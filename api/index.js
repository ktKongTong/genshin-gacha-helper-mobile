const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = (req, res) => {
  createProxyMiddleware({
    target:'https://hk4e-api.mihoyo.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api':'/event/gacha_info/api/getGachaLog',
    },
  })(req, res)
}
