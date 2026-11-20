import { z } from "zod";

export const PropertySchema = z.object({
    hostId: z.uuid(),
    name: z.string().trim().min(1),
    location: z.string().trim().min(1),
    pricePerDay: z.number().positive(),
    maxGuests: z.number().int().positive(),
    imageUrls: z.array(
        z.string()
        .url()
        .refine((url) => url.startsWith('https://'), {
            message: 'Image URL must start with https://',
        }),
    )
    .min(1)
    .max(10, { message: 'You can provide between 1 and 10 image URLs.' }),
});

export type Property = z.infer<typeof PropertySchema>;