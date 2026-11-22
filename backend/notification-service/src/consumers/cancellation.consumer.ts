import type { Channel } from 'amqplib';
import { consume } from '../config/rabbitmq.js';
import { bookingEvent } from '../schemas/events.js';
import { sendBookingEmails } from '../services/bookingEmail.service.js';
import { cancellationEmail } from '../templates/cancellation.js';

export function startCancellationConsumer(channel: Channel) {
  return consume(channel, 'cancellation', bookingEvent, (event) =>
    sendBookingEmails(event, cancellationEmail),
  );
}