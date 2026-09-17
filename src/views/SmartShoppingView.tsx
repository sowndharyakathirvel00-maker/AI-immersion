import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Check,
  Trash2,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GroceryCategory } from '../types';
import { CATEGORIES, getCategoryEmoji } from '../utils/categoryHelpers';

export const SmartShoppingView: React.FC = () => {
  const {
    shoppingList,
    addShoppingItem,
    toggleShoppingItem,
    removeShoppingItem,
    moveShoppingItemToGroceries,
    recommendedPurchases,
    dontBuyYetItems,
    userProfile,
  } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<GroceryCategory>('Dairy');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('pieces');
  const [estimatedPrice, setEstimatedPrice] = useState<number>(45);
  const [notes, setNotes] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addShoppingItem({
      name: name.trim(),
      category,
      quantity: Number(quantity) || 1,
      unit,
      estimatedPrice: Number(estimatedPrice) || 0,
      isCompleted: false,
      notes: notes.trim(),
    });

    setName('');
    setQuantity(1);
    setEstimatedPrice(45);
    setNotes('');
  };

  const handleAddRecommended = (rec: {
    name: string;
    category: GroceryCategory;
    reason: string;
  }) => {
    addShoppingItem({
      name: rec.name,
      category: rec.category,
      quantity: 1,
      unit: rec.name.toLowerCase().includes('milk') ? 'Litre' : 'pack',
      estimatedPrice: rec.name.toLowerCase().includes('milk') ? 45 : 60,
      isCompleted: false,
      notes: rec.reason,
      addedFromRecommendation: true,
    });
  };

  const totalEstimatedCost = shoppingList.reduce(
    (sum, item) => sum + (item.isCompleted ? 0 : item.estimatedPrice || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="bg-[#FAF6ED] rounded-3xl p-6 sm:p-7 border border-[#E8E0D0] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#2F543C] text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#3F6E4E]" />
              <span>Smart Inventory Forecasting</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2820]">
              Shop Smarter 🛍️
            </h2>
            <p className="text-xs sm:text-sm text-[#52685B] leading-relaxed">
              Plan your replenishment based on consumption pace. Avoid duplicate purchases and keep your grocery budget lean.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E8E4DA] text-right">
            <span className="text-xs text-[#52685B] block">Pending Shopping Cost</span>
            <span className="text-2xl font-bold text-[#1A2820] font-mono">
              {userProfile.currency}{totalEstimatedCost}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Recommended Purchases & Don't Buy Yet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Recommended Purchases */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3F6E4E]" />
              <h3 className="text-base font-bold text-[#1A2820]">
                Recommended Purchases
              </h3>
            </div>
            <span className="text-[11px] text-[#55695E]">Based on household velocity</span>
          </div>

          <div className="space-y-3">
            {recommendedPurchases.map((rec, idx) => {
              const alreadyInList = shoppingList.some(
                (s) => s.name.toLowerCase().includes(rec.name.toLowerCase()) && !s.isCompleted
              );

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#F8FAF8] border border-[#D8E6DC] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1 bg-white rounded-xl shadow-xs">
                      {getCategoryEmoji(rec.category)}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A2820]">{rec.name}</h4>
                      <p className="text-xs text-[#3B5A45]">{rec.frequency}</p>
                      <p className="text-[11px] text-[#6E8276] italic">{rec.reason}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddRecommended(rec)}
                    disabled={alreadyInList}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      alreadyInList
                        ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                        : 'bg-[#3F6E4E] hover:bg-[#345B40] text-white shadow-xs'
                    }`}
                  >
                    {alreadyInList ? 'Added to List' : '+ Add to List'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Don't Buy Yet (Anti-Duplicate Purchases) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-[#DE7E36]" />
              <h3 className="text-base font-bold text-[#1A2820]">
                “Don't Buy Yet”
              </h3>
            </div>
            <span className="text-[11px] text-[#A24D14] font-medium">
              Prevent duplicate purchases
            </span>
          </div>

          <div className="space-y-3">
            {dontBuyYetItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#FCDDC8] flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl p-1 bg-white rounded-xl shadow-xs mt-0.5">
                    🍚
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A2820]">{item.name}</h4>
                    <p className="text-xs text-[#A24D14] font-medium">
                      Current Stock: {item.currentStock}
                    </p>
                    <p className="text-[11px] text-[#69564A] mt-0.5">{item.reason}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FCE2CE] text-[#8B400E] whitespace-nowrap">
                  Well Stocked
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Shopping List */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E4DA] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F0EBE0]">
          <div>
            <h3 className="text-lg font-bold text-[#1A2820] flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#3F6E4E]" />
              Interactive Grocery Shopping List
            </h3>
            <p className="text-xs text-[#52685B]">
              Check off items as you shop, or 1-click transfer them into your kitchen inventory!
            </p>
          </div>
          <span className="text-xs font-bold text-[#3F6E4E]">
            {shoppingList.filter((s) => s.isCompleted).length} / {shoppingList.length} completed
          </span>
        </div>

        {/* Add Shopping Item Form */}
        <form
          onSubmit={handleAddItem}
          className="bg-[#FAF8F3] p-4 rounded-2xl border border-[#E8E4DA] grid grid-cols-1 sm:grid-cols-12 gap-3"
        >
          <div className="sm:col-span-4">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name (e.g. Greek Yogurt, Oats)..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            />
          </div>

          <div className="sm:col-span-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GroceryCategory)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <input
              type="number"
              min="0.1"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
              placeholder="Qty"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            />
          </div>

          <div className="sm:col-span-2">
            <input
              type="number"
              min="0"
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(parseFloat(e.target.value) || 0)}
              placeholder={`Price (${userProfile.currency})`}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 bg-[#3F6E4E] hover:bg-[#345B40] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>
        </form>

        {/* Shopping List Items */}
        <div className="space-y-2.5">
          {shoppingList.length === 0 ? (
            <p className="text-center text-xs text-[#718779] py-8 italic">
              Your shopping list is empty. Add staples above or use the recommendations!
            </p>
          ) : (
            shoppingList.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.isCompleted
                    ? 'bg-[#F2EFE8]/70 border-[#E0DBCF] opacity-75'
                    : 'bg-white border-[#E8E4DA] shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleShoppingItem(item.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      item.isCompleted
                        ? 'bg-[#3F6E4E] border-[#3F6E4E] text-white'
                        : 'border-[#CAD6CE] bg-white text-transparent hover:border-[#3F6E4E]'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div>
                    <span
                      className={`text-sm font-bold text-[#1A2820] ${
                        item.isCompleted ? 'line-through text-[#6F8276]' : ''
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="text-xs text-[#52685B] ml-2">
                      ({item.quantity} {item.unit}) • {item.category}
                    </span>
                    {item.notes && (
                      <p className="text-[11px] text-[#697E72] italic">{item.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                  <span className="text-xs font-bold text-[#1A2820] font-mono">
                    {userProfile.currency}{item.estimatedPrice}
                  </span>

                  <button
                    onClick={() => moveShoppingItemToGroceries(item.id)}
                    title="Bought it! Move to Kitchen Groceries inventory"
                    className="px-3 py-1.5 bg-[#EAF1EC] hover:bg-[#D8E6DC] text-[#2F543C] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <PackageCheck className="w-3.5 h-3.5 text-[#3F6E4E]" />
                    <span>Moved to Pantry</span>
                  </button>

                  <button
                    onClick={() => removeShoppingItem(item.id)}
                    className="p-1.5 text-[#55695E] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
