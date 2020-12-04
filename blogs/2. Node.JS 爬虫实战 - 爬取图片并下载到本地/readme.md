# 前言

爬虫应该遵循：[robots 协议](https://baike.baidu.com/item/robots%E5%8D%8F%E8%AE%AE/2483797?fr=aladdin)

# 什么是爬虫

引用百度百科：

> 网络爬虫（又称为网页蜘蛛，网络机器人，在 FOAF 社区中间，更经常的称为网页追逐者），是一种按照一定的规则，自动地抓取万维网信息的程序或者脚本。另外一些不常使用的名字还有蚂蚁、自动索引、模拟程序或者蠕虫。

---

通俗的讲就是通过机器自动地获取想要的信息，当你访问一个网站，发现有很多好看的图片，于是你会选择右键保存到本地，当你保存了几张之后你会想我为什么不能写个脚本，自动的去下载这些图片到本地呢？于是爬虫诞生了......

## 常见的爬虫类型

- 服务端渲染的页面(ssr)
  就是服务端已经返回了渲染好的 html 片段

![](https://upload-images.jianshu.io/upload_images/10390288-8e2e60674809faf5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 客户端渲染的页面(csr)
  常见的单页面应用就是客户端渲染

![](https://upload-images.jianshu.io/upload_images/10390288-cc8a71d59b36164c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

第二种需要通过分析接口爬虫，本文讲解的是使用第一种，使用 nodejs 实现爬取远程图片下载到本地

**最终效果：**

![](https://upload-images.jianshu.io/upload_images/10390288-b666d6e13ad9c8a5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/10390288-ce9d169f034cccbf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


# 准备

1 目录

```base
┌── cache
│   └── img 图片目录
├── app.js
└──  package.json
```

2 安装依赖

- axios 请求库

```base
npm i axios --save
```

- cheerio 服务端的'jq'

```base
npm i cheerio --save
```

- fs 文件模块

```base
npm i fs --save
```

# 开始爬虫

爬取某户外网站，爬取首页推荐的图片并下载到本地

![](https://upload-images.jianshu.io/upload_images/10390288-6481b7b3bc8d8078.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1 流程分析
- 分析页面结构，确定要爬取的内容
- node 端 http 请求获取到页面内容
- 用 cheerio 得到图片数组
- 遍历图片数组，并下载到本地

2 编写代码
axios 拿到 html 片段
分析发现该图片在'newsimg'块里，cheerio 使用跟 jq 基本没什么区别,拿到图片标题和下载链接

![](https://upload-images.jianshu.io/upload_images/10390288-bf603dbda388e2c1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```base
const res = await axios.get(target_url);
const html = res.data;
const $ = cheerio.load(html);
const result_list = [];
$('.newscon').each(element => {
  result_list.push({
    title: $(element).find('.newsintroduction').text(),
    down_loda_url: $(element).find('img').attr('src').split('!')[0],
  });
});
this.result_list.push(...result_list);
```

已经拿到一个下载链接数组，接下来要做的是遍历该数组，发送请求然后用 fs 保存到本地

```base
const target_path = path.resolve(__dirname, `./cache/image/${href.split('/').pop()}`);
const response = await axios.get(href, { responseType: 'stream' });
await response.data.pipe(fs.createWriteStream(target_path));
```

3 请求优化
避免太频繁请求会被封 ip，比较简单的方法有几个:

- 避免短时间内频繁请求，间隔一定时间再请求
- axios 拦截器中设置 User-Agent，每次请求到用一个不同的
- ip 库，每次请求都用不一样的 ip

---

# 源码

[源码](https://github.com/zhongzihao1996/my-blog/blob/dev/blogs/2.%20Node.JS%20%E7%88%AC%E8%99%AB%E5%AE%9E%E6%88%98%20-%20%E7%88%AC%E5%8F%96%E5%9B%BE%E7%89%87%E5%B9%B6%E4%B8%8B%E8%BD%BD%E5%88%B0%E6%9C%AC%E5%9C%B0/stealData.js)

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END