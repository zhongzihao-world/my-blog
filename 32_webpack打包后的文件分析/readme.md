# webpack

> Webpack 是一个前端资源加载/打包工具。它将根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源。

![](https://www.runoob.com/wp-content/uploads/2017/01/what-is-webpack.png)

Webpack 可以将多种静态资源 js、css、less 转换成一个静态文件，减少了页面的请求。

本文主要是分析webpack打包后的文件

---

# 新建打包

## 1. 新建测试模块

新建两个 js , 导出简单的函数

``` bash 

# add.js

const add = (a, b) => a + b; 

# demo.js

const sub = (a, b) => a - b; 

``` 
新建主入口方法 index,引入demojs方法

``` bash 
# index.js

const { add, sub } = require('./demo');

console.log(add(99, 1));
console.log(sub(99, 1));
```

新建webpack配置

``` bash 
# webpack.config.js
module.exports = {
  // mode: 'development',
  mode: 'production',
  devtool: 'source-map',
  entry: resolve('./index.js'),
  output: {
    path: resolve('./dist'),
  }
};
```

执行打包, npm run build 

![](https://upload-images.jianshu.io/upload_images/10390288-29109ebbdeaa0eb4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

执行打包后的js，运行正常
![](https://upload-images.jianshu.io/upload_images/10390288-1c59c256437b30cd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

---

# 打包后的文件分析

瞄一眼打包后的文件: main.js

![](https://upload-images.jianshu.io/upload_images/10390288-bb1d147fef5ce035.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

从上到下扫一遍后，可以发现其是一个匿名的自执行函数，函数内部定义了一个 __webpack_modules__ 对象，一个闭包：__webpack_require__ 函数，一个 __webpack_module_cache__ 对象，看名字就知道这是一个缓存对象，下面又是一个匿名的自执行函数

1. 展开下面的匿名自执行函数:

![](https://upload-images.jianshu.io/upload_images/10390288-8780d22b14f89ae6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

其实就是入口 index.js 里的代码块，对导出模块部分做了相应的处理，其内部调用 __webpack_require__ 函数实现了模块的导入功能

2. 展开 __webpack_require__ 函数:
![](https://upload-images.jianshu.io/upload_images/10390288-d47ba7b205db30dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

内部也比较简单，使用了 __webpack_module_cache__ 缓存模块，第一次导入模块时 在 __webpack_modules__ 根据模块id(如 './add.js"')导入相应的模块并写入缓存


3. 展开 __webpack_modules__ :

![](https://upload-images.jianshu.io/upload_images/10390288-a77a889f738c6123.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

其实就是集成了所有模块的一个集合，至此整个模块流程分析完了

---
# [源码](https://zhuanlan.zhihu.com/p/86426969)

---
END

