import React, { useState } from 'react';
import { Button, Input, Badge , RecipeSkeleton} from '../components/UI';
import { Search, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Recipe from '../services/recipeService';
import type { RecipeSummary } from '../types';
import { useStore } from '../hooks/useStore';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { pantry } = useStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<RecipeSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Combine manual query with pantry items
    const ingredientsToSearch = [...pantry.map(i => i.name)];
    if (query) {
      query.split(',').forEach(s => ingredientsToSearch.push(s.trim()));
    }

    if (ingredientsToSearch.length === 0) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      const data = await Recipe.searchRecipes(ingredientsToSearch);
      setResults(data);
    } catch (error) {
      console.error('Recipe search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecipe = (recipe: RecipeSummary) => {
    navigate(`/recipe/${recipe.id}`, { state: { summary: recipe } });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
          What are we cooking <span className="text-brand-500">today?</span>
        </h1>
        <p className="text-lg text-stone-500 max-w-2xl mx-auto">
          We found <span className="font-semibold text-brand-600">{pantry.length} items</span> in your pantry. 
          Let our chef suggest the perfect meal.
        </p>

        <div className="max-w-xl mx-auto relative">
          <form onSubmit={handleSearch} className="relative">
             <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Add extra ingredients (e.g. 'Spinach, Lemon')..."
                className="pl-12 pr-32 h-14 rounded-full shadow-lg border-transparent focus:border-brand-300 ring-offset-2"
             />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
             <div className="absolute right-2 top-2 bottom-2">
               <Button type="submit" size="md" className="h-full rounded-full px-6" isLoading={loading}>
                 Match
               </Button>
             </div>
          </form>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
             {pantry.slice(0, 5).map(i => (
               <span key={i.id} className="text-xs px-2 py-1 bg-white border border-stone-200 rounded-full text-stone-500">
                 {i.name}
               </span>
             ))}
             {pantry.length > 5 && <span className="text-xs text-stone-400 py-1">+{pantry.length - 5} more</span>}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            {hasSearched ? 'Suggested Recipes' : 'Popular Ideas'}
            {loading && <span className="text-sm font-normal text-stone-400 ml-2">Thinking...</span>}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecipeSkeleton />
            <RecipeSkeleton />
            <RecipeSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!hasSearched && results.length === 0 ? (
               // Empty State / Initial Prompt
               <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-stone-200">
                  <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-500">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900">Ready to Discover?</h3>
                  <p className="text-stone-500 mb-6">Add ingredients to your pantry or search above to get started.</p>
                  <Button onClick={() => handleSearch()} variant="secondary">
                    Use My Pantry ({pantry.length} items)
                  </Button>
               </div>
            ) : results.length === 0 ? (
               <div className="col-span-full text-center py-12">
                 <p className="text-stone-500">No matching recipes found. Try adding more diverse ingredients.</p>
               </div>
            ) : (
              results.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} onClick={() => handleViewRecipe(recipe)} />
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
  const usedCount = recipe.usedIngredients?.length || 0;
  const missedCount = recipe.missedIngredients?.length || 0;
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
          {recipe.missedIngredients.length > 0 ? (
             <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-full">
               <AlertCircle size={14} /> Missing {recipe.missedIngredients.length} items
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
           {recipe.usedIngredients.length > 3 && (
             <span className="text-[10px] bg-stone-50 text-stone-500 px-2 py-1 rounded-md">
               +{recipe.usedIngredients.length - 3}
             </span>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;