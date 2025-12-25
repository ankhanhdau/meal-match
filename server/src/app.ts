import express from 'express';
import cors from 'cors';
import recipeRouter from './routes/recipe-routes.js';
import authRouter from './routes/auth-routes.js';
import favoritesRouter from './routes/favorites-routes.js';
import pantryRouter from './routes/pantry-routes.js';

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/recipes', recipeRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/pantry', pantryRouter);

export default app;