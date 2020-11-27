# 前言

Vue 最独特的特性之一，是其非侵入性的响应式系统。比如我们修改了数据，那么依赖这些数据的视图都会进行更新，大大提高了我们的"搬砖"效率，回想一下初学 JS 的时候海量的 Dom操作~.~......，Vue 通过数据驱动视图，极大的将我们从繁琐的DOM操作中解放出来。

如下图，我们改变了 msg 的值，视图也响应式的进行了更新

![](https://upload-images.jianshu.io/upload_images/10390288-012f028f655fb620.gif?imageMogr2/auto-orient/strip)

# Vue 响应式原理

我们先看 vue 官网的图，其实不太清晰，我初看的时候也是一脸懵逼的~.~：

![](https://upload-images.jianshu.io/upload_images/10390288-b2fe639d96b0a030.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

再看下面这张图，响应式原理涵盖在里面了（图片来源于网络）：

![](https://upload-images.jianshu.io/upload_images/10390288-38a2b30b4bce1864.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

梳理一下流程:

- 1. Vue 初始化 => 劫持 data 设置 get、set （拦截数据读写）
- 2. Compile 解析模板 => 生成 watcher => 读取 data，触发 get 方法 => Dep 收集依赖（watcher）
- 3. 数据变化 => 触发 set方法 => 通知 Dep 中的所有  watcher => 视图更新


对于 **Observer、Dep 和 Watcher** 这三大金刚 ，我初学的时候也是傻傻的分不清楚很懵，我的理解是：


**Dep(dependence)** 即依赖收集器，收集 Watcher 即观察者。

**Watcher** 即观察者，观察数据，数据变化时更新对应的视图（dom）。

**Observer** 即劫持者，通过 **Object.defineProperty()** 给数据设置 get 和 set 方法：

- get: 当某个地方用到数据时，如下 h1、h2 标签都用到了 msg 数据，即观察 msg 数据 的两个 watcher 将被放入 msg 数据的依赖收集器 Dep 中。

```bash
data() {
  return {
    msg: 'hello vue',
  }
},

<h1>{{msg}}</h1>
<h2>{{msg}}</h2>
```

- set：当 msg 数据改变的时候，遍历 Dep 依赖收集器，通知所有 Watcher 更新视图，即 h1、h2 标签内的文本内容

## 实现 Vue 的响应式系统

通过上面分析，可知每一个数据有一个依赖收集器 Dep，Dep 里面存放到该数据的 Watcher，如下图所示（图片来源于网络）:

![](https://upload-images.jianshu.io/upload_images/10390288-72976326be0b846c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**1. Dep**

我们先实现 Dep，Dep 我们可以用数组来模拟，它应该有两个方法：

- add，收集 Watcher
- notify，数据变化的时候通知 Watcher 更新视图

```bash
# 依赖收集器
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(watcher) {
    # 添加观察者
    this.subs.push(watcher);
  }
  notify() {
    # 通知每一个观察者更新视图
    this.subs.forEach(watcher => watcher.update());
  }
}
```

**2. Watcher**

Watcher 实现如下，其中 cb 是更新视图的方法，关键点在于 oldVal，它有两个用处：

- Dep 触发 update 方法时，比对新旧值，若有变化才更新，避免不必要的视图更新
- **初始化的时候，会获取旧值，会触发数据的 get 方法，在此时可以把依赖注入到 Dep 中（即依赖收集）**

```bash
# 观察者，用于更新视图
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    # 视图更新函数
    this.cb = cb;
    # 旧值
    this.oldVal = this.getOldVal();
  }
  getOldVal() {
    # 传递watch自己
    Dep.target = this;
    # 获取值的时候会触发 get 方法，把自己 push 进 deps[] 里
    const oldVal = compileUtils.getVal(this.expr, this.vm);
    Dep.target = null;
    return oldVal;
  }
  update() {
    # 获取新值
    const newVal = compileUtils.getVal(this.expr, this.vm);
    if (newVal !== this.oldVal) {
      this.cb(newVal);
    }
  }
}
```

``` Dep.target = this``` 的用处是相当于设置了一个全局变量**让 Dep 能收集到 watcher 自己**，后面 ```Dep.target = null``` 用处是销毁全局变量

**3. Observer**

Observer 实现如下，通过 Object.defineProperty 拦截数据的读写操作：

- get 收集依赖，**注意判断 Dep.target 是否有值**，因为模板解析的时候也会读取数据触发 get 方法
- set 通知依赖收集器，更新视图

```bash
// 数据劫持
class Observer {
  constructor(data) {
    this.observer(data, key, data[key]);
  }
  difineReactive(obj, key, value) {
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get() {
        # 防止视图初始化的时候也被收集到Dep中
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: newVal => {
        this.observer(newVal);
        if (newVal !== value) {
          value = newVal;
          # 通知依赖收集器，有变化
          dep.notify();
        }
      },
    });
  }
}

```

**4. Compile**

到这里我们已经实现了 Observer、Dep 和 Watcher，实现了数据的响应式追踪，可是还有一个点没打通，那就是**依赖收集**，那么依赖什么时候收集呢？换言之我们怎么知道哪些数据依赖了哪些视图呢？

在 Vue 解析模板的时候，实际上我们已经知道了哪些 Dom 依赖了哪些数据，所以是在 compile 的时候完成了模板解析并完成了依赖收集。

Compile 实现如下，省略大部分 dom 操作相关代码，可以用 DocumentFragment 文档碎片提升性能，逻辑比较简单，我们在 dom 解析数据的时候生成了对应的 watcher，并完成了依赖收集：

``` bash 
# 编译类，输出真实Dom
class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    # 获取文档对象
    const fragment = this.nodeFragment(this.el);
    # 编译
    this.compile(fragment);
    # 挂载回app
    this.el.appendChild(fragment);
  }
  # 是否元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
  # 获取文档碎片
  nodeFragment(el) {
    # do something
  }
  compile(fragment) {
    const childNodes = fragment.childNodes;
    [...childNodes].forEach(node => {
      if (this.isElementNode(node)) {
        # 元素节点
        # do something
      } else {
        # 文本节点
        # do something
      }
    })
  }
}

# 根据不同指令 执行不同的编译操作
const compileUtils = {
  # v-text
  text(node, expr, vm) {
    const value = vm.$data[expr];
    # 创建观察者 完成依赖收集
    new Watcher(vm, expr, newVal => {
      node.textContent = value;
    });
    node.textContent = value;
  },
};
```

至此一个响应式的系统就已经完了

# 双向数据绑定

## 什么是双向数据绑定

上面我们实现了响应式的系统，但只是单向的，即数据驱动视图，什么是双向数据绑定呢？如下图：
![](https://upload-images.jianshu.io/upload_images/10390288-da0e19e63fd51768.gif?imageMogr2/auto-orient/strip)

我们常见的 v-model， 就是双向数据绑定，其实它是一个语法糖：

``` bash
<input v-model="msg" />

等价于 =>

<input :value="msg" @input="msg = $event.target.value" />
```

## 实现

双向数据绑定即：
- 数据改变 => 视图更新
- 视图改变 => 数据改变 => 视图更新

![](https://upload-images.jianshu.io/upload_images/10390288-5ca49153f5347b07.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

比如最简单的 input，我们只需要监听 input 事件，文本发生变化时更新数据，触发数据的 set 方法，通知所有的 watcher 更新视图

我们在模板编译的时候，**给 dom 元素绑定相应的事件**，如 input 标签绑定 input 事件并指定更新数据的回调函数：

``` bash 
const compileUtils = {
  # v-model
  model(node, expr, vm) {
    const value = vm.$data[expr];
    # 创建观察者 完成依赖收集
    new Watcher(vm, expr, newVal => {
      node.value = value;
    });
    node.addEventListener('input', (e) => {
      # 更新数据，触发数据的 set 方法
      vm.$data[expr] = newVal;
    });
    node.value = value;
  },
};
```
至此大功告成


# 源码

[源码](https://github.com/zhongzihao1996/my-blog/blob/master/34_Vue%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86/vue.js)


---

END
