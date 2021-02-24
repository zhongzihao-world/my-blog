# 前言

前端学习永无止境，学习吧骚年~

本文集合了 ES6 至 ES11 常用到的特性，包括还在规划的 ES12，只列举大概使用，详细介绍的话内容量将十分巨大~.~。PS：使用新特性需要使用最新版的 bable 就行转义

本文后面将长期不断更新~

# 新特性

## ES6（2015）

### 1. 类（class） 

``` bash 
class Man {
  constructor(name) {
    this.name = '小豪';
  }
  console() {
    console.log(this.name);
  }
}
const man = new Man('小豪');
man.console(); // 小豪
```

### 2. 模块化(ES Module)

``` bash 
// 模块 A 导出一个方法
export const sub = (a, b) => a + b;
// 模块 B 导入使用
import { sub } from './A';
console.log(sub(1, 2)); // 3
```

### 3. 箭头（Arrow）函数
``` bash 
const func = (a, b) => a + b;
func(1, 2); // 3
```

### 4. 函数参数默认值
``` bash 
function foo(age = 25,){ // ...}
```

### 5. 模板字符串
```bash
const name = '小豪';
const str = `Your name is ${name}`;
```

### 6. 解构赋值
``` bash 
let a = 1, b= 2;
[a, b] = [b, a]; // a 2  b 1
```

### 7. 延展操作符
``` bash
let a = [...'hello world']; // ["h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d"]
```

### 8. 对象属性简写
```bash 
const name='小豪',
const obj = { name };
```

### 9. Promise
``` bash 
Promise.resolve().then(() => { console.log(2); });
console.log(1);
// 先打印 1 ，再打印 2
```

### 10. let和const
``` bash 
let name = '小豪'；
const arr = [];
```

## ES7（2016）

### 1. Array.prototype.includes()
``` bash 
[1].includes(1); // true
```

### 2. 指数操作符
``` bash 
2**10; // 1024
```

## ES8（2017）

###  1. async/await

 异步终极解决方案

``` bash 
async getData(){
    const res = await api.getTableData(); // await 异步任务
    // do something    
}
```

### 2. Object.values()
```bash 
Object.values({a: 1, b: 2, c: 3}); // [1, 2, 3]
```

### 3. Object.entries()
```bash 
Object.entries({a: 1, b: 2, c: 3}); // [["a", 1], ["b", 2], ["c", 3]]
```

### 4. String padding

``` bash 
// padStart
'hello'.padStart(10); // "     hello"
// padEnd
'hello'.padEnd(10) "hello     "
```

### 5. 函数参数列表结尾允许逗号

### 6. Object.getOwnPropertyDescriptors()

> 获取一个对象的所有自身属性的描述符,如果没有任何自身属性，则返回空对象。

### 7. SharedArrayBuffer对象

> SharedArrayBuffer 对象用来表示一个通用的，固定长度的原始二进制数据缓冲区，

``` bash 
/**
 * 
 * @param {*} length 所创建的数组缓冲区的大小，以字节(byte)为单位。  
 * @returns {SharedArrayBuffer} 一个大小指定的新 SharedArrayBuffer 对象。其内容被初始化为 0。
 */
new SharedArrayBuffer(10)
```

### 8. Atomics对象

> Atomics 对象提供了一组静态方法用来对 SharedArrayBuffer 对象进行原子操作。


## ES9（2018）

### 1. 异步迭代

await可以和for...of循环一起使用，以串行的方式运行异步操作

``` bash 
async function process(array) {
  for await (let i of array) {
    // doSomething(i);
  }
}
```

### 2. Promise.finally()

``` bash 
Promise.resolve().then().catch(e => e).finally();
```

### 3. Rest/Spread 属性

``` bash 
const values = [1, 2, 3, 5, 6];
console.log( Math.max(...values) ); // 6
```

### 4. 正则表达式命名捕获组

``` bash 
const reg = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/;
const match = reg.exec('2021-02-23');
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d8d9ad711f74ee184bd054754cda9d6~tplv-k3u1fbpfcp-watermark.image)

### 5. 正则表达式反向断言

``` bash 
(?=p)、(?<=p)  p 前面(位置)、p 后面(位置)
(?!p}、(?<!p>) 除了 p 前面(位置)、除了 p 后面面(位置)
```

``` (?<=w) ```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b0175e066c14e22a438ee9698bf13d0~tplv-k3u1fbpfcp-watermark.image)

``` (?<!w) ```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8ad8e025f3548b8aa47609e97cdbaf6~tplv-k3u1fbpfcp-watermark.image)

### 6. 正则表达式dotAll模式

> 正则表达式中点.匹配除回车外的任何单字符，标记s改变这种行为，允许行终止符的出现

``` bash 
/hello.world/.test('hello\nworld');  // false
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86b5a8c3baf8456d8d22f889723f1f1b~tplv-k3u1fbpfcp-watermark.image)


## ES10（2019）

### 1. Array.flat()和Array.flatMap()

flat()

