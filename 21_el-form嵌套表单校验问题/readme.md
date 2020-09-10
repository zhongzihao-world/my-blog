## 前言

本篇文章基于 vue、element-ui

## 需求

前端开发过程中，经常遇到表单校验的需求，element-ui 为我们带来了极大的便利，前端只需要更专注于前端逻辑。

我们往往会遇到相对复杂的表单，比如下面的表单:
![](https://upload-images.jianshu.io/upload_images/10390288-14e466e0699d515f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们设计的时候可以把它设计成 3 级表单，即划分表单到每一个校验项(输入框，下拉框的等)

最终实现效果如下图所示:

![](https://upload-images.jianshu.io/upload_images/10390288-38a4447f3c6f04b5.gif?imageMogr2/auto-orient/strip)

## 实现

el-form 使用，详情可参见： [Form 表单](https://element.eleme.cn/2.13/#/zh-CN/component/form)

有几个比较重要的属性：

- ref 相当于标签的 id
- model 表单数据对象
- rules 表单验证规则
- prop 表单域 model 字段
- label 标签文本

在提交按钮的时候，执行**validate**方法即可；实时校验可在**rules**中设置校验项 **trigger: 'change'**即可

### 1.el-form 设计

划分表单到每一个校验项(输入框，下拉框的等)，可以设计成 3 级表单

奖励设置 这一个校验项稍微复杂一点，可以动态绑定 model 和 rules 实现子项的表单校验

```bash
<!-- 一级表单 -->
<el-form class="form" ref="form" :model="form" :rules="form_rules" size="small">
  <el-form-item label="红包活动标题" prop="name">
    <el-input v-model='form.name' placeholder="请输入红包活动标题（活动展示）" />
  </el-form-item>
  <el-form-item :label="`奖励设置(${form.seconde_form.length}/${max_reward_module_num})`" prop="seconde_form">
    <el-card class="reward_module" v-for="(second_form, second_form_index) in form.seconde_form" :key="`${second_form_index}_second_form`">
      <!-- 二级表单 -->
      <el-form class="second_form" :ref="`second_form_${second_form_index}`" :model="second_form" :disabled="is_form_item_disabled" inline size="small">
        <el-form-item prop="packet_name" :key="`${second_form_index}_packet_name`" :rules="[{ required: true, message: '请输入奖励名称', trigger: 'change' }]" style="width:150px;margin-right:20px;">
          <el-input v-model="second_form.packet_name" />
        </el-form-item>
      </el-form>
    </el-card>
  </el-form-item>
</el-form>
```

### 2.el-form-item 子项校验

校验比较简单，只需要获取到每一个表单对象，并执行**validate**即可，二级表单就遍历拿到二级表单独享执行同样的操作

1. 定义 form 数据模型:

```bash
form: {
  name: '',
  seconde_form: [
    {
      packet_name: '',
    },
  ],
},
```

2. 封装一个 check_form 方法

```bash
/**
 * 表单校验方法
 * @param {String} form_name
 */
function $check_form(form_name) {
  const form_component = this.$refs[form_name][0] ? this.$refs[form_name][0] : this.$refs[form_name];
  return new Promise((resolve, reject) => {
    form_component.validate(valid => {
      if (valid) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

```

3. 点击按钮的时候执行 checkParam 方法

```bash
async checkParam(form_name) {
  try {
    await this.$check_form(form_name);
    for (let i = 0; i < this.form.seconde_form.length; i++) {
      await this.$check_form(`second_form_${i}`);
    }
    // next step do something
  } catch (e) {
    console.log(e);
  }
},
```

---

END
