import { createClient } from 'redis';

export const client = createClient({
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

export const connectRedis = async (): Promise<void> => {
    await client.connect();
    console.log('Redis connected successfully');
};