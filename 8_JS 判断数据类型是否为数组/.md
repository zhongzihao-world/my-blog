## 1.Array.isArray(es6 新增)

```bash
console.log(Array.isArray([])); // true
console.log(Array.isArray({})); // false
```

## 2.原型\_\_proto\_\_

```bash
console.log([].__proto__ === Array.prototype); // true
console.log([].__proto__ === Object.prototype); // false
```

## 3.构造器 constructor

```bash
console.log([].constructor === Array); // true
console.log([].constructor === Object); // false
```

## 4.Object.prototype.toString

```bash
console.log(Object.prototype.toString.call([]) === "[object Array]"); // true
console.log(Object.prototype.toString.call({}) === "[object Array]" ); // false
```

## 5.instanceof

> instanceof 运算符用来判断一个构造函数的 prototype 属性所指向的对象是否存在另外一个要检测对象的原型链上

因为 Array.\_\_proto\_\_.\_\_proto\_\_ === Object.prototype;（不理解的温习一下 JS 原型链）

```bash
console.log([] instanceof Array); // true
console.log([] instanceof Object); // true
```
