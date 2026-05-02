## 指责介绍

loopagentNode ：

​	处理循环操作，比如一个用户请求 要求进行分析 执行 检测，就是说需要多轮操作来规范的 比如检测 检测不通过 重新分析 执行，这就是这个节点的功用

ParallelAgentNode：

​	处理并行操作，并行执行，多条链路去一起完成任务，最后汇总即可

SequentialAgentNode:

​	处理串行操作，主要用于编排子智能体，和loop循环，parallel 并行，组合出复杂的智能体流程

## 具体实现

loop节点：

```java
@Service
public class LoopAgentNode extends AbstractArmorySupport {

    @Override
    protected AiAgentRegisterVO doApply(ArmoryCommandEntity requestParameter, DefaultArmoryFactory.DynamicContext dynamicContext) throws Exception {
        log.info("Ai Agent 装配操作 - LoopAgentNode");

        List<AiAgentConfigTableVO.Module.AgentWorkflow> agentWorkflows = dynamicContext.getAgentWorkflows();
        AiAgentConfigTableVO.Module.AgentWorkflow agentWorkflow = agentWorkflows.remove(0);

        List<BaseAgent> subAgents = dynamicContext.queryAgentList(agentWorkflow.getSubAgents());

        LoopAgent loopAgent =
                LoopAgent.builder()
                        .name(agentWorkflow.getName())
                        .description(agentWorkflow.getDescription())
                        .subAgents(subAgents)
                        .maxIterations(agentWorkflow.getMaxIterations())
                        .build();

        dynamicContext.getAgentGroup().put(agentWorkflow.getName(), loopAgent);

        return router(requestParameter, dynamicContext);
    }
    
    // ... 省略 get，前面章节已经体现过
}    

```

拿到配置类中的 agentworkflows中的第一个调度单元 并去除 然后接纳

后面两个全都是类似的

