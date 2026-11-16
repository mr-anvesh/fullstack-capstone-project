import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../prisma/db';

export const registerUser = async (req: Request, res: Response) => {
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existingUser = await db.orm.public.User.first({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db.orm.public.User.create({
    email,
    name: email,
    passwordHash: hashedPassword,
  });

  res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
};

export const loginUser = async (req: Request, res: Response) => {
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
        message: 'Email and password are required' 
    });
  }

  const user = await db.orm.public.User.first({ email });

  if (!user) {
    return res.status(400).json({ 
        message: 'Invalid email or password' 
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(400).json({ 
        message: 'Invalid email or password' 
    });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  res.json({ token });
}