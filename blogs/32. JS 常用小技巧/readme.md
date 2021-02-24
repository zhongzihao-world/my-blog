# 前言

JavaScript 是一门弱类型语言，其使用非常广泛。

这里我总结了自己日常使用中的 Tips ,不断更新 ~.~

# 常用技巧

## 1. 数据类型转 Boolean

``` bash 
# !!
!!0; // false
!!undefined; // false
!!null; // false
!!(()=>{}); // true
```

## 2. 解构交换两数

不使用临时变量的情况下，交换两数

``` bash 
let a = 1, b = 2;
[a, b] = [b, a]; // [2, 1]
```

## 3. 短路赋值

初始化参数，并赋予其默认值

``` bash
let param = test_param || []; 
```

## 4. if 判断优化

当 if 判断中存在多种情况时，如:

``` bash 
if(param === 1 || param === 2 || param === 3){
  // do something
}
```

考虑使用数组进行优化

``` bash 
if([1, 2, 3].includes(param)){
  // do something
}
```

## 5. switch 判断优化

``` bash 
switch (param) {
  case '1': {
    // do something
    break;
  }
  case '2': {
    // do something
    break;
  }
  default: {
    // do something
    break;
  }
}
```

使用对象进行优化

``` bash 
const Utils = {
  '1': () => {
    // do something
  },
  '2': () => {
    // do something
  },
},

Utils[param];
```

## 6. 简单深拷贝

日常使用中，经常遇到需要深拷贝的场景

``` bash 
const arr = JSON.parse(JSON.stringify({name:'小豪',age:'25',}));
```

但存在几个问题：

-  Date 对象将变为 String 类型
-  RegExp、Error对象变为空对象
-  undefined、Function 丢失
-  NAN、Infinity 变为null

如下图：

![](https://upload-images.jianshu.io/upload_images/10390288-96cd2357b3cd43ce.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 7. 动态正则匹配

eval 生成正则表达式

``` bash 
let str = 'hello world ';
let reg1 = `/hello/g`;
let reg2 = `/world/g`;

eval(reg1).test(str); // true
eval(reg2).test(str); // true
```

# Number

## 1. 保留两位小数

``` bash 
new Number(1).toFixed(2); // '1.00'
new Number(1.994).toFixed(2); // "1.99"
new Number(1.995).toFixed(2); // "2.00"
```

## 2. 幂运算

``` bash 
Math.pow(2,10); // 1024
2**10; // 1024
```

## 3. 安全计算

js中进行数字计算时候，会出现精度误差的问题，如两个小数相乘：

```bash
 0.1*0.2; //  0.02000000000000000
 0.1*0.2 === 0.02; // false
 ```

封装一个乘法计算函数：

 ``` bash 
function safeAccumulate(arg1,arg2) {
  var m=0,s1=arg1.toString(),s2=arg2.toString();
  try{m+=s1.split(".")[1].length}catch(e){}
  try{m+=s2.split(".")[1].length}catch(e){}
  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}
safeAccumulate(0.1, 0.2); // 0.02
safeAccumulate(0.1, 0.2) === 0.02; // true
 ```

# String

## 1. 判断是否是 https 链接

startsWith 判断是否以 'https' 开头

```bash
'https://www.baidu.com/'.startsWith('https');
```

## 2. 判断是否回文数


```bash
let str = 'hello olleh';
str === str.split('').reverse().join(''); // true
```

# Array

## 1. 数组去重

使用 Set 进行数组去重

``` bash
let arr = [1, 2, 2, 3, 3, 4, 5];
arr = [...new Set(arr)];
```

## 2. 数组求和

``` bash
[1, 2, 3, 4].reduce((a, b) => a + b);  // 10
```

## 3. 平铺多维数组

flat 展开数组，参数表示要提取嵌套数组的结构深度 

``` bash 
const arr = new Array(5).fill(0).map(()=> new Array(5).fill(0));
arr.flat(Infinity);
```

## 4. 初始化二维数组

初始化 5*5 二维数组

` new Array(5).fill(0).map(()=> new Array(5).fill(0));`

# Object

## 1. 对象遍历

``` bash 
const obj = { name: '小豪', age: 25 };
Object.keys(obj).forEach(key => {
  console.log(`${key}:${obj[key]}`);
});
// name:小豪
// age:25
```

## 2. 冻结对象

Object.freeze() 冻结对象

``` bash 
let obj = { name: '小豪', age: 25 };
Object.freeze(obj);

obj.age = 18; // 25 修改失败
delete obj.age; // false 无法删除
```


---

后续不断更新，欢迎评论补充~

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END
