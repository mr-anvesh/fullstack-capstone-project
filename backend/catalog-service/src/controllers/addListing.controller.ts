import type { NextFunction, Request, Response } from 'express';
import { PropertySchema } from '../schemas/property.schema';
import { addListing } from '../services/addListing.service';

export async function addListingController(req: Request, res: Response, next: NextFunction) {
    try {
        const listingData = PropertySchema.parse(req.body);
        const listing = await addListing(listingData);
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}
