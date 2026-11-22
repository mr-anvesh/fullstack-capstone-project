import { z } from 'zod';
import type { BookingEvent, BookingRole } from '../schemas/events.js';
import { sendEmail } from './email.service.js';

const contact = z.object({ email: z.email() });

async function getEmail(userId: string) {
  const baseUrl = process.env.AUTH_URL;
  const token = process.env.INTERNAL_API_TOKEN;
  if (!baseUrl || !token) throw new Error('Auth lookup is not configured');

  const response = await fetch(
    new URL(`/internal/users/${encodeURIComponent(userId)}/email`, baseUrl),
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5_000),
    },
  );

  if (!response.ok) throw new Error(`Auth lookup failed (${response.status})`);
  return contact.parse(await response.json()).email;
}

export async function sendBookingEmails(
  event: BookingEvent,
  template: (bookingId: string, role: BookingRole) => {
    subject: string;
    text: string;
  },
) {
  const [guestEmail, hostEmail] = await Promise.all([
    getEmail(event.guestId),
    getEmail(event.hostId),
  ]);

  await sendEmail({ to: guestEmail, ...template(event.bookingId, 'guest') });
  await sendEmail({ to: hostEmail, ...template(event.bookingId, 'host') });
}