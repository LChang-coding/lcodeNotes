## 职责

chatmodlenode 配置时 需要好多好多工具装配

这一章主要是讲述 怎么从配置中拿到工具 并注册进去

## 具体

首先 要知道toomcp的配置

```java
@Data
public static class ChatModel {
    private String model;
    private List<ToolMcp> toolMcpList;
    
    @Data
    public static class ToolMcp {
        private SSEServerParameters sse;
        private StdioServerParameters stdio;
        private LocalParameters local;
    
    // ... 省略部分
} 
```

有三种工具配置方式

那么就需要对应的三个服务来解耦

原本的代码是一大坨 嵌入到charmodelnode中

现在要做的就是策略加工厂来解耦

首先声明策略接口，统一的接口，让所有实现的方法参数统一

```java
public interface ToolMcpCreateService {

    ToolCallback[] buildToolCallback(AiAgentConfigTableVO.Module.ChatModel.ToolMcp toolMcp);

}

```

第二步 策略实现

```java
mcpsse

@Service
public class SSEToolMcpCreateService implements ToolMcpCreateService {

    @Override
    public ToolCallback[] buildToolCallback(AiAgentConfigTableVO.Module.ChatModel.ToolMcp toolMcp) {
        AiAgentConfigTableVO.Module.ChatModel.ToolMcp.SSEServerParameters sseConfig = toolMcp.getSse();

        // https://127.0.0.1:9999/sse?apikey=DElk89iu8Ehhnbu
        String originalBaseUri = sseConfig.getBaseUri();
        String baseUri;
        String sseEndpoint;

        int queryParamStartIndex = originalBaseUri.indexOf("sse");
        if (queryParamStartIndex != -1) {
            baseUri = originalBaseUri.substring(0, queryParamStartIndex - 1);
            sseEndpoint = originalBaseUri.substring(queryParamStartIndex - 1);
        } else {
            baseUri = originalBaseUri;
            sseEndpoint = sseConfig.getSseEndpoint();
        }

        sseEndpoint = StringUtils.isBlank(sseEndpoint) ? "/sse" : sseEndpoint;

        HttpClientSseClientTransport sseClientTransport = HttpClientSseClientTransport
                .builder(baseUri) // 使用截取后的 baseUri
                .sseEndpoint(sseEndpoint) // 使用截取或默认的 sseEndpoint
                .build();

        McpSyncClient mcpSyncClient = McpClient.sync(sseClientTransport).requestTimeout(Duration.ofMinutes(sseConfig.getRequestTimeout())).build();
        var init_sse = mcpSyncClient.initialize();

        log.info("Tool SSE MCP Initialized {}", init_sse);

        return SyncMcpToolCallbackProvider.builder().mcpClients(mcpSyncClient).build()
                .getToolCallbacks();
    }

}

把源码代码，迁移过来，返回 SyncMcpToolCallbackProvider.builder().mcpClients(mcpSyncClient).build().getToolCallbacks()

mcpstdio

@Service
public class StdioToolMcpCreateService implements ToolMcpCreateService {

    @Override
    public ToolCallback[] buildToolCallback(AiAgentConfigTableVO.Module.ChatModel.ToolMcp toolMcp) {
        AiAgentConfigTableVO.Module.ChatModel.ToolMcp.StdioServerParameters stdioConfig = toolMcp.getStdio();

        AiAgentConfigTableVO.Module.ChatModel.ToolMcp.StdioServerParameters.ServerParameters serverParameters = stdioConfig.getServerParameters();
        // https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
        var stdioParams = ServerParameters.builder(serverParameters.getCommand())
                .args(serverParameters.getArgs())
                .env(serverParameters.getEnv())
                .build();

        var mcpClient = McpClient.sync(new StdioClientTransport(stdioParams, new JacksonMcpJsonMapper(new ObjectMapper())))
                .requestTimeout(Duration.ofSeconds(stdioConfig.getRequestTimeout())).build();
        var init_stdio = mcpClient.initialize();

        log.info("Tool Stdio MCP Initialized {}", init_stdio);

        return SyncMcpToolCallbackProvider.builder().mcpClients(mcpClient).build()
                .getToolCallbacks();
    }
}

把源码代码，迁移过来，返回 SyncMcpToolCallbackProvider.builder().mcpClients(mcpClient).build().getToolCallbacks()

mcplocal

@Service
public class LocalToolMcpCreateService implements ToolMcpCreateService {

    @Resource
    protected ApplicationContext applicationContext;

    @Override
    public ToolCallback[] buildToolCallback(AiAgentConfigTableVO.Module.ChatModel.ToolMcp toolMcp) {
        AiAgentConfigTableVO.Module.ChatModel.ToolMcp.LocalParameters local = toolMcp.getLocal();

        ToolCallbackProvider localToolCallbackProvider = (ToolCallbackProvider) applicationContext.getBean(local.getName());
        log.info("Tool Local MCP Initialized {}", local.getName());

        return localToolCallbackProvider.getToolCallbacks();
    }

}

本地 local 核心的就是拿到 bean 的名称，也就顺便拿到了 getToolCallbacks 返回即可。
```

一共三种方式

前两种根据协议去返回对应的mcp工具

第三种是本地注册bean 然后get返回即可（记得强制转换一下）

### 整合

至此，三个统一接口的实现类已经完备

那么下一步采用工厂，返回相应的实现类，即可完成业务需求

```java
@Slf4j
@Service
public class DefaultMcpClientFactory {

    @Resource
    private LocalToolMcpCreateService localToolMcpCreateService;

    @Resource
    private SSEToolMcpCreateService sseToolMcpCreateService;

    @Resource
    private StdioToolMcpCreateService stdioToolMcpCreateService;

    public ToolMcpCreateService getToolMcpCreateService(AiAgentConfigTableVO.Module.ChatModel.ToolMcp toolMcp) {
        if (null != toolMcp.getLocal()) return localToolMcpCreateService;
        if (null != toolMcp.getSse()) return sseToolMcpCreateService;
        if (null != toolMcp.getStdio()) return stdioToolMcpCreateService;
        throw new AppException(ResponseCode.E0002);
    }

}
```

根据 类型 选出对应的实现类 返回 然后就可以用返回的实现类 来配置返回mcp服务列表

使用样例：

```java
  // 构建mcp服务（工厂）
        List<ToolCallback> toolCallbackList = new ArrayList<>();
        for (AiAgentConfigTableVO.Module.ChatModel.ToolMcp toolMcp : toolMcpList) {
            TooMcpCreateService tooMcpCreateService = defaultMcpClientFactory.getTooMcpCreateService(toolMcp);
            ToolCallback[] toolCallbacks = tooMcpCreateService.buildToolCallback(toolMcp);
            toolCallbackList.addAll(List.of(toolCallbacks));
        }
// 构建对话模型
        ChatModel chatModel = OpenAiChatModel.builder()
                .openAiApi(openAiApi)
                .defaultOptions(OpenAiChatOptions.builder()
                        .model(chatModelConfig.getModel())
                        .toolCallbacks(toolCallbackList)
                        .build())
                .build(); 
```

