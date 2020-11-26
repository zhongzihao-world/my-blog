# 前言

##

# 响应式原理

## Observer、Dep 和 Watcher

对于这三大金刚，我初学的时候也是傻傻的分不清楚很懵，我的理解是：

Observer 就是劫持者，通过 **Object.defineProperty()**劫持数据；

Dep(dependence) 即依赖收集器，收集 Watcher 即观察者。

![](https://cn.vuejs.org/images/data.png)

Observer 用于劫持数据，通过**Object.defineProperty()**给数据设置 get 和 set 方法：

- get: 当某个地方用到数据时，如下 h1、h2 标签都用到了 msg 数据，即观察 msg 数据 的两个 watcher 将被放入 msg 数据的 依赖收集器 Dep 中。

```bash
data() {
  return {
    msg: 'hello vue',
  }
},

<h1>{{msg}}</h1>
<h2>{{msg}}</h2>
```

- set：当 msg 数据改变的时候，遍历 Dep 依赖收集器，通知所有 Watcher 更新视图，即 h1、h2 标签内的文本内容

## 实现 Observer、Dep、Watcher

通过上面分析，可知每一个数据有一个依赖收集器 Dep，Dep 里面存放到该数据的 Watcher

1. Dep

我们先实现 Dep，Dep 我们可以用数组来模拟，它应该有两个方法：

- add，收集观察者 Watcher
- notify，数据变化的时候通知 Watcher 更新视图

```bash
# 依赖收集器
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(watcher) {
    # 添加观察者
    this.subs.push(watcher);
  }
  notify() {
    # 通知每一个观察者更新视图
    this.subs.forEach(watcher => watcher.update());
  }
}
```

2. Watcher

Watcher 实现如下：

关键点在于 oldVal，它有两个用处：

- Dep 触发 update 方法时，比对新旧值，若有变化才更新，避免不必要的视图更新
- **初始化的时候，会获取旧值，会触发数据的 get 方法，在此时可以把依赖注入到 Dep 中（即依赖收集）**

```bash
# 观察者，用于更新视图
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    # 视图更新函数
    this.cb = cb;
    # 旧值
    this.oldVal = this.getOldVal();
  }
  getOldVal() {
    # 传递watch自己
    Dep.target = this;
    # 获取值的时候会触发 get 方法，把自己 push 进 deps[] 里
    const oldVal = compileUtils.getVal(this.expr, this.vm);
    Dep.target = null;
    return oldVal;
  }
  update() {
    # 获取新值
    const newVal = compileUtils.getVal(this.expr, this.vm);
    if (newVal !== this.oldVal) {
      this.cb(newVal);
    }
  }
}
```

3. Observer

Observer 实现如下：

劫持数据，通过 Object.defineProperty 拦截数据的读写操作：

- get 收集依赖，注意 Dep.target，因为模板解析的时候也会读取数据触发 get 方法
- set 通知依赖收集器，更新视图

```bash
// 数据劫持
class Observer {
  constructor(data) {
    this.observer(data, key, data[key]);
  }
  difineReactive(obj, key, value) {
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get() {
        # 防止视图初始化的时候也被收集到Dep中
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: newVal => {
        this.observer(newVal);
        if (newVal !== value) {
          value = newVal;
          # 通知依赖收集器，有变化
          dep.notify();
        }
      },
    });
  }
}

```

---

END
