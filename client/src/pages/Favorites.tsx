import React from 'react';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import type { RecipeDetail } from '../types';
import { Button } from '../components/UI';
import { useNavigate } from 'react-router-dom';

const Favorites: React.FC = () => {
  const { favorites, removeFavorite } = useStore();
  const navigate = useNavigate();

  const handleView = (recipe: RecipeDetail) => {
    // Pass the full RecipeDetail object to preserve dishTypes and other data
    navigate(`/recipe/${recipe.id}`, { state: { summary: recipe, fromFavorites: true } });
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <header className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
           <Heart size={28} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Saved Recipes</h1>
          <p className="text-stone-500">Your curated collection of favorite meals.</p>
        </div>
      </header>

      {favorites.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-stone-200">
           <Heart size={48} className="mx-auto mb-4 text-stone-200" />
           <h3 className="text-xl font-semibold text-stone-900">No favorites yet</h3>
           <p className="text-stone-500 mb-6">Start browsing to save delicious recipes you love.</p>
           <Button onClick={() => navigate('/')}>Find Recipes</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {favorites.map(recipe => (
             <div key={recipe.id} className="group relative bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all">
                <div className="h-48 overflow-hidden relative">
                   <img 
                      src={`${recipe.image || recipe.title}`} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      alt={recipe.title} 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <Button onClick={() => handleView(recipe)} size="sm" className="w-full text-stone-900  hover:bg-stone-100 border-none shadow-lg">
                        View Recipe <ArrowRight size={16} className="ml-1" />
                      </Button>
                   </div>
                   <button 
                        onClick={(e) => { e.stopPropagation(); removeFavorite(recipe.id); }}
                        className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                   </button>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                   <h3 className="font-bold text-lg text-stone-900 mb-1 line-clamp-1">{recipe.title}</h3>
                   
                   <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-1 rounded-md">
                        {recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : 'Recipe'}
                      </span>
                      <span className="text-xs text-stone-400">{recipe.extendedIngredients?.length || 0} ingredients</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;