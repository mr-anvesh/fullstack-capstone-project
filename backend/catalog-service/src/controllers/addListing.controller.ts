import type { NextFunction, Request, Response } from 'express';
import { PropertySchema } from '../schemas/property.schema';
import { addListing } from '../services/addListing.service';

export async function addListingController(req: Request, res: Response, next: NextFunction) {
    const result = PropertySchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ message: 'Request body does not match the listing schema' });
        return;
    }

    try {
        const listing = await addListing(result.data);
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}
