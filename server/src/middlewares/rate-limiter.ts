import type { Request, Response, NextFunction } from 'express';
import redisClient from '../db/redis-client.js';

const MAX_REQUESTS = 10; // Max requests
const WINDOW_SIZE_IN_SECONDS = 60; // Time window in seconds
export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ip = req.ip || req.socket.remoteAddress;
        if (!ip) {
            return res.status(400).json({ error: 'Unable to determine client IP' });
        }
        const key = `rate-limit:${ip}`;
        const requests = await redisClient.incr(key);
        if (requests === 1) {
            await redisClient.expire(key, WINDOW_SIZE_IN_SECONDS);
        }
        if (requests > MAX_REQUESTS) {
            const ttl = await redisClient.ttl(key);
            return res.status(429).json({
                error: 'Too Many Requests',
                message: `You have exceeded the ${MAX_REQUESTS} requests in ${WINDOW_SIZE_IN_SECONDS} seconds limit!`,
                retryAfter: ttl
            });
        }
        next();
    } catch (error) {
        console.error('Rate limiter error:', error);
        next();
    }
};