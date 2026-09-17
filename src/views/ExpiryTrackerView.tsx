import React from 'react';
import {
  Clock,
  AlertTriangle,
  Check,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GroceryItem } from '../types';
import { getCategoryEmoji, getStatusBadge } from '../utils/categoryHelpers';

export const ExpiryTrackerView: React.FC = () => {
  const {
    activeGroceries,
    getDaysRemaining,
    getItemStatus,
    markAsConsumed,
    setIsRecordWasteOpen,
    setItemToWaste,
    userProfile,
    setActiveView,
  } = useApp();

  // Buckets
  const expiredItems: GroceryItem[] = [];
  const todayItems: GroceryItem[] = [];
  const tomorrowItems: GroceryItem[] = [];
  const within3DaysItems: GroceryItem[] = [];
  const within7DaysItems: GroceryItem[] = [];
  const laterItems: GroceryItem[] = [];

  activeGroceries.forEach((item) => {
    const days = getDaysRemaining(item.expiryDate);
    if (days < 0) expiredItems.push(item);
    else if (days === 0) todayItems.push(item);
    else if (days === 1) tomorrowItems.push(item);
    else if (days <= 3) within3DaysItems.push(item);
    else if (days <= 7) within7DaysItems.push(item);
    else laterItems.push(item);
  });

  const renderItemCard = (item: GroceryItem, urgencyColor: string) => {
    const days = getDaysRemaining(item.expiryDate);
    const status = getItemStatus(item.expiryDate);
    const badge = getStatusBadge(status, days);

    return (
      <div
        key={item.id}
        id={`expiry-item-${item.id}`}
        className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between shadow-xs hover:shadow-sm ${urgencyColor}`}
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 bg-[#FBF9F5] rounded-xl border border-[#E8E4DA]">
                {getCategoryEmoji(item.category)}
              </span>
              <div>
                <h4 className="text-sm font-bold text-[#1A2820] leading-snug">
                  {item.name}
                </h4>
                <p className="text-xs text-[#52685B]">
                  {item.quantity} {item.unit} • {item.storageLocation}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-[#1A2820] font-mono">
              {userProfile.currency}{item.price}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#55695E] py-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#788C80]" />
              Expiry: {item.expiryDate}
            </span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-md border text-[10px] ${badge.bg}`}
            >
              {badge.text}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#F0EBE0] flex items-center justify-between gap-2">
          <button
            onClick={() => {
              setItemToWaste(item);
              setIsRecordWasteOpen(true);
            }}
            className="text-xs text-[#82968B] hover:text-red-700 py-1 px-2 rounded hover:bg-red-50 transition-colors"
          >
            Mark Wasted
          </button>
          <button
            onClick={() => markAsConsumed(item.id)}
            className="px-3 py-1.5 bg-[#3F6E4E] hover:bg-[#345B40] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Use Today</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner & "Use First" Recommendation */}
      <div className="bg-gradient-to-r from-[#EAF1EC] to-[#F5EFE6] rounded-3xl p-6 sm:p-7 border border-[#CDE0D2] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#2F543C] text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#3F6E4E]" />
              <span>Smart Recommendation: Use First</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A2820]">
              Prioritize items expiring in the next 48 hours
            </h2>
            <p className="text-xs sm:text-sm text-[#465E50] leading-relaxed">
              Consuming high-risk perishables first is the most effective single habit to cut grocery expenses and eliminate organic kitchen waste.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('recipes')}
              className="px-4 py-2.5 bg-[#3F6E4E] hover:bg-[#345B40] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Suggest Recipes for These</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-8">
        {/* 1. Expired Items (if any) */}
        {expiredItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-700">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-bold">
                Expired Groceries ({expiredItems.length})
              </h3>
              <span className="text-xs text-red-600 font-medium">
                – Inspect immediately
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {expiredItems.map((item) => renderItemCard(item, 'border-red-200 bg-red-50/20'))}
            </div>
          </div>
        )}

        {/* 2. Expiring Today */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <h3 className="text-base font-bold text-[#1A2820]">
                Expiring Today ({todayItems.length})
              </h3>
              <span className="text-xs text-[#52685B]">– Needs immediate use</span>
            </div>
          </div>

          {todayItems.length === 0 ? (
            <p className="text-xs text-[#718779] bg-white rounded-2xl p-4 border border-[#E8E4DA] italic">
              No items expiring today. Great job staying ahead!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayItems.map((item) => renderItemCard(item, 'border-red-200 bg-red-50/10'))}
            </div>
          )}
        </div>

        {/* 3. Expiring Tomorrow */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#DE7E36]" />
            <h3 className="text-base font-bold text-[#1A2820]">
              Expiring Tomorrow ({tomorrowItems.length})
            </h3>
            <span className="text-xs text-[#52685B]">– Plan for lunch or dinner</span>
          </div>

          {tomorrowItems.length === 0 ? (
            <p className="text-xs text-[#718779] bg-white rounded-2xl p-4 border border-[#E8E4DA] italic">
              No items expiring tomorrow.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tomorrowItems.map((item) => renderItemCard(item, 'border-[#FADCC7] bg-[#FFF8F3]'))}
            </div>
          )}
        </div>

        {/* 4. Within 3 Days */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <h3 className="text-base font-bold text-[#1A2820]">
              Expiring Within 3 Days ({within3DaysItems.length})
            </h3>
            <span className="text-xs text-[#52685B]">– Consume early this week</span>
          </div>

          {within3DaysItems.length === 0 ? (
            <p className="text-xs text-[#718779] bg-white rounded-2xl p-4 border border-[#E8E4DA] italic">
              No items expiring in 3 days.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {within3DaysItems.map((item) =>
                renderItemCard(item, 'border-amber-200 bg-amber-50/20')
              )}
            </div>
          )}
        </div>

        {/* 5. Within 7 Days */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3F6E4E]" />
            <h3 className="text-base font-bold text-[#1A2820]">
              Expiring Within 7 Days ({within7DaysItems.length})
            </h3>
            <span className="text-xs text-[#52685B]">– Fresh produce & dairy</span>
          </div>

          {within7DaysItems.length === 0 ? (
            <p className="text-xs text-[#718779] bg-white rounded-2xl p-4 border border-[#E8E4DA] italic">
              No items expiring within 7 days.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {within7DaysItems.map((item) => renderItemCard(item, 'border-[#D5E6DA]'))}
            </div>
          )}
        </div>

        {/* 6. Later (> 7 Days) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-stone-400" />
            <h3 className="text-base font-bold text-[#1A2820]">
              Longer Shelf Life ({laterItems.length})
            </h3>
            <span className="text-xs text-[#52685B]">– Grains, frozen goods, oils & staples</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {laterItems.slice(0, 8).map((item) => {
              const days = getDaysRemaining(item.expiryDate);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3 border border-[#E8E4DA] text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{getCategoryEmoji(item.category)}</span>
                    <span className="font-semibold text-[#1A2820] truncate">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#52685B] whitespace-nowrap">
                    {days}d left
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
