const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

// 如果你使用dotenv来管理环境变量
require('dotenv').config();

const app = express();

// 使用dotenv或直接指定
const targetUrl = process.env.VITE_ORIGIN_URL;
const proxyPort = process.env.VITE_PROXY_PORT;

app.use(cors({
  origin: '*', // 允许所有源
  allowedHeaders: '*', // 允许所有头部
  methods: "GET, PUT, POST, DELETE, OPTIONS", // 允许的方法
  maxAge: 3600, // 预检请求的结果缓存时间
}));

const proxyOptions = {
  target: targetUrl,
  changeOrigin: true,
};

app.use('/', createProxyMiddleware(proxyOptions));

app.listen(proxyPort, () => {
  console.log(`Proxy server running at http://localhost:${proxyPort}`);
});
