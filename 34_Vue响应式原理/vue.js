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