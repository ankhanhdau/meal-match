import React, { useState } from 'react';
import { Button, Input, Badge, RecipeSkeleton, Card } from '../components/UI';
import { Search, Sparkles, AlertCircle, Filter, Clock, ChevronDown, Check, Wand2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecipeService from '../services/recipeService';
import type { RecipeSummary, SearchFilters } from '../types';
import { useStore } from '../hooks/useStore';

const CUISINES = ['African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'];
const MEAL_TYPES = ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'marinade', 'fingerfood', 'snack', 'drink'];
const DIETS = [
  { value: 'gluten free', label: 'Gluten Free' },
  { value: 'ketogenic', label: 'Ketogenic' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'lacto-vegetarian', label: 'Lacto-Vegetarian' },
  { value: 'ovo-vegetarian', label: 'Ovo-Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescetarian', label: 'Pescetarian' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'low fodmap', label: 'Low FODMAP' },
  { value: 'primal', label: 'Primal' },
  { value: 'whole30', label: 'Whole30' }
];
const INTOLERANCES = [
  { value: 'dairy', label: 'Dairy' },
  { value: 'egg', label: 'Egg' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'grain', label: 'Grain' },
  { value: 'peanut', label: 'Peanut' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'sesame', label: 'Sesame' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'soy', label: 'Soy' },
  { value: 'sulfite', label: 'Sulfite' },
  { value: 'tree nut', label: 'Tree Nut' },
  { value: 'wheat', label: 'Wheat' }
];

const Dashboard: React.FC = () => {
  const { pantry } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [excludeInput, setExcludeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<RecipeSummary[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter State
  const [cuisine, setCuisine] = useState('');
  const [mealType, setMealType] = useState('');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>([]);
  const [maxReadyTime, setMaxReadyTime] = useState<number | ''>('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    setHasSearched(true);
    const ingredients = ingredientsInput
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(s => s !== '');

    const excludeIngredients = excludeInput
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(s => s !== '');

    const filters: SearchFilters = {
      query: query || undefined,
      includeIngredients: ingredients,
      excludeIngredients,
      cuisine: cuisine || undefined,
      type: mealType || undefined,
      diet: selectedDiets,
      intolerances: selectedIntolerances,
      maxReadyTime: maxReadyTime === '' ? undefined : Number(maxReadyTime)
    };

    try {
      const data = await RecipeService.searchRecipes(filters);
      setResults(data);
    } catch (error) {
      console.error('Recipe search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const usePantryIngredients = () => {
    const pantryList = pantry.map(p => p.name).join(', ');
    setIngredientsInput(pantryList);
  };

  const toggleList = (item: string, list: string[], setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleViewRecipe = (recipe: RecipeSummary) => {
    navigate(`/recipe/${recipe.id}`, { state: { summary: recipe } });
  };

  return (
    <div className="max-w-8xl mx-auto space-y-8 animate-fade-in pb-10">

      {/* Header */}
      <section className="text-center space-y-4 py-4">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
          What's your <span className="text-brand-500">craving</span> today?
        </h1>
        <p className="text-stone-500 max-w-xl mx-auto text-lg">
          Describe a vibe, a dish, or just look through your pantry.
          We'll handle the magic.
        </p>
      </section>

      {/* Main Search Panel */}
      <Card className="p-6 md:p-8 shadow-2xl shadow-stone-200/50 border-stone-200 overflow-visible">
        <form onSubmit={handleSearch} className="space-y-8">

          {/* Primary Natural Language Input */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-stone-700 uppercase tracking-widest">
              <Wand2 size={16} className="text-brand-500" /> What's on your mind?
            </label>
            <div className="relative">
              <textarea
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. A high-protein Mediterranean dinner that's quick to clean up..."
                className="w-full p-4 pl-5 rounded-2xl border border-stone-200 bg-white text-stone-900 placeholder-stone-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none transition-all resize-none text-lg leading-relaxed shadow-sm"
              />
            </div>
          </div>

          {/* Secondary Ingredient Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Include Ingredients</label>
              <button
                type="button"
                onClick={usePantryIngredients}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100"
              >
                + Use Pantry Ingredients
              </button>
            </div>
            <div className="relative">
              <Input
                value={ingredientsInput}
                onChange={(e) => setIngredientsInput(e.target.value)}
                placeholder="Chicken, Spinach, Garlic..."
                className="h-14 rounded-2xl pl-12 shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold transition-colors"
            >
              <Filter size={18} />
              <span>Advanced Filters</span>
              <ChevronDown className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} size={16} />
            </button>
          </div>

          {/* Filters Grid */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6 border-t border-stone-100 animate-slide-down">

              {/* Dropdowns Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Cuisine</label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-stone-200 bg-white text-stone-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Any Cuisine</option>
                    {CUISINES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Meal Type</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-stone-200 bg-white text-stone-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all appearance-none cursor-pointer capitalize"
                  >
                    <option value="">Any Meal Type</option>
                    {MEAL_TYPES.map(m => <option key={m} value={m.toLowerCase()}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Max Ready Time (mins)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="e.g. 45"
                      value={maxReadyTime}
                      onChange={(e) => setMaxReadyTime(e.target.value === '' ? '' : parseInt(e.target.value))}
                      className="pl-12"
                    />
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                  </div>
                </div>

                {/* Exclude Input */}
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Exclude Ingredients</label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. Mushrooms, Cilantro..."
                      value={excludeInput}
                      onChange={(e) => setExcludeInput(e.target.value)}
                      className="pl-11 border-stone-200"
                    />
                    <XCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                  </div>
                </div>
              </div>

              {/* Diets Column */}
              <div className="space-y-6 ">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Dietary Preferences</label>
                  <div className="flex flex-wrap gap-2">
                    {DIETS.map(diet => (
                      <button
                        key={diet.value}
                        type="button"
                        onClick={() => toggleList(diet.value, selectedDiets, setSelectedDiets)}
                        className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all border ${selectedDiets.includes(diet.value)
                          ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-200'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-brand-300'
                          }`}
                      >
                        {diet.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Intolerances Column */}
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Intolerances</label>
                <div className="grid grid-cols-2 gap-y-3">
                  {INTOLERANCES.map(intol => (
                    <label key={intol.value} className="flex items-center gap-3 group cursor-pointer">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${selectedIntolerances.includes(intol.value)
                        ? 'bg-brand-500 border-brand-500'
                        : 'bg-white border-stone-300 group-hover:border-brand-400'
                        }`}>
                        {selectedIntolerances.includes(intol.value) && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedIntolerances.includes(intol.value)}
                        onChange={() => toggleList(intol.value, selectedIntolerances, setSelectedIntolerances)}
                      />
                      <span className={`text-sm transition-colors ${selectedIntolerances.includes(intol.value) ? 'text-stone-900 font-bold' : 'text-stone-500 group-hover:text-stone-700'}`}>
                        {intol.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Search Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-80 h-16 rounded-2xl text-xl shadow-xl shadow-brand-500/20"
              isLoading={loading}
            >
              Discover Recipes
            </Button>
          </div>
        </form>
      </Card>

      {/* Results Section */}
      <section className="space-y-8 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-stone-900">
            {hasSearched ? 'Your Matches' : 'Trending Now'}
          </h2>
          {loading && (
            <div className="flex items-center gap-2 text-stone-400 font-medium">
              <Sparkles size={18} className="animate-pulse text-brand-500" />
              <span>Crafting recommendations...</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <RecipeSkeleton />
            <RecipeSkeleton />
            <RecipeSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!hasSearched && results.length === 0 ? (
              <div className="col-span-full py-24 text-center bg-white rounded-[2rem] border border-dashed border-stone-200">
                <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-500">
                  <Wand2 size={48} />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-2">Ready for a Culinary Adventure?</h3>
                <p className="text-stone-500 mb-8 max-w-sm mx-auto">Tell us what you're in the mood for or just hit search to see our pantry suggestions.</p>
                <Button onClick={() => handleSearch()} variant="secondary" size="lg" className="rounded-2xl">
                  Search from Pantry ({pantry.length} items)
                </Button>
              </div>
            ) : results.length === 0 ? (
              <div className="col-span-full text-center py-24 bg-stone-100/50 rounded-[2rem] border border-stone-200">
                <AlertCircle size={48} className="mx-auto text-stone-300 mb-4" />
                <h3 className="text-xl font-bold text-stone-900">No matches found</h3>
                <p className="text-stone-500">Try broadening your search or relaxing some filters.</p>
              </div>
            ) : (
              results.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleViewRecipe(recipe)}
                />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

const RecipeCard: React.FC<{ recipe: RecipeSummary; onClick: () => void }> = ({ recipe, onClick }) => {
  // Calculate match percentage
  const usedCount = recipe.usedIngredientCount || 0;
  const missedCount = recipe.missedIngredientCount || 0;
  const totalCount = usedCount + missedCount;
  const matchPercentage = totalCount === 0 ? 0 : Math.round((usedCount / totalCount) * 100);

  // Determine badge color based on match percentage
  let matchColor: 'success' | 'warning' | 'neutral' = 'neutral';
  if (matchPercentage >= 80) matchColor = 'success';
  else if (matchPercentage >= 50) matchColor = 'warning';

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden bg-stone-100">
        <img
          src={`${recipe.image || recipe.title}`}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={matchColor}>{matchPercentage}% Match</Badge>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-stone-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
            {recipe.title}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-stone-500 mb-4 mt-2">
          {recipe.usedIngredientCount > 0 ? (
            <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-full">
              <AlertCircle size={14} /> Missing {recipe.missedIngredientCount} items
            </div>
          ) : (
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Sparkles size={14} /> You have everything!
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-stone-50 flex flex-wrap gap-1">
          {/* Used Ingredients Tags */}
          {recipe.usedIngredients.slice(0, 3).map((ing, i) => (
            <span key={i} className="text-[10px] bg-brand-50 text-brand-700 px-2 py-1 rounded-md">
              {ing.name}
            </span>
          ))}
          {recipe.usedIngredientCount > 3 && (
            <span className="text-[10px] bg-stone-50 text-stone-500 px-2 py-1 rounded-md">
              +{recipe.usedIngredientCount - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;