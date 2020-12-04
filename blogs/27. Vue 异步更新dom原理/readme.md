# Vue 异步更新 DOM 的原理

## 前言

> Vue 异步执行 DOM 更新。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部尝试对异步队列使用原生的 Promise. then 和 MessageChannel，如果执行环境不支持，会采用 setTimeout(fn, 0)代替。

## vue 异步更新流程

更新流程：

- 1. 修改 Vue 中的 Data 时，会触发所有和这个 Data 相关的 Watcher 进行更新
- 2. 将所有的 Watcher 加入队列 Queue
- 3. 调用 nextTick 方法，执行异步任务。
- 4. 异步任务的回调中，对 Queue 中的 Watcher 进行排序，然后执行对应的 DOM 更新

1. vue 在调用 Watcher 更新视图时，并不会直接进行更新，而是把需要更新的 Watcher 加入到 Queue 队列里，然后把具体的更新方法 flushSchedulerQueue 传给 nexTick 进行调用。

```bash
// 当一个 Data 更新时，会依次执行以下代码
// 1. 触发 Data.set
// 2. 调用 dep.notify
// 3. Dep 会遍历所有相关的 Watcher 执行 update 方法
class Watcher {
  // 4. 执行更新操作
  update() {
    queueWatcher(this);
  }
}

const queue = [];

function queueWatcher(watcher: Watcher) {
  // 5. 将当前 Watcher 添加到异步队列
  queue.push(watcher);
  // 6. 执行异步队列，并传入回调
  nextTick(flushSchedulerQueue);
}

// 更新视图的具体方法
function flushSchedulerQueue() {
  let watcher, id;
  // 排序，先渲染父节点，再渲染子节点
  // 这样可以避免不必要的子节点渲染，如：父节点中 v-if 为 false 的子节点，就不用渲染了
  queue.sort((a, b) => a.id - b.id);
  // 遍历所有 Watcher 进行批量更新。
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    // 更新 DOM
    watcher.run();
  }
}
```

![](https://upload-images.jianshu.io/upload_images/10390288-da82cf6217aa949b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. nextTick -- 将传入的 flushSchedulerQueue 添加到 callbacks 数组中，然后执行了 timerFunc 方法。

```bash
const callbacks = [];
let timerFunc;

function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;
  // 1.将传入的 flushSchedulerQueue 方法添加到回调数组
  callbacks.push(() => {
    cb.call(ctx);
  });
  // 2.执行异步任务
  // 此方法会根据浏览器兼容性，选用不同的异步策略
  timerFunc();
}
```

3. timerFunc 方法 -- 是根据浏览器兼容性创建的一个异步方法，执行完该方法就会调用 flushSchedulerQueue 方法进行具体的 DOM 更新。

```bash
let timerFunc;
// 判断是否兼容 Promise
if (typeof Promise !== "undefined") {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks);
  };
  // 判断是否兼容 MutationObserver
  // https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
} else if (typeof MutationObserver !== "undefined") {
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  // 判断是否兼容 setImmediate
  // 该方法存在一些 IE 浏览器中
} else if (typeof setImmediate !== "undefined") {
  // 这是一个宏任务，但相比 setTimeout 要更好
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // 如果以上方法都不知道，使用 setTimeout 0
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

// 异步执行完后，执行所有的回调方法，也就是执行 flushSchedulerQueue
function flushCallbacks() {
  for (let i = 0; i < copies.length; i++) {
    callbacks[i]();
  }
}
```

![](https://upload-images.jianshu.io/upload_images/10390288-e54c0cde4dfe7c69.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

4. 完善逻辑判断

- 判断 has 标识，避免在一个 Queue 中添加相同的 Watcher
- 判断 waiting 标识，让所有的 Watcher 都在一个 tick 内进行更新
- 判断 flushing 标识，处理 Watcher 渲染时，可能产生的新 Watcher

![](https://upload-images.jianshu.io/upload_images/10390288-7bae87ee78fc4bb9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 问题

1. 什么时候能获取到真正的 DOM 元素？

在 Vue 的 nextTick 回调中。

2. 为什么 this.\$nextTick 能够获取更新后的 DOM？

调用 this.$nextTick 其实就是调用图中的nextTick 方法，在异步队列中执行回调函数。根据先进先出原则，修改Data 触发的更新异步队列会先得到执行，执行完成后就生成了新的DOM，接下来执行this.$nextTick 的回调函数时，能获取到更新后的 DOM 元素了。

```bash
Vue.prototype.$nextTick = function (fn: Function) {
  return nextTick(fn, this);
};
```

# 参考

[vue 异步更新 dom 的原理](https://www.cnblogs.com/pleaseAnswer/p/13566987.html)

---

END
