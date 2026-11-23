import 'dotenv/config';
import { createClient } from 'redis';

export const redis = createClient({
    url: process.env['REDIS_URL'] ?? 'redis://localhost:6379',
    disableOfflineQueue: true,
});

redis.on('error', (error) => {
    console.error('Booking Redis error:', error);
});