import { openRabbitMQ } from './config/rabbitmq.js';
import { startSignupConsumer } from './consumers/signup.consumer.js';
import { startNewBookingConsumer } from './consumers/newBooking.consumer.js';
import { startCancellationConsumer } from './consumers/cancellation.consumer.js';

const channel = await openRabbitMQ();
await startSignupConsumer(channel);
await startNewBookingConsumer(channel);
await startCancellationConsumer(channel);

console.log('Notification consumers are ready');