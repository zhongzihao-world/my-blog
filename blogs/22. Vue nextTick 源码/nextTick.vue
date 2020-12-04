<template>
  <div>
    <div>
      <h1>原始数据</h1>
      <p ref="demo"
         @click="changeMsg">{{msg1}}</p>
      <hr />
    </div>
    <div>
      <h1>默认</h1>
      <p>{{msg2}}</p>
      <hr />
    </div>
    <div>
      <h1>Promise</h1>
      <p>{{msg3}}</p>
      <hr />
    </div>
    <div>
      <h1>setImmediate</h1>
      <p>{{msg4}}</p>
      <hr />
    </div>
    <div>
      <h1>setTimeout</h1>
      <p>{{msg5}}</p>
      <hr />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg1: 'hello world',
      msg2: 'default',
      msg3: 'default',
      msg4: 'default',
      msg5: 'default',
    };
  },
  methods: {
    changeMsg() {
      this.msg1 = 'nextTick';
      this.msg2 = this.$refs.demo.innerHTML;
      Promise.resolve().then(() => {
        this.msg3 = this.$refs.demo.innerHTML;
      });
      setImmediate(() => {
        this.msg4 = this.$refs.demo.innerHTML;
      });
      setTimeout(() => {
        this.msg5 = this.$refs.demo.innerHTML;
      });
    },
  },
};
</script>
