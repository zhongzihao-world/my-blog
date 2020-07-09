## 效果

![](https://upload-images.jianshu.io/upload_images/10390288-70094edb821661f1.gif?imageMogr2/auto-orient/strip)

分析该过程，可拆分成两个步骤：

- 鼠标框选一段区域
- 判断框选区域包含的 checkbox，进行对应处理

## HTML 和 CSS 布局

该布局基于 element-ui，一个父容器 box，里面一个 mask div，一个 el-checkbox-group 块。其中父容器设置 position: relative; 子 mask 容器设置 position: absolute;并且其宽、高、偏移值根据鼠标当前位置动态计算

```bash
<div class="box" >
  <div class="mask" v-show="is_show_mask" :style="'width:'+mask_width+'left:'+mask_left+'height:'+mask_height+'top:'+mask_top">
  </div>
  <el-checkbox-group>
    <el-checkbox>
    </el-checkbox>
  </el-checkbox-group>
</div>

.box {
  width: 800px;
  margin: 20px auto;
  position: relative;
  overflow: hidden;
  user-select: none;
  .mask {
    position: absolute;
    background: #409eff;
    opacity: 0.4;
  }
}
```

## JS 实现框选

该部分逻辑实际上可拆分为 4 个步骤：

- 鼠标按下 mousedown，记录当前起点坐标 start_x，start_y，并绑定 mousemove、mouseup 事件
- 鼠标移动 mousemove，实时更新终点坐标 end_x，end_y，即可框选矩形大小、位置
- 鼠标松开 mouseup，移除 mousemove、mouseup 事件
- 根据框选矩形大小、位置，计算在范围内的 checkbox 数量，进行对应处理

**1. 给 box 绑定 mousedown 事件**

```bash
<div class="box" @mousedown="handleMouseDown"></div>

handleMouseDown(event: any) {
  this.start_x = event.clientX;
  this.start_y = event.clientY;

  document.body.addEventListener('mousemove', this.handleMouseMove);
  document.body.addEventListener('mouseup', this.handleMouseUp);
}
```

**2. mousemove 事件，比较简单，只是更新 end_x，end_y 坐标**

```bash
handleMouseMove(event: MouseEvent) {
  this.end_x = event.clientX;
  this.end_y = event.clientY;
}
```

**3. mouseup 事件，移除 mousemove、mouseup 事件，并调用判断方法**

```bash
handleMouseUp() {
  document.body.removeEventListener('mousemove', this.handleMouseMove);
  document.body.removeEventListener('mouseup', this.handleMouseUp);
  this.handleDomSelect();
  this.resSetXY();
}
```

---

**4. 处理框选逻辑**

**难点是如何判断元素是否被框选住**

问题可转化为 框选矩形是否与 checkbox 矩形 相交或者包含在内,即**两矩形是否相交或者存在包含关系**

假定矩形 A1 左上角坐标为 (x1,y1);矩形宽度为 width1,高度为 height1;

假定矩形 A2 左上角坐标为 (x2,y2);矩形宽度为 width2,高度为 height2;

画图分析，只看水平方向：
![x轴方向不相交](https://upload-images.jianshu.io/upload_images/10390288-0ea5067a4dce2e14.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![x轴方向相交](https://upload-images.jianshu.io/upload_images/10390288-c83ff7a598ad8469.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

由图可以得出，x 方向上：
令 maxX = Math.max(x1 + width1, x2 + width2)
令 minX = Math.max(x1, x2)

若相交或包含则必满足：**maxX - minX <= width1 + width2;**

同理可以容易得到 y 轴相交的判断

使用 Element.getBoundingClientRect()获取 dom 元素位置信息

> Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。返回值是一个 DOMRect 对象，返回的结果是包含完整元素的最小矩形，并且拥有 left, top, right, bottom, x, y, width, 和 height 这几个以像素为单位的只读属性用于描述整个边框。

该部分逻辑如下，比较简单

```bash
collide(rect1: any, rect2: any): boolean {
  const maxX: number = Math.max(rect1.x + rect1.width, rect2.x + rect2.width);
  const maxY: number = Math.max(rect1.y + rect1.height, rect2.y + rect2.height);
  const minX: number = Math.min(rect1.x, rect2.x);
  const minY: number = Math.min(rect1.y, rect2.y);
  if (maxX - minX <= rect1.width + rect2.width && maxY - minY <= rect1.height + rect2.height) {
    return true;
  } else {
    return false;
  }
}
```

难点已经攻破，遍历 checkbox 集合，每个 checkbox 都执行上面的矩形相交判断，并进行相应的勾选处理，此处不再多累述

## 完整代码

```bash
<template>
  <div class="box" @mousedown="handleMouseDown">
    <div class="mask" v-show="is_show_mask" :style="'width:'+mask_width+'left:'+mask_left+'height:'+mask_height+'top:'+mask_top">
    </div>
    <el-checkbox-group v-model="select_list">
      <el-checkbox v-for="(item,index) in data_list" :label="item.city_id" :key="index">
        <p @click.stop.prevent> {{item.city_name}}</p>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator';

interface City {
  city_id: number;
  city_name: string;
}

@Component({})
export default class Debug extends Vue {
  data_list: Array<City> = [
    { city_id: 35, city_name: '香港特別行政區' },
    { city_id: 34, city_name: '北京市' },
    { city_id: 33, city_name: '江苏省' },
    { city_id: 32, city_name: '吉林省' },
    { city_id: 31, city_name: '内蒙古自治区' },
  ];

  select_list: Array<number> = [];

  is_show_mask = false;

  box_screen_left = 0;

  box_screen_top = 0;

  start_x = 0;

  start_y = 0;

  end_x = 0;

  end_y = 0;

  get mask_width() {
    return `${Math.abs(this.end_x - this.start_x)}px;`;
  }

  get mask_height() {
    return `${Math.abs(this.end_y - this.start_y)}px;`;
  }

  get mask_left() {
    return `${Math.min(this.start_x, this.end_x) - this.box_screen_left}px;`;
  }

  get mask_top() {
    return `${Math.min(this.start_y, this.end_y) - this.box_screen_top}px;`;
  }

  mounted() {
    const dom_box: any = document.querySelector('.box');
    this.box_screen_left = dom_box.getBoundingClientRect().left;
    this.box_screen_top = dom_box.getBoundingClientRect().top;
  }

  /* 方法 */
  handleMouseDown(event: any) {
    if (event.target.tagName === 'SPAN') return false;

    this.is_show_mask = true;
    this.start_x = event.clientX;
    this.start_y = event.clientY;
    this.end_x = event.clientX;
    this.end_y = event.clientY;

    document.body.addEventListener('mousemove', this.handleMouseMove);
    document.body.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove(event: MouseEvent) {
    this.end_x = event.clientX;
    this.end_y = event.clientY;
  }

  handleMouseUp() {
    document.body.removeEventListener('mousemove', this.handleMouseMove);
    document.body.removeEventListener('mouseup', this.handleMouseUp);
    this.is_show_mask = false;
    this.handleDomSelect();
    this.resSetXY();
  }

  handleDomSelect() {
    const dom_mask: any = window.document.querySelector('.mask');
    const rect_select = dom_mask.getClientRects()[0];

    const add_list: Array<number> = [];
    const del_list: Array<number> = [];
    document
      .querySelectorAll('.el-checkbox-group .el-checkbox')
      .forEach((node, index) => {
        const rects = node.getClientRects()[0];
        if (this.collide(rects, rect_select) === true) {
          if (this.select_list.includes(this.data_list[index].city_id)) {
            del_list.push(this.data_list[index].city_id);
          } else {
            add_list.push(this.data_list[index].city_id);
          }
        }
      });
    this.select_list = this.select_list
      .concat(add_list)
      .filter((item: number) => !del_list.includes(item));
  }

  // eslint-disable-next-line class-methods-use-this
  collide(rect1: any, rect2: any): boolean {
    const maxX: number = Math.max(rect1.x + rect1.width, rect2.x + rect2.width);
    const maxY: number = Math.max(
      rect1.y + rect1.height,
      rect2.y + rect2.height,
    );
    const minX: number = Math.min(rect1.x, rect2.x);
    const minY: number = Math.min(rect1.y, rect2.y);
    if (
      maxX - minX <= rect1.width + rect2.width &&
      maxY - minY <= rect1.height + rect2.height
    ) {
      return true;
    } else {
      return false;
    }
  }

  resSetXY() {
    this.start_x = 0;
    this.start_y = 0;
    this.end_x = 0;
    this.end_y = 0;
  }
}
</script>

<style lang="scss" scoped>
.box {
  width: 800px;
  margin: 20px auto;
  position: relative;
  overflow: hidden;
  user-select: none;
  .mask {
    position: absolute;
    background: #409eff;
    opacity: 0.4;
  }
  .el-checkbox-group {
    overflow: auto;
    .el-checkbox {
      width: 137px;
      margin: 0 20px 10px 0;
      float: left;
      ::v-deep .el-checkbox__input {
        padding-top: 3px;
        vertical-align: top;
      }
      p {
        width: 110px;
        white-space: pre-wrap;
      }
    }
  }
}
</style>

```

---

## END
