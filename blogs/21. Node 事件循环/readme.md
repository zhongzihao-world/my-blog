# Node.js 事件循环机制

> Node.js 采用事件驱动和异步 I/O 的方式，实现了一个单线程、高并发的 JavaScript 运行时环境

# 高并发策略

一般来说，高并发的解决方案就是提供多线程模型，服务器为每个客户端请求分配一个线程，使用同步 I/O，系统通过线程切换来弥补同步 I/O 调用的时间开销。比如 Apache 就是这种策略，由于 I/O 一般都是耗时操作，因此这种策略很难实现高性能，但非常简单，可以实现复杂的交互逻辑。

而事实上，大多数网站的服务器端都不会做太多的计算，它们接收到请求以后，把请求交给其它服务来处理（比如读取数据库），然后等着结果返回，最后再把结果发给客户端。因此，Node.js 针对这一事实采用了单线程模型来处理，它不会为每个接入请求分配一个线程，而是用一个主线程处理所有的请求，然后对 I/O 操作进行异步处理，避开了创建、销毁线程以及在线程间切换所需的开销和复杂性。

# 事件循环

Node.js 在主线程里维护了一个**事件队列**，当接到请求后，就将该请求作为一个事件放入这个队列中，然后继续接收其他请求。当主线程空闲时(没有请求接入时)，就开始循环事件队列，检查队列中是否有要处理的事件，这时要分两种情况：

- 非 I/O 任务，就亲自处理，并通过回调函数返回到上层调用
- I/O 任务，就从 程线池 中拿出一个线程来处理这个事件，并指定回调函数，然后继续循环队列中的其他事件。

当线程中的 I/O 任务完成以后，就执行指定的回调函数，并把这个完成的事件放到事件队列的尾部，等待事件循环，当主线程再次循环到该事件时，就直接处理并返回给上层调用。 这个过程就叫 事件循环 (Event Loop)，其运行原理如下图所示：
![](https://upload-images.jianshu.io/upload_images/10390288-03153f7b67f2e226.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这个图是整个 Node.js 的运行原理，从左到右，从上到下，Node.js 被分为了四层，分别是 应用层、V8 引擎层、Node API 层 和 LIBUV 层。

> - 应用层： 即 JavaScript 交互层，常见的就是 Node.js 的模块，比如 http，fs
> - V8 引擎层： 即利用 V8 引擎来解析 JavaScript 语法，进而和下层 API 交互
> - NodeAPI 层： 为上层模块提供系统调用，一般是由 C 语言来实现，和操作系统进行交互 。
> - LIBUV 层： 是跨平台的底层封装，实现了 事件循环、文件操作等，是 Node.js 实现异步的核心 。

无论是 Linux 平台还是 Windows 平台，Node.js 内部都是通过 线程池 来完成异步 I/O 操作的，而 LIBUV 针对不同平台的差异性实现了统一调用。因此，Node.js 的单线程仅仅是指 JavaScript 运行在单线程中，而并非 Node.js 是单线程。

事件循环模型：

``` bash 
 ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<──connections───     │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

事件循环的顺序：

- timers: 这个阶段执行定时器队列中的回调如 setTimeout() 和 setInterval()。
- I/O callbacks: 这个阶段执行几乎所有的回调。但是不包括close事件，定时器和setImmediate()的回调。
- idle, prepare: 这个阶段仅在内部使用，可以不必理会。
- poll: 等待新的I/O事件，node在一些特殊情况下会阻塞在这里。
- check: setImmediate()的回调会在这个阶段执行。
- close callbacks: 例如socket.on('close', ...)这种close事件的回调。

## 1. poll阶段

当v8引擎将js代码解析后传入libuv引擎后，循环首先进入poll阶段。poll阶段的执行逻辑如下： 
先查看poll queue中是否有事件，有任务就按先进先出的顺序依次执行回调。 当queue为空时，会检查是否有setImmediate()的callback，如果有就进入check阶段执行这些callback。但同时也会检查是否有到期的timer，如果有，就把这些到期的timer的callback按照调用顺序放到timer queue中，之后循环会进入timer阶段执行queue中的 callback。 这两者的顺序是不固定的，收到代码运行的环境的影响。如果两者的queue都是空的，那么loop会在poll阶段停留，直到有一个i/o事件返回，循环会进入i/o callback阶段并立即执行这个事件的callback。

poll阶段在执行poll queue中的回调时实际上不会无限的执行下去。有两种情况poll阶段会终止执行poll queue中的下一个回调：1.所有回调执行完毕。2.执行数超过了node的限制。

## 2. check阶段

check阶段专门用来执行setImmediate()方法的回调，当poll阶段进入空闲状态，并且setImmediate queue中有callback时，事件循环进入这个阶段。

## 3. close阶段

当一个socket连接或者一个handle被突然关闭时（例如调用了socket.destroy()方法），close事件会被发送到这个阶段执行回调。否则事件会用process.nextTick（）方法发送出去。

## 4. timer阶段

这个阶段以先进先出的方式执行所有到期的timer加入timer队列里的callback，一个timer callback指得是一个通过setTimeout或者setInterval函数设置的回调函数

## 5. I/O callback阶段

这个阶段主要执行大部分I/O事件的回调，包括一些为操作系统执行的回调。例如一个TCP连接生错误时，系统需要执行回调来获得这个错误的报告。

# 工作原理

Node.js 实现异步的核心是事件，也就是说，它把每一个任务都当成 事件 来处理，然后通过 Event Loop 模拟了异步的效果，为了更具体、更清晰的理解和接受这个事实，下面我们用伪代码来描述一下其工作原理 。

## 1. 定义事件队列

既然是队列，那就是一个先进先出 (FIFO) 的数据结构，我们用 JS 数组来描述，如下：

```bash
/**
 * 定义事件队列
 * 入队：push()
 * 出队：shift()
 * 空队列：length == 0
 */
globalEventQueue: []
```

我们利用数组来模拟队列结构：数组的第一个元素是队列的头部，数组的最后一个元素是队列的尾部，push() 就是在队列尾部插入一个元素，shift() 就是从队列头部弹出一个元素。这样就实现了一个简单的事件队列。

## 2. 定义接收请求入口

每一个请求都会被拦截并进入处理函数，如下所示：

```bash
/**
 * 接收用户请求
 * 每一个请求都会进入到该函数
 * 传递参数request和response
 */
processHttpRequest:function(request,response){

    // 定义一个事件对象
    var event = createEvent({
        params:request.params, // 传递请求参数
        result:null, // 存放请求结果
        callback:function(){} // 指定回调函数
    });

    // 在队列的尾部添加该事件
    globalEventQueue.push(event);
}
```

这个函数很简单，就是把用户的请求包装成事件，放到队列里，然后继续接收其他请求。

## 3. 定义 Event Loop

当主线程处于空闲时就开始循环事件队列，所以我们还要定义一个函数来循环事件队列：

```bash
/**
 * 事件循环主体，主线程择机执行
 * 循环遍历事件队列
 * 处理非IO任务
 * 处理IO任务
 * 执行回调，返回给上层
 */
eventLoop:function(){
    // 如果队列不为空，就继续循环
    while(this.globalEventQueue.length > 0){

        // 从队列的头部拿出一个事件
        var event = this.globalEventQueue.shift();

        // 如果是耗时任务
        if(isIOTask(event)){
            // 从线程池里拿出一个线程
            var thread = getThreadFromThreadPool();
            // 交给线程处理
            thread.handleIOTask(event)
        }else {
            // 非耗时任务处理后，直接返回结果
            var result = handleEvent(event);
            // 最终通过回调函数返回给V8，再由V8返回给应用程序
            event.callback.call(null,result);
        }
    }
}
```

## 4. 处理 I/O 任务

```bash
/**
 * 处理IO任务
 * 完成后将事件添加到队列尾部
 * 释放线程
 */
handleIOTask:function(event){
    //当前线程
    var curThread = this;

    // 操作数据库
    var optDatabase = function(params,callback){
        var result = readDataFromDb(params);
        callback.call(null,result)
    };

    // 执行IO任务
    optDatabase(event.params,function(result){
        // 返回结果存入事件对象中
        event.result = result;

        // IO完成后，将不再是耗时任务
        event.isIOTask = false;

        // 将该事件重新添加到队列的尾部
        this.globalEventQueue.push(event);

        // 释放当前线程
        releaseThread(curThread)
    })
}
```

当 I/O 任务完成以后就执行回调，把请求结果存入事件中，并将该事件重新放入队列中，等待循环，最后释放当前线程，当主线程再次循环到该事件时，就直接处理了。

总结以上过程我们发现，Node.js 只用了一个主线程来接收请求，但它接收请求以后并没有直接做处理，而是放到了事件队列中，然后又去接收其他请求了，空闲的时候，再通过 Event Loop 来处理这些事件，从而实现了异步效果，当然对于 IO 类任务还需要依赖于系统层面的线程池来处理。

因此，我们可以简单的理解为：**Node.js 本身是一个多线程平台，而它对 JavaScript 层面的任务处理是单线程的。**

# CPU 密集型是短板

至此，对于 Node.js 的单线程模型，我们应该有了一个简单而又清晰的认识，它通过事件驱动模型实现了高并发和异步 I/O，然而也有 Node.js 不擅长做的事情：

上面提到，如果是 I/O 任务，Node.js 就把任务交给线程池来异步处理，高效简单，因此 Node.js 适合处理 I/O 密集型任务。但不是所有的任务都是 I/O 密集型任务，当碰到 CPU 密集型任务时，即只用 CPU 计算的操作，比如要对数据加解密(node.bcrypt.js)，数据压缩和解压(node-tar)，这时 Node.js 就会亲自处理，一个一个的计算，前面的任务没有执行完，后面的任务就只能干等着 。如下图所示：

## ![](https://upload-images.jianshu.io/upload_images/10390288-65882a1d504ccf2e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在事件队列中，如果前面的 CPU 计算任务没有完成，后面的任务就会被阻塞，出现响应缓慢的情况，如果操作系统本身就是单核，那也就算了，但现在大部分服务器都是多 CPU 或多核的，而 Node.js 只有一个 EventLoop，也就是只占用一个 CPU 内核，当 Node.js 被 CPU 密集型任务占用，导致其他任务被阻塞时，却还有 CPU 内核处于闲置状态，造成资源浪费。

**因此，Node.js 并不适合 CPU 密集型任务。**

# 适用场景

> - RESTful API - 请求和响应只需少量文本，并且不需要大量逻辑处理， 因此可以并发处理数万条连接。
> - 聊天服务 - 轻量级、高流量，没有复杂的计算逻辑。

---
# 参考

[Node.js 事件循环机制](https://www.cnblogs.com/onepixel/p/7143769.html)

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END

