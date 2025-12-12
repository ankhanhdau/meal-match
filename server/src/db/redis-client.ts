import { createClient } from "redis";
import { env } from "../config/env-config.js";

const redisClient = createClient({
    url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Connected'));

await redisClient.connect();

export default redisClient;