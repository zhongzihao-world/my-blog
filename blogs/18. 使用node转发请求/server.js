const Koa = require('koa');
const koaStatic = require('koa-static');
const koaMount = require('koa-mount');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const k2c = require('koa2-connect');
const proxy_list = require('../config/proxy.js');

const resolve = file => path.resolve(__dirname, file);
const port = process.env.PORT || 3000;

const app = new Koa();
app.use(async (ctx, next) => {
  const url = ctx.path;
  if (url.startsWith('/api')) {
    ctx.respond = false;
    await k2c(
      createProxyMiddleware({
        target: proxy_list[0],
        changeOrigin: true,
        secure: false,
      }),
    )(ctx, next);
    return await next();
  }
  return await next();
});
// 开放目录
app.use(koaMount('/', koaStatic(resolve('../dist'))));

app.listen(port, () => {
  console.log(` Your application is running here: http://localhost:${port}`);
});
