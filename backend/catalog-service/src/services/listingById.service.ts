import { db } from "../prisma/db";
import type { Property } from "../schemas/property.schema";

export async function listingById(id: string): Promise<Property | null> {
    const query = await db.orm.public.Properties
        .first({ id });
    return query
        ? { ...query, pricePerDay: Number(query.pricePerDay) }
        : null;
}