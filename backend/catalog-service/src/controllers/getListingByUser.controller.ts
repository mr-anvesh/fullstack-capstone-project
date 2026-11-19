import type { NextFunction, Request, Response } from 'express';
import { getuserListings } from '../services/getListingByUser.service';

export async function getListingByUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.headers['x-user-id'];

        if (typeof userId !== 'string' || userId.length === 0) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        const listings = await getuserListings(userId);
        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
}
