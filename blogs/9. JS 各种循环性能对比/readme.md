我们日常处理数据的时候，经常会需要对数组进行处理，数组遍历的方式有很多种，如 for 循环、forEach 等，那么它们的效率如何呢，测试一下

新建一个 40000000 个数据测试数组

```bash
const data = new Array(40000000).fill(0);
```

执行环境为:

```bash
node -v
v10.5.0
```

执行 10 次并取平均值（实际结果可能受 node 版本和主机配置影响）

## 1.普通 for 循环

```bash
console.log('-----普通for循环-------');
console.time('for');
const result_1 = [];
for (let i = 0; i < data.length; i++) {
  result_1.push(data[i]);
}
console.timeEnd('for');
console.log('-----执行完毕-------');
```

平均耗时约：**674.267ms**

## 2.for of

```bash
console.log('-----for of-------');
console.time('for_of');
const result_2 = [];
for (let item of data) {
  result_2.push(item);
}
console.timeEnd('for_of');
console.log('-----执行完毕-------');
```

平均耗时约：**1095.000ms**

## 3.for in

```bash
console.log('-----for in-------');
console.time('for_in');
const result_3 = [];
for (let key in data) {
  result_3.push(data[key]);
}
console.timeEnd('for_in');
console.log('-----执行完毕-------');
```

平均耗时约：**9213.187ms**

## 4.forEach

```bash
console.log('-----forEach-------');
console.time('forEach');
const result_4 = [];
data.forEach((item) => {
  result_4.push(item);
});
console.timeEnd('forEach');
console.log('-----执行完毕-------');
```

平均耗时约：**1022.339ms**

## 5.map

```bash
console.log('-----map-------');
console.time('map');
const result_5 = [];
data.map((item) => {
  result_5.push(item);
});
console.timeEnd('map');
console.log('-----执行完毕-------');
```

平均耗时约：**6751.867ms**

只看上面的执行结果，性能:
**普通 for 循环 > forEach > for of > map > for in**

如果只考虑性能，遍历的时候优先考虑 for 循环；但不应只考虑性能**还要考虑代码语义性和可维护性**。
