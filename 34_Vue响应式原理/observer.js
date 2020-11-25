// 试图更新
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    // 旧值
    this.oldVal = this.getOldVal();
  }

  getOldVal() {
    // 传递watch自己
    Dep.target = this;
    // 获取值的时候会出发 get 方法，把自己 push 进 deps[] 里
    const oldVal = compileUtils.getVal(this.expr, this.vm);
    Dep.target = null;
    return oldVal;
  }

  update() {
    const newVal = compileUtils.getVal(this.expr, this.vm);
    if (newVal !== this.oldVal) {
      this.cb(newVal);
    }
  }
}


// 订阅收集
class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
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
        // 防止初始化的时候也被push
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: newVal => {
        this.observer(newVal);
        if (newVal !== value) {
          value = newVal;
          dep.notify();
        }
      },
    });
  }

}