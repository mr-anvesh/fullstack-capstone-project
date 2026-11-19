import { z } from 'zod';

export const createBookingSchema = z.object({
    hostId: z.uuid(),
    guestId: z.uuid(),
    propertyId: z.uuid(),
    totalAmount: z.number(),
    guestCount: z.number().int().min(1),
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime()
}).refine(
    data => new Date(data.endsAt) > new Date(data.startsAt),
    {
        message: "End date must be after start date",
        path: ["endsAt"]
    }
);

export type CreateBooking = z.infer<
    typeof createBookingSchema
>;