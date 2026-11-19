import type { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/user.service';

export async function registerUserController(req: Request, res: Response) {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(400).json({ message: 'Email, name, and password are required' });
    return;
  }

  try {
    const user = await registerUser(email, name, password);
    res.status(201).json({
      message: 'User registered successfully',
      userId: user.id,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

export async function loginUserController(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error });
  }
}
