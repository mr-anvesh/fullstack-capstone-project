import type { Request } from 'express';
import rateLimit from 'express-rate-limit';

const rateLimitKey = (req: Request): string => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const realIp = req.headers['x-real-ip'];
  const clientIp = typeof realIp === 'string' ? realIp : req.socket.remoteAddress ?? 'unknown';

  return token ?? clientIp;
};

export const limiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimitKey,
});