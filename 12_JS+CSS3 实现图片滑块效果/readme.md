## 效果

![](https://upload-images.jianshu.io/upload_images/10390288-56e662412db9d675.gif?imageMogr2/auto-orient/strip)

分析该动画，可拆分成两个步骤：

- 鼠标移入或者移出时，添加一个动画 class
- 实现该动画 class，实现移入移出动画

图片瀑布流布局可参考 [Vue 手写图片瀑布流组件(附源码)](https://www.jianshu.com/p/fdfd87f9b92d)

## HTML 和 CSS 布局

布局比较简单，一个父容器 ，里面一个 mask div，一个 img div

```bash
<div class="photo_item" style="max-width:200px;">
  <div class="photo_mask"></div>
  <img src="http://photo.tuchong.com/2732846/ft640/20811104.webp">
</div>
```

布局，父容器设置 position: relative; 子 mask 容器设置 position: absolute;并撑满整个容器

编写动画 class，不妨让左滑入 class 为 enter_left，则左边动画可写为：

```bash
.enter_left {
  animation: enter-left 0.3s ease-in;
}

@keyframes enter-left {
  0% {
    transform: translate3d(-100%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
```

刚开始让 mask 置于父容器外，100%时刚好到达父容器右边界，同理很容易写出各个方向的 css 动画

## JS 判断滑块方向

上一步我们已经完成了一大半，写出了各个方向的动画，**难点是如何判断鼠标进入容器的方向**

我们可以画图分析，如下图：
![](https://upload-images.jianshu.io/upload_images/10390288-b2ba099241462336.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

假设该矩形的中心点坐标为 x0(x0,y0),鼠标进出矩形的边界坐标点为 x(x,y)

根据斜率公式，可以得到:

- l1 斜率： **k0 = height/width**
- l2 斜率： **-k0**
- l3 斜率： **k=(y-y0)/(x-x0)**

观察图形可知，l1 和 l2 把矩形分成了 4 个块，我们很容易得到：

若 鼠标从右边进出，根据斜率： **k>=-k0 && k<=k0**，且 **x > x0**;
根据对称性，若鼠标从左边进出，则： **k>=-k0 && k<=k0**，且**x < x0**;

......

---

开始写 js 逻辑，绑定鼠标移入移出事件

```bash
<div class="photo_item" style="max-width:200px;" @mouseenter="(event)=>imgEventHandle(event,true)" @mouseleave="(event)=>imgEventHandle(event,false)">
  <div class="photo_mask"></div>
  <img src="http://photo.tuchong.com/2732846/ft640/20811104.webp">
</div>
```

**注意：不要用 mouseout 和 mouseover 事件，该事件会导致鼠标滑入子元素时也触发鼠标事件**

使用 **event.target.getBoundingClientRect()**获得当前鼠标的相信信息；

> Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。返回值是一个 DOMRect 对象，返回的结果是包含完整元素的最小矩形，并且拥有 left, top, right, bottom, x, y, width, 和 height 这几个以像素为单位的只读属性用于描述整个边框。

直接给出该部分逻辑代码

```bash
imgEventHandle(event: any, is_enter: boolean) {
  let direction_index: number;
  const direction_list: Array<string> = ['top', 'right', 'bottom', 'left'];
  const x: number = event.clientX;
  const y: number = event.clientY;
  // 中点坐标
  const rect_dom: any = event.target.getBoundingClientRect();
  const x0: number = rect_dom.left + rect_dom.width / 2;
  const y0: number = rect_dom.top + rect_dom.height / 2;
  const k0 = (rect_dom.height) / (rect_dom.width);
  // 当前鼠标点斜率
  const k = (y - y0) / (x - x0);
  if (k <= k0 && k >= -k0) {
    // 左右进出
    direction_index = x >= x0 ? 1 : 3;
  } else {
    // 上下进出
    direction_index = y >= y0 ? 2 : 0;
  }
  direction_list.forEach(item => {
    event.target.childNodes[0].classList.remove(`${is_enter ? 'leave' : 'enter'}_${item}`);
  });
  event.target.childNodes[0].classList.add(`${is_enter ? 'enter' : 'leave'}_${direction_list[direction_index]}`);
}
```

## 完整代码

```bash
<template>
  <div style="max-width:1366px;margin:0 auto;">
    <div class="photo_item" style="max-width:200px;" @mouseenter="(event)=>imgEventHandle(event,true)" @mouseleave="(event)=>imgEventHandle(event,false)">
      <div class="photo_mask"></div>
      <img src="http://photo.tuchong.com/2732846/ft640/20811104.webp">
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Debug extends Vue {
  // eslint-disable-next-line class-methods-use-this
  imgEventHandle(event: any, is_enter: boolean) {
    let direction_index: number;
    const direction_list: Array<string> = ['top', 'right', 'bottom', 'left'];
    const x: number = event.clientX;
    const y: number = event.clientY;
    // 中点坐标
    const rect_dom: any = event.target.getBoundingClientRect();
    const x0: number = rect_dom.left + rect_dom.width / 2;
    const y0: number = rect_dom.top + rect_dom.height / 2;
    const k0 = (rect_dom.height) / (rect_dom.width);
    // 当前鼠标点斜率
    const k = (y - y0) / (x - x0);
    if (k <= k0 && k >= -k0) {
      // 左右进出
      direction_index = x >= x0 ? 1 : 3;
    } else {
      // 上下进出
      direction_index = y >= y0 ? 2 : 0;
    }
    direction_list.forEach(item => {
      event.target.childNodes[0].classList.remove(`${is_enter ? 'leave' : 'enter'}_${item}`);
    });
    event.target.childNodes[0].classList.add(`${is_enter ? 'enter' : 'leave'}_${direction_list[direction_index]}`);
  }
}
</script>

<style lang="scss" scoped>
.photo_item {
  position: relative;
  break-inside: avoid;
  margin: 0 auto;
  overflow: hidden;
  box-shadow: 10px 10px 5px #ccc;
  &:hover {
    .photo_mask {
      z-index: 1;
    }
  }
  img {
    width: 100%;
  }
  .photo_mask {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    &.enter_top {
      animation: enter-top 0.3s ease-in;
    }
    &.leave_top {
      animation: leave-top 0.3s ease-out;
    }
    &.enter_right {
      animation: enter-right 0.3s ease-in;
    }
    &.leave_right {
      animation: leave-right 0.3s ease-out;
    }
    &.enter_bottom {
      animation: enter-bottom 0.3s ease-in;
    }
    &.leave_bottom {
      animation: leave-bottom 0.3s ease-out;
    }
    &.enter_left {
      animation: enter-left 0.3s ease-in;
    }
    &.leave_left {
      animation: leave-left 0.3s ease-out;
    }
  }
}
@keyframes enter-top {
  0% {
    z-index: -1;
    transform: translate3d(0, -100%, 0);
  }
  100% {
    z-index: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes leave-top {
  0% {
    z-index: 1;
    transform: translate3d(0, 0, 0);
  }
  100% {
    z-index: -1;
    transform: translate3d(0, -100%, 0);
  }
}
@keyframes enter-right {
  0% {
    z-index: -1;
    transform: translate3d(100%, 0, 0);
  }
  100% {
    z-index: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes leave-right {
  0% {
    z-index: 1;
    transform: translate3d(0, 0, 0);
  }
  100% {
    z-index: -1;
    transform: translate3d(100%, 0, 0);
  }
}
@keyframes enter-bottom {
  0% {
    transform: translate3d(0, 100%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes leave-bottom {
  0% {
    z-index: 1;
    transform: translate3d(0, 0, 0);
  }
  100% {
    z-index: -1;
    transform: translate3d(0, 100%, 0);
  }
}
@keyframes enter-left {
  0% {
    transform: translate3d(-100%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes leave-left {
  0% {
    z-index: 1;
    transform: translate3d(0, 0, 0);
  }
  100% {
    z-index: -1;
    transform: translate3d(-100%, 0, 0);
  }
}
</style>
```

---

## END
