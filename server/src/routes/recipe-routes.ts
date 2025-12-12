import { Router } from 'express';
import RecipeController from '../controllers/recipe-controller.js';
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { rateLimiter } from '../middlewares/rate-limiter.js';

const recipeRouter = Router();

recipeRouter.get('/search', authMiddleware, rateLimiter, RecipeController.search);

recipeRouter.get('/:id', authMiddleware, rateLimiter, RecipeController.getById);

export default recipeRouter;
