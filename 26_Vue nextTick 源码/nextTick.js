/**
 * Defer a task to execute it asynchronously.
 * 延迟任务以异步执行它
 */
export const nextTick = (function () {
  // 所有回调函数
  const callbacks = []
  // 是否正在执行
  let pending = false
  // 异步触发执行回调函数
  let timerFunc

  // 遍历执行回调函数
  function nextTickHandler() {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  //nextTick行为利用可以访问的微任务队列
  //通过本地的答应我。那么或是变异观察者。
  //MutationObserver有更广泛的支持，但是它被严重地窃听进来了
  //当触发in-touch事件处理程序时，iOS>=9.3.3中的UIWebView。它
  //触发几次后完全停止工作。。。所以，如果是本地人
  //承诺可用，我们将使用它：

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  //nextTick行为利用可以访问的微任务队列
  //通过本地的答应我。那么或是变异观察者。
  //MutationObserver有更广泛的支持，但是它被严重地窃听进来了
  //当触发in-touch事件处理程序时，iOS>=9.3.3中的UIWebView。它
  //触发几次后完全停止工作。。。所以，如果是本地人
  //承诺可用，我们将使用它：


  // 根据环境判断异步人不类型
  // 优先级依次为：Promise、MutationObserver、setTimeout
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve()
    var logError = err => { console.error(err) }
    timerFunc = () => {
      p.then(nextTickHandler).catch(logError)
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      //在有问题的uiwebview中，答应我。那么不会完全崩溃，但是
      //它可能会陷入一种奇怪的状态，即回调被推送到
      //微任务队列，但队列不会被刷新，直到浏览器
      //需要做一些其他的工作，例如处理计时器。所以我们可以
      //通过添加空计时器“强制”刷新微任务队列。
      if (isIOS) setTimeout(noop)
    }
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    //如果本机Promise不可用，请使用MutationObserver，
    //例如PhantomJS、iOS7、Android 4.4
    var counter = 1
    // 监听dom节点变化,然后触发执行 nextTickHandler
    var observer = new MutationObserver(nextTickHandler)
    var textNode = document.createTextNode(String(counter))
    observer.observe(textNode, {
      // 监听文本内容的修改。
      characterData: true
    })
    timerFunc = () => {
      // 在 0 1 之间不断变化
      counter = (counter + 1) % 2
      textNode.data = String(counter)
    }
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    //回退到setTimeout
    timerFunc = () => {
      setTimeout(nextTickHandler, 0)
    }
  }

  // 实时往数组里塞回调
  return function queueNextTick(cb?: Function, ctx?: Object) {
    let _resolve
    callbacks.push(() => {
      if (cb) {
        // 简单包装一下
        try {
          cb.call(ctx)
        } catch (e) {
          handleError(e, ctx, 'nextTick')
        }
      } else if (_resolve) {
        _resolve(ctx)
      }
    })
    // 没有回调在执行了
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
})()