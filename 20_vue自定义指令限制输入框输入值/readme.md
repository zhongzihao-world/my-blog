```bash
limit_input_number.js

export default {
  bind(el) {
    el.onkeypress = (event) => {
      return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8;
    };
    el.oninput = () => {
      el.children[0].value = el.children[0].value.replace(/\D/ig, '');
    };
  },
};

]);

v-limit-input-number
```


END
