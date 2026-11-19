import type { NextFunction, Request, Response } from 'express';
import { updateListing } from '../services/updateListing.service';

export async function updateListingController(req: Request, res: Response, next: NextFunction) {
    try {
        const { id: listingId, ...listingData } = req.body;

        if (typeof listingId !== 'string' || listingId.length === 0) {
            res.status(400).json({ message: 'Listing ID is required' });
            return;
        }

        const listing = await updateListing(listingId, listingData);
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}
