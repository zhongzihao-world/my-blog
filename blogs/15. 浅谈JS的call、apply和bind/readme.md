# 前言

> call、apply、bind 的作用是改变函数运行时 this 的指向

先搞懂 this，自己初学的时候对 this 是一脸懵逼的 o((⊙﹏⊙))o...

# this

总结了一下，this 实际上是在函数被调用时发生的绑定，它指向什么地方完全取决于函数在哪里被调用。但这里有个列外，构造函数的 this 和 es6 的箭头函数的 this 又有所不同。

## 1.函数调用

```bash
 # Window
function print() {
  console.log(this);
}

print(); // 等价于window.print()
```

## 2.对象属性调用

谁调用，this 指向谁

```bash
const obj = {
  name: 'outside',
  print() {
    console.log(this.name);
  },
  extend: {
    name: 'inside',
    print() {
      console.log(this.name);
    },
  },
};

obj.print(); // outside
obj.extend.print(); // inside
```

第二个输出这里可能有点难理解，记住谁调用指向谁，是 extend 调用的，指向 extend

## 3.构造函数

构造函数的 this 将指向 new 出来的对象，在该例子中即 man

我们先看下面的代码：

```bash
class Man {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  print() {
    console.log(this.name, this.age);
  }
  extend = {
    name: 'inside',
    age: 99,
    print() {
      console.log(this.name, this.age);
    },
  };
}

const man = new Man('小明', 18);
console.log(man.print()); // 小明 18
console.log(man.extend.print()); // inside 99
```

第二个输出是不是有点奇怪，是的，我们打印一下 man 对象，发现其跟上一个例子情况是一样的,记住只是构造函数的 this 指向实例对象

![](https://upload-images.jianshu.io/upload_images/10390288-04cc3cad23df99d9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 4.箭头函数

箭头函数和匿名函数很像，不过**箭头函数没有 this，箭头头函数的 this 是继承父执行上下文里面的 this**

我们改写一下 3 中的 extend

```bash
class Man {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  print() {
    console.log(this.name, this.age);
  }
  extend = {
    name: 'inside',
    age: 99,
    print: () => {
      console.log(this.name, this.age);
    },
    deep_pro: {
      name: 'deep_insise',
      age: 9999,
      print: () => {
        console.log(this); //  Man {extend: {…}, name: "小明", age: 18}
        console.log(this.name, this.age);
      },
    }
  };
}

const man = new Man('小明', 18);
console.log(man.print()); // 小明 18
console.log(man.extend.print()); // 小明 18
console.log(man.extend.deep_pro.print()); // 小明 18
```

# call、apply、bind

上面说了一大堆，搞懂了 this，回到正题

> call、apply、bind 的作用是改变函数运行时 this 的指向

- call、apply 作用是执行一个方法并改变 this，他们的区别是传入参数的方式不同
- bind 和前面两者不同的是只是返回一个改变了 this 的函数，需手动执行它

call 和 apply 容易混淆问题，我是这么记忆的：call 可以想象为打电话，打电话是一个一个接着打的不可能同时多个，所以 call 是传多个参数，apply 直接一个数组。

调用：

```bash
func.call(obj, arg1, arg2, ...);
func.apply(obj, [arg1, arg2, ...]);
```

我们试着用 call、apply、bind 改变 this：

```bash
class Caculate {
  constructor(name) {
    this.name = name;
  }
  add(a, b) {
    return this.name + a + b;
  }
}

const demo = new Caculate('构造函数:');
console.log(demo.add('hello', ' world')); // 构造函数:hello world
```

## 1.call

```bash
console.log(demo.add.call({ name: 'call改变:' }, 'hello', ' call')); // call改变:hello call
```

## 2.apply

```bash
console.log(demo.add.apply({ name: 'apply改变:' }, ['hello', ' apply'])); // apply改变:hello apply
```

## 3.bind

bind 和 call 一样，参数是一个一个传的

```bash
const bind_ = demo.add.bind({ name: 'bind改变:' }, 'hello', ' bind');
console.log(bind_()); // "bind改变:hello bind"
```

看到这里，相信你已经理解了，上面解释 this 的时候函数调用有两种形式：

```bash
print(); // 1.函数调用
man.extend.print(); // 2.对象属性调用
```

实际上我们可以把它用 call 重写为：

```bash
print.call(window);
man.extend.print.call(man.extend);
```

# 实现简单的 call、apply、bind

我们也可以动手实现简单的 call、apply、bind，有助于加深理解

## call：

```bash
Function.prototype.call_ = function (context, ...args) {
  let context_ = context || window;
  // 让 fn 的上下文为 context
  context_.fn = this;
  const result = context_.fn(...args);
  delete context_.fn;
  return result;
};
```

## apply：

```bash
Function.prototype.apply_ = function (context, args) {
  let context_ = context || window;
  // 让 fn 的上下文为 context
  context_.fn = this;
  let param_ = args || [];
  const result = context_.fn(param_);
  delete context_.fn;
  return result;
};
```

## bind：

```bash
Function.prototype.bind_ = function (context, ...args) {
  let fn = this;
  return function () {
    fn.apply(context, args.concat(...arguments));
  };
};
```

# 扩展

上面讲解 this 的时候讲到 this 实际上是在函数被调用时发生的绑定，它指向什么地方完全取决于函数在哪里被调用，但又有特例: 箭头函数和构造函数

其实我们可以用 bind 实现箭头函数,照搬上面的例子:

```bash
class Man {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  print() {
    console.log(this.name, this.age);
  }
  extend = {
    name: 'inside',
    age: 99,
    print: function print() {
      console.log(this.name, this.age);
    }.bind(this), // 手动绑定this
  };
}

const man = new Man('小明', 18);
console.log(man.print()); // 小明 18
console.log(man.extend.print()); 小明 18
```

自己手写一个 new 操作符方法：

```bash
function Factory(fn, ...args) {
  const target = Object.create(fn.prototype);
  const res = fn.apply(target, args);
  return res instanceof Object ? res : target;
}
```

以上纯手敲 + 个人理解，如有不足，欢迎指出~

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END
