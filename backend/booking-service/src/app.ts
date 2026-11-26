import express from 'express';
import { checkUser } from './middlewares/auth.js';
import { createBookingController } from './controllers/createBooking.controller.js';
import { getUserBookingsController } from './controllers/getUserBookings.controller.js';
import { cancelBookingController } from './controllers/cancelBooking.controller.js';
import { getBookingDetailsController } from './controllers/getBookingDetails.controller.js';
import { redis } from './config/redis.js';

const app = express();
const bookings = express.Router();

app.use(express.json());
app.use(checkUser);

bookings.get('/', getUserBookingsController);
bookings.post('/book', createBookingController);
bookings.post('/cancel-booking', cancelBookingController);
bookings.post('/getdetails', getBookingDetailsController);

app.use('/bookings', bookings);

await redis.connect();

export default app;
