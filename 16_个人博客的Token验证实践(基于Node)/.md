## 前言

- **为什么要用 token**

> HTTP 是一种无状态的协议，也就是 HTTP 没法保存客户端的信息，没办法区分每次请求的不同。

设想这样的场景，A 和 B 同时修改个人的文章，服务器同时收到两个 post 请求，但浏览器并不知道哪个请求是 A 哪个请求是 B，需要一个标识符（token）来标记一串信息并且在请求的时候带上

- **token 是什么**

> Token 是服务器生成的一串字符，作为客户端请求的令牌。当第一次登陆后，服务器会分发 Tonken 字符串给客户端。后续的请求，客户端只需带上这个 Token，服务器即可知道是该用户的访问。

个人理解就是一串被服务器加密过的个人信息，比如下面这个：

```bash
acess_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWRhMTBjOTI0NThmNDAwMmFjZDEyMTAiLCJuaWNrX25hbWUiOiLlsI_osaoxOTk2IiwiY3JlYXRlZF90aW1lIjoiMjAyMC0wNi0wNVQwOTozMDo0OS42MThaIiwidXBkYXRlZF90aW1lIjoiMjAyMC0wNi0wNVQwOToyOToyMC4wNzlaIiwiaWF0IjoxNTkxMzQ5NDY4LCJleHAiOjE1OTE5NTQyNjh9.GmUJRXHed7M1xJyPaFFgaQKJoS-w8-l3N_PQFPiwwTE
```

服务器通过秘钥解密从而获得当前请求者的信息

## 技术栈

- 前端：vue + ssr
- 后端：egg(一个 node 框架) + ts
- 数据库：redis + mongo
- 部署：Docker
- 构建：Jenkins

blog 已经基本完成，并且用上了 ssr 渲染

本文主要是讲 token 验证，其他不再累述

## token 验证设计

我的 blog 对 get 类型的请求不做 token 验证，其他会修改资源的请求如 POST、PUT 会做 token 验证

可拆解为下面 3 个步骤

- 客户端用户登录，服务端根据用户信息生成 token 并在客户端持久化存储
- 客户端请求，带上 token
- 服务端验证 token，若失败则直接返回错误状态

**1.前端（vue.js）**

使用 axios 库，并且在 request 拦截器中把 token 塞到请求头 header ，在 response 拦截器中统一对错误状态码进行全局提示

登录成功之后把 token 写入 浏览器缓存 中，每次请求都带上

```bash
import Vue from 'vue';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

axios.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const acess_token = await Vue.prototype.$getCacheData('acess_token'); # 缓存中读取token
    if (acess_token) {
      config.headers.acess_token = acess_token;
    }
    return config;
  },
  (err: any) => Promise.reject(err),
);

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.ret === 200) {
      return response;
    } else {
      Vue.prototype.$global_fail(response.data.content);
      return Promise.reject(response);
    }
  },
  (err: any) => {
    console.log(err);
    if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
      Vue.prototype.$global_error('请求超时，请联系管理员');
    }
    if (err.response) {
      Vue.prototype.$global_error(decodeURI(err.response.data.msg || err.response.data.message));
    }
    return Promise.reject(err);
  },
);
```

关于前端缓存，这里我推荐一个 localForage 库，很实用

> localForage 是一个 JavaScript 库，能存储多种类型的数据，而不仅仅是字符串。localForage 有一个优雅降级策略，若浏览器不支持 IndexedDB 或 WebSQL，则使用 localStorage。

但注意，它的操作都是异步的，可以自己封装一层把它改成同步的

```bash
import Vue from 'vue';
import localForage from 'localforage';

Vue.prototype.$setCacheData = async (key: string, data: any): Promise<void> => await localForage.setItem(key, data);
Vue.prototype.$getCacheData = async (key: string): Promise<string | null> => await localForage.getItem(key) || null;
Vue.prototype.$clearCache = () => localForage.clear();
```

**2.后端（egg.js）**

- **生成 token**

用户登录，使用 jsonwebtoken 生成 token

jsonwebtoken 的详情请点击： [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

加密解密使用也比较简单，直接给出 UserService 方法，其中 secret 为秘钥，且可以设置 token 过期时间

```bash
# /app/service/user.ts
import * as jwt from 'jsonwebtoken';

export default class UserService extends Service {

  private secret = 'Hello__World'; # 秘钥
  async createToken(user: User): Promise<string> {
    const payload = {
      _id: user._id,
      nick_name: user.nick_name,
      created_time: user.created_time,
      updated_time: user.updated_time,
    };
    return jwt.sign(payload, this.secret, { expiresIn: '7d' }); # 过期时间
  }

  checkToken(token: string): User {
    try {
      # 根据秘钥解密token
      return jwt.verify(token, this.secret);
    } catch (e) {
      throw '无效的token';
    }
  }

}
```

在中间件中进行 token 验证，若失败直接返回

- **中间件验证**

开启 verify 中间件，并只对特定的 POST 请求进行验证:

开启中间件

```bash
# /config/config.default.ts
config.middleware = ['verify'];
config.verify = {
  enable: true,
  # 只对POST请求做验证
  match(ctx) {
    return ctx.request.method === 'POST';
  },
};

```

在 verify 调用 checkToken 方法验证 token

```bash
# /app/middleware/verify.ts
module.exports = () => {
  return async (ctx, next) => {
    if (ctx.path.startsWith('/api/user/login') || ctx.path.startsWith('/api/user/sendCode') || ctx.path.startsWith('/api/user/register')) {
      return await next();
    }
    try {
      const acess_token: string = ctx.request.header.acess_token;
      if (!acess_token) {
        throw '请登录';
      } else {
        await ctx.service.user.checkToken(acess_token); # 验证token
        return await next();
      }
    } catch (e) {
      # token验证失败会走到这里，返回自定义状态码
      console.log(e);
      ctx.body = {
        ret: 304,
        content: `${e}`,
      };
    }
  };
};
```

至此 token 验证就完了，如有不足，欢迎指出

---

END
