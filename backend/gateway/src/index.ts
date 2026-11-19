import express from 'express';
import { proxy } from './middlewares/proxy.js';
import { limiter } from './middlewares/rate-limiter.js';
import { attachUserId } from './middlewares/attach-user.js';

const app = express();
const router = express.Router();

app.use(limiter);
app.use(attachUserId);

router.use('/auth', proxy(process.env.AUTH_URL ?? 'http://localhost:4001', '/auth'));
router.use('/providers', proxy(process.env.CATALOG_URL ?? 'http://localhost:4002', '/providers'));
router.use('/bookings', proxy(process.env.BOOKING_URL ?? 'http://localhost:4003', '/bookings'));
router.use('/notifications', proxy(process.env.NOTIFICATION_URL ?? 'http://localhost:4004', '/notifications'));

app.use(router);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Gateway is running on PORT: ${PORT}`));
