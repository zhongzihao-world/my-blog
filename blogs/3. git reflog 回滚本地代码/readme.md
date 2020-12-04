# 背景

- 程序员 A 在本地进行了三次 commit 'demo1'、'demo2'、'demo3'
- 程序员 A 不小心进行了回滚 git reset --hard 'commit1',回滚到第一次提交
- 程序员 A 又修改了文件并进行了 commit, 'demo4'

> 问：如何找回被 reset 的两次 commit，并合并最新的一次 commit 'demo4'

使用 git log 查看，仅能看到 demo1 和 demo4 的提交记录

![](https://upload-images.jianshu.io/upload_images/10390288-d7a342e7b9d7844b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# git reflog

> git reflog 可以查看所有分支的所有操作记录（包括已经被删除的 commit 记录和 reset 的操作）
> 恢复步骤

```
git reflog
git reset  --hard  hash
```

![](https://upload-images.jianshu.io/upload_images/10390288-5498290adc23bd74.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

列出所有的提交记录，然后就可以执行回滚了，这里需要回滚到 demo3 的提交

![](https://upload-images.jianshu.io/upload_images/10390288-ba529e1fe298d795.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

已经恢复到之前的代码了，那么问题来了，demo4 的提交被吃掉了，该怎么解决呢？

# git cherry-pick

> git cherry-pick 能够把另一个分支的一个或多个提交复制到当前分支
> 恢复步骤

```
git cherry-pick  hash
```

![](https://upload-images.jianshu.io/upload_images/10390288-057b7c2ce2766f35.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

大功告成

---

[我的博客](https://github.com/zhongzihao1996/my-blog/tree/master)

---

END


