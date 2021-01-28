# 前言

本篇文章基于 vue、node(koa)

# 需求

vue 项目开发过程中，接口跨域是一个很常见的问题。在开发时候可以用 vue 自带的 proxy 可以轻松解决。生产环境下，前端项目往往是部署在后端项目下，不会存在跨域的问题，接口前缀可以忽略。

dev 环境下，请求一个产品列表接口，我们可能会这么做：

```bash
https://www.baidu.com/api/product/list
```

生产环境下，前缀可以忽略：

```bash
/api/product/list
```

问题来了，如果我们想在本地测试生产环境下的前端项目，会存在跨域的问题；发给后端部署项目又太麻烦，修改代价太大。我们可以自己部署一个简易的 node 服务，来部署自己的前端项目~

# 实现

## 0. 安装依赖

```basn
npm i koa --save-dev
npm i koa-static --save-dev
npm i koa-mount --save-dev
npm i http-proxy-middleware --save-dev
npm i koa2-connect --save-dev
```

## 1. koa 搭建简易服务端

引入 koa，然后监听端口

```bash
const Koa = require('koa');
const Koa = require('koa');
const path = require('path');

const app = new Koa();;
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(` Your application is running here: http://localhost:${port}`);
});
```

开放 dist（即打包出来的目录）

```bash
const koaStatic = require('koa-static');
const koaMount = require('koa-mount');

// 开放目录
app.use(koaMount('/', koaStatic(resolve('../dist'))));
```

这样差不多就完成了，跑服务然后打开 3000 端口，项目能够正常访问：

![](https://upload-images.jianshu.io/upload_images/10390288-8ac039a7c54e90c5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 2. 转发接口请求

项目是能正常请求了，可是还需要处理接口问题，即 node 当成中间件，转发前端接口请求到真正的后端接口

```bash
const { createProxyMiddleware } = require('http-proxy-middleware');
const k2c = require('koa2-connect');

app.use(async (ctx, next) => {
  const url = ctx.path;
  if (url.startsWith('/api')) {
    ctx.respond = false;
    await k2c(
      createProxyMiddleware({
        target: # 后端的接口地址,
        changeOrigin: true,
        secure: false,
      }),
    )(ctx, next);
  }
  return await next();
});
```

最后再打开浏览器查看，大功告成,接口转发成功~

![](https://upload-images.jianshu.io/upload_images/10390288-2298e4d082470611.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 源码

[源码](https://github.com/zhongzihao1996/my-blog/blob/dev/blogs/18.%20%E4%BD%BF%E7%94%A8node%E8%BD%AC%E5%8F%91%E8%AF%B7%E6%B1%82/server.js)

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END