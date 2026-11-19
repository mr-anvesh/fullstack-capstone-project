import type { NextFunction, Request, Response } from 'express';
import { createBooking } from '../services/createBooking.service.js';

export async function createBookingController(req: Request, res: Response, next: NextFunction) {
    try {
        const booking = await createBooking(req.body);
        res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
}