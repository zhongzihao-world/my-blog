# 前言

常规 vue 项目打包后访问，返回 html 内容只有一个 id 为 app 的 div，其他内容块都是通过 js 动态生成的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d93b3a47622c44108d30deb4c8570001~tplv-k3u1fbpfcp-watermark.image)

有两个比较大的问题：

  - 不利于 seo
  - 首屏加载页慢，用户体验不好

本文是自己总结的几点优化经验，如有不足，欢迎指出~

# 优化

## SSR

使用 ssr 重新部署构建项目后：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aec0a730009e4a71916f5696cb119369~tplv-k3u1fbpfcp-watermark.image)

可以看到返回的内容就已经包含了首屏的 html 代码块 perfect!~.~

**极速传送门**： [基于vue-cli4.0+Typescript+SSR的小Demo](https://github.com/zhongzihao1996/vue-ssr-demo)


## 按需引入

使用 es6 module 进行按需引入

路由文件中按需引入组件：

``` bash 
# router.index.ts
export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "Home" */ './views/Home.vue'),
      },
      {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      },
    ],
  });
}
```

静态库按需引入模块，而不是全部，如 element-ui 库中，我只想用 button 组件 ：

``` bash 
import {
  button
} from 'element-ui';
```

## 请求优化

### 1. css、js 放置顺序

css 文件放 header 中，js 文件放 body前，不过 vue 已经帮我们处理好了~

### 2. 使用字体图标，icon 资源使用雪碧图

我们知道 http 建立一次连接需要 3 次握手，太多的请求会影响加载速度

对不必要的静态资源我们应该尽量减少，比如页面中的 icon 图标，如下腾讯官网的一个图片：

![](https://sqimg.qq.com/qq_product_operations/im/2015/plats1.png)

直接引入一张完成的图片，根据 ``` background-position``` 来设置图片的位置

推荐一个制作雪碧图的网站： [CSS Sprites Generator](https://www.toptal.com/developers/css/sprite-generator)


## 使用CDN

静态资源都上传到 CDN，提高访问速度

**不使用 CDN：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ade6f977203247f78a139c9ef46f5508~tplv-k3u1fbpfcp-watermark.image)


**使用 CDN：**

可以看到使用 CDN后，会对静态文件进行 GZIP 压缩， 下载度度极大的提高

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d55fb4fc258545b48ed9cda692c717a6~tplv-k3u1fbpfcp-watermark.image)

## 入口 chunk 优化

拆分入口 chunk 文件，分离出一些静态的库，既可以加速打包，也可以优化加载。

如下，分离了一些静态库：vuejs、axios、vuex等，可以看到浏览器将开启多个下载线程进行下载。若没有分离这些静态库，入口 chunk 将十分巨大，加载速度可想而知~.~

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93fc346839954d69b6586b343173430e~tplv-k3u1fbpfcp-watermark.image)

分离一个 element-ui 库，dev 环境我们不用管，prod 环境下我们才分离，只需要在 vue 打包配置中移除该库即可：

``` bash 
# vue.config.js
configureWebpack: {
  externals:
    process.env.NODE_ENV === 'production'
      ? {
        'element-ui': 'element-ui',
      }
      : undefined,
},
```

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END
