import type { Channel } from 'amqplib';
import { consume } from './consume.js';
import { bookingEvent } from '../schemas/bookingEvent.schema.js';
import { sendBookingEmails } from '../services/bookingEmail.service.js';
import { cancellationEmail } from '../templates/cancellation.js';

export function startCancellationConsumer(channel: Channel) {
  return consume(channel, 'cancellation', bookingEvent, (event) =>
    sendBookingEmails(event, cancellationEmail),
  );
}