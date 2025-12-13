import type { RecipeDetail } from "../types.js";
import { getAuthHeaders } from '../utils/authHeader.js';
import { getApiUrl } from './api.js';

export default class FavoritesService {
    static async getFavorites(): Promise<RecipeDetail[]> {
        const response = await fetch(getApiUrl('api/favorites'), {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch favorites');
        }
        return response.json();
    };

    static async getFavoriteById(recipeId: number): Promise<RecipeDetail> {
        const response = await fetch(getApiUrl(`api/favorites/${recipeId}`), {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch favorite');
        }
        return response.json();
    };

    static async addFavorite(recipe: RecipeDetail): Promise<RecipeDetail> {
        const response = await fetch(getApiUrl('api/favorites'), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(recipe)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add favorite');
        }
        return response.json();
    };

    static async removeFavorite(recipeId: number): Promise<{ message: string; recipeId: number }> {
        const response = await fetch(getApiUrl(`api/favorites/${recipeId}`), {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to remove favorite');
        }
        return response.json();
    };
};