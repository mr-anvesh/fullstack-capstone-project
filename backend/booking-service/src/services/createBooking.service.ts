import { db } from '../prisma/db.js';
import { createBookingSchema, type CreateBooking} from '../schemas/booking.schema.js';
import { publishNotification } from '../events/event.publisher.js';

export async function createBooking(bookingData: CreateBooking) {
    const parsed = createBookingSchema.parse(bookingData);
    const { hostId, propertyId, guestCount, totalAmount } = parsed;
    const startDate = new Date(parsed.startsAt);
    const endDate = new Date(parsed.endsAt);

    const conflictingBooking = await db.orm.public.Booking
        .where({ propertyId })
        .where((booking) => booking.status.neq('CANCELLED'))
        .where((booking) => booking.startsAt.lt(endDate))
        .where((booking) => booking.endsAt.gt(startDate))
        .first();

    if (conflictingBooking) {
        throw new Error('PROPERTY_UNAVAILABLE');
    }

    const query = await db.orm.public.Booking.create({
        guestId: bookingData.guestId,
        hostId,
        propertyId,
        startsAt: startDate,
        endsAt: endDate,
        guestCount,
        totalAmount: totalAmount.toString(),
        status: 'CONFIRMED',
    });

    await publishNotification('newbooking', {
        bookingId: query.id,
        guestId: query.guestId,
        hostId: query.hostId,
    }).catch(console.error);
    return query;
}