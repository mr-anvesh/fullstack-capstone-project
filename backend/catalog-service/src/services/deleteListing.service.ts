import { client } from "../config/redis";
import { db } from "../prisma/db";

export async function deleteListing(id : string) {
    const data = await db.orm.public.Properties
        .where({ id })
        .delete();
    if(!data) throw new Error("No listing found for the given ID");
    await client.del(id); // Remove the listing from Redis cache if it exists
    return data;
}