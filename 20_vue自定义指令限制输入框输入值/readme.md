## 需求

前端开发过程中，经常遇到表单校验的需求，比如校验用户输入框的内容，限制用户只能输入数字。

本文内容基于 element-ui，el-form 组件可以绑定 model、rule 用于表单内容校验，但如果有多个表单多个输入框那就得写很多个 rule，虽然方法可以通用可是使用起来也是比较繁琐的，可通过自定义执行实现一次注册，多次使用。

## Vue 自定义指令

我们使用 el-input 作为表单的输入框

### 1. 先注册一个自定义指令

```bash
import Vue from 'vue';

Vue.directive('LimitInputNumber', {
  bind(el) {
   # do something
  },
});
```

### 2.使用自定义指令

直接在组件内绑定 v-limit-input-number 指令

```bash
<el-input  v-limit-input-number  />
```

### 3.指令内部校验

- 1.  onkeypress 事件

> onkeypress 事件会在键盘按键被按下并释放一个键时发生

可在事件触发时检测若输入的值不为数字，直接返回 fales

```bash
Vue.directive('LimitInputNumber', {
  bind(el) {
    el.onkeypress = (event) => {
      return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8;
    };
  },
});
```

但该事件存在一个问题，就是在中文输入法的时候无法触发事件，导致用户可以输入中文

- 2. oninput 事件

> oninput 事件在用户输入时触发

可在事件触发时进行过滤，过滤掉那些不为数字的值，并重新绑定到输入框上，解决了中文输入法下的问题

```bash
Vue.directive('LimitInputNumber', {
  bind(el) {
    el.oninput = () => {
      el.children[0].value = el.children[0].value.replace(/\D/ig, '');
    };
  },
});

```

## 完整代码

```bash
import Vue from 'vue';

Vue.directive('LimitInputNumber', {
  bind(el) {
    el.onkeypress = (event) => {
      return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8;
    };
    el.oninput = () => {
      el.children[0].value = el.children[0].value.replace(/\D/ig, '');
    };
  },
});
```

---

END
