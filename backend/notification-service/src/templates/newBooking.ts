import type { BookingRole } from '../schemas/events.js';

export function newBookingEmail(bookingId: string, role: BookingRole) {
  return {
    subject: role === 'guest' ? 'Your booking is confirmed' : 'You have a new booking',
    text: `Booking ${bookingId} is confirmed.`,
  };
}