## 简介

**前端项目 Vue，后端项目 egg.js**

传统做法，前端项目打包得到 dist 静态文件，然后人肉复制到后端项目的静态目录下，打包整个后端工程并放到服务器，安装依赖启动服务，整个过程不仅繁琐还容易出错，还易出现"明明我本地没问题的啊，怎么线上不行了"、“运维这你的问题”

**使用 Jenkins+Docker 进行部署**

1.前端项目构建，在 Docker 容器中打包，对 dist 静态文件归档

2.后端项目构建，拿到上次归档静态文件，打包、安装依赖，并把整个后端工程打包成一个镜像

3.进行镜像发布，一般使用 docker-compose 进行发布

整个过程都在 Jenkins 流水线中完成，运维只需要在线上机器上 pull 指定的镜像并进行容器热更新即可，减少了人工犯错的可能，大大的提高了效率

---

## 准备

一台 Linux 机器，并安装 Git，Jenkins 和 Docker，网上教程很多，此处不再搬砖

## 新建 Jenkins 多分支流水线任务

可参考 [Jenkins 配置多分支流水线项目（github）](https://www.jianshu.com/p/c0cb9142c2c7)

## 配置邮件提醒

可参考 [Jenkins Pipeline 配置自动发送 QQ 邮件](https://www.jianshu.com/p/61846a465c28)

## 编写 Jenkinsfile

项目根目录下必须包含 Jenkinsfile 文件
Jenkinsfile 基本语法，语法比较简单，可参考 [Jenkins Pipeline 语法](https://www.jenkins.io/zh/doc/book/pipeline/)
**我的前端 Jenkinsfile:**
![](https://upload-images.jianshu.io/upload_images/10390288-9fd080d9c26238d9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
流程:

- 检查参数
- 安装依赖并打包成静态文件(Docker 中)
- 归档静态文件
  withDockerContainer 声明该管道在 Docker 内执行，会启动容器并把当前工作目录挂载映射到 Docker 容器内，在 Docker 容器内操作不会污染到宿主机，如为了加速可以在容器内安装 cnpm 而不影响到宿主机。该管道执行后，容器会自动停止
  ![](https://upload-images.jianshu.io/upload_images/10390288-ce29c87dc0047298.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  使用 archiveArtifacts artifacts 对静态文件归档
  归档的静态文件在:
  `${JENKINS_URL}job/${project_name}/job/${GIT_BRANCH}/${BUILD_NUMBER}/artifact/${tar_file_name}`

**后端 Jenkinsfile:**
![](https://upload-images.jianshu.io/upload_images/10390288-f049627fa7f4a22b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
流程:

- 检查参数
- 安装依赖，因为用了 ts，全部转为 js
- 拿到前端归档文件移动到指定目录
- 构建镜像(使用 Dockerfile)
- 发布镜像
- 发送邮件通知

使用 copyArtifacts filter 获得上一次成功归档的静态文件，注意需要先安装 Copy Artifact 插件
![](https://upload-images.jianshu.io/upload_images/10390288-91bd8dcd58483553.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

---

## 构建项目
点击对应分支并点击构建即开始构建项目，构建完成后，会发送邮件通知
![](https://upload-images.jianshu.io/upload_images/10390288-ae00c947e81e5de2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以设置 web-hook 进行自动化构建，即 push 或者 merge 代码后，会对指定分支进行自动构建
gitlab 已经实现，后续会放上教程
github 目前还没是实现(努力 ing......)

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END
