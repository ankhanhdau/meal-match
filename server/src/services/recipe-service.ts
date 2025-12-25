import redisClient from '../db/redis-client.js';
import { getOpenAI, AI_MODELS } from '../config/openai.js';

export default class RecipeService {
    private apiKey: string;
    private baseUrl: string;
    private openai = getOpenAI();

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.spoonacular.com';
    }

    async convertNaturalLanguageToQuery(userInput: string): Promise<string> {
        // The System Prompt
        const SYSTEM_PROMPT = `
            You are a URL parameter generator for the Spoonacular API. 
            Analyze the user's natural language request and return a JSON object representing the search filters.

            Supported Parameters (Keys):
            - query: The main dish/food name (e.g., "pasta", "burger", "soup")
            - includeIngredients: Comma-separated list of ingredients that MUST be in the recipe
            - excludeIngredients: Comma-separated list of ingredients to avoid
            - cuisine: ONE of: african, asian, american, british, cajun, caribbean, chinese, eastern european, european, french, german, greek, indian, irish, italian, japanese, jewish, korean, latin american, mediterranean, mexican, middle eastern, nordic, southern, spanish, thai, vietnamese
            - type: ONE of: main course, side dish, dessert, appetizer, salad, bread, breakfast, soup, beverage, sauce, marinade, fingerfood, snack, drink
            - diet: Comma-separated from: gluten free, ketogenic, vegetarian, lacto-vegetarian, ovo-vegetarian, vegan, pescetarian, paleo, primal, low fodmap, whole30
            - intolerances: Comma-separated from: dairy, egg, gluten, grain, peanut, seafood, sesame, shellfish, soy, sulfite, tree nut, wheat
            - maxReadyTime: Maximum cooking time in minutes (integer)
            - minCalories: Minimum calories per serving (integer)
            - maxCalories: Maximum calories per serving (integer)

            Rules:
            1. Only include keys that are relevant to the user's request. Omit keys with no value.
            2. For dish names (e.g., "burger", "pizza", "tacos"), use 'query'.
            3. For specific ingredients the user wants included (e.g., "with chicken", "using tomatoes"), use 'includeIngredients'.
            4. For dietary restrictions or allergies, use 'diet' and/or 'intolerances' appropriately.
            5. Values must match the allowed options exactly (case-insensitive is okay).
            6. Return ONLY a valid JSON object with no additional text, explanations, or markdown.

            Example:
            User: "I want a quick vegetarian pasta under 500 calories"
            Response: {"query":"pasta","diet":"vegetarian","maxCalories":500,"maxReadyTime":30}
        `;

        try {
            const completion = await this.openai.chat.completions.create({
                model: AI_MODELS.CHAT,
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userInput }
                ],
                temperature: 0,
            });

            // Parse JSON result
            const aiParams = JSON.parse(completion.choices[0]?.message.content || '{}');

            // Convert JSON to Query String (e.g., "diet=keto&query=soup")
            const searchParams = new URLSearchParams();
            Object.entries(aiParams).forEach(([key, value]) => {
                if (value) searchParams.append(key, String(value));
            });

            return searchParams.toString();

        } catch (error) {
            console.error('AI Translation Error:', error);
            // Fallback: If AI fails, just search the text as a basic query
            return `query=${encodeURIComponent(userInput)}`;
        }
    }

    async getRecipesByFilters(queryString: string, number: number = 6) {
        const cacheKey = `recipes:${queryString}:${number}`;
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
        const response = await fetch(
            `${this.baseUrl}/recipes/complexSearch?apiKey=${this.apiKey}&${queryString}&number=${number}&fillIngredients=true`
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