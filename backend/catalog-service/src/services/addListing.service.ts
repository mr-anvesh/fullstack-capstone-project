import { db } from "../prisma/db";
import type { Property } from "../schemas/property.schema";

export async function addListing(listingData: Property) {
    const query = await db.orm.public.Properties
        .create(
            {
                ...listingData,
                pricePerDay: String(listingData.pricePerDay),
            }
        );
    return query;
}