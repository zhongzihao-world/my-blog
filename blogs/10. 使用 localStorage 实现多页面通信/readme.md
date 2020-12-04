# 背景

> 两个页面 A、B，B 页面关闭时，通知 A 页面请求接口刷新列表页

![](https://upload-images.jianshu.io/upload_images/10390288-7a37cfbfaab97b82.gif?imageMogr2/auto-orient/strip)

## 实现

使用 **storage** 事件实现页面通信，约定好通信的 key，这里我们假定 key 为 **refresh_list**

**A 页面 监听 storage 事件**

```bash
mounted() {
  window.addEventListener('storage', this.otherWindowListener, false);
  this.$on('hook:beforeDestroy', () => {
    window.removeEventListener('storage', this.otherWindowListener);
  });
},
methods: {
  otherWindowListener(event) {
    if (event.key === 'refresh_list'){
      // do something
    };
  },
},
```

**B 页面，当保存时，设置约定好的 localStorage key 值，关闭页面**

```bash
methods: {
  close() {
    localStorage.setItem('refresh_list', new Date().getTime());
    try {
        window.close();
      } catch (e) {
        console.log(e);
    }
  },
},

```

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END