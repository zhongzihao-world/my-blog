<template>
  <div class="waterfall_box" ref="waterfall_box" :style="`height:${waterfall_box_height_exect}`">
    <template v-if="waterfall_col_num>1">
      <div v-for="(img,index) in waterfall_list" class="waterfall_item" :style="{top:img.top+'px',left:img.left+'px',width:img_width+'px',height:img.height}" :key="index">
        <slot :row="img"></slot> # 作用域插槽
      </div>
    </template>
    <!-- 列数小于1 没有瀑布流的必要，直接正常布局即可 -->
    <template v-else>
      <div v-for="(img,index) in img_list" :key="index" style="margin-bottom: 20px;">
        <slot :row="img"></slot> # 作用域插槽
      </div>
    </template>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class WaterFall extends Vue {
  @Prop({ required: true, type: Array })
  readonly img_list!: [];

  @Prop({ required: true, type: Number }) // 图片宽度
  readonly img_width!: number;

  @Prop({ required: true, type: Number }) // 图片下边距
  readonly img_margin_bottom!: number;

  img_margin_right!: number; // 图片右边距

  /* 容器宽高 */
  waterfall_box_width = 0;

  waterfall_box_height = 0;

  waterfall_col_num = 0; // 列数

  waterfall_col_height_list: Array<number> = []; // 每列最大高度

  waterfall_list = []; // 瀑布流用到的数据

  // 容器的高度 拼上单位
  get waterfall_box_height_exect() {
    return this.waterfall_col_num <= 1
      ? 'auto'
      : `${this.waterfall_box_height}px`;
  }

  @Watch('img_list')
  img_list_change() {
    this.initParam();
  }

  async mounted() {
    const waterfall_box_dom: any = this.$refs.waterfall_box;
    this.waterfall_box_width = waterfall_box_dom.offsetWidth;
    window.addEventListener('resize', this.afreshLayoutWaterFall);
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.afreshLayoutWaterFall);
  }

  /* ---------------------- */
  initParam() {
    this.waterfall_col_num =
      Math.floor(this.waterfall_box_width / this.img_width) || 1;
    this.waterfall_col_height_list = new Array(this.waterfall_col_num).fill(0);
    this.img_margin_right =
      (this.waterfall_box_width - this.waterfall_col_num * this.img_width) /
      (this.waterfall_col_num - 1);
    if (this.waterfall_col_num <= 1) return;
    this.layoutWatreFall();
  }

  // 瀑布流布局
  layoutWatreFall() {
    const temp_waterfall_list: any = [];
    this.img_list.forEach((img_item: any) => {
      const minIndex = this.finMinHeightIndex();
      const img_obj = {
        ...img_item,
        url: img_item.url,
        width: this.img_width,
        height: Math.floor((this.img_width / img_item.width) * img_item.height),
        top: this.waterfall_col_height_list[minIndex],
        left: minIndex * (this.img_margin_right + this.img_width),
      };
      temp_waterfall_list.push(img_obj);
      this.waterfall_col_height_list[minIndex] +=
        img_obj.height + this.img_margin_bottom;
    });
    this.waterfall_list = temp_waterfall_list;
    // console.log(this.waterfall_list);
    this.waterfall_box_height = Math.max.call(
      null,
      ...this.waterfall_col_height_list,
    );
  }

  // 找到数组最小值下标
  finMinHeightIndex() {
    return this.waterfall_col_height_list.indexOf(
      Math.min.call(null, ...this.waterfall_col_height_list),
    );
  }

  afreshLayoutWaterFall() {
    const waterfall_box_dom: any = this.$refs.waterfall_box;
    if (waterfall_box_dom) {
      this.waterfall_box_width = waterfall_box_dom.offsetWidth;
      this.initParam();
    }
  }
}
</script>

<style lang="scss" scoped>
.waterfall_box {
  position: relative;
  margin: 0 auto;
  .waterfall_item {
    float: left;
    position: absolute;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>