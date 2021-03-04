# toString

> 返回一个表示该对象的字符串，当对象表示为文本值或以期望的字符串方式被引用时，toString 方法被自动调用。

## 类型判断

```bash
toString.call(()=>{})       // [object Function]
toString.call({})           // [object Object]
toString.call([])           // [object Array]
toString.call('')           // [object String]
toString.call(NaN)          // [object Number]
toString.call(22)           // [object Number]
toString.call(undefined)    // [object undefined]
toString.call(null)         // [object null]
toString.call(new Date)     // [object Date]
toString.call(Math)         // [object Math]
toString.call(window)       // [object Window]
```

## 自动调用

**使用操作符的时候，如果其中一边为对象，则会先调用 toSting 方法，也就是隐式转换，然后再进行操作。**

```bash
let c = [1, 2, 3]
let d = {a:2}
Object.prototype.toString = function(){
    console.log('Object')
}
Array.prototype.toString = function(){
    console.log('Array')
}
Number.prototype.toString = function(){
    console.log('Number')
}
String.prototype.toString = function(){
    console.log('String')
}

console.log(c < 2)  // false  (一次 => 'Array')
console.log(c + c)  // "1,2,31,2,3" (两次 => 'Array')
console.log(d > d)  // false (两次 => 'Object')
```

# valueOf

> 返回当前对象的原始值。

```bash
let c = [1, 2, 3]
let d = {a:2}

console.log(c.valueOf()); // [1, 2, 3]
console.log(d.valueOf());  // {a:2}
```

# 两者区别

- 在输出对象时会自动调用
- 不同点：**默认返回值不同，且存在优先级关系**

valueOf 偏向于运算，toString 偏向于显示。

```bash
class A {
    valueOf() {
        return 2
    }
    toString() {
        return '哈哈哈'
    }
}
let a = new A()

console.log(String(a)); // '哈哈哈'   => (toString)
console.log(Number(a)); // 2         => (valueOf)
console.log(a + '22'); // '222'     => (valueOf)
console.log(a == 2); // true      => (valueOf)
console.log(a === 2); // false     => (严格等于不会触发隐式转换)
```

- 在进行对象转换时，将优先调用 toString 方法，如若没有重写 toString，将调用 valueOf 方法；如果两个方法都没有重写，则按 Object 的 toString 输出
- 在进行强转字符串类型时，将优先调用 toString 方法，强转为数字时优先调用 valueOf。
- 使用运算操作符的情况下，valueOf 的优先级高于 toString。

# 案例

## 1 a===1&&a===2&&a===3 为 true

双等号(==)：会触发隐式类型转换，所以可以使用 valueOf 或者 toString 来实现。

```bash
class A {
    constructor(value) {
        this.value = value;
    }
    valueOf() {
        console.log('valueOf ');
        return this.value++;
    }
    toString () {
        console.log('toString');
        return this.value++;
    }
}

const a = new A(1);
if (a == 1 && a == 2 && a == 3) {
    console.log("hello world");
}
// 输出3次 valueOf
```

全等(===)：严格等于不会进行隐式转换，这里使用 Object.defineProperty 数据劫持的方法来实现

```bash
let value = 1;
Object.defineProperty(window, 'a', {
    get() {
        return value++;
    }
})
if (a === 1 && a === 2 && a === 3) {
    console.log("hello world")
}
```

## 2 实现一个无限累加函数

用 JS 实现一个无限累加的函数 add

```bash
add(1); // 1
add(1)(2);  // 3
add(1)(2)(3)； // 6
add(1)(2)(3)(4)； // 10
```

实现:

```bash
function add(a) {
    function sum(b) { // 使用闭包
        a = b ? a + b : a; // 累加
        return sum;
    }
    sum.toString = function() { // 只在最后一次调用
        return a;
    }
    return sum; // 返回一个函数
}

add(1); // 1
add(1)(2); // 3
add(1)(2)(3); // 6
add(1)(2)(3)(4); // 10
```
