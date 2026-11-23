import { randomUUID } from 'node:crypto';
import { redis } from '../config/redis.js';
import { db } from '../prisma/db.js';
import { createBookingSchema, type CreateBooking } from '../schemas/booking.schema.js';
import { publishNotification } from '../events/event.publisher.js';

const BOOKING_LOCK_TTL_MS = 10_000;

const RELEASE_LOCK = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
    end
    return 0
`;

export async function createBooking(bookingData: CreateBooking) {
    const parsed = createBookingSchema.parse(bookingData);
    const { guestId, hostId, propertyId, guestCount, totalAmount } = parsed;
    const startDate = new Date(parsed.startsAt);
    const endDate = new Date(parsed.endsAt);

    const key = `booking:lock:${propertyId.toLowerCase()}`;
    const token = randomUUID();

    const acquired = await redis.sendCommand([
        'SET', key, token, 'NX', 'PX', String(BOOKING_LOCK_TTL_MS),
    ]).catch((cause: unknown) => {
        throw new Error('BOOKING_LOCK_UNAVAILABLE', { cause });
    });

    if (acquired?.toString() !== 'OK') {
        throw new Error('BOOKING_IN_PROGRESS');
    }

    let booking;
    try {
        const conflict = await db.orm.public.Booking
            .where({ propertyId })
            .where((row) => row.status.neq('CANCELLED'))
            .where((row) => row.startsAt.lt(endDate))
            .where((row) => row.endsAt.gt(startDate))
            .first();

        if (conflict) {
            throw new Error('PROPERTY_UNAVAILABLE');
        }

        booking = await db.orm.public.Booking.create({
            guestId,
            hostId,
            propertyId,
            startsAt: startDate,
            endsAt: endDate,
            guestCount,
            totalAmount: totalAmount.toString(),
            status: 'CONFIRMED',
        });
    } finally {
        await redis.sendCommand(['EVAL', RELEASE_LOCK, '1', key, token])
            .catch((error: unknown) => {
                console.error('Could not release booking lock:', error);
            });
    }

    await publishNotification('newbooking', {
        bookingId: booking.id,
        guestId: booking.guestId,
        hostId: booking.hostId,
    }).catch(console.error);

    return booking;
}