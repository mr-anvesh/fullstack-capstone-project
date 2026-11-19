import { db } from "../prisma/db";

export async function updateListing(id: string, listingData: any) {
    const query = await db.orm.public.Properties
        .where({ id })
        .update(listingData);
    return query;
};