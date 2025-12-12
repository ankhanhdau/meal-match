import { Router } from "express";
import FavoritesController from "../controllers/favorites-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const favoritesRouter = Router();

// Get user favorites
favoritesRouter.get("/", authMiddleware, FavoritesController.getUserFavorites);

// Get user favorites recipe by ID
favoritesRouter.get("/:id", authMiddleware, FavoritesController.getFavoriteById);

// Add a favorite
favoritesRouter.post("/", authMiddleware, FavoritesController.addFavorite);

// Remove a favorite
favoritesRouter.delete("/:id", authMiddleware, FavoritesController.removeFavorite);

export default favoritesRouter;