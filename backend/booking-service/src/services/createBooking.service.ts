import { randomUUID } from 'node:crypto';
import { redis } from '../config/redis.js';
import { publishNotification } from '../events/event.publisher.js';
import { db } from '../prisma/db.js';
import { createBookingSchema, type CreateBooking } from '../schemas/booking.schema.js';

const LOCK = 'LOCK';
const LOCK_TTL_MS = 10_000;

const RELEASE_LOCK_SCRIPT = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
    end
    return 0
`;

export async function createBooking(bookingData: CreateBooking) {
    const {
        guestId,
        hostId,
        propertyId,
        guestCount,
        totalAmount,
        startsAt,
        endsAt,
    } = createBookingSchema.parse(bookingData);

    const checkIn = new Date(startsAt);
    const checkOut = new Date(endsAt);
    const lockToken = randomUUID();

    const lockReply = await redis
        .sendCommand(['SET', LOCK, lockToken, 'NX', 'PX', String(LOCK_TTL_MS)])
        .catch((cause: unknown) => {
            throw new Error('BOOKING_LOCK_UNAVAILABLE', { cause });
        });

    if (lockReply?.toString() !== 'OK') {
        throw new Error('BOOKING_IN_PROGRESS');
    }

    let booking;
    try {
        const overlappingBooking = await db.orm.public.Booking
            .where({ propertyId })
            .where((existing) => existing.status.neq('CANCELLED'))
            .where((existing) => existing.startsAt.lt(checkOut))
            .where((existing) => existing.endsAt.gt(checkIn))
            .first();

        if (overlappingBooking) {
            throw new Error('PROPERTY_UNAVAILABLE');
        }

        booking = await db.orm.public.Booking.create({
            guestId,
            hostId,
            propertyId,
            startsAt: checkIn,
            endsAt: checkOut,
            guestCount,
            totalAmount: totalAmount.toString(),
            status: 'CONFIRMED',
        });
    } finally {
        // Delete the key only if this request still owns the lock.
        await redis
            .sendCommand(['EVAL', RELEASE_LOCK_SCRIPT, '1', LOCK, lockToken])
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