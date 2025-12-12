import pool from '../db/connection.js';
import type { RecipeDetail } from '../types/recipes.js';

export default class FavoritesService {
    static async getUserFavorites(userId: number): Promise<RecipeDetail[]> {
        const result = await pool.query(
            `SELECT
            recipe_id as id,
            title,
            image,
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
        const result = await pool.query(
            `INSERT INTO user_favorites (
                user_id,
                recipe_id,
                title,
                image,
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
                sourceUrl
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            ON CONFLICT (user_id, recipe_id) DO NOTHING
            RETURNING *`,
            [
                userId,
                recipe.id,
                recipe.title,
                recipe.image,
                Array.isArray(recipe.dishTypes) ? recipe.dishTypes : [], // Ensure array format for PostgreSQL TEXT[]
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
                recipe.sourceUrl
            ]
        );
        return result;
    };
    static async removeFavorite(userId: number, recipeId: number): Promise<any> {
        const result = await pool.query(
            'DELETE FROM user_favorites WHERE user_id = $1 AND recipe_id = $2 RETURNING *',
            [userId, recipeId]
        );
        return result;;
    };
};