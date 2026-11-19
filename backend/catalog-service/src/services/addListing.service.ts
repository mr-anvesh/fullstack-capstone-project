import { client } from "../config/redis";
import { db } from "../prisma/db";
import type { Property } from "../schemas/property.schema";

export async function addListing(listingData: Property) {
    const data = await db.orm.public.Properties
        .create(
            {
                ...listingData,
                pricePerDay: String(listingData.pricePerDay),
            }
        );
    if(!data) throw new Error("Failed to add the listing");
    await client.del(listingData.hostId); // Invalidate the cache for the host's listings
    await client.del(listingData.location); // Invalidate the cache for the location's listings
    return data;
}