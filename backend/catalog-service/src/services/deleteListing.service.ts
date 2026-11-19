import { db } from "../prisma/db";

export async function deleteListing(id : string) {
    const query = await db.orm.public.Properties
        .where({ id })
        .delete();
    return query;
}