import { client } from "../config/redis";
import { db } from "../prisma/db";

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
    await client.set(location, JSON.stringify(data), { EX: 24 * 3600 });
    console.log("Cached URL in Redis for location:", location);

    return data.map((listing) => ({
        ...listing,
        pricePerDay: Number(listing.pricePerDay),
    }));
};