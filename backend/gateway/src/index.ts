import express from 'express';
import { proxy } from './middlewares/proxy.js';
import { limiter } from './middlewares/rate-limiter.js';
import { attachUserId } from './middlewares/attach-user.js';

const authUrl = process.env.AUTH_URL ?? 'http://localhost:4001';
const bookingUrl = process.env.BOOKING_URL ?? 'http://localhost:4002';
const catalogUrl = process.env.CATALOG_URL ?? 'http://localhost:4003';
const notificationUrl = process.env.NOTIFICATION_URL ?? 'http://localhost:4004';

const app = express();
const router = express.Router();

app.use(limiter);
app.use(attachUserId);

router.use('/auth', proxy(authUrl, { preservePath: true }));
router.use('/bookings', proxy(bookingUrl, { preservePath: true }));
router.use('/listings', proxy(catalogUrl, { preservePath: true }));
router.use('/notifications', proxy(notificationUrl));

app.use(router);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Gateway is running on PORT: ${PORT}`));
