import { z } from 'zod';

export const PropertySchema = z.object({
    hostId: z.uuid(),
    name: z.string().trim().min(1),
    location: z.string().trim().min(1),
    pricePerDay: z.number().positive(),
    maxGuests: z.number().int().positive()
});

export type Property = z.infer<
    typeof PropertySchema
>;