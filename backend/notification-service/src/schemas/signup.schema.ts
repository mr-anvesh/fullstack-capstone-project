import { z } from 'zod';

export const signupEvent = z.object({
  name: z.string(),
  email: z.email(),
});