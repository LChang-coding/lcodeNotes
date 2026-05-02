## 说白了之前想要装配ruuernode必须依靠三个模式的节点

但是用户如果没配，就是想要一个单一的agent去回答问题，那么这个就允许

解决办法就是在配置表类中加上一个ruuner配置 下面只放上单一智能体

如果agnetworkflows为空 自动走到runnernode 装配单一智能体

同时runnernode的节点变化 之前是固定取一个sequentialagent智能体实现类

现在是根据配置的 runnerconfig.getAgentName（）从dynamiccontext.getAgentGroup（）上下文获取对象来填充

三个工作流：

也是三种模式，是固定的，

对外暴露的只有一个，可以通过runner配置来选择