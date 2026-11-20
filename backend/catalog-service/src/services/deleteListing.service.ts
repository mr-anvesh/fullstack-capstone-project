import { client } from "../config/redis";
import { db } from "../prisma/db";

export async function deleteListing(id : string) {
    const listing = await db.orm.public.Properties.first({ id });
    if (!listing) throw new Error("No listing found for the given ID");

    const data = await db.orm.public.Properties
        .where({ id })
        .delete();
    if(!data) throw new Error("No listing found for the given ID");

    await client.del(id);
    await client.del(listing.hostId);
    await client.del(listing.location);
    
    return data;
}