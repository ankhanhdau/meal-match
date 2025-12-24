import { Worker } from 'bullmq';
import { env } from '../config/env-config.js';
import { EmailService } from '../services/email-service.js';

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT
};

export const startEmailWorker = () => {
  const worker = new Worker('email-queue', async (job) => {
    console.log(`[WORKER] Processing job ${job.id}: Sending email to ${job.data.email}...`);

    const emailService = new EmailService();
    await emailService.sendWelcomeEmail(job.data.email, job.data.username);

    console.log(`[WORKER] ✅ Email sent to ${job.data.username}!`);
  }, { connection });

  worker.on('failed', (job, err) => {
    console.error(`[WORKER] Job ${job?.id} failed: ${err.message}`);
  });
};
startEmailWorker();