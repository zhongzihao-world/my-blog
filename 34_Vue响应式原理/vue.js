const compileUtils = {
  // data 拿值
  getVal(expr, vm) {
    return vm.$data[expr];
  },
  // data 设置值
  setVal(expr, vm, newVal) {
    vm.$data[expr] = newVal;
  },
  // v-text
  text(node, expr, vm) {
    const value = this.getVal(expr, vm);
    // 创建观察者
    new Watcher(vm, expr, newVal => {
      this.updater.textUpdater(node, newVal);
    });
    this.updater.textUpdater(node, value);
  },
  // v-model
  model(node, expr, vm) {
    const value = this.getVal(expr, vm);
    // 创建观察者
    new Watcher(vm, expr, newVal => {
      this.updater.modelUpdater(node, newVal);
    });
    // 更新数据，触发数据的 set 方法
    node.addEventListener('input', (e) => {
      this.setVal(expr, vm, e.target.value);
    });
    this.updater.modelUpdater(node, value);
  },
  updater: {
    textUpdater(node, value) {
      node.textContent = value;
    },
    modelUpdater(node, value) {
      node.value = value;
    },
  },
};

// 编译类，输出真实Dom
class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    // 获取文档对象
    const fragment = this.nodeFragment(this.el);
    // 编译
    this.compile(fragment);
    // 放回app
    this.el.appendChild(fragment);
  }

  // 是否元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }

  // 是否是指令 v-model v-text等
  isDirective(name) {
    return name.startsWith('v-');
  }

  // 文档碎片
  nodeFragment(el) {
    const f = document.createDocumentFragment();
    let first_child;
    while (first_child = el.firstChild) {
      f.appendChild(first_child);
    }
    return f;
  }

  compile(fragment) {
    const childNodes = fragment.childNodes;
    [...childNodes].forEach(node => {
      if (this.isElementNode(node)) {
        // 元素节点
        this.compileElement(node);
      } else {
        // 文本节点
        this.compiletext(node);
      }
    })
  }

  // 编译元素节点
  compileElement(node) {
    const attributes = node.attributes;
    [...attributes].forEach(attr => {
      const { name, value } = attr;
      // 判断是否为指令 
      if (this.isDirective(name)) {
        // v-text v-model
        const [, directive] = name.split('-');
        // 编译，更新数据
        compileUtils[directive](node, value, this.vm);
      }
    });
  }

  // 编译文本节点
  compiletext(node) {
    // do something
  }
}

// 观察者，用于更新视图
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    // 视图更新函数
    this.cb = cb;
    // 旧值
    this.oldVal = this.getOldVal();
  }

  getOldVal() {
    // 传递watch自己
    Dep.target = this;
    // 获取值的时候会触发 get 方法，把自己 push 进 deps[] 里
    const oldVal = compileUtils.getVal(this.expr, this.vm);
    Dep.target = null;
    return oldVal;
  }

  update() {
    // 获取新值
    const newVal = compileUtils.getVal(this.expr, this.vm);
    if (newVal !== this.oldVal) {
      this.cb(newVal);
    }
  }
}


// 依赖收集器
class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(watcher) {
    // 添加观察者
    this.subs.push(watcher);
  }

  notify() {
    // 通知每一个观察者更新视图
    this.subs.forEach(watcher => watcher.update());
  }
}


// 数据劫持
class Observer {

  constructor(data) {
    this.observer(data);
  }

  observer(data) {
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        this.difineReactive(data, key, data[key]);
      });
    }
  }

  difineReactive(obj, key, value) {
    // 递归绑定
    this.observer(value);
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get() {
        // 防止视图初始化的时候也被收集到Dep中
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: newVal => {
        this.observer(newVal);
        if (newVal !== value) {
          value = newVal;
          // 通知依赖收集器，有变化
          dep.notify();
        }
      },
    });
  }
}


class Vue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data();
    this.$options = options;
    // 挂载
    if (this.$el) {
      new Observer(this.$data);
      new Compile(this.$el, this);
    }
  }
}