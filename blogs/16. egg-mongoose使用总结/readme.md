# 前言

本项目基于： [egg.js](https://eggjs.org/zh-cn/)

# 安装配置

### 1.安装依赖

```bash
npm install egg-mongoose --save
```

### 2.开启插件

```bash
# /config/plugin.ts
import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
};

export default plugin;
```

### 3.插件配置

```bash
# /config/config.default.ts
import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.mongoose = {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/blog',
    options: {
      poolSize: 40,
    },
  };

  return {
    ...config,
  };
};
```

本项目锁使用的环境:

```bash
"egg-mongoose": "3.2.0"

node -v
v10.5.0
```

---

**_分割线，下面是重点_**

# 使用

### 一.创建 Model（模型）

eggjs 在 /app/model/ 下定义数据模型

以我的 blog 项目为例，假设有一个 tag 表、article 表，article 表通过 tag_id 关联 tag 表如下：

#### 1.tag 表

```bash
# /app/model/tag.ts
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PostSchema = new Schema({
    tag_name: {
      type: String,
      required: true,
    },
    created_time: {
      type: Date,
      default: new Date(),
    },
    updated_time: {
      type: Date,
      default: new Date(),
    },
  });
  return mongoose.model('Tag', PostSchema);
};
```

#### 2.article 表

通过 tag_id 关联 tag 表

```bash
# /app/model/article.ts
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PostSchema = new Schema({
    tag_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Tag',
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: '',
    },
    weather: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    images: {
      type: Array,
      default: [],
    },
    pv: {
      type: Number,
      default: 0,
    },
    created_time: {
      type: Date,
      default: new Date(),
    },
    updated_time: {
      type: Date,
      default: new Date(),
    },
  });
  return mongoose.model('Article', PostSchema);
};
```

更多 schema 使用：[mongoose schema](https://www.jianshu.com/p/d073a385d282)

### 二.简单常用

eggjs 中，一般在 service 层操作 model 层,返回的是一个 promise，so 可以直接用 await 同步编程

我们先定义 search 为查询条件

#### 1.增

新增一篇文章

```bash
# article 为对象
const article: Article;
this.ctx.model.Article.create(article);
```

批量新增

```bash
# article 为数组
const article: Array<Article>;
this.ctx.model.Article.create(article);
```

#### 2.删

删除一篇文章

```bash
this.ctx.model.Article.deleteOne(search);
```

删除多篇文章

```bash
this.ctx.model.Article.remove(search);
```

#### 3.查

查找一篇文章

```bash
this.ctx.model.Article.findOne(search);
```

查找多篇

```bash
# search 为空 或者空对象返回全部
this.ctx.model.Article.find(search);
```

分页查找 skip、limit

```bash
this.ctx.model.Article.find(search)
  .sort({ _id: -1 }) # 按照创建时间倒序
  .skip(page_size * (current_page - 1)) # 跳过前n个数据
  .limit(page_size); # 限制n个数据
```

#### 4.改

替换文章内容

```bash
# 注意，是直接全部替换为 new_data
# findOneAndUpdate默认返回旧的数据
# 若需要部分更新，应使用 $set 操作符
return await this.ctx.model.Article.findOneAndUpdate(search, new_data);
```

返回修改后最新的数据

```bash
# 注意第三个参数
return await this.ctx.model.Article.findOneAndUpdate(search, new_data, { new: true });
```

---

再次分割线，下面是重点中的重点

### 三.操作符

#### \$set

> \$set 对指定文档中的某些键进行更新,如果这个字段不存在则创建它

```bash
# 修改文章 pv为 10000
const operation: any = {
  $set: {
    pv: 10000,
  },
};
return await this.ctx.model.Article.findOneAndUpdate(search, operation);
```

#### $gt、$lt、$gte、$lte、\$ne

- (>) 大于 \$gt
- (<) 小于 \$lt
- (>=) 大于等于 \$gte
- (<= ) 小于等于 \$lte
- (!==) 不等于 \$ne

```bash
# 查pv大于10的文章
const search = {
  pv: {
    $gt: 1000,
  },
};
this.ctx.model.Article.find(search);
```

#### $or、$and、$not、$nor

- \$or 满足任一表达式
- \$and 同时满足多个表达式
- \$not 不满足表达式
- \$nor 不满足任一表达式

查找 pv 大于 10 且公开的文章

```bash
const search: any = {
  $and: [
    { pv: { $gt: 10 } },
    { status: true },
  ],
};
this.ctx.model.Article.find(search);
```

#### \$inc

> \$inc 用来增加和减少已有键的值,只能用于 Number 类型。对于不存在的键，会自动创建相应的键,并且值为给定的值

文章 pv 自增

```bash
const operation: any = {
  $inc: {
    pv: 1,
  },
};
this.ctx.model.Article.findOneAndUpdate(search, operation);
```

#### \$push、\$pull

> \$push 向已有的数组末尾添加一个元素,如果没有就创建一个新的数组

> \$pull 会删除掉数组中符合条件的元素

```bash
const operation: any = {
  $push: {
    images: {
      content: 'hello world',
    },
  },
};
await this.ctx.model.Article.findOneAndUpdate(search, operation);

const operation: any = {
  $pull: {
    images: {
      content: 'hello world',
    },
  },
};
await this.ctx.model.Article.findOneAndUpdate(search, operation);
```

#### \$in、\$nin

- \$in 包含
- \$nin 不包含

> \$in 类似与 js Araay includes 方法，与数组中任意一个值相等

查找 pv 在[1,2,3]的文章

```bash
const search: any = {
  pv: {
    $in: [ 1, 2, 3 ],
  },
};
this.ctx.model.Article.find(search);
```

#### \$type

> \$type 匹配数据类型

详细的类型请：[MongoDB \$type 操作符](https://www.runoob.com/mongodb/mongodb-operators-type.html)

匹配 status 字段类型为 boolean

```bash
const search: any = {
  status: {
    $type: 8,
  },
};
this.ctx.model.Article.find(search);
```

#### \$exists

> \$exists 判断字段是否存在

查找 status 字段存在的文章

```bash
const search: any = {
  status: {
    $exists: true,
  },
};
this.ctx.model.Article.find(search);
```

#### \$regex

> \$regex 正则匹配内容

正则匹配内容 123

```bash
const search: any = {
  content: { $regex: '123', $options: 'i' },
};
this.ctx.model.Article.find(search);
```

实际上，也可以直接用字面量

```bash
const search: any = {
  content: /123/g,
};
this.ctx.model.Article.find(search);
```

#### \$where

> \$where 类似于 mysql 的 where

查找 pv 大于 20 的文章

```bash
const search: any = {
  $where: 'this.pv>20',
};
this.ctx.model.Article.find(search);
```

### 四.aggregate 聚合

> MongoDB 的聚合管道将 MongoDB 文档在一个管道处理完毕后将结果传递给下一个管道处理。管道操作是可以重复的。

常用的管道操作符：

#### 1.\$match

> \$match 用于过滤数据，只输出符合条件的文档。

```bash
this.ctx.model.Article.aggregate([
  { $match: search },
]);
```

#### 2.\$project

> \$project 用于修改输入文档的结构,可以用来重命名、增加或删除域

修改文档结构，只输出 content 字段

```bash
this.ctx.model.Article.aggregate([
  { $match: search },
  {
    $project: {
      content: 1,
    },
  },
]);
```

#### 3.\$limit、\$skip

- \$limi: 限制返回的文档数
- \$skip：跳过指定数量的文档

常用的分页查找

```bash
this.ctx.model.Article.aggregate([
  { $match: search },
  { $skip: page_size * (current_page - 1) },
  { $limit: page_size },
]);
```

#### 4.\$group

> \$group 将集合中的文档分组,用于统计结果。类似于 mysql group by

统计每个标签的文章总数 count

```bash
 this.ctx.model.Article.aggregate([
  {
    $group: {
      _id: '$tag_id',
      count: {
        $sum: 1,
      },
    },
  },
]);
```

#### 5.\$sort

> \$sort 将输入文档排序后输出

按照文章修改时间倒序

```bash
this.ctx.model.Article.aggregate([
  { $match: search },
  { $sort: { updated_time: -1 } },
]);
```

#### 6.\$lookup、\$unwind

- \$unwind 将 Array 类型字段拆分成多条，每条包含数组中的一个值

- \$lookup mongo3.2 版本新增，用于实现联表查询

有几个参数：

|     语法     |            解释            |
| :----------: | :------------------------: |
|     from     |          源数据表          |
|  localField  |      待 Join 的数据表      |
| foreignField | Join 的数据表的 match 字段 |
|      as      |   为输出文档的新增值命名   |

查找文章详情，根据 tag_id 查找 tag 表的详情

```bash
this.ctx.model.Article.aggregate([
  {
    $lookup: {
      from: 'tags',
      localField: 'tag_id',
      foreignField: '_id',
      as: 'tag_info',
    },
  },
  { $unwind: '$tag_info' },
]);
```

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END
