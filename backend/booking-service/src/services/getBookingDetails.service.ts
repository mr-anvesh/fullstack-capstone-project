import { db } from "../prisma/db.js";

export async function getBookingDetails(bookingId: string) {
    const bookingDetails = await db.orm.public.Booking
        .where({ id: bookingId});
    
    return bookingDetails;
}