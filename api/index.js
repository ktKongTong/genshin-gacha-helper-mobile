const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = (req, res) => {
  let target = 'https://hk4e-api.mihoyo.com'
    // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/apis':'/event/gacha_info/api/getGachaLog',
    }
  })(req, res)
}
