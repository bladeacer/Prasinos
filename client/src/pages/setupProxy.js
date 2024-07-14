const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/maps/api/place/autocomplete/json',
    createProxyMiddleware({
      target: 'https://maps.googleapis.com',
      changeOrigin: true,
      pathRewrite: {
        '^/maps/api/place/autocomplete/json': '/maps/api/place/autocomplete/json',
      },
    })
  );
};
