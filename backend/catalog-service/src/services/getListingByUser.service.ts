import { client } from "../config/redis";
import { db } from "../prisma/db";

// Implement CACHE-ASIDE Pattern
export async function getuserListings(userId: string) {
    // Check if listings are cached in Redis (HOT PATH)
    const cachedListings = await client.get(userId);
    if (cachedListings) {
        console.log("Cache hit for user:", userId);
        return JSON.parse(cachedListings);
    }
    console.log("Cache Miss...");
    
    // If not cached, fetch from the database (COLD PATH)
    const data = await db.orm.public.Properties
        .where({ hostId: userId })
        .all();
    
    if(!data) throw new Error("No listings found for the user");
    
    // Cache the fetched listings in Redis for future requests
    await client.set(userId, JSON.stringify(data), { EX: 24 * 3600 });
    console.log("Cached URL in Redis for user:", userId);

    return data.map((listing) => ({
        ...listing,
        pricePerDay: Number(listing.pricePerDay),
    }));
}