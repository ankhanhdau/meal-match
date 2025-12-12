
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, Check, Heart, Leaf, DollarSign, Tag, ExternalLink } from 'lucide-react';
import RecipeService from '../services/recipeService';
import { useStore } from '../hooks/useStore';
import type { RecipeDetail, RecipeSummary } from '../types';
import { Card } from '../components/UI';

const RecipeDetails: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { addFavorite, removeFavorite, isFavorite } = useStore();
    const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
    const [loading, setLoading] = useState(true);

    // We expect summary to be passed in navigation state
    const summary: RecipeSummary = state?.summary;
    const fromFavorites: boolean = state?.fromFavorites || false;

    useEffect(() => {
        const fetchDetails = async () => {
            if (!summary) {
                navigate('/'); // Redirect if direct access without state
                return;
            }
            if (fromFavorites) {
                setRecipe(summary as RecipeDetail);
                setLoading(false);
                return;
            }
            const details = await RecipeService.getRecipeDetails(summary.id);
            setRecipe(details);
            setLoading(false);
        };

        fetchDetails();
    }, [summary, fromFavorites, navigate]);

    if (!summary) return null;

    const isFav = recipe ? isFavorite(recipe.id) : false;

    const toggleFav = () => {
        if (!recipe) return;
        if (isFav) removeFavorite(recipe.id);
        else addFavorite(recipe);
    };

    const getNutrient = (name: string) => {
        return recipe?.nutrition.nutrients.find(n => n.name.toLowerCase().includes(name.toLowerCase()));
    };

    const steps = recipe?.analyzedInstructions?.[0]?.steps || [];

    return (
        <div className="max-w-6xl mx-auto pb-10 animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
            >
                <ArrowLeft size={20} /> {fromFavorites ? "Back to Favorites" : "Back to Search"}
            </button>

            {/* Hero Image Section */}
            <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-8 shadow-xl">
                <img
                    src={`${summary.image || summary.title}`}
                    alt={summary.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-shadow-lg leading-tight">{summary.title}</h1>
                    <div className="flex flex-wrap gap-3">
                        {recipe?.dishTypes?.map((type, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm capitalize">
                                <Tag size={12} /> {type}
                            </span>
                        ))}
                        {recipe?.vegetarian && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-md border border-green-400/30 text-green-100 text-sm"><Leaf size={14} /> Vegetarian</span>}
                        {recipe?.vegan && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-700/20 backdrop-blur-md border border-green-600/30 text-green-100 text-sm"><Leaf size={14} /> Vegan</span>}
                        {recipe?.dairyFree && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-400/30 text-purple-100 text-sm">Dairy Free</span>}
                        {recipe?.glutenFree && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-100 text-sm">Gluten Free</span>}
                        {recipe?.healthScore && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-100 text-sm">Health Score: {recipe.healthScore}</span>}
                    </div>
                </div>
                <div className="absolute top-6 right-6 flex gap-3">
                    {recipe?.sourceUrl && (
                        <a
                            href={recipe.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all"
                            title="View Source"
                        >
                            <ExternalLink size={24} />
                        </a>
                    )}
                    <button
                        onClick={toggleFav}
                        className={`p-3 rounded-full backdrop-blur-md transition-all ${isFav ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                    >
                        <Heart size={24} fill={isFav ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Instructions & Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center text-center">
                            <Clock className="text-brand-500 mb-2" size={24} />
                            <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Time</span>
                            <span className="font-bold text-stone-800 text-lg">
                                {loading ? "..." : recipe ? `${recipe.readyInMinutes}m` : '0m'}
                            </span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center text-center">
                            <Users className="text-brand-500 mb-2" size={24} />
                            <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Servings</span>
                            <span className="font-bold text-stone-800 text-lg">{loading ? "..." : recipe?.servings || 2}</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center text-center">
                            <DollarSign className="text-brand-500 mb-2" size={24} />
                            <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Price/Serv</span>
                            <span className="font-bold text-stone-800 text-lg">{loading ? "..." : recipe ? `$${recipe.pricePerServing}` : '$0'}</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center text-center">
                            <ChefHat className="text-brand-500 mb-2" size={24} />
                            <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Steps</span>
                            <span className="font-bold text-stone-800 text-lg">{loading ? "..." : steps.length}</span>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div>
                        <h2 className="text-2xl font-bold text-stone-900 mb-6">Preparation</h2>
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-stone-200 rounded-xl animate-pulse"></div>)}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {steps.length ? (
                                    steps.map((step) => (
                                        <div key={step.number} className="flex gap-4 group">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg border border-brand-100 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                                {step.number}
                                            </div>
                                            <div className="pt-2">
                                                <p className="text-stone-700 leading-relaxed text-lg">{step.step}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-stone-500 italic">No detailed instructions available.</p>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Col: Ingredients Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-24">
                        <h3 className="font-bold text-xl text-stone-900 mb-6">Ingredients</h3>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 bg-stone-200 rounded animate-pulse"></div>)}
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {recipe?.extendedIngredients?.map((ing, idx) => {
                                    const isOwned = (summary?.usedIngredients || []).some(ui => ui.id === ing.id);
                                    return (
                                        <li key={`${ing.id}-${idx}`} className="flex items-start gap-3 text-sm group">
                                            {!fromFavorites && <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border ${isOwned ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300 text-transparent'}`}>
                                                <Check size={12} strokeWidth={4} />
                                            </div>}
                                            <div className="flex-1">
                                                <p className={`font-medium ${isOwned ? 'text-stone-900' : 'text-stone-600'}`}>{ing.original}</p>
                                                <p className="text-xs text-stone-400">{ing.amount} {ing.unit}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        <div className="mt-8 pt-6 border-t border-stone-100">
                            <h4 className="font-semibold text-stone-900 mb-4">Nutrition Facts</h4>
                            {loading ? (
                                <div className="space-y-2">
                                    <div className="h-4 bg-stone-200 rounded animate-pulse w-full"></div>
                                    <div className="h-4 bg-stone-200 rounded animate-pulse w-3/4"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-stone-50 p-3 rounded-xl">
                                        <span className="block text-xs text-stone-500 mb-1">Calories</span>
                                        <span className="block font-bold text-stone-800">{getNutrient('Calories')?.amount} {getNutrient('Calories')?.unit}</span>
                                    </div>
                                    <div className="bg-stone-50 p-3 rounded-xl">
                                        <span className="block text-xs text-stone-500 mb-1">Protein</span>
                                        <span className="block font-bold text-stone-800">{getNutrient('Protein')?.amount}{getNutrient('Protein')?.unit}</span>
                                    </div>
                                    <div className="bg-stone-50 p-3 rounded-xl">
                                        <span className="block text-xs text-stone-500 mb-1">Fat</span>
                                        <span className="block font-bold text-stone-800">{getNutrient('Fat')?.amount}{getNutrient('Fat')?.unit}</span>
                                    </div>
                                    <div className="bg-stone-50 p-3 rounded-xl">
                                        <span className="block text-xs text-stone-500 mb-1">Carbs</span>
                                        <span className="block font-bold text-stone-800">{getNutrient('Carbohydrates')?.amount}{getNutrient('Carbohydrates')?.unit}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default RecipeDetails;