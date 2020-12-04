在判断一个数据的类型时，可以使用 Object 原生的 toString 方法

我们先看看下面的例子:

```bash
const str = 'hello world';

str.toString(); // "hello world"
Object.prototype.toString(str); // "[object Object]"
Object.prototype.toString.call(str); // "[object String]"
```

## 1.str.toString()

因为 str 是字符串，根据原型链会调用 String.prototype.toString 方法,

```bash
# 重写 String 原型方法
String.prototype.toString = function toString(str) {
  return 'HHHHHH';
}
str.toString(); // "HHHHHH"
```

## 2.Object.prototype.toString();

> toString()是在以特殊的字符串形式输出 this 的类型

根据 JS 原型链,String 对象继承自 Object 原型 ，即：
String.prototype.\_\_proto\_\_ === Object.prototype; // true

String 原型重写了 toString 方法

```bash
# 删除 String 原型 string 方法
delete String.prototype.toString;

str.toString(); // "[object String]"
str.toString === Object.prototype.toString; // true
```

调用问题,使用 call、apply 或者 bind 绑定当前对象

```bash
Object.prototype.toString(str); // "[object Object]"
# 实际上等于:
Object.prototype.toString(); // 输出的是 Object 类型

# 使用bind、apply、bind改变this指向
Object.prototype.toString.call(str);  // "[object String]"
Object.prototype.toString.apply(str); // "[object String]"
Object.prototype.toString.bind(str)(); // "[object String]"
```

## 3.JS 原型链

JS 原型链有两个比较重要的属性：\_\_proto\_\_ 和 prototype；

- \_\_proto\_\_ 我的理解就是一个指针，该指针指向其构造函数的原型对象 prototype。
- prototype 是构造函数的一个属性，你可以理解为一个空对象，可以在该对象内写任意的方法和属性，由该构造函数实例化的对象的\_\_proto\_\_ 指针会指向 该构造函数的 prototype。

构造函数也是对象，也有 \_\_proto\_\_，也会指向其构造函数的原型对象 prototype......一环扣着一环这就是 JS 的原型链和继承原理

但原型链有一个终点，即：**Object.prototype.\_\_proto\_\_ === null**;当我们访问一个属性值的时候, 它会沿着原型链向上查找, 直到原型链终点:null.

**注意继承的是构造函数的 prototype**

```bash
Object.a = 1;
Object.prototype.b = 2;
const obj = new Object();

obj.a; # undefined
obj.b; # 2

Object.a; # 1
```

## 4. 难以理解的 Function 与 Object 的关系

我的理解：

Object 和 Object.prototype 是两种东西，前者是构造函数，后者是原型对象

```bash
# 控制台打印一下
Object; // ƒ Object() { [native code] } # 构造函数
Object.prototype; // 原型对象 # 控制台将打印出一大坨属性
```

Function 是一个构造函数，用于创建其他函数，包括 Object、Array、RegExp 等构造函数，实际上都是 Function 创建出来得。

```bash
# 控制台打印一下
Function.prototype === Object.__proto__; // true
Function.prototype === Array.__proto__; // true
Function.prototype === RegExp.__proto__; // true
```

看到这里，相信下面的原型链你也能够理解了

```bash
const test = {};

test.__proto__ === Object.prototype; // true
test.__proto__.__proto__  === Object.prototype.__proto__; // true # 指向null

Object.__proto__ === Function.prototype; // true
Object.__proto__.__proto__ === Object.prototype; // true
Object.__proto__.__proto__.__proto__ === null; // true
```

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END
