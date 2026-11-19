import { createClient } from 'redis';

export const client = createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

export const connectRedis = async (): Promise<void> => {
    await client.connect();
    console.log('Redis connected successfully');
};