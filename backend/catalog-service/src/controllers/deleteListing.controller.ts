import type { NextFunction, Request, Response } from 'express';
import { deleteListing } from '../services/deleteListing.service';

export async function deleteListingController(req: Request, res: Response, next: NextFunction) {
    try {
        const listingId = req.body?.id;

        if (typeof listingId !== 'string' || listingId.length === 0) {
            res.status(400).json({ message: 'Listing ID is required' });
            return;
        }

        await deleteListing(listingId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
