import nodemailer from 'nodemailer';
import { env } from '../config/env-config.js';

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASSWORD
            }
        });
    }

    async sendWelcomeEmail(toEmail: string, username: string) {
        const appUrl = env.APP_URL || 'https://meal-match-kappa.vercel.app';

        try {
            const info = await this.transporter.sendMail({
                from: `"Meal Match Chef" <${env.EMAIL_USER}>`,
                to: toEmail,
                subject: "Welcome to Meal Match! 🥗",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2c3e50;">Welcome to the Kitchen, ${username}! 👨‍🍳</h2>
                        <p>We are thrilled to have you. You can now use AI to discover recipes tailored to your ingredients, diet, and cuisine preferences. Start exploring and find your next favorite dish!</p>
                        
                        <div style="margin: 30px 0;">
                            <a href="${appUrl}" style="background-color: #e67e22; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                                Go to Meal Match
                            </a>
                        </div>

                        <p style="color: #7f8c8d; font-size: 0.9em;">
                            Did you know? You can search "Comfort food for a rainy day" and our AI will understand you!
                        </p>
                    </div>
                `,
            });
            console.log("📨 Email sent: %s", info.messageId);
        } catch (error) {
            console.error("❌ Error sending email:", error);
            throw error;
        }
    }
}