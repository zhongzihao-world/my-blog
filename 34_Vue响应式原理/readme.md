# 前言

##

# 实现

## Observer、Dep 和 Watcher

对于这三大金刚，我初学的时候也是傻傻的分不清楚很懵，我的理解是：
Observer 就是劫持者，通过 **Object.defineProperty()**劫持数据；Dep 就是 dependence 即依赖收集器，收集什么依赖呢？收集每一个数据的 Watcher 即观察者。

![](https://cn.vuejs.org/images/data.png)

END
