import type { RecipeSummary } from '../types';
import { getAuthHeaders } from '../utils/authHeader';
import { getApiUrl } from './api';

export default class RecipeService {
    static async searchRecipes(ingredients?: string[]): Promise<RecipeSummary[]> {
        const params = ingredients ? `?ingredients=${encodeURIComponent(ingredients.join(','))}` : '';

        const response = await fetch(getApiUrl(`api/recipes/search${params}`), {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to search recipes');
        }
        return response.json();
    };

    static async getRecipeDetails(id: number) {
        const response = await fetch(getApiUrl(`api/recipes/${id}`), {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to get recipe details');
        }
        return response.json();
    };
};