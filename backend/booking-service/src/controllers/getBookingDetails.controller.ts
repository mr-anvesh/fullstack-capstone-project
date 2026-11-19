import type { NextFunction, Request, Response } from 'express';
import { getBookingDetails } from '../services/getBookingDetails.service.js';

export async function getBookingDetailsController(req: Request, res: Response, next: NextFunction) {
    try {
        const bookingId = req.body?.id;

        if (typeof bookingId !== 'string' || bookingId.length === 0) {
            res.status(400).json({ message: 'Booking ID is required' });
            return;
        }

        const booking = await getBookingDetails(bookingId);
        res.status(200).json(booking);
    } catch (error) {
        next(error);
    }
}