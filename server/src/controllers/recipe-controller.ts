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
            const service = getRecipeService();

            // Destructure the params
            const { query, number, ...manualFilters } = req.query;

            // Initialize the Final Parameters container
            const finalParams = new URLSearchParams();

            //  Process AI Natural Language if query exists
            if (query && typeof query === 'string') {
                const aiQueryString = await service.convertNaturalLanguageToQuery(query);

                // Parse the AI result into finalParams
                const aiParams = new URLSearchParams(aiQueryString);
                aiParams.forEach((value, key) => {
                    finalParams.append(key, value);
                });
            }

            // Apply Manual Filters (Overrides/Additions)
            Object.entries(manualFilters).forEach(([key, value]) => {
                if (value) {
                    // Special handling for Ingredients to merge 
                    if (key === 'includeIngredients' && finalParams.has('includeIngredients')) {
                        const existing = finalParams.get('includeIngredients');
                        finalParams.set('includeIngredients', `${existing},${value}`);
                    }
                    // For everything else, Manual overrides AI 
                    else {
                        finalParams.set(key, String(value));
                    }
                }
            });

            if (finalParams.has('includeIngredients')) {
                finalParams.set("sort", "max-used-ingredients");
            } else {
                finalParams.set("sort", "popularity");
            }

            // Execute Search
            const limit = typeof number === 'string' ? Number(number) : 9;
            const finalQueryString = finalParams.toString();

            console.log('🔍 Final Search Query:', finalQueryString);

            const data = await service.getRecipesByFilters(finalQueryString, limit);

            res.json(data.results || []);

        } catch (error) {
            console.error(error);
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