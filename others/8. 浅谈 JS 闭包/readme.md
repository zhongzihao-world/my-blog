# 闭包是啥

> 闭包（closure）是指可以访问另一个函数作用域变量的函数，一般是定义在外层函数中的内层函数。.

# 作用域链

要理解闭包，就要理解作用域链，作用域链类似于 JS 的原型链，当自身没有该变量时，将沿着作用域链一直往上找，直到全局变量 window。，因为作用域链的关系，函数里面可以访问到全局作用域里的变量，反之，window 无法访问到函数内部变量。

盘古开天辟地时期（es6 前），js 只有全局作用域函数作用域，看下面代码：

```bash
var n = 0; // 全局作用域
function add() {
  // 函数作用域
  console.log(n);
}
add(); // 0
```

我根据自己理解画了张图，add()执行 时，将压入执行栈，形成一个执行上下文

执行到`console.log(n)`，发现函数自身作用域没有变量 n，就往上找，到全局作用域，找到 n =0，输出

函数执行完毕，弹出执行栈

![](https://upload-images.jianshu.io/upload_images/10390288-89c5f7efa8fb7cfc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 闭包有什么用？

局部变量无法共享和长久的保存，而全局变量可能造成变量污染，所以我们希望有一种机制既可以长久的保存变量又不会造成全局污染。

言简意赅翻一下就是：既想反复使用，又想避免全局污染

看下面代码，我们需要一个私有变量存储每次执行结果：

```bash
function sum(n) {
  var count = 0;
  return count += n;
}
console.log(sum(1));
console.log(sum(2));
console.log(sum(3));·
```

然而输出：

![](https://upload-images.jianshu.io/upload_images/10390288-59bf8bec72aa63a2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们还是画下图：

sum()每次执行完，内部的 count 都被销毁了

![](https://upload-images.jianshu.io/upload_images/10390288-5da305382bb966d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 闭包使用

根据闭包定义，对上面代码进行改造：

```bash
function sum() {
  var count = 0;
  return function(n) {
    return count += n;
  };
}
var _sum = sum();
console.log(_sum(1));
console.log(_sum(2));
console.log(_sum(3));
```

执行结果：

![](https://upload-images.jianshu.io/upload_images/10390288-28aa9157df049b41.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
