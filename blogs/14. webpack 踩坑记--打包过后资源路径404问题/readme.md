# 前言

该文章是基于低版本 vue-cli2.x 创建的项目，vue-cli3.0 以后修改 webpack 配置需要在项目根目录下新建一个 **vue.config.js**，不过都是换汤不换药

# 项目配置

页面很简单，一段文字，和一张背景图片

下面几个配置项比较重要:

- assetRoot: 打包后文件存放路径
- assetsSubDirectory：静态资源路径(除 index.html 其他资源将被放入这里)
- assetsPublicPath：index.html 里面引用资源的的路径前缀

假设我们做如下的配置

```bash
# /config/index.js
assetsRoot: path.resolve(__dirname, '../dist'),
assetsSubDirectory: 'static',
```

## 访问白屏问题

打包后 dist 的目录是这样的

```bash
# dist
┌── static
│   └── css
│   │   └── *.css
│   └── img
│   │   └── *.jpg
│   └── js
│   │   └── *.js
└── index.html
```

然后，双击打开 index.html，what？怎么白屏了

F12 看一下，发现这里的资源路径是有问题的，因为 static/js/xxx 代表的是根路径下，而我们打开是在项目目录下找不到资源，自然就白屏了。

![](https://upload-images.jianshu.io/upload_images/10390288-3d040aae5b09cc70.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

打包过后的目录结构是固定的，而 index.html 和 static 同级，固可以用相对路径引入 static 下的资源

配置:

```bash
assetsSubDirectory：'./'
```

配置完成后，再打包访问，文字出来，背景图片裂开了......
![](https://upload-images.jianshu.io/upload_images/10390288-238f40f68459e296.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 背景图片裂开

F12 发现，图片资源路径有问题：static/img/vague_bg.9cfff92.png。因为是在 css 里引入的 img，结合打包出来的目录结构，正确的应该是 /static/img/xxx，但问题是前面已经设置了 assetsSubDirectory 为相对路径.......

有补救方法，在 xxx.css 里面回退两个路径不就回到了 static 目录了吗？

配置 url-loader

```bash
# /build/webpack.base.conf.js 设置rules
{
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  use: [
    {
      loader: "url-loader",
      options: {
        limit: 10000,
        name: utils.assetsPath("img/[name].[hash:7].[ext]"),
        publicPath: "../../"
      }
    }
  ]
},
```

设置完，再打包访问，perfect~
![](https://upload-images.jianshu.io/upload_images/10390288-28cf8aebcd677fed.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 后言

有些人可能会问，为什么不一开始直接设置 assetsSubDirectory：'/'，即根路径不也可以解决问题吗？

**是的，没错，**确实可以解决问题。但是我哔哩哔哩一大堆是提供一些问题的解决思路，自己踩过的坑和如何排坑的。如果设置了跟路径，那么就限死了当前资源只能在根路径了，可能项目会集成到后端项目中(也可以通过目录映射解决)，不一定是在根路径下。设置当前 dist 下的资源位相对路径确保在任何环境下资源路径都没有问题。

该篇文章是 18 年刚毕业的时候遇到的问题，之前写在自己的 blog 里面，因为疏于管理自己的 blog 被黑，现在分享出来，记录自己的心路历程。

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END

