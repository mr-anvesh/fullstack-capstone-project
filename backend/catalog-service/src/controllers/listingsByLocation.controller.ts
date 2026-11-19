import type { NextFunction, Request, Response } from 'express';
import { getListingsByLocation } from '../services/listingsByLocation.service';

export async function listingsByLocationController(req: Request, res: Response, next: NextFunction) {
    try {
        const location = req.query.location;

        if (typeof location !== 'string' || location.trim().length === 0) {
            res.status(400).json({ message: 'Location is required' });
            return;
        }

        const listings = await getListingsByLocation(location);
        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
}
