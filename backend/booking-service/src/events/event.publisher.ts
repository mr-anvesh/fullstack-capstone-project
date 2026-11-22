import { connect } from 'amqplib';

type NotificationQueue = 'signup' | 'newbooking' | 'cancellation';

export async function publishNotification(
  queue: NotificationQueue,
  event: object,
) {
  const url = process.env.RABBITMQ_URL;
  if (!url) throw new Error('RABBITMQ_URL is required');

  const connection = await connect(url, { timeout: 5_000 });
  connection.on('error', console.error);

  try {
    const channel = await connection.createConfirmChannel();
    channel.on('error', console.error);

    let returned = false;
    channel.on('return', () => {
      returned = true;
    });

    channel.publish('notifications', queue, Buffer.from(JSON.stringify(event)), {
      contentType: 'application/json',
      persistent: true,
      mandatory: true,
    });

    await channel.waitForConfirms();
    if (returned) throw new Error(`No queue is bound for ${queue}`);
  } finally {
    await connection.close().catch(console.error);
  }
}