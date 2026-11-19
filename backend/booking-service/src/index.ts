import express from 'express';
import { checkUser } from './middlewares/auth.js';
import { createBookingController } from './controllers/createBooking.controller.js';
import { getUserBookingsController } from './controllers/getUserBookings.controller.js';
import { cancelBookingController } from './controllers/cancelBooking.controller.js';
import { getBookingDetailsController } from './controllers/getBookingDetails.controller.js';

const app = express();

app.use(express.json())
app.use(checkUser);

app.post('/book', createBookingController);
app.get('/bookings', getUserBookingsController);
app.post('/cancel-booking', cancelBookingController);
app.post('/getdetails', getBookingDetailsController);

app.listen(process.env.PORT || 4002);
