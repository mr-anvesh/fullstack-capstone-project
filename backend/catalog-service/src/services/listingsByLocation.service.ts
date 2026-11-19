import { db } from "../prisma/db";

export async function getListingsByLocation(location: string) {
    const query = await db.orm.public.Properties
        .where({ location })
        .all();
    return query.map((listing) => ({
        ...listing,
        pricePerDay: Number(listing.pricePerDay),
    }));
};