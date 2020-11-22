class Observer {

  constructor(data) {
    this.observer(data);
  }

  observer(data) {
    if (data && typeof data === 'object') {
      // console.log(data);
      Object.keys(data).forEach(key => {
        this.difineReactive(data, key, data[key]);
      });
    }
  }

  difineReactive(obj, key, value) {
    // 递归绑定
    this.observer(value);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get() {
        return value;
      },
      set: newVal => {
        this.observer(newVal);
        if (newVal !== value) {
          value = newVal;
        }
      },
    });
  }


}