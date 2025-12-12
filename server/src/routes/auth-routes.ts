import { Router } from 'express';
import AuthController from '../controllers/auth-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const authRouter = Router();

// Register
authRouter.post('/register', AuthController.register);

// Login
authRouter.post('/login', AuthController.login);

// Get current user
authRouter.get('/me', authMiddleware, AuthController.getCurrentUser);

export default authRouter;