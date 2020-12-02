# 前言

前端实现的水印基本都是不安全的，可被破解的~.~

## 水印

> 水印（watermark）是一种容易识别、被夹于纸内，能够透过光线穿过从而显现出各种不同阴影的技术。

# 实现

先创建一个 wrap 块，并给其设置一些样式：

``` bash 
<div class="wrap1 wrap_common"></div>

<style>

* {

  margin: 0; 
  padding: 0; 
}

. wrap_common {
  position: relative; 
  margin: 0 auto; 
  width: 800px; 
  height: 44vh; 
  border: 1px solid rgba(0, 0, 0, 1); 
  background: rgba(255, 255, 255, 1); 
  overflow: hidden; 
}

. wrap_common:first-child{
  margin-bottom: 5vh; 
}
</style>

``` 

## 1. DIV绝对定位

通过图层叠加的方式将水印追加到 wrap 上，我们先看一下最终效果

![](https://upload-images.jianshu.io/upload_images/10390288-3eaef158c237d861.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

动态获取到 wrap 的长宽并计算其能放几个水印块，并相应的设置每一个水印块的偏移值 left，top即可

``` bash 
const wrap = document.querySelector('.wrap1');
const { clientWidth, clientHeight } = wrap;
const waterHeight = 100;
const waterWidth = 180;
// 能放下几行几列
const [columns, rows] = [Math.ceil(clientWidth / waterWidth), Math.ceil(clientHeight / waterHeight)]
for (let i = 0; i < columns; i++) {
  for (let j = 0; j <= rows; j++) {
    // 生成水印块
    const watcerMarkElement = createWaterMarkElement();
    // 动态设置偏移值
    addAttributes(watcerMarkElement, {
      width: `${waterWidth}px` ,
      height: `${waterHeight}px` ,
      left: `${waterWidth + (i - 1) * waterWidth + 10}px` ,
      top: `${waterHeight + (j - 1) * waterHeight + 10}px` ,
    });
    wrap.appendChild(watcerMarkElement)
  }
}
```

## 2. canvas+背景图

我们知道，可以给 div 这只样式 background，我们可以很轻松的实现背景图片，那么水印也可以通过这种方式来实现，其中背景图片通过 canvas 来画出来，并且通过 toDataURL() 将图片转为 dataURL(base64)。

``` bash 
const wrap = document. querySelector('. wrap2'); 
wrap. style. backgroundImage = `url(${drawWaterMark()})` ; 

``` 

drawWaterMark 方法实现如下 :

``` bash 
const drawWaterMark = (text = '小豪看世界') => {
  const sin = Math.sin(Math.PI / 4.5);
  const cos = Math.cos(Math.PI / 4.5);
  const canvas = document.createElement('canvas')
  canvas.width = 200;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  ctx.transform(cos, -sin, sin, cos, 0, 0);
  ctx.font = '16px';
  ctx.fillStyle = 'rgba(0,0,0,.4)';
  ctx.fillText(text, 80, 140);
  ctx.fillText(text, -30, 100);
  return canvas.toDataURL('image/png')
};
```

![](https://upload-images.jianshu.io/upload_images/10390288-fb2cbc2f47d9f3a9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们可以看到 wrap 插入了一个 base64的图片，强迫症的童鞋可以处理一下，将它转为 style 标签插入到body中; 

改为 style 标签插入：

``` bash 
const style = document. createElement('style'); 
style. type = 'text/css'; 
style. innerHTML = `
  . wrap2 {

    background-image: url(${drawWaterMark()});

  }
`; 
document. body. appendChild(style); 
```
emmm，看起来美观一点了~.~

![](https://upload-images.jianshu.io/upload_images/10390288-71a9cb68e61caf3d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 参考

[从破解某设计网站谈前端水印(详细教程)](https://juejin.cn/post/6900713052270755847)

# 源码

[源码](https://github.com/zhongzihao1996/my-blog/tree/master/35_JS%20%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95)

---

END
