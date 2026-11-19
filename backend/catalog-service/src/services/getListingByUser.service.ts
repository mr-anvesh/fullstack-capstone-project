import { db } from "../prisma/db";

export async function getuserListings(userId: string) {
    const query = await db.orm.public.Properties
        .where({ hostId: userId })
        .all();
    return query.map((listing) => ({
        ...listing,
        pricePerDay: Number(listing.pricePerDay),
    }));
}