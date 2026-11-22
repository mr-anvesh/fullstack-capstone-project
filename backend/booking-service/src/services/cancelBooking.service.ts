import { db } from '../prisma/db.js';
import { publishNotification } from '../events/event.publisher.js';

export async function cancelBooking(id: string) {
    const query = await db.orm.public.Booking
        .where({ id })
        .update({
            status: 'CANCELLED',
        });

    if (!query) return null;

    await publishNotification('cancellation', {
        bookingId: query.id,
        guestId: query.guestId,
        hostId: query.hostId,
    }).catch(console.error);
    
    return query;
}