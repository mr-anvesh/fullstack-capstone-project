import type { Request, Response } from 'express';
import { db } from '../prisma/db';

export async function getUserEmail(req: Request<{ id: string }>, res: Response) {
  const token = process.env.INTERNAL_API_TOKEN;
  if (!token || req.get('authorization') !== `Bearer ${token}`) {
    res.sendStatus(401);
    return;
  }

  const user = await db.orm.public.User.first({ id: req.params.id });
  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.json({ email: user.email });
}