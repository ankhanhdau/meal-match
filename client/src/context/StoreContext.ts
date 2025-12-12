import { createContext } from 'react';
import type { User, PantryItem, RecipeDetail } from '../types';

export interface StoreContextType {
    user: User | null;
    token: string | null;
    register: (name: string, email: string, password: string) => void;
    login: (email: string, password: string) => void;
    logout: () => void;
    pantry: PantryItem[];
    addToPantry: (name: string) => void;
    removeFromPantry: (id: number) => void;
    favorites: RecipeDetail[];
    addFavorite: (recipe: RecipeDetail) => void;
    removeFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
    isLoading: boolean;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);