import { Queue } from 'bullmq';
import { env } from '../config/env-config.js'; 

// Create a connection to the Redis instance we already have
const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT
};

// Define the Queue
export const emailQueue = new Queue('email-queue', { connection });

// Helper to add jobs easily
export const addWelcomeEmailJob = async (email: string, username: string) => {
  await emailQueue.add('send-welcome', {
    email,
    username,
    date: new Date()
  });
  console.log(`[QUEUE] Added welcome email job for ${email}`);
};