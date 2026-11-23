import type { Channel } from 'amqplib';
import { consume } from '../config/rabbitmq.js';
import { signupEvent } from '../schemas/signup.schema.js';
import { sendEmail } from '../services/email.service.js';
import { signupEmail } from '../templates/signup.js';

export function startSignupConsumer(channel: Channel) {
  return consume(channel, 'signup', signupEvent, ({ name, email }) =>
    sendEmail({ to: email, ...signupEmail(name) }),
  );
}