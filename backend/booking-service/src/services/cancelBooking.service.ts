import { db } from '../prisma/db.js';

export async function cancelBooking(id: string) {
    const query = await db.orm.public.Booking
        .where({ id })
        .update({
            status: 'CANCELLED',
        });
    return query;
}