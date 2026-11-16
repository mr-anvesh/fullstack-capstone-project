import express from 'express';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const router = express.Router();

const rateLimitKey = (req: express.Request): string => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  return token ?? req.ip ?? "unknown";
};

const limiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimitKey,
});

app.use(limiter);

const proxy = (target: string, pathFilter: string) =>
  createProxyMiddleware({ 
    target, 
    changeOrigin: true, 
    pathFilter 
  });

router.use('/auth', proxy(process.env.AUTH_URL ?? 'http://localhost:4001', '/auth'));
router.use('/providers', proxy(process.env.CATALOG_URL ?? 'http://localhost:4002', '/providers'));
router.use('/bookings', proxy(process.env.BOOKING_URL ?? 'http://localhost:4003', '/bookings'));
router.use('/notifications', proxy(process.env.NOTIFICATION_URL ?? 'http://localhost:4004', '/notifications'));

app.use(router);


app.listen(3000, () => console.log('Gateway is running on PORT: 3000'));
