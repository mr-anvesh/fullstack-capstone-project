import type { NextFunction, Request, Response } from 'express';
import { listingById } from '../services/listingById.service';

export async function listingByIdController(req: Request, res: Response, next: NextFunction) {
    try {
        const listingId = req.body?.id;

        if (typeof listingId !== 'string' || listingId.length === 0) {
            res.status(400).json({ message: 'Listing ID is required' });
            return;
        }

        const listing = await listingById(listingId);
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }

        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}
