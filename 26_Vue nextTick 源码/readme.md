# nextTick

> Vue 异步执行 DOM 更新。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部尝试对异步队列使用原生的 Promise. then 和MessageChannel，如果执行环境不支持，会采用 setTimeout(fn, 0)代替。

说白了，nextTick就是异步执行一段代码，JS异步执行代码的方法有：Promise、setImmediate、setTimeout、setInterval等

下面demo，点击第一个 p 标签，将其值设置为 'nextTick', 然后把第二个p设置为第一个标签的值

``` bash 
<p ref="demo" @click="changeMsg">{{msg1}}</p>
<p>{{msg2}}</p>

this.msg1 = 'nextTick'; 
this.msg2 = this.$refs.demo.innerHTML; 
```

![](https://upload-images.jianshu.io/upload_images/10390288-59f5eb71704a7f94.gif?imageMogr2/auto-orient/strip)

因为vue的dom更新是异步的，所以拿到的dom值是旧的，需要在vue dom更新之后执行对应的获取dom操作

# nextTick 源码

> Vue.nextTick用于延迟执行一段代码，它接受2个参数（回调函数和执行回调函数的上下文环境），如果没有提供回调函数，那么将返回promise对象。

[nextTick 源码](./nextTick.js)


## queueNextTick 

nextTick 返回一个 queueNextTick 函数，其内部对cb回调函数做了一层包装并塞进callbacks数组中，使用 pending 变量确保执行一个事件循环中只执行一次 timerFunc()次

``` bash 
return function queueNextTick (cb?: Function, ctx?: Object) {
    let _resolve
    callbacks.push(() => {
      if (cb) {
        try {
          cb.call(ctx)
        } catch (e) {
          handleError(e, ctx, 'nextTick')
        }
      } else if (_resolve) {
        _resolve(ctx)
      }
    })
    if (!pending) {
      pending = true
      timerFunc()
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        _resolve = resolve
      })
    }
  }
```

## timerFunc

先看 timerFunc 定义，有3中：

- Promise
- MutationObserver
- setTimeout

不难看出其作用是为了延迟执行 nextTickHandler 函数

```bash 
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve()
  var logError = err => { console.error(err) }
  timerFunc = () => {
    p.then(nextTickHandler).catch(logError)
    if (isIOS) setTimeout(noop)
  }
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  var counter = 1
  var observer = new MutationObserver(nextTickHandler)
  var textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
} else {
  timerFunc = () => {
    setTimeout(nextTickHandler, 0)
  }
}
```

## nextTickHandler

nextTickHandler 遍历执行了传入的回调函数

``` bash 
const callbacks = []
let pending = false
let timerFunc

function nextTickHandler() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```

到这里 nextTice 函数的主线逻辑就很清楚了。定义一个变量 callbacks，把通过参数 cb 传入的函数用一个函数包装一下，处理执行失败和参数 cb 不存在的场景，然后 添加到 callbacks。调用 timerFunc 函数，在其中遍历 callbacks 执行每个函数，因为 timerFunc 是一个异步执行的函数，且定义一个变量 pending来保证一个事件循环中只调用一次 timerFunc 函数。这样就实现了 nextTice 函数异步执行传入的函数的作用了。

# 源码

[源码分析](https://github.com/zhongzihao1996/my-blog/blob/master/26_Vue%20nextTick%20%E6%BA%90%E7%A0%81/nextTick.js)


---
END