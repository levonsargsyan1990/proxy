require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = 'localhost';

// Logging
app.use(morgan('dev'));

// Info GET endpoint
app.get('/info', (req, res, next) => {
  res.send('This is a proxy service which proxies to Billing and Account APIs.');
});

// Proxy endpoints
app.use('/', createProxyMiddleware({
  target: process.env.API_URL,
  changeOrigin: true,
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    const response = responseBuffer.toString('utf8'); // convert buffer to string
    console.log('Response', response);
    return response; // return the result
  }),
}));

// Start the Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});