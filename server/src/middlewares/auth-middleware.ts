import type { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth-service.js';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = AuthService.verifyToken(token);
        req.user = { userId: decoded.userId, email: decoded.email };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}