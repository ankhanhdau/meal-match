import { Worker } from 'bullmq';
import { env } from '../config/env-config.js';

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT
};

// This function simulates sending an email (takes 2 seconds)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const startEmailWorker = () => {
  const worker = new Worker('email-queue', async (job) => {
    console.log(`[WORKER] Processing job ${job.id}: Sending email to ${job.data.email}...`);
    
    // Simulate 2s delay (like talking to SendGrid/AWS SES)
    await sleep(2000); 
    
    console.log(`[WORKER] ✅ Email sent to ${job.data.username}!`);
  }, { connection });

  worker.on('failed', (job, err) => {
    console.error(`[WORKER] Job ${job?.id} failed: ${err.message}`);
  });
};
startEmailWorker();