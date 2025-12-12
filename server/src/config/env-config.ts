import dotenv from 'dotenv';

dotenv.config();

export const env = {
    SPOONACULAR_API_KEY: process.env.SPOONACULAR_API_KEY as string,
    PORT: Number(process.env.PORT) || 3001,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string ?? "7d",
    BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    REDIS_HOST: process.env.REDIS_HOST as string || 'localhost',
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    DB_USER: process.env.DB_USER as string,
    DB_PASSWORD: process.env.DB_PASSWORD as string,
    DB_HOST: process.env.DB_HOST as string || 'localhost',
    DB_PORT: Number(process.env.DB_PORT) || 5432,
    DB_NAME: process.env.DB_NAME as string,
};