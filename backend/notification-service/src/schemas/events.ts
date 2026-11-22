import { z } from 'zod';

export const signupEvent = z.object({
  name: z.string(),
  email: z.email(),
});

export const bookingEvent = z.object({
  bookingId: z.string(),
  guestId: z.uuid(),
  hostId: z.uuid(),
});

export type BookingEvent = z.infer<typeof bookingEvent>;
export type BookingRole = 'guest' | 'host';