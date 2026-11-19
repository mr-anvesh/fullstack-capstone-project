import type { Request, Response, NextFunction } from "express";

export function checkUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'];

    if (userId == '') {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }

    next();
}