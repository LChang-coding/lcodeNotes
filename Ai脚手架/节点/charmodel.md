## chatmodel

是从aiapinode 流转过来的 

直接获取上下文中的aiapi就行

## 功用

结合ai的接口 进行模型的构建

此外还需要构建mcp的工具集合 来调用

```java
@Slf4j
@Service
public class ChatModelNode extends AbstractArmorySupport {

    @Override
    protected AiAgentRegisterVO doApply(ArmoryCommandEntity requestParameter, DefaultArmoryFactory.DynamicContext dynamicContext) throws Exception {
        log.info("Ai Agent 装配操作 - ChatModelNode");

        OpenAiApi openAiApi = dynamicContext.getOpenAiApi();

        AiAgentConfigTableVO aiAgentConfigTableVO = requestParameter.getAiAgentConfigTableVO();
        AiAgentConfigTableVO.Module.ChatModel chatModelConfig = aiAgentConfigTableVO.getModule().getChatModel();

        // 构建tool mcp
        List<McpSyncClient> mcpSyncClients = new ArrayList<>();
        List<AiAgentConfigTableVO.Module.ChatModel.ToolMcp> toolMcpList = chatModelConfig.getToolMcpList();
        for (AiAgentConfigTableVO.Module.ChatModel.ToolMcp toolMcp : toolMcpList) {
            mcpSyncClients.add(createMcpSyncClient(toolMcp));
        }

        ChatModel chatModel = OpenAiChatModel.builder()
                .openAiApi(openAiApi)
                .defaultOptions(OpenAiChatOptions.builder()
                        .model(chatModelConfig.getModel())
                        .toolCallbacks(SyncMcpToolCallbackProvider.builder().mcpClients(mcpSyncClients).build().getToolCallbacks())
                        .build())
                .build();

        dynamicContext.setChatModel(chatModel);

        return router(requestParameter, dynamicContext);
    }

    @Override
    public StrategyHandler<ArmoryCommandEntity, DefaultArmoryFactory.DynamicContext, AiAgentRegisterVO> get(ArmoryCommandEntity requestParameter, DefaultArmoryFactory.DynamicContext dynamicContext) throws Exception {
        return defaultStrategyHandler;
    }

    private McpSyncClient createMcpSyncClient(AiAgentConfigTableVO.Module.ChatModel.ToolMcp toolMcp) {

        AiAgentConfigTableVO.Module.ChatModel.ToolMcp.SSEServerParameters sseConfig = toolMcp.getSse();
        AiAgentConfigTableVO.Module.ChatModel.ToolMcp.StdioServerParameters stdioConfig = toolMcp.getStdio();

        if (null != sseConfig) {
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
            return mcpSyncClient;
        }

        if (null != stdioConfig) {
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
            return mcpClient;
        }

        throw new RuntimeException("toolMcp sse and stdio is null!");
    }

}

```

主要就是拼装mcp工具集

还有就是建造chatmodel对象