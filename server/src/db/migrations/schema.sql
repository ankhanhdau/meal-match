CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    recipe_id INT NOT NULL,
    title TEXT NOT NULL,
    image TEXT,
    dishTypes TEXT [],
    readyInMinutes INT,
    servings INT,
    vegetarian BOOLEAN DEFAULT FALSE,
    vegan BOOLEAN DEFAULT FALSE,
    glutenFree BOOLEAN DEFAULT FALSE,
    dairyFree BOOLEAN DEFAULT FALSE,
    healthScore INT,
    pricePerServing NUMERIC,
    extendedIngredients JSONB,
    analyzedInstructions JSONB,
    nutrition JSONB,
    sourceUrl TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS pantry_items (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);