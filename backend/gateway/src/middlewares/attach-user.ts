import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const attachUserId = (req: Request, res: Response, next: NextFunction): void => {
  delete req.headers['x-user-id'];

  const authorization = req.headers.authorization;
  if (!authorization) {
    next();
    return;
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token not found' });
    return;
  }

  const secret = process.env.JWT_SECRET;

  try {
    //@ts-ignore
    const payload = jwt.verify(token, secret);
    req.headers['x-user-id'] = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
