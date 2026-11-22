import type { BookingRole } from '../schemas/events.js';

export function cancellationEmail(bookingId: string, role: BookingRole) {
  return {
    subject: role === 'guest' ? 'Your booking was cancelled' : 'A booking was cancelled',
    text: role === 'guest'
      ? `Your reservation ${bookingId} has been cancelled.`
      : `Reservation ${bookingId} for your listing has been cancelled.`,
  };
}