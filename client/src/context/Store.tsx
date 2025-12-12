import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, PantryItem, RecipeDetail } from '../types';
import AuthService from '../services/authService.js';
import FavoriteService from '../services/favoritesService.js';
import PantryService from '../services/pantryService.js';
import { StoreContext } from './StoreContext';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [pantry, setPantry] = useState<PantryItem[]>([]);
    const [favorites, setFavorites] = useState<RecipeDetail[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user's favorites from server
    const loadUserFavorites = async () => {
        try {
            const userFavorites = await FavoriteService.getFavorites();
            setFavorites(userFavorites);
        } catch (error) {
            console.error('Failed to load favorites:', error);
            setFavorites([]); // Clear favorites on error
        }
    };

    //Load user's pantry from server
    const loadUserPantry = async () => {
        try {
            const userPantry = await PantryService.getUserPantry();
            setPantry(userPantry);
        }
        catch (error) {
            console.error('Failed to load pantry items:', error);
            setPantry([]); // Clear pantry on error
        }
    }

    // Fetch current user if token exists
    const fetchCurrentUser = async (authToken: string) => {
        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                // Load user's favorites after successful authentication
                await loadUserFavorites();
                await loadUserPantry();
            } else {
                // Token invalid, clear it
                localStorage.removeItem('token');
                setToken(null);
                setFavorites([]); // Clear favorites when token is invalid
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        } finally {
            setIsLoading(false);
        }
    };
    // On mount, check for token
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchCurrentUser(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const register = async (name: string, email: string, password: string) => {
        const data = await AuthService.register(name, email, password);
        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('token', data.accessToken);
        // Load user's favorites after registration (should be empty for new users)
        await loadUserFavorites();
        await loadUserPantry();
    }
    const login = async (email: string, password: string) => {
        const data = await AuthService.login(email, password);
        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('token', data.accessToken);
        // Load user's favorites after login
        await loadUserFavorites();
        await loadUserPantry();
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setFavorites([]); // Clear favorites on logout
        setPantry([]); // Clear pantry on logout
        localStorage.removeItem('token');
    };

    const addToPantry = async (name: string) => {
        if (pantry.some(i => i.name.toLowerCase() === name.toLowerCase())) return;
        try {
            const newItem = await PantryService.addPantryItem(name);
            setPantry([...pantry, newItem]);
        } catch (error) {
            console.error("Error adding pantry item:", error);
            throw error;
        }
    };

    const removeFromPantry = async (id: number) => {
        try {
            await PantryService.removePantryItem(id);
            setPantry(pantry.filter(i => i.id !== id));
        } catch (error) {
            console.error("Error removing pantry item:", error);
            throw error;
        }
    };

    const addFavorite = async (recipe: RecipeDetail) => {
        if (favorites.some(f => f.id === recipe.id)) {
            return;
        }
        try {
            await FavoriteService.addFavorite(recipe);
            setFavorites([...favorites, recipe]);
        } catch (error) {
            // Handle server response - if it says "already in favorites", that's ok
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (errorMessage.includes('already in favorites')) {
                setFavorites([...favorites, recipe]); // Add to local state anyway
            } else {
                throw error; // Re-throw other errors
            }
        }
    };

    const removeFavorite = async (id: number) => {
        try {
            await FavoriteService.removeFavorite(id);
            setFavorites(favorites.filter(f => f.id !== id));
        } catch (error) {
            console.error("Error removing favorite:", error);
            // Revert optimistic update if it fails
            throw error;
        }
    };

    const isFavorite = (id: number) => favorites.some(f => f.id === id);

    return (
        <StoreContext.Provider value={{
            user, token, register, login, logout,
            pantry, addToPantry, removeFromPantry,
            favorites, addFavorite, removeFavorite, isFavorite, isLoading
        }}>
            {children}
        </StoreContext.Provider>
    );
};
