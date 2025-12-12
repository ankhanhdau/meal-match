import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env-config.js';
import pool from '../db/connection.js';
import type { User } from '../types/user.js';
import type { AuthTokens } from '../types/auth.js';

const saltRounds = env.BCRYPT_SALT_ROUNDS;
const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;

export default class AuthService {
    static async register(name: string, email: string, password: string): Promise<AuthTokens> {
        const existingUser = await pool.query('SELECT id FROM users WHERE email =$1', [email]);
        if (existingUser.rows.length) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );
        const user: User = result.rows[0];

        // Validate environment variables
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }

        if (!JWT_EXPIRES_IN) {
            throw new Error('JWT_EXPIRES_IN environment variable is not defined');
        }

        const payload = { userId: user.id, email: user.email };
        const secret = JWT_SECRET as string;

        const accessToken = jwt.sign(
            payload,
            secret,
            { expiresIn: JWT_EXPIRES_IN as any }
        );
        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    };
    
    static async login(email: string, password: string): Promise<AuthTokens> {
        const result = await pool.query(
            'SELECT id, name, email, password_hash FROM users WHERE email = $1',
            [email]
        );
        if (result.rows.length === 0) {
            throw new Error('Invalid email or password');
        }
        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Validate environment variables
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        if (!JWT_EXPIRES_IN) {
            throw new Error('JWT_EXPIRES_IN environment variable is not defined');
        }

        const payload = { userId: user.id, email: user.email };
        const secret = JWT_SECRET as string;
        const accessToken = jwt.sign(
            payload,
            secret,
            { expiresIn: JWT_EXPIRES_IN as any }
        );
        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    };

    static verifyToken(token: string): { userId: number; email: string } {
        try {
            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET environment variable is not defined');
            }
            const secret = JWT_SECRET as string;
            const decoded = jwt.verify(token, secret) as { userId: number; email: string };
            return decoded;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    };

    static async getUserById(userId: number): Promise<User | null> {
        const result = await pool.query(
            'SELECT id, name, email FROM users WHERE id = $1',
            [userId]
        );
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    };
};