import redisClient from '../db/redis-client.js';

export default class RecipeService {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.spoonacular.com';
    }

    async getRecipesByIngredients(ingredients: string[], number: number = 6) {
        const cleanedIngredients = ingredients.map(ing => ing.toLowerCase().trim()).filter(ing => ing.length > 0);
        const cacheKey = `recipes:${cleanedIngredients.sort().join(',')}:${number}`;
        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                console.log('Cache hit for key:', cacheKey);
                return JSON.parse(cachedData);
            }
        } catch (err) {
            console.error('Error accessing Redis cache:', err);
        }
        console.log('Cache miss for key:', cacheKey);
        const params = new URLSearchParams({
            ingredients: cleanedIngredients.join(',+'),
            number: number.toString(),
            apiKey: this.apiKey
        });
        const response = await fetch(
            `${this.baseUrl}/recipes/findByIngredients?${params.toString()}`
        );

        if (!response.ok) {
            throw new Error(`Error fetching recipes: ${response.statusText}`);
        }
        const data = await response.json();
        try {
            await redisClient.set(cacheKey, JSON.stringify(data), {
                EX: 3600
            });
        } catch (error) {
            console.error('Redis save error:', error);
        }
        return data;
    };

    async getRecipeDetails(recipeId: number) {
        try {
            const cachedData = await redisClient.get(`recipe:${recipeId}`);
            if (cachedData) {
                console.log('Cache hit for recipe ID:', recipeId);
                return JSON.parse(cachedData);
            }
        } catch (err) {
            console.error('Error accessing Redis cache:', err);
        }
        console.log('Cache miss for recipe ID:', recipeId);
        const params = new URLSearchParams({
            apiKey: this.apiKey,
            includeNutrition: 'true',
            addWinePairing: 'false',
            addTasteData: 'false'
        });
        const response = await fetch(
            `${this.baseUrl}/recipes/${recipeId}/information?${params.toString()}`
        );
        if (!response.ok) {
            throw new Error(`Error fetching recipe details: ${response.statusText}`);
        }
        const data = await response.json();
        try {
            await redisClient.set(`recipe:${recipeId}`, JSON.stringify(data), {
                EX: 3600
            });
        } catch (error) {
            console.error('Redis save error:', error);
        }
        return data;
    };
};