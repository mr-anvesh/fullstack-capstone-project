import { db } from "../prisma/db";
import type { Property } from "../schemas/property.schema";
import { client } from "../config/redis";
import { getPropertyImageUrls } from "./propertyImages.service";

// Implement CACHE-ASIDE Pattern
export async function listingById(id: string): Promise<Property | null> {
    // Check if the listing is cached in Redis (HOT PATH)
    const cachedListing = await client.get(id);
    if (cachedListing) {
        console.log("Cache hit for listing ID:", id);
        return JSON.parse(cachedListing);
    }
    console.log("Cache Miss...");
    
    // If not cached, fetch from the database (COLD PATH)
    const data = await db.orm.public.Properties
        .first({ id });
    if(!data) throw new Error("No listing found for the given ID");

    const result = {
        ...data,
        pricePerDay: Number(data.pricePerDay),
        imageUrls: await getPropertyImageUrls(id),
    };

    // Cache the fetched listing in Redis for future requests
    await client.set(id, JSON.stringify(result), { EX: 24 * 3600 });
    console.log("Cached URL in Redis for listing ID:", id);

    return result;
}