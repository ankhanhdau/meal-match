export interface Ingredient {
    id: number;
    name: string;
}

export interface InstructionStep {
    number: number;
    step: string;
}

export interface RecipeDetail {
    id: number;
    title: string;
    image: string;
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
    cuisines?: string[];
    diets?: string[];
    summary?: string;
    instructions?: string;
}