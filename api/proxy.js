const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = (req, res) => {
  let target = ''
    console.log(req.url)
  // 代理目标地址
  // 这里使用 backend 主要用于区分 vercel serverless 的 api 路径
  if (req.url.startsWith('/proxy')) {
    target = 'https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog'
  }

  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      // 通过路径重写，去除请求路径中的 `/backend`
      // 例如 /backend/user/login 将被转发到 http://backend-api.com/user/login
      '^/proxy/': '/'
    }
  })(req, res)
}