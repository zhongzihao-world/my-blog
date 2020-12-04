# 前言

刚学前端的时候一直听别人说 JS 是单线程、单线程、单线程的，其实完整的应该是在浏览器环境下 JS 执行引擎是单线程的。

那么什么是线程？为什么JS是单线程的？

## 1. 进程和线程

> 进程和线程的主要差别在于它们是不同的操作系统资源管理方式。进程有独立的地址空间，一个进程崩溃后，在保护模式下不会对其它进程产生影响，而线程只是一个进程中的不同执行路径。

我的理解，一个程序运行，至少有一个进程，一个进程至少有一个线程，进程是操作系统分配内存资源的最小单位，线程是 cpu 调度的最小单位。

打个比方，进程好比一个工厂，线程就是里面的工人，工厂内有多个工人，里面的工人可以共享里面的资源，多个工人可以一起协调工作，类似于多线程并发执行。

## 2. 浏览器是多进程的

打开 windows 任务管理器，可以看到浏览器开了很多个进程，每一个 tab 页都是单独的一个进程，所以一个页面崩溃以后并不会影响其他页面

![](https://upload-images.jianshu.io/upload_images/10390288-8501dd43771925e2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

浏览器包含下面几个进程：

* Browser 进程：浏览器的主进程（负责协调、主控），只有一个
* 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建
* GPU 进程：最多一个，用于 3D 绘制等
* 浏览器渲染进程（浏览器内核）（Renderer 进程，内部是多线程的）：默认每个 Tab 页面一个进程，互不影响

## 3. 浏览器渲染进程

**浏览器渲染进程是多线程的**，也是一个前端人最关注的，它包括下面几个线程：

* GUI 渲染线程
  + 负责渲染浏览器界面，解析 HTML，CSS，构建 DOM 树和 RenderObject 树，布局和绘制等。
  + 当界面需要重绘（Repaint）或由于某种操作引发回流(reflow)时，该线程就会执行
  + GUI 渲染线程与 JS 引擎线程是互斥的，当 JS 引擎执行时 GUI 线程会被挂起（相当于被冻结了），GUI 更新会被保存在一个队列中等到 JS 引擎空闲时立即被执行。
* JS 引擎线程
  + 也称为 JS 内核，负责处理 Javascript 脚本程序。（例如 V8 引擎）
  + JS 引擎线程负责解析 Javascript 脚本，运行代码。
  + JS 引擎一直等待着任务队列中任务的到来，然后加以处理，一个 Tab 页（renderer 进程）中无论什么时候都只有一个 JS 线程在运行 JS 程序
  + 同样注意，GUI 渲染线程与 JS 引擎线程是互斥的，所以如果 JS 执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。
* 事件触发线程
  + 归属于浏览器而不是 JS 引擎，用来控制事件循环（可以理解，JS 引擎自己都忙不过来，需要浏览器另开线程协助）
  + 当 JS 引擎执行代码块如 setTimeOut 时（也可来自浏览器内核的其他线程, 如鼠标点击、AJAX 异步请求等），会将对应任务添加到事件线程中
  + 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待 JS 引擎的处理
  + 注意，由于 JS 的单线程关系，所以这些待处理队列中的事件都得排队等待 JS 引擎处理（当 JS 引擎空闲时才会去执行）
* 定时触发器线程
  + 传说中的 setInterval 与 setTimeout 所在线程
  + 浏览器定时计数器并不是由 JavaScript 引擎计数的, （因为 JavaScript 引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确）
  + 因此通过单独线程来计时并触发定时（计时完毕后，添加到事件队列中，等待 JS 引擎空闲后执行）
  + 注意，W3C 在 HTML 标准中规定，规定要求 setTimeout 中低于 4ms 的时间间隔算为 4ms。
* 异步 http 请求线程
  + 在 XMLHttpRequest 在连接后是通过浏览器新开一个线程请求
  + 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中。再由 JavaScript 引擎执行。

## 4. JS 引擎是单线程的

为什么 js 引擎是单线程的，一个原因是多线程复杂度会更高，另一个问题是结果可能是不可预期的：假设 JS 引擎是多线程的，有一个 div，A 线程获取到该节点设置了属性，B 线程又删除了该节点，so what？多线程并发执行下该怎么操作呢？

或许这就是为什么 JS 引擎是单线程的，代码从上而下顺序的预期执行，虽然降低了编程成本，但也有其他问题，如果某个操作很耗时间，比如，某个计算操作 for 循环遍历 10000 万次，就会阻塞后面的代码造成页面卡顿... ... 

**GUI 渲染线程与 JS 引擎线程互斥的**，是为了防止渲染出现不可预期的结果，因为 JS 是可以获取 dom 的，如果修改这些元素属性同时渲染界面（即 JS 线程和 UI 线程同时运行），那么渲染线程前后获得的元素数据就可能不一致了。所以 JS 线程执行的时候，渲染线程会被挂起；渲染线程执行的时候，JS 线程会挂起，**所以 JS 会阻塞页面加载，这也是为什么 JS 代码要放在 body标签之后，所有html内容之前；为了防止阻塞页面渲造成白屏**。

## 5. WebWorker

上面说了，JS 是单线程的，也就是说，所有任务只能在一个线程上完成，一次只能做一件事。前面的任务没做完，后面的任务只能等着。随着电脑计算能力的增强，尤其是多核 CPU 的出现，单线程带来很大的不便，无法充分发挥计算机的计算能力。

> Web Worker，是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。

Web Worker 有几个特点：

* **同源限制**：分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。
* **DOM 限制**：不能操作 DOM
* **通信联系**：Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。
* **脚本限制**：不能执行 alert()方法和 confirm()方法
* **文件限制**：无法读取本地文件

## 6. 浏览器渲染流程

下面是浏览器渲染页面的简单过程，详细讲又可以开一篇文章了~. ~：《从输入 URL 到页面渲染完成发生了什么》

* 1. 用户输入 url ，DNS 解析成请求 IP 地址
* 2. 浏览器与服务器建立连接（tcp 协议、三次握手），服务端处理返回html代码块
* 3. 浏览器接受处理，解析 html 成 dom 树、解析 css 成 cssobj
* 4. dom 树、cssobj 结合成 render 树
* 5. JS 根据 render 树进行计算、布局、重绘
* 6. GPU 合成，输出到屏幕

# JS 事件循环

上面扯皮了一大堆，下面开始进入正题

## 1. 同步任务和异步任务

JS 有两种任务：

* 同步任务
* 异步任务

同步任务，顾名思义就是代码是同步执行的，异步代码就是代码是异步执行的，为什么 JS 要这么分呢？

我们假设 JS 全部代码都是同步执行的，一个打包过后的 JS 有 10000 行代码，如果开始就遇到 setTimeout, 那么就需要等 100 秒才能执行后面的代码... ... 如果中间还有一些 io 操作和异步请求等，想想都令人崩溃

``` bash
setTimeout(()=>{
// todo
},100000)

// 下面省略10000行代码
```

因为同步执行异步任务比较耗时间，而且代码中绝大部分都是同步代码，所以我们可以先执行同步代码，把这些异步任务交给其他线程去执行，如定时触发器线程、异步 http 请求线程等，然后等这些异步任务完成了再去执行他们。这种**调度同步、异步任务的策略**，就是**JS 事件循环**：

* 1. 执行整体代码，如果是同步任务，就直接在主线程上执行，形成一个执行栈
* 2. 当遇到异步任务的时候如网络请求等，就交给其他线程执行, 当异步任务执行完了，就往事件队列里面塞一个回调函数
* 3. 一旦执行栈中的所有同步任务执行完毕（即执行栈空），就会读取事件队列，取一个任务塞到执行栈中，开始执行
* 4. 一直重复步骤 3

![](https://upload-images.jianshu.io/upload_images/10390288-cdae45d43dc5e75b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这就是事件循环了，确保了同步和异步任务有条不絮的执行，只有当前所有同步任务执行完了，主线程才会去读取事件队列,看看有没有任务（异步任务执行完的第回调）要执行，每次取一个来执行。

![](https://upload-images.jianshu.io/upload_images/10390288-0d38b33ebb974039.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

老生长谈的 setTimeout

``` bash
setTimeout(() => {
  console.log('异步任务');
}, 0);

console.log('同步任务');
```

相信你狠容易就能理解下面的执行结果，主线程扫描整体代码：

* 发现有个异步任务setTimeout，就挂起交由定时器触发线程（定时器会在等待了指定的时间后将结果以回调形式放入到事件队列中等待读取到主线程执行），
* 发现同步任务 console，直接塞入执行栈执行
* 从上到下执行完了一遍
* 执行栈处于空闲状态，检查事件队列是否有任务(此时定时器执行完了)，取出一个任务塞到执行战中执行
* 事件队列清空

![](https://upload-images.jianshu.io/upload_images/10390288-a555571bc1d51f20.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 2. 宏任务(macro-task)、微任务(micro-task)

### 1. 宏任务、微任务

除了广义的同步任务和异步任务，JavaScript 单线程中的任务可以细分为宏任务和微任务：

* macro-task：script(整体代码), setTimeout, setInterval, setImmediate, I/O, UI rendering
* process. nextTick, Promises, Object. observe, MutationObserver

### 2. 事件循环与宏任务、微任务

每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）

再检测本次循环中是否寻在微任务，存在的话就依次从微任务的任务队列中读取执行完所有的微任务，再读取宏任务的任务队列中的任务执行，再执行所有的微任务，如此循环。JS 的执行顺序就是每次事件循环中的宏任务-微任务。

* 第一次事件循环，整段代码作为宏任务进入主线程执行
* 同步代码被直接推到执行栈执行，遇到异步代码就挂起交由其他线程执行(执行完会往事件队列塞回调) 
* 同步代码执行完，读取微任务队列，若有执行所有微任务，微任务清空
* 页面渲染
* 从事件队列面里取一个宏任务塞入执行栈执行
* 如此反复

![](https://upload-images.jianshu.io/upload_images/10390288-d11222d6683d231a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

用代码翻译一下就是
``` bash 
# 宏任务
for (let macrotask of macrotask_list) {
  # 执行一个宏任务
  macrotask(); 
  # 执行所有微任务
  for (let microtask of microtask_list) {
    microtask();
  }
  #  UI渲染
  ui_render(); 
}
``` 

![](https://upload-images.jianshu.io/upload_images/10390288-ac2820314f46ef55.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 3. 事件循环与页面渲染

在 ECMAScript 中，microtask(微任务) 称为 jobs，macrotask（宏任务) 可称为 task。

浏览器为了能够使得 JS 内部 task 与 DOM 任务能够有序的执行，会在一个 task 执行结束后，在下一个 task 执行开始前，对页面进行重新渲染:

**（task -> 渲染 -> task ->... ）**

让我们看一下例子，我们有一个id为app的 div
``` bash
<div id="app">宏任务、微任务</div>
```

执行下面的代码会发生什么？

``` bash 
document. querySelector('#app').style.color = 'yellow'; 

Promise. resolve(). then(() => {
  document. querySelector('#app').style.color = 'red'; 
}); 

setTimeout(() => {
  document.querySelector('#app').style.color = 'blue'; 
  Promise.resolve(). then(() => {
    for (let i = 0; i < 99999; i++) {
      console.log(i);
    }
  }); 
}, 17); 
```

我们直接看一下运行结果：

![](https://upload-images.jianshu.io/upload_images/10390288-ecc99ebc1b58d7ef.gif?imageMogr2/auto-orient/strip)

文字会先变红，然后过一段时间后会变蓝；我们分析一下程序是如何运行的：

* 第一轮事件循环，遇到第一个同步任务塞进执行栈执行，dom操作使文字**变黄**, 遇到第二个是Promise微任务塞到微任务队列，继续往下，遇到宏任务setTimeout交由定时器触发线程
* 第一轮宏任务执行完了，检查微任务队列发现有任务，执行并清空队列，dom操作使文字**变红**，此时setTimeout还没执行完
* GUI 渲染线程进行渲染，**使文字变红**
* 第二轮循环，执行栈为空，检查微任务队列为空，继续检测事件队列，发现已经有结果了，塞入执行栈中执行
* 执行 setTimeout 里的回调，执行第一个同步任务，dom操作使文字变蓝，第二个是微任务塞入微任务队列，同步任务执行完了，发现微任务中有任务执行并清空队列，微任务里console是同步任务，此时JS线程一直在执行，GUI 渲染线程被挂起，一直等到里面的同步任务执行完
* GUI 渲染线程进行渲染，**使文字变蓝**
* 事件循环结束

> HTML5标准规定了setTimeout()的第二个参数的最小值（最短间隔），不得低于4毫秒，如果低于这个值，就会自动增加。

其中有一个问题是，谷歌下经测试并不玩全遵循两个宏任务之间执行ui渲染(谷歌的优化策略？)，把 setTimeout 事件设置为0，发现文字不会由黑>红>蓝，而是直接黑>蓝，为了模拟效果所以我把时间间隔设置为了17ms(我的屏幕是60HZ也就是16. 67ms刷新一次)

![](https://upload-images.jianshu.io/upload_images/10390288-9411ca79097d9d4e.gif?imageMogr2/auto-orient/strip)


### 4. Vue. $nextTick 

使用vue的小伙伴们可能工作中可能会经常用到这个api，Vue的官方介绍：

> 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。

其内部实现就是利用了 microtask(微任务)，来延时执行一段代码(获取dom节点的值), 即当前所有同步代码执行完后执行 microtask(微任务)，可参照之前的文章：

[Vue nextTick 源码](https://github.com/zhongzihao1996/my-blog/blob/master/26_Vue%20nextTick%20%E6%BA%90%E7%A0%81/nextTick.js)

# 参考

[原创 进程和线程的区别](https://www.cnblogs.com/lmule/archive/2010/08/18/1802774.html)

[Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)

[JS 是单线程，你了解其运行机制吗？](https://github.com/biaochenxuying/blog/issues/8)

**文章中的所有图片均来自网络**

# 源码

[源码](https://github.com/zhongzihao1996/my-blog/blob/master/blogs/24.%20JS%20%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%20Event%20Loop/index.js)

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END
