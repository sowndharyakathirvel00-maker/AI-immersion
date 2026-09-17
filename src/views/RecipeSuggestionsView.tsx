import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Clock,
  Flame,
  Bookmark,
  Check,
  ChefHat,
  Sparkles,
  ArrowRight,
  Info,
  X,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Recipe } from '../types';

export const RecipeSuggestionsView: React.FC = () => {
  const {
    recipes,
    expiringSoonGroceries,
    cookRecipe,
    savedRecipeIds,
    toggleSaveRecipe,
    setActiveView,
  } = useApp();

  const [activeRecipeModal, setActiveRecipeModal] = useState<Recipe | null>(null);

  // Extract unique expiring ingredients
  const expiringIngredientNames = Array.from(
    new Set(expiringSoonGroceries.map((g) => g.name))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="bg-[#FAF6ED] rounded-3xl p-6 sm:p-8 border border-[#E8E0D0] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#2F543C] text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#3F6E4E]" />
              <span>Smart Pantry Matcher</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2820]">
              Cook Before It Expires 🍳
            </h2>
            <p className="text-xs sm:text-sm text-[#52685B] leading-relaxed">
              We cross-referenced your pantry with items expiring in the next 3 days. Cooking these meals rescues food before it spoils.
            </p>
          </div>

          <button
            onClick={() => setActiveView('groceries')}
            className="px-4 py-2.5 bg-white hover:bg-[#F2EFE8] text-xs font-semibold text-[#283A2E] rounded-xl border border-[#D5DDD7] transition-colors whitespace-nowrap self-start md:self-center"
          >
            Check Full Inventory →
          </button>
        </div>

        {/* Expiring Ingredients Pills */}
        <div className="mt-6 pt-5 border-t border-[#ECE4D5]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-[#1A2820]">
              You have {expiringSoonGroceries.length} ingredients that should be used soon:
            </span>
            <span className="text-[11px] text-[#A24D14] font-semibold">
              High Priority
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {expiringSoonGroceries.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#FADCC7] text-xs font-medium text-[#1A2820] shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-[#DE7E36]" />
                <span className="font-semibold">{item.name}</span>
                <span className="text-[11px] text-[#8C7A6E]">
                  ({item.quantity} {item.unit})
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#1A2820] flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#3F6E4E]" />
            Recommended Recipes for Today
          </h3>
          <span className="text-xs text-[#52685B]">
            Sorted by rescue priority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((recipe) => {
            const isSaved = savedRecipeIds.includes(recipe.id);

            return (
              <div
                key={recipe.id}
                id={`recipe-card-${recipe.id}`}
                className="bg-white rounded-3xl overflow-hidden border border-[#E8E4DA] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Recipe Image & Tags */}
                  <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                    {recipe.imageUrl ? (
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#EAF1EC] text-[#3F6E4E] text-4xl">
                        🍳
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleSaveRecipe(recipe.id)}
                      title={isSaved ? 'Remove from saved' : 'Save Recipe'}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#1A2820] hover:bg-white shadow-xs transition-colors"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isSaved ? 'fill-[#3F6E4E] text-[#3F6E4E]' : 'text-[#52685B]'
                        }`}
                      />
                    </button>

                    {/* Prep Time & Calories Pill */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D3E2D6]" />
                        {recipe.prepTime}
                      </span>
                      {recipe.calories && (
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-400" />
                          {recipe.calories} kcal
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h4 className="text-base font-bold text-[#1A2820] leading-snug mb-1.5 group-hover:text-[#3F6E4E] transition-colors">
                      {recipe.title}
                    </h4>
                    <p className="text-xs text-[#52685B] line-clamp-2 leading-relaxed mb-4">
                      {recipe.description}
                    </p>

                    {/* Rescues Badge */}
                    <div className="p-3 rounded-2xl bg-[#FFF8F3] border border-[#FCDDC8] mb-4">
                      <span className="text-[10px] uppercase font-bold text-[#A24D14] tracking-wider block mb-1.5">
                        🔥 Rescues from your pantry:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.expiringIngredientsUsed.map((ing) => (
                          <span
                            key={ing}
                            className="px-2 py-0.5 rounded-md bg-white border border-[#F5CDAD] text-[11px] font-semibold text-[#8B400E]"
                          >
                            ✓ {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ingredients summary */}
                    <div className="text-xs text-[#55695E]">
                      <span className="font-semibold text-[#1A2820]">Ingredients: </span>
                      {recipe.ingredients.map((i) => i.name).join(', ')}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 pt-0 border-t border-[#F2EEE4] mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setActiveRecipeModal(recipe)}
                    className="flex-1 py-2 px-3 bg-[#F4EFE6] hover:bg-[#EAE5D9] text-xs font-semibold text-[#283A2E] rounded-xl transition-colors text-center"
                  >
                    View Recipe Steps
                  </button>
                  <button
                    onClick={() => cookRecipe(recipe)}
                    className="flex-1 py-2 px-3 bg-[#3F6E4E] hover:bg-[#345B40] text-xs font-semibold text-white rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Cooked It!</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recipe Steps Modal */}
      {activeRecipeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn overflow-y-auto"
          onClick={() => setActiveRecipeModal(null)}
        >
          <div
            className="w-full max-w-lg bg-[#FBF9F5] rounded-3xl shadow-2xl border border-[#E8E4DA] p-6 max-h-[90vh] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DA]">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#3F6E4E]" />
                <h3 className="text-base font-bold text-[#1A2820]">
                  {activeRecipeModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveRecipeModal(null)}
                className="p-1.5 rounded-lg text-[#52685B] hover:bg-[#EAE5D9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {/* Recipe Meta */}
              <div className="flex items-center gap-3 text-xs text-[#52685B]">
                <span className="px-2.5 py-1 rounded-lg bg-[#EAE5D9] font-medium">
                  ⏱️ Prep: {activeRecipeModal.prepTime}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#EAE5D9] font-medium">
                  👥 Serves: {activeRecipeModal.servings}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#EAE5D9] font-medium">
                  🎯 Level: {activeRecipeModal.difficulty}
                </span>
              </div>

              {/* Ingredients List */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E4DA]">
                <h4 className="text-xs font-bold text-[#1A2820] uppercase tracking-wider mb-2.5">
                  Required Ingredients
                </h4>
                <ul className="space-y-1.5">
                  {activeRecipeModal.ingredients.map((ing, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-[#283A2E] flex items-center justify-between py-1 border-b border-[#FAF7F0] last:border-0"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3F6E4E]" />
                        {ing.name}
                      </span>
                      <span className="font-mono text-[#55695E]">{ing.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <h4 className="text-xs font-bold text-[#1A2820] uppercase tracking-wider mb-3">
                  Step-by-Step Preparation
                </h4>
                <ol className="space-y-3">
                  {activeRecipeModal.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-[#283A2E]">
                      <span className="w-5 h-5 rounded-full bg-[#3F6E4E] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed flex-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#E8E4DA] flex items-center justify-between gap-3">
              <button
                onClick={() => toggleSaveRecipe(activeRecipeModal.id)}
                className="px-4 py-2 bg-white border border-[#D5DDD7] hover:bg-[#F2EFE8] text-xs font-semibold text-[#283A2E] rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#3F6E4E]" />
                <span>
                  {savedRecipeIds.includes(activeRecipeModal.id) ? 'Saved' : 'Save Recipe'}
                </span>
              </button>

              <button
                onClick={() => {
                  cookRecipe(activeRecipeModal);
                  setActiveRecipeModal(null);
                }}
                className="px-5 py-2 bg-[#3F6E4E] hover:bg-[#345B40] text-xs font-semibold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark As Cooked (Deduct from Pantry)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
