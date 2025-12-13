import { getAuthHeaders } from "../utils/authHeader";
import type { PantryItem } from "../types.js";
import { getApiUrl } from './api.js';

export default class PantryService {
    static async getUserPantry(): Promise<PantryItem[]> {
        const response = await fetch(getApiUrl('api/pantry'), {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch pantry items');
        }
        return response.json();
    };

    static async addPantryItem(name: string): Promise<PantryItem> {
        const response = await fetch(getApiUrl('api/pantry'), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add pantry item');
        }
        return response.json();
    };

    static async removePantryItem(itemId: number): Promise<{ message: string; itemId: number }> {
        const response = await fetch(getApiUrl(`api/pantry/${itemId}`), {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to remove pantry item');
        }
        return response.json();
    };
};