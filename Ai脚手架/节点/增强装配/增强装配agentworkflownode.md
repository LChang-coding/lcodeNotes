## 之前三个模式节点的流转 是写死的 现在我要让他统一回到 agentworkflownode 网关 然后做分发

主要实现就是在上下文中 添加

```java
/**
     * 原子安全的递进步骤
     */
    private AtomicInteger currentStepIndex = new AtomicInteger(0);

    /**
     * 当前的智能体
     */
    private AiAgentConfigTableVO.Module.AgentWorkflow currentAgentWorkflow;
```

第一个负责标记 当前应该处理（流转）到配置表中的第几个编排流

第二行配置的当前被处理的编排流对象，是通过配置表中get原子数字 装配进去的 职责清晰

这样设计 三个模式的节点 就可以通过agentworkflownode 统一调度