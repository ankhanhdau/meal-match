import OpenAI from 'openai';
import { env } from '../config/env-config.js';

let openaiInstance: OpenAI | null = null;

export function getOpenAI(): OpenAI {
    if (!openaiInstance) {
        const apiKey = env.OPENAI_API_KEY;
        
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY is not defined in environment variables');
        }
        
        openaiInstance = new OpenAI({
            apiKey: apiKey
        });
    }
    return openaiInstance;
}

export const AI_MODELS = {
  CHAT: "gpt-4o-mini",          // Use this for Zone 1 (Search Intent)
  EMBEDDING: "text-embedding-3-small" // Use this for Zone 2 (Favorites RAG)
};