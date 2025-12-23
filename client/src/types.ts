export interface User {
    id: number;
    name: string;
    email: string;
}
export interface PantryItem {
    id: number;
    name: string;
}

export interface Ingredient {
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
}
export interface RecipeSummary {
    id: number;
    title: string;
    image: string;
    usedIngredients: Ingredient[];
    missedIngredients: Ingredient[];
}
interface InstructionStep {
    number: number;
    step: string;
}
export interface RecipeDetail extends RecipeSummary {
    summary: string;
    cuisines: string[];
    instructions: string;
    dishTypes: string[];
    readyInMinutes: number;
    servings: number;
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    healthScore: number;
    pricePerServing: number;
    extendedIngredients: Ingredient[];
    analyzedInstructions: {
        steps: InstructionStep[];
    }[];
    nutrition: {
        nutrients: {
            name: string;
            amount: number;
            unit: string;
        }[];
    };
    sourceUrl: string;
}