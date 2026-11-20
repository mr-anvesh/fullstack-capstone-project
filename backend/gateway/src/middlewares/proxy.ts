import type { Request, Response } from 'express';
import { createProxyMiddleware, type Options } from 'http-proxy-middleware';

export function proxy(target: string, { preservePath = false }: { preservePath?: boolean } = {}) {
  const options: Options<Request, Response> = {
    target,
    changeOrigin: true,
  };

  if (preservePath) {
    options.pathRewrite = (_path, req) => req.originalUrl;
  }

  return createProxyMiddleware<Request, Response>(options);
}
