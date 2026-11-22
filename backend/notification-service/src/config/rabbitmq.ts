import { connect, type Channel } from 'amqplib';

const exchange = 'notifications';
const queues = ['signup', 'newbooking', 'cancellation'] as const;

export async function openRabbitMQ() {
  const url = process.env.RABBITMQ_URL;
  if (!url) throw new Error('RABBITMQ_URL is required');

  const connection = await connect(url);
  connection.on('error', console.error);

  const channel = await connection.createChannel();
  channel.on('error', console.error);
  channel.on('close', () => process.exit(1));

  await channel.assertExchange(exchange, 'direct', { durable: true });
  await channel.assertQueue('DLQ', { durable: true });
  await channel.bindQueue('DLQ', exchange, 'DLQ');

  for (const queue of queues) {
    await channel.assertQueue(queue, {
      durable: true,
      deadLetterExchange: exchange,
      deadLetterRoutingKey: 'DLQ',
    });
    await channel.bindQueue(queue, exchange, queue);
  }

  await channel.prefetch(1);
  return channel;
}

export function consume<T>(
  channel: Channel,
  queue: (typeof queues)[number],
  schema: { parse(value: unknown): T },
  handle: (event: T) => Promise<void>,
) {
  return channel.consume(queue, async (message) => {
    if (!message) return;

    try {
      const event = schema.parse(JSON.parse(message.content.toString()));
      await handle(event);
    } catch (error) {
      console.error(`Failed to process ${queue}`, error);
      channel.reject(message, false);
      return;
    }

    channel.ack(message);
  });
}