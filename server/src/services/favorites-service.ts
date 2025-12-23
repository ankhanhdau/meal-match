import { getOpenAI, AI_MODELS } from '../config/openai.js';
import pool from '../db/connection.js';
import type { RecipeDetail } from '../types/recipes.js';

export default class FavoritesService {
    static async getUserFavorites(userId: number): Promise<RecipeDetail[]> {
        const result = await pool.query(
            `SELECT
            recipe_id as id,
            title,
            image,
            summary,
            cuisines as "cuisines",
            dishTypes as "dishTypes",
            readyInMinutes as "readyInMinutes",
            servings,
            vegetarian,
            vegan,
            glutenFree as "glutenFree",
            dairyFree as "dairyFree",
            healthScore as "healthScore",
            pricePerServing as "pricePerServing",
            extendedIngredients as "extendedIngredients",
            analyzedInstructions as "analyzedInstructions",
            nutrition,
            sourceUrl as "sourceUrl",
            created_at
        FROM user_favorites
        WHERE user_id = $1
        ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows as RecipeDetail[];
    };

    static async getFavoriteById(userId: number, recipeId: number): Promise<RecipeDetail | null> {
        const result = await pool.query(
            `SELECT
            recipe_id as id,
            title,
            image,
            summary,
            cuisines as "cuisines",
            dishTypes as "dishTypes",
            readyInMinutes as "readyInMinutes",
            servings,
            vegetarian,
            vegan,
            glutenFree as "glutenFree",
            dairyFree as "dairyFree",
            healthScore as "healthScore",
            pricePerServing as "pricePerServing",
            extendedIngredients as "extendedIngredients",
            analyzedInstructions as "analyzedInstructions",
            nutrition,
            sourceUrl as "sourceUrl",
            created_at
        FROM user_favorites
        WHERE user_id = $1 AND recipe_id = $2`,
            [userId, recipeId]
        );
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0] as RecipeDetail;
    };

    static async addFavorite(userId: number, recipe: RecipeDetail): Promise<any> {
        try {
            const openai = getOpenAI();
            // Helper function to strip HTML tags from Spoonacular's summary/instructions
            function stripHtml(html: string) {
                return html.replace(/<[^>]*>?/gm, '');
            }

            const ingredientsList = recipe.extendedIngredients.map((i: any) => i.nameClean || i.name).join(', ');
            const tagsList = [...(recipe.dishTypes || []), ...(recipe.cuisines || []), ...(recipe.diets || [])].join(', ');

            const textContext = `
                Title: ${recipe.title}
                Category: ${tagsList}
                Ready In: ${recipe.readyInMinutes} minutes
                Ingredients: ${ingredientsList}
                Description: ${stripHtml(recipe.summary || '')}
                Instructions: ${stripHtml(recipe.instructions || '')}
                `.trim();

            const embeddingResponse = await openai.embeddings.create({
                model: AI_MODELS.EMBEDDING,
                input: textContext
            });
            
            const embeddingVector = embeddingResponse.data[0]?.embedding;

            const result = await pool.query(
                `INSERT INTO user_favorites (
                user_id,
                recipe_id,
                title,
                image,
                summary,
                cuisines,
                dishTypes,
                readyInMinutes,
                servings,
                vegetarian,
                vegan,
                glutenFree,
                dairyFree,
                healthScore,
                pricePerServing,
                extendedIngredients,
                analyzedInstructions,
                nutrition,
                sourceUrl,
                embedding
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18 , $19, $20)
            ON CONFLICT (user_id, recipe_id) DO NOTHING
            RETURNING *`,
                [
                    userId,
                    recipe.id,
                    recipe.title,
                    recipe.image,
                    recipe.summary,
                    recipe.cuisines || [],
                    recipe.dishTypes || [],
                    recipe.readyInMinutes,
                    recipe.servings,
                    recipe.vegetarian,
                    recipe.vegan,
                    recipe.glutenFree,
                    recipe.dairyFree,
                    recipe.healthScore,
                    recipe.pricePerServing,
                    JSON.stringify(recipe.extendedIngredients || []),
                    JSON.stringify(recipe.analyzedInstructions || []),
                    JSON.stringify(recipe.nutrition || {}),
                    recipe.sourceUrl,
                    JSON.stringify(embeddingVector)
                ]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    };
    static async removeFavorite(userId: number, recipeId: number): Promise<any> {
        const result = await pool.query(
            'DELETE FROM user_favorites WHERE user_id = $1 AND recipe_id = $2 RETURNING *',
            [userId, recipeId]
        );
        return result.rows[0];
    };
    static async searchFavorites(userId: number, query: string): Promise<RecipeDetail[]> {
        const openai = getOpenAI();
        const embeddingResponse = await openai.embeddings.create({
            model: AI_MODELS.EMBEDDING,
            input: query
        });

        const queryEmbedding = embeddingResponse.data[0]?.embedding;

        const result = await pool.query(
            `SELECT
                recipe_id as id,
                title,
                image,
                summary,
                cuisines as "cuisines",
                dishTypes as "dishTypes",
                readyInMinutes as "readyInMinutes",
                servings,
                vegetarian,
                vegan,
                glutenFree as "glutenFree",
                dairyFree as "dairyFree",
                healthScore as "healthScore",
                pricePerServing as "pricePerServing",
                extendedIngredients as "extendedIngredients",
                analyzedInstructions as "analyzedInstructions",
                nutrition,
                sourceUrl as "sourceUrl",
                created_at,
                (embedding <=> $2::vector) AS similarity
            FROM user_favorites
            WHERE user_id = $1
            ORDER BY similarity ASC
            LIMIT 10`,
            [userId, JSON.stringify(queryEmbedding)]
        );
        return result.rows as RecipeDetail[];
    };
};