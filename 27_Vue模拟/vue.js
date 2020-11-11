const compileUtils = {
  // 从data拿值，解决嵌套值的问题
  getVal(expr, vm) {
    return expr.split('.').reduce((data, currentVal) => {
      return data[currentVal];
    }, vm.$data);
  },
  text(node, expr, vm) {
    const value = this.getVal(expr, vm);
    this.updater.textUpdater(node, value);
  },
  html(node, expr, vm) {

  },
  model(node, expr, vm) {

  },
  on(node, expr, vm, eventName) {

  },
  updater: {
    textUpdater(node, value) {
      node.textContent = value;
    }
  }
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

  // 文档碎片
  nodeFragment(el) {
    const f = document.createDocumentFragment();
    let first_child;
    while (first_child = el.firstChild) {
      f.appendChild(first_child);
    }
    return f;
  }

  // 是否是指令 v-model v-text v-html v-on:click等
  isDirective(name) {
    return name.startsWith('v-');
  }

  compile(fragment) {
    const childNodes = fragment.childNodes;
    [...childNodes].forEach(node => {
      if (this.isElementNode(node)) {
        this.compileElement(node);
      } else {
        this.compiletext(node);
      }
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
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
        // v-text v-html v-model v-on:click
        const [, directive] = name.split('-');
        const [directiveName, eventName] = directive.split(':');
        compileUtils[directiveName](node, value, this.vm, eventName);
      }
    });
  }

  // 编译文本节点
  compiletext(node) {
    const is_template = /\{\{(.*)\}\}/;
    if (is_template.test(node.nodeValue)) {
    }
  }
}


class Vue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data();
    this.$options = options;
    // 挂载
    if (this.$el) {
      new Compile(this.$el, this);
    }
  }
}