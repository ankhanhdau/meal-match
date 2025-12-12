import AuthService from '../services/auth-service.js';
import {type AuthenticatedRequest } from '../middlewares/auth-middleware.js';
import type { Request, Response } from 'express';
import { addWelcomeEmailJob } from '../queues/email-queue.js';

// Register
export default class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            // Validation
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Name, email, and password are required' });
            }

            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters' });
            }
            const result = await AuthService.register(name, email, password);
            addWelcomeEmailJob(email, name);
            res.status(201).json(result);
        } catch (error) {
            console.error('Registration error:', error);
            res.status(400).json({
                error: error instanceof Error ? error.message : 'Registration failed'
            });
        }
    };
    // Login
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const result = await AuthService.login(email, password);

            res.json(result);
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({
                error: error instanceof Error ? error.message : 'Login failed'
            });
        }
    };

    // Get current user
    static async getCurrentUser(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const user = await AuthService.getUserById(req.user.userId);
            res.json({ user });
        } catch (error) {
            console.error('Get current user error:', error);
            res.status(400).json({
                error: error instanceof Error ? error.message : 'Failed to get current user'
            });
        }
    };
};