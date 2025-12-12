import type { Response } from 'express';
import PantryService from '../services/pantry-service.js';
import { type AuthenticatedRequest } from '../middlewares/auth-middleware.js';
import type { PantryItem } from '../types/pantry.js';

export default class PantryControler {
    // Get user pantry items
    static async getUserPantry(req: AuthenticatedRequest, res: Response): Promise<void | Response> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const pantryItems = await PantryService.getUserPantry(userId);
            res.json(pantryItems);
        } catch (error) {
            console.error('Error fetching pantry items:', error);
            res.status(500).json({ error: 'Failed to fetch pantry items' });
        }
    };

    // Add a pantry item
    static async addPantryItem(req: AuthenticatedRequest, res: Response): Promise<void | Response> {
        try {
            const userId = req.user?.userId;
            const itemName: string = req.body.name;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            if (!itemName || typeof itemName !== 'string') {
                return res.status(400).json({ error: 'Invalid pantry item name' });
            }

            const newItem: PantryItem = await PantryService.addPantryItem(userId, itemName);
            if (!newItem) {
                return res.status(500).json({ error: 'Failed to add pantry item' });
            }
            res.status(201).json(newItem);
        } catch (error) {
            console.error('Error adding pantry item:', error);
            res.status(500).json({ error: 'Failed to add pantry item' });
        }
    };

    // Remove a pantry item
    static async removePantryItem(req: AuthenticatedRequest, res: Response): Promise<void | Response> {
        try {
            const userId = req.user?.userId;
            const itemId = Number(req.params.id);

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            if (isNaN(itemId)) {
                return res.status(400).json({ error: 'Invalid pantry item ID' });
            }
            const deletedItemId = await PantryService.removePantryItem(userId, itemId);
            if (deletedItemId === null) {
                return res.status(404).json({ error: 'Pantry item not found' });
            }
            res.json({ message: 'Pantry item removed', itemId: deletedItemId });
        } catch (error) {
            console.error('Error removing pantry item:', error);
            res.status(500).json({ error: 'Failed to remove pantry item' });
        }
    };
};
