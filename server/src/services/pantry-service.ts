import {pool} from '../db/connection.js';
import type { PantryItem } from '../types/pantry.js';

export default class PantryService {
    static async getUserPantry(userId: number): Promise<PantryItem[]> {
        const result = await pool.query(
            `SELECT id, name, created_at
             FROM pantry_items
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows as PantryItem[];
    };

    static async addPantryItem(userId: number, name: string): Promise<PantryItem> {
        const result = await pool.query(
            `INSERT INTO pantry_items (user_id, name)
             VALUES ($1, $2)
             RETURNING id, user_id, name, created_at`,
            [userId, name]
        );
        return result.rows[0] as PantryItem;
    };

    static async removePantryItem(userId: number, itemId: number): Promise<void> {
        await pool.query(
            `DELETE FROM pantry_items
             WHERE user_id = $1 AND id = $2`,
            [userId, itemId]
        );
    };
};