import FavoritesService from "../services/favorites-service.js";
import { type AuthenticatedRequest } from "../middlewares/auth-middleware.js";
import type { RecipeDetail } from "../types/recipes.js";
import type { Response } from "express";

export default class FavoritesController {
    // Get user favorites
    static async getUserFavorites(req: AuthenticatedRequest, res: Response): Promise<void | Response> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const favorites = await FavoritesService.getUserFavorites(userId);
            res.json(favorites);
        } catch (error) {
            console.error("Error fetching favorites:", error);
            res.status(500).json({ error: "Failed to fetch favorites" });
        }
    };

    // Get user favorites recipe by ID
    static async getFavoriteById(req: AuthenticatedRequest, res: Response): Promise<void | Response> {
        try {
            const userId = req.user?.userId;
            const recipeId = Number(req.params.id);

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            if (isNaN(recipeId)) {
                return res.status(400).json({ error: "Invalid recipe ID" });
            }

            const favorite = await FavoritesService.getFavoriteById(userId, recipeId);
            if (!favorite) {
                return res.status(404).json({ error: "Favorite not found" });
            }
            res.json(favorite);
        } catch (error) {
            console.error("Error fetching favorite:", error);
            res.status(500).json({ error: "Failed to fetch favorite" });
        }
    };

    // Add a favorite
    static async addFavorite(req: AuthenticatedRequest, res: Response): Promise<void | Response> {
        try {
            const userId = req.user?.userId;
            const recipe: RecipeDetail = req.body;

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const result = await FavoritesService.addFavorite(userId, recipe);

            if (result.rowCount === 0) {
                // Recipe already exists due to ON CONFLICT DO NOTHING
                return res.status(200).json({ message: 'Recipe already in favorites', recipeId: recipe.id });
            }
            res.status(201).json({ message: 'Recipe added to favorites', recipeId: recipe.id });
        } catch (error) {
            console.error("Error adding favorite:", error);
            res.status(500).json({ error: "Failed to add favorite" });
        }
    };

    // Remove a favorite
    static async removeFavorite(req: AuthenticatedRequest, res: Response): Promise<void | Response> {
        try {
            const userId = req.user?.userId;
            const recipeId = Number(req.params.id);

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            if (isNaN(recipeId)) {
                return res.status(400).json({ error: "Invalid recipe ID" });
            }

            const result = await FavoritesService.removeFavorite(userId, recipeId);

            if (!result) {  
                return res.status(404).json({ error: "Favorite not found" });
            }
            res.json({ message: "Favorite removed", recipeId });
        } catch (error) {
            console.error("Error removing favorite:", error);
            res.status(500).json({ error: "Failed to remove favorite" });
        }
    };

    // Search favorites
    static async searchFavorites(req: AuthenticatedRequest, res: Response): Promise<void | Response> {
        try {
            const userId = req.user?.userId;
            const query: string = req.query.query as string;

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            if (!query || typeof query !== 'string') {
                return res.status(400).json({ error: 'Invalid search query' });
            }

            const results = await FavoritesService.searchFavorites(userId, query);
            res.json(results);
        } catch (error) {
            console.error("Error searching favorites:", error);
            res.status(500).json({ error: "Failed to search favorites" });
        }
    };
};