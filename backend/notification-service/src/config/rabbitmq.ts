import { connect, type Channel } from 'amqplib';
const queues = ['signup', 'newbooking', 'cancellation'] as const;

export async function openRabbitMQ() {
  const url = process.env.RABBITMQ_URL;
  if (!url) throw new Error('RABBITMQ_URL is required');

  const connection = await connect(url);
  const channel = await connection.createChannel();

  await channel.assertExchange("notifications", 'direct', { durable: true });
  await channel.assertQueue('DLQ', { durable: true });
  await channel.bindQueue('DLQ', "notifications", 'DLQ');

  for (const queue of queues) {
    await channel.assertQueue(queue, {
      durable: true,
      deadLetterExchange: "notifications",
      deadLetterRoutingKey: 'DLQ',
    });
    await channel.bindQueue(queue, "notifications", queue);
  }

  await channel.prefetch(1);
  return channel;
}