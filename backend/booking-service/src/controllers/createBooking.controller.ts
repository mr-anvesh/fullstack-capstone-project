import type { NextFunction, Request, Response } from 'express';
import { createBooking } from '../services/createBooking.service.js';

export async function createBookingController(req: Request, res: Response, next: NextFunction) {
    try {
        const booking = await createBooking(req.body);
        res.status(201).json(booking);
    } catch (err) {
        if (err instanceof Error) {
            if (err.message === 'BOOKING_IN_PROGRESS' ||
                err.message === 'PROPERTY_UNAVAILABLE') {
                res.status(409).json({ message: err.message });
                return;
            }

            if (err.message === 'BOOKING_LOCK_UNAVAILABLE') {
                res.status(503).json({ message: err.message });
                return;
            }
        }

        next(err);
    }
}