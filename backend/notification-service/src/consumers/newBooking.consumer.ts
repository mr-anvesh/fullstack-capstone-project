import type { Channel } from 'amqplib';
import { consume } from '../config/rabbitmq.js';
import { bookingEvent } from '../schemas/events.js';
import { sendBookingEmails } from '../services/bookingEmail.service.js';
import { newBookingEmail } from '../templates/newBooking.js';

export function startNewBookingConsumer(channel: Channel) {
  return consume(channel, 'newbooking', bookingEvent, (event) =>
    sendBookingEmails(event, newBookingEmail),
  );
}