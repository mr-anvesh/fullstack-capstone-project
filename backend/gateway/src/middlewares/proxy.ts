import { createProxyMiddleware } from 'http-proxy-middleware';

export const proxy = (target: string, pathFilter: string) =>
  createProxyMiddleware({ 
    target, 
    changeOrigin: true, 
    pathFilter 
  });