import type { Channel } from 'amqplib';
import { consume } from './consume.js';
import { bookingEvent } from '../schemas/bookingEvent.schema.js';
import { sendBookingEmails } from '../services/bookingEmail.service.js';
import { newBookingEmail } from '../templates/newBooking.js';

export function startNewBookingConsumer(channel: Channel) {
  return consume(channel, 'newbooking', bookingEvent, (event) =>
    sendBookingEmails(event, newBookingEmail),
  );
}