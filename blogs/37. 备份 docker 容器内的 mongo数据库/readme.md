# 前言

之前自己写了一个个人博客，整体技术栈为： Vue + node + mongo，之前就是一个小白，啥也不懂没有设置权限，也没有修改端口，也没有限制远程登录host......

**突然有一天，发现数据全部没有了（被黑）**：

![](https://upload-images.jianshu.io/upload_images/10390288-227736f8db424f6a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

后面小白不断成长，摸索出了 jenkins + docker 实现了自动构建和部署，其中 mongo 被我部署进了 docker 容器

**现在有个问题，我想定期的去备份数据，以备不时之需**

# 人力备份

什么叫人力备份，就是手工的把 mongo 容器内的数据备份，流程：

- 进入 mongo 容器，备份数据
- 拷贝 mongo 容器的数据到宿主机机器

## 1. mongo 容器内备份数据

找到正在运行中的 mongo 容器，这里是 3dcf2168ed94

``` bash 
docker images
```
![](https://upload-images.jianshu.io/upload_images/10390288-fa5360ac44685a2d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

进入 mongo 容器

``` bash 
docker exec -it 3dcf2168ed94 sh
```

![](https://upload-images.jianshu.io/upload_images/10390288-be6f21fdfb5c3093.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们新建一个备份目录，假设是 ```/root/blog```

![](https://upload-images.jianshu.io/upload_images/10390288-7b08ed9a30e2707e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


执行 mongodump 命令，导出 blog 整个数据库到当前目录

``` bash 
# 导出 blog 数据库 到当前目录
mongodump -h localhost:27017 -d blog -o ./
```

![](https://upload-images.jianshu.io/upload_images/10390288-5146b5e61d3e9e71.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


可以看到，已经成功备份了容器的数据，我们退出，回到宿主机器

``` basj
exit
```

## 2. 拷贝容器数据到宿主机

执行命令：

``` bash 
# 拷贝 3dcf2168ed94容器内的 /root/blog  => 当前目录（宿主机器）
docker cp 3dcf2168ed94:/root/blog ./
```

![](https://upload-images.jianshu.io/upload_images/10390288-ceb528eeb5043c84.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


完美，数据成功备份出来了

# 自动备份

每次都手工太费劲了，于是偷懒的我想了个法子

## 1. 自动挂载

docker 容器内的目录其实是可以自动挂载到宿主机的

``` bash 
# docker-compose.yml
# 宿主机的 /root/blog-backend/data 映射到 容器内的 /data/db
/root/blog-backend/data:/data/db
```

![](https://upload-images.jianshu.io/upload_images/10390288-2a853a67245636ad.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 2. 定时任务备份数据

我这里做的是定时任务每天都会去执行一个函数，这个函数的功能就是备份数据到某个目录，然后该目录会自动映射到宿主机器，形成一个闭环

我这里用的是 eggjg，每天备份一次

``` bash 
# /app/schedule/backup.ts
export default class BackUp extends Subscription {
  static get schedule() {
    return {
      interval: '1d', # 每天备份一次
      type: 'all',
    };
  }
  async subscribe() {
    try {
      // 备份数据
    } catch (e) {
      console.log(e);
      this.ctx.logger.error(`${new Date()}：备份数据失败`);
    }
  }
}
```

![](https://upload-images.jianshu.io/upload_images/10390288-d9f79caf06663c6e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


完美，终于可以愉快地摸鱼了~.~


[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END
