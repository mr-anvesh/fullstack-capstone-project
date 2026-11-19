import { db } from "../prisma/db.js";

export async function getUserBookings(userId: string) {
    //fetch all user bookings
    const bookings = await db.orm.public.Booking
        .where({ guestId: userId})
        .orderBy((booking) => booking.startsAt.desc())
        .all();
    
    return bookings;
}