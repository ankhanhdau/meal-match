import { Router } from 'express';
import PantryController from '../controllers/pantry-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const pantryRouter = Router();

// Get user pantry items
pantryRouter.get('/', authMiddleware, PantryController.getUserPantry);

// Add a pantry item
pantryRouter.post('/', authMiddleware, PantryController.addPantryItem);

// Remove a pantry item
pantryRouter.delete('/:id', authMiddleware, PantryController.removePantryItem);

export default pantryRouter;
