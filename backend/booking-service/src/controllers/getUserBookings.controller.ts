import type { NextFunction, Request, Response } from 'express';
import { getUserBookings } from '../services/getUserBookings.service.js';

export async function getUserBookingsController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.headers['x-user-id'];

        if (typeof userId !== 'string' || userId.length === 0) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        const bookings = await getUserBookings(userId);
        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
}