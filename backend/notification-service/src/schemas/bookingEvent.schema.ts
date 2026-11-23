import { z } from 'zod';

export const bookingEvent = z.object({
  bookingId: z.string(),
  guestId: z.uuid(),
  hostId: z.uuid(),
});

export type BookingEvent = z.infer<typeof bookingEvent>;
export type BookingRole = 'guest' | 'host';