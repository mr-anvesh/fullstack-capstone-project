import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../prisma/db';

export async function registerUser(email: string, name: string, password: string) {
  const existingUser = await db.orm.public.User.first({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return db.orm.public.User.create({
    email: email,
    name: name,
    passwordHash: hashedPassword,
  });
}

export async function loginUser(email: string, password: string) {
  const user = await db.orm.public.User.first({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}