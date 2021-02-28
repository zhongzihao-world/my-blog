# 前言

浏览器垃圾回收机制 GC(Garbage Collecation)：**垃圾收集器会定期（周期性）找出那些不在继续使用的变量，然后释放其内存。**

# JS 回收机制

## 1. 标记清除

> 当变量进入环境时，将变量标记"进入环境"，当变量离开环境时，标记为："离开环境"。某一个时刻，垃圾回收器会过滤掉环境中的变量，以及被环境变量引用的变量，剩下的就是被视为准备回收的变量。IE、Firefox、Opera、Chrome、Safari 的 js 实现使用的都是标记清除的垃圾回收策。

## 2. 引用计数

> 变量的引用次数，被引用一次则加 1，当这个引用计数为 0 时，被视为准备回收的对象。

# 浏览器内存管理

## GC 方案

### 1. 标记内存中的可达值

从根节点出发，遍历所有的对象，能访问到的，标记为可达的，否则为不可达。

### 2. 回收不可达值占据的内存

步骤 1 完成后，清理掉不可达的对象。

### 3. 内存整理

步骤 2 完成后，进行内存碎片整理。

## GC 不足

浏览器进行垃圾回收的时候，会暂停 JavaScript 脚本，等垃圾回收完毕再继续执行其他代码。对于 JS 游戏、动画对连贯性要求比较高的应用，如果暂停时间很长就会造成页面卡顿。

## GC 优化策略

### 1. 分代收集

多回收新生代，少回收老生代。

![](https://upload-images.jianshu.io/upload_images/10390288-a4d30c55a93d15bf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 2. 增量收集

将垃圾收集工作分成更小的块，每次处理一部分，多次处理。

![](https://upload-images.jianshu.io/upload_images/10390288-0ee62656ef02497e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 3. 闲时收集

在 CPU 空闲时运行，减少对代码的影响。

# 内存泄露

> 内存泄露是指一块被分配的内存既不能使用，又不能回收，直到浏览器进程结束

常见内存泄漏情况：

- 全局变量
- 闭包
- DOM 元素引用
- 定时器、回调
- 子元素存在引用
- 监听事件没有解绑

# V8 引擎 GC

V8 的 GC 策略主要基于分代式垃圾回收机制，根据对象的存活时间进行不同的分代，分别采用不同的垃圾回收算法。

## 1. V8 的内存结构

> 垃圾回收的过程主要出现在新生代和老生代

带斜纹的区域代表暂未使用的内存：

![](https://upload-images.jianshu.io/upload_images/10390288-8298a90ef6a483e8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### ①. 新生代(new_space)

新生代主要用于存放存活时间较短的对象，其两个 semispace(半空间)构成的，内存最大值在 64 位系统和 32 位系统上分别为 32MB 和 16MB，在新生代的垃圾回收过程中主要采用了 Scavenge 算法。

#### (1). Scavenge 算法

> Scavenge 算法是一种典型的牺牲空间换取时间的算法，两个空间中，始终只有一个处于使用状态，另一个处于闲置状态。当进行垃圾回收时：

如果 From 空间中尚有存活对象，则会被复制到 To 空间进行保存，非存活的对象会被自动回收。

当复制完成后，From 空间和 To 空间完成一次角色互换，To 空间会变为新的 From 空间，原来的 From 空间则变为 To 空间。

**Ⅰ. From 空间中分配了三个对象 A、B、C**

![](https://upload-images.jianshu.io/upload_images/10390288-f477f6953349bd56.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**Ⅱ. 当程序主线程任务第一次执行完毕后进入垃圾回收时，发现对象 A 已经没有其他引用，则表示可以对其进行回收**

![](https://upload-images.jianshu.io/upload_images/10390288-e8986d53ebd6392c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**Ⅲ. 对象 B 和对象 C 此时依旧处于活跃状态，因此会被复制到 To 空间中进行保存**

![](https://upload-images.jianshu.io/upload_images/10390288-3568e714bacf4da0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**Ⅳ. 接下来将 From 空间中的所有非存活对象全部清除**

![](https://upload-images.jianshu.io/upload_images/10390288-1184c5f6d4bb48f7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**Ⅴ. 此时 From 空间中的内存已经清空，开始和 To 空间完成一次角色互换**

![](https://upload-images.jianshu.io/upload_images/10390288-4780a463d3b09fe2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**Ⅵ. 当程序主线程在执行第二个任务时，在 From 空间中分配了一个新对象 D**

![](https://upload-images.jianshu.io/upload_images/10390288-24a51954462cfaeb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**Ⅶ. 任务执行完毕后再次进入垃圾回收，发现对象 D 已经没有其他引用，表示可以对其进行回收**

![](https://upload-images.jianshu.io/upload_images/10390288-a5407df30267cce6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**Ⅷ. 对象 B 和对象 C 此时依旧处于活跃状态，再次被复制到 To 空间中进行保存**

![](https://upload-images.jianshu.io/upload_images/10390288-d35bedb99ad5dc56.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**Ⅸ. 再次将 From 空间中的所有非存活对象全部清除**

![](https://upload-images.jianshu.io/upload_images/10390288-5edf849d18c578ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**Ⅹ. From 空间和 To 空间继续完成一次角色互换**

![](https://upload-images.jianshu.io/upload_images/10390288-d9df9aa7b7fa6536.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Scavenge 算法过程：**将存活对象在 From 空间和 To 空间之间进行复制，同时完成两个空间之间的角色互换**，其缺点是：**浪费了一半的内存用于复制**。

#### (2). 对象晋升

> 当一个对象在经过多次复制之后依旧存活，那么它会被认为是一个生命周期较长的对象，在下一次进行垃圾回收时，该对象会被直接转移到老生代中。

晋升的条件：

- 经历过一次 Scavenge 算法

- To 空间的内存占比超过 25%

### ②. 老生代(old_space)

老生代中管理着大量的存活对象，采用 Mark-Sweep(标记清除)和 Mark-Compact(标记整理)来进行管理内存。

#### (1). Mark-Sweep 算法

Mark-Sweep(标记清除)分为标记和清除两个阶段，

- 标记阶段，遍历堆中的所有对象，然后标记活着的对象
- 清除阶段，将死亡的对象进行清除

#### (2). 根节点

- 全局对象
- 本地函数的局部变量和参数
- 当前嵌套调用链上的其他函数的变量和参数

### ③. 大对象区(large_object_space)

存放体积超越其他区域大小的对象，每个对象都会有自己的内存，垃圾回收不会移动大对象区。

### ④. 代码区(code_space)

代码对象，会被分配在这里，唯一拥有执行权限的内存区域。

### ⑤. map 区(map_space)

存放 Cell 和 Map，每个区域都是存放相同大小的元素。

# 参考

[前端之浅谈浏览器的垃圾回收机制和内存泄露](https://www.cnblogs.com/yanglongbo/articles/9762359.html)

[一文搞懂 V8 引擎的垃圾回收](https://juejin.cn/post/6844904016325902344)

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END
