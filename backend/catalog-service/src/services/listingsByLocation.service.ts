import { client } from "../config/redis";
import { db } from "../prisma/db";
import { getPropertyImageUrls } from "./propertyImages.service";

// Implement CACHE-ASIDE Pattern
export async function getListingsByLocation(location: string) {
    //Check if listings are cached in Redis (HOT PATH)
    const cachedListings = await client.get(location);
    if (cachedListings) {
        console.log("Cache hit for location:", location);
        return JSON.parse(cachedListings);
    }
    console.log("Cache Miss...");
    
    // If not cached, fetch from the database (COLD PATH)
    const data = await db.orm.public.Properties
        .where({ location })
        .all();

    if(!data) throw new Error("No listings found for the location");
    
    // Cache the fetched listings in Redis for future requests
    const listings = await Promise.all(
        data.map(async (listing) => ({
            ...listing,
            pricePerDay: Number(listing.pricePerDay),
            imageUrls: await getPropertyImageUrls(listing.id),
        })),
    );

    await client.set(location, JSON.stringify(listings), { EX: 24 * 3600 });
    console.log("Cached URLs in Redis for location:", location);

    return listings;
};