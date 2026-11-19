import { client } from '../config/redis';

const ttl = 24 * 3600;

export const cacheListings = async (key: string, data: any, expirationInSeconds: number): Promise<void> => {
    try {
        await client.set(key, JSON.stringify(data), { EX: expirationInSeconds });
    } catch (error) {
        console.error('Error caching listings:', error);
    }
};