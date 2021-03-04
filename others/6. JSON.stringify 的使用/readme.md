# 作用:

序列化对象

# 语法

> JSON.stringify(value[, replacer][, space])

- value：必须要的字段。传入的对象，如数组，类等。
- replacer：可选字段。两种方式，一是方法，二是数组。

  - 传入的是数组。以第二个数组的值为 key，第一个数组为 value 进行序列化，如果不存在就忽略。
  - 传入的是方法。把序列化后的每一个对象传进方法里面进行处理。

- space：分隔符。

  - 1、如果省略，那显示出来的值就没有分隔符，直接输出。
  - 2、如果是一个数字，那它就定义缩进几个字符，如果大于 10，则最大值为 10。
  - 3、如果是一些转义字符，比如“\t”，表示回车，那它每行一个回车。
  - 4、如果是字符串，那每行输出组把该字符串附加上去，最大长度也是 10 个字符。

  # 实例

1. 只有一个参数

```bash
const obj = {};
obj.age = 27;
obj.name = 'zzh';

console.log(JSON.stringify(obj)); # {"age":27,"name":"zzh"}
```

2. 第二个参数存在

- 传入的值是 function

```bash
const arr = ['Zzh', 'zzh'];

function upperCase(key, value) {
  return value.toString().toUpperCase();
}

console.log(JSON.stringify(arr, upperCase)); # "ZZH,ZZH"
```

- 传入的值是数组

直接忽略

```bash
const arr = ['Zzh', 'zzh'];

console.log(JSON.stringify(arr, [1, 2])); # ["Zzh","zzh"]
```

- 传入的值是数组，且第一个参数不为数组对象

第二个的值为 key，第一个值为 value 进行表示

```bash
const obj = {};
obj.age = 27;
obj.name = 'zzh';
obj.weight = 67;

console.log(JSON.stringify(obj, ['age', 'name', 'height'])); # {"age":27,"name":"zzh"}
```

3. 第三个参数存在

- 参数为数字

定义缩进几个字符

```bash
const obj = {};
obj.age = 27;
obj.name = 'zzh';
obj.weight = 67;

console.log(JSON.stringify(obj, ['age', 'name', 'height'], 20));
# {
#          "age": 27,
#          "name": "zzh"
#}
```

- 参数为转义字符

“\t”，表示回车，每一行一个回车

```bash
const obj = {};
obj.age = 27;
obj.name = 'zzh';
obj.weight = 67;

console.log(JSON.stringify(obj, ['age', 'name', 'height'], "\t"));
# {
#	"age": 27,
#	"name": "zzh"
#}
```