``` bash 
[1, 2, [3, 4]].flat(Infinity); // [1, 2, 3, 4]
```

flatMap()

``` bash 
[1, 2, 3, 4].flatMap(a => [a**2]); // [1, 4, 9, 16]
```

### 2. String.trimStart()和String.trimEnd()

去除字符串首尾空白字符

### 3. String.prototype.matchAll

> matchAll（）为所有匹配的匹配对象返回一个迭代器

``` bash 
const raw_arr = 'test1  test2  test3'.matchAll((/t(e)(st(\d?))/g));
const arr = [...raw_arr];
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7aedab0dda0454d87ca9953bf8cee92~tplv-k3u1fbpfcp-watermark.image)

### 4. Symbol.prototype.description

> 只读属性，回 Symbol 对象的可选描述的字符串。

``` bash 
Symbol('description').description; // 'description'
```

### 5. Object.fromEntries()

> 返回一个给定对象自身可枚举属性的键值对数组

``` bash 
// 通过 Object.fromEntries， 可以将 Map 转化为 Object:
const map = new Map([ ['foo', 'bar'], ['baz', 42] ]);
console.log(Object.fromEntries(map)); // { foo: "bar", baz: 42 }
```

### 6. 可选 Catch

## ES11（2020）

### 1. Nullish coalescing Operator(空值处理)

表达式在 ?? 的左侧 运算符求值为undefined或null，返回其右侧。

``` bash 
let user = {
    u1: 0,
    u2: false,
    u3: null,
    u4: undefined
    u5: '',
}
let u2 = user.u2 ?? '用户2'  // false
let u3 = user.u3 ?? '用户3'  // 用户3
let u4 = user.u4 ?? '用户4'  // 用户4
let u5 = user.u5 ?? '用户5'  // ''
```

### 2. Optional chaining（可选链）

?.用户检测不确定的中间节点

``` bash 
let user = {}
let u1 = user.childer.name // TypeError: Cannot read property 'name' of undefined
let u1 = user.childer?.name // undefined
```

### 3. Promise.allSettled

> 返回一个在所有给定的promise已被决议或被拒绝后决议的promise，并带有一个对象数组，每个对象表示对应的promise结果

``` bash 
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => reject('我是失败的Promise_1'));
const promise4 = new Promise((resolve, reject) => reject('我是失败的Promise_2'));
const promiseList = [promise1,promise2,promise3, promise4]
Promise.allSettled(promiseList)
.then(values=>{
  console.log(values)
});
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc2c2cbb66e5413fb1394c39f9060fe2~tplv-k3u1fbpfcp-watermark.image)

### 4. import()

按需导入

### 5. 新基本数据类型BigInt

> 任意精度的整数

### 6. globalThis

 - 浏览器：window
 - worker：self
 - node：global

## ES12（2021）

### 1. replaceAll

> 返回一个全新的字符串，所有符合匹配规则的字符都将被替换掉

``` bash 
const str = 'hello world';
str.replaceAll('l', ''); // "heo word"
```

### 2. Promise.any

> Promise.any() 接收一个Promise可迭代对象，只要其中的一个 promise 成功，就返回那个已经成功的 promise 。如果可迭代对象中没有一个 promise 成功（即所有的 promises 都失败/拒绝），就返回一个失败的 promise

``` bash 
const promise1 = new Promise((resolve, reject) => reject('我是失败的Promise_1'));
const promise2 = new Promise((resolve, reject) => reject('我是失败的Promise_2'));
const promiseList = [promise1, promise2];
Promise.any(promiseList)
.then(values=>{
  console.log(values);
})
.catch(e=>{
  console.log(e);
});
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/368110e5500d456b80fbf1239c146a72~tplv-k3u1fbpfcp-watermark.image)

### 3. WeakRefs

> 使用WeakRefs的Class类创建对对象的弱引用(对对象的弱引用是指当该对象应该被GC回收时不会阻止GC的回收行为)

### 4. 逻辑运算符和赋值表达式

> 逻辑运算符和赋值表达式，新特性结合了逻辑运算符（&&，||，??）和赋值表达式而JavaScript已存在的 复合赋值运算符有：

``` bash 
a ||= b
//等价于
a = a || (a = b)

a &&= b
//等价于
a = a && (a = b)

a ??= b
//等价于
a = a ?? (a = b)

```

### 5. 数字分隔符

> 数字分隔符，可以在数字之间创建可视化分隔符，通过_下划线来分割数字，使数字更具可读性

``` bash 
const money = 1_000_000_000;
//等价于
const money = 1000000000;

1_000_000_000 === 1000000000; // true
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fded7875fb8540018cf35ff2aa5fa103~tplv-k3u1fbpfcp-watermark.image)



# 参考:

[ES6、ES7、ES8、ES9、ES10新特性一览](https://juejin.cn/post/6844903811622912014)

[ES11新特性介绍](https://juejin.cn/post/6844904180855881736)

[JavaScript ES12新特性抢先体验](https://juejin.cn/post/6890652568507121677)

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END
