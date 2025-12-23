import type { Response } from 'express';
import RecipeService from '../services/recipe-service.js';
import { type AuthenticatedRequest } from "../middlewares/auth-middleware.js";
import { env } from '../config/env-config.js';

let recipeService: RecipeService;

function getRecipeService(): RecipeService {
    if (!recipeService) {
        const apiKey = env.SPOONACULAR_API_KEY;
        
        if (!apiKey) {
            throw new Error('SPOONACULAR_API_KEY is not defined in environment variables');
        }
        
        recipeService = new RecipeService(apiKey);
    }
    return recipeService;
}

export default class RecipeController {
    static async search(req: AuthenticatedRequest, res: Response) {
        try {
            const { ingredients, number } = req.query;
            if (!ingredients) {
                return res.status(400).json({ error: 'Ingredients query parameter is required' });
            }
            if (typeof ingredients !== 'string') {
                return res.status(400).json({ error: 'Ingredients must be a string' });
            }
            const ingredientsArray = ingredients.split(',');
            const service = getRecipeService();
            const data = await service.getRecipesByIngredients(ingredientsArray, Number(number) || 6);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch recipes' });
        }
    };

    static async getById(req: AuthenticatedRequest, res: Response) {
        try {
            const recipeId = Number(req.params.id);
            if (isNaN(recipeId)) {
                return res.status(400).json({ error: 'Invalid recipe ID' });
            }
            const service = getRecipeService();
            const data = await service.getRecipeDetails(recipeId);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch recipe details' });
        }
    };
};