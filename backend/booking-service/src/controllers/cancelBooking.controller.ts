import type { NextFunction, Request, Response } from 'express';
import { cancelBooking } from '../services/cancelBooking.service.js';

export async function cancelBookingController(req: Request, res: Response, next: NextFunction) {
    try {
        const bookingId = req.body?.id;

        if (typeof bookingId !== 'string' || bookingId.length === 0) {
            res.status(400).json({ message: 'Booking ID is required' });
            return;
        }

        const booking = await cancelBooking(bookingId);
        res.status(200).json(booking);
    } catch (error) {
        next(error);
    }
}