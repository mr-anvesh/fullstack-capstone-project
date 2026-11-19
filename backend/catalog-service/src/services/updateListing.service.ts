import { client } from "../config/redis";
import { db } from "../prisma/db";

export async function updateListing(id: string, listingData: any) {
    const data = await db.orm.public.Properties
        .where({ id })
        .update(listingData);
    if(!data) throw new Error("No listing found for the given ID");

    await client.del(id); // Invalidate the cache for the updated listing
    
    return data;
};