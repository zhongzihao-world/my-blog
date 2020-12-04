# 前言

实际项目开发中，可能每次修改你都会 commit 一下，等到要推到远程仓库的时候会发现有很多 commit，这个时候可以把多个 commit 合并为一个，便于项目维护

# 合并

## 1. git log 查看提交历史

```bash
git log
```

查看提交历史

![](https://upload-images.jianshu.io/upload_images/10390288-bee6b0b73569417a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 2. git rebase

选择一个提交记录，比如这里 我选择 'v1.7.1'的合并

```bash
git rebaes -i '7e8da4932a8d98881266fadeb696a17eaabaecc0'
```

![](https://upload-images.jianshu.io/upload_images/10390288-d600059707083424.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 设置选项

进入 vim 编辑界面，有很多选项，一般情况下只需关注这两个即可:

- > pick: 执行这个 commit
- > squash: 这个 commit 会被合并到前一个 commit

![](https://upload-images.jianshu.io/upload_images/10390288-283f2dde01eac2c7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如图所示，下面两个 commit 会被合并到 第一个合并上，保存退出，合并会自动执行

再次查看提交历史，发现已经被合并：

![](https://upload-images.jianshu.io/upload_images/10390288-6b32c36f37f9ecb0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 撤销修改

合并过程中如果操作有问题，可以进行撤销

```bash
git rebase --abort
```

---

END
