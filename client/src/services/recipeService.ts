import type { RecipeSummary } from '../types';
import { getAuthHeaders } from '../utils/authHeader';
import { getApiUrl } from './api';
import type { SearchFilters } from '../types';

export default class RecipeService {
    static async searchRecipes(filter: SearchFilters): Promise<RecipeSummary[]> {
        const params = Object.entries(filter)
            .filter((entry) => {
                const value = entry[1];
                return value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
            })
            .map(([key, value]) => {
                if (key === 'includeIngredients' && Array.isArray(value) || key === 'excludeIngredients' && Array.isArray(value)) {
                    return `${key}=${value.join(',')}`;
                }
                const encodedValue = Array.isArray(value)
                    ? encodeURIComponent(value.join(','))
                    : encodeURIComponent(String(value));
                return `${key}=${encodedValue}`;
            })
            .join('&');
        const response = await fetch(getApiUrl(`api/recipes/search?${params}`), {
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