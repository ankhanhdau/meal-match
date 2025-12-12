
import React, { useState } from 'react';
import { Plus, Trash2, PackageOpen } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { Button, Input, Card } from '../components/UI';

const Pantry: React.FC = () => {
  const { pantry, addToPantry, removeFromPantry } = useStore();
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addToPantry(inputValue.trim());
      setInputValue('');
    }
  };

  const commonIngredients = [
    "Eggs", "Milk", "Flour", "Rice", "Chicken", "Tomatoes", "Onions", "Garlic", "Cheese", "Pasta", "Butter", "Olive Oil"
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">My Pantry</h1>
        <p className="text-stone-500">Manage your available ingredients to get better recipe matches.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Add Ingredients */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4">Add Ingredient</h2>
            <form onSubmit={handleAdd} className="flex gap-2 mb-6">
              <Input 
                placeholder="e.g. Avocado" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="md" variant="secondary" className="px-3">
                <Plus size={20} />
              </Button>
            </form>

            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Quick Add</p>
              <div className="flex flex-wrap gap-2">
                {commonIngredients.map(item => (
                  <button
                    key={item}
                    onClick={() => addToPantry(item)}
                    disabled={pantry.some(p => p.name.toLowerCase() === item.toLowerCase())}
                    className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed border border-stone-200 rounded-lg text-sm text-stone-700 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: List */}
        <div className="md:col-span-2">
          <Card className="min-h-[400px]">
             <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
               <div className="flex items-center gap-2 text-stone-500">
                 <PackageOpen size={18} />
                 <span className="font-medium">{pantry.length} Items in Pantry</span>
               </div>
             </div>
             
             {pantry.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-64 text-stone-400">
                 <PackageOpen size={48} strokeWidth={1} className="mb-4 text-stone-300" />
                 <p>Your pantry is empty.</p>
                 <p className="text-sm">Add items to start discovering recipes.</p>
               </div>
             ) : (
               <ul className="divide-y divide-stone-100">
                 {pantry.map((item) => (
                   <li key={item.id} className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group">
                     <span className="font-medium text-stone-700 capitalize">{item.name}</span>
                     <button 
                      onClick={() => removeFromPantry(item.id)}
                      className="text-stone-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                     >
                       <Trash2 size={18} />
                     </button>
                   </li>
                 ))}
               </ul>
             )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pantry;