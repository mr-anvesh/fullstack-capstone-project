import type { Channel } from 'amqplib';

export function consume<T>(
  channel: Channel,
  queue: 'signup' | 'newbooking' | 'cancellation',
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