/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const proxy = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/api',
    proxy({
      target: process.env.REACT_APP_BACKEND_SERVER_URL,
      changeOrigin: true,
    })
  );
};