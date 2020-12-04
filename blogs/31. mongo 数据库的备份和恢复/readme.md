# 前言

前阵子使用 ssr 重构了博客，需要对之前的旧数据进行备份，之前的做法是直接把mongo/data目录下的所有文件进行备份...... （没错我之前就是这么干的~.~）

最近研究了一下，有两种方法可以备份 mongo 数据库

如下图，有一个 blog 数据库，我们下面开始对其进行备份

![](https://upload-images.jianshu.io/upload_images/10390288-d75f791a92b0a223.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 1. mongodump、mongorestore

> ​ mongodump 是 MongoDB 官方提供的备份工具，它可以从 MongoDB 数据库读取数据，并生成 BSON 文件，mongodump 适合用于备份和恢复数据量较小的 MongoDB 数据库，不适用于大数据量备份。

### 备份

语法如下，注意有几个参数:

* -h：MongDB所在服务器地址，如 localhost:27017
* -d：备份的数据库
* -c：备份的数据表
* -o：备份的数据存放位置

` `  ` mongodump -h dbhost -d dbname -o dbdirectory `  ` ` 

我们直接运行命令:

``` bash 
# 导出 blog 数据库 到当前目录
mongodump -h localhost:27017 -d blog -o ./

# 也可以导出特定表
# 导出 blog 数据库的 articles 表 到当前目录
mongodump -h localhost:27017 -c articles -d blog -o ./
``` 
![](https://upload-images.jianshu.io/upload_images/10390288-c3bfe30ad0f31250.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

执行完毕，我们点开blog目录发现，下面有后缀为 bson、json的文件，输出一个bson文件看，发现是乱码：

` `  ` cat articles.bson `  ` ` 
![](https://upload-images.jianshu.io/upload_images/10390288-16dc64db99a795a7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

其实我们备份的数据都是二进制的，我们直接查看不到的，需要结合 mongo 自带的 bsondump :

` `  ` bsondump .\articles.bson `  ` ` 
![](https://upload-images.jianshu.io/upload_images/10390288-3386de09c5d8ad06.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

emmm，可以正常查看了

### 恢复

和备份差不多:

* -h：MongDB所在服务器地址，如 localhost:27017
* -d：需要恢复的数据库
* -c：需要恢复的数据表
* <path>：mongorestore 最后的一个参数，备份数据所在位置

` `  ` >mongorestore -h <hostname><:port> -d dbname <path> `  ` ` 

我们先把 blog 数据库删除，然后开始恢复

``` bash
# 恢复 blog 数据库的所有表
 mongorestore -h localhost:27017 -d blog ./

# 当然你也可以只恢复特定的表
# 比如，只恢复 articles 表
mongorestore -h localhost:27017  -c articles  -d blog ./articles.bson
```
![](https://upload-images.jianshu.io/upload_images/10390288-6f007b56004a19da.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

执行，所有数据已恢复~

## 2. mongoexport、mongoimport

> Mongodb中 的 mongoexport 工具可以把一个 collection 导出成 JSON 格式或 CSV 格式的文件。

mongoexport 只能一个一个表导出，额......~.~

![](https://upload-images.jianshu.io/upload_images/10390288-1d46653a656fa346.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 导出

mongoexport 的使用和参数基本和 mongodump 一样：

* -h：MongDB所在服务器地址，如 localhost:27017
* -d：备份的数据库
* -c：备份的数据表
* -o：备份的数据存放位置，必须指定存放类型，如 json、csv

``` bash 
# 导出 blog 数据库的 articles 表
mongoexport -h localhost:27017 -d blog -c articles -o  ./articles.json
mongoexport -h localhost:27017 -d blog -c articles -o  ./articles.csv
```
![](https://upload-images.jianshu.io/upload_images/10390288-57c926d80683937b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 恢复

* -h：MongDB所在服务器地址，如 localhost:27017
* -d：恢复的数据库
* -c：恢复的数据表
* <path>：mongorestore 最后的一个参数，备份数据所在位置

``` bash 
# 从json导入
mongoimport -h localhost:27017 -d blog -c articles ./articles.json
# 从csvf导入
mongoimport -h localhost:27017 -d blog -c articles ./articles.csv
```
![](https://upload-images.jianshu.io/upload_images/10390288-b2300415374e58ba.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

恢复成功~

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END
