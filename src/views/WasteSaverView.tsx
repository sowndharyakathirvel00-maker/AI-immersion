import React, { useState } from 'react';
import {
  Recycle,
  Trash2,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  Info,
  Plus,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GroceryCategory, WasteReason } from '../types';
import { CATEGORIES, getCategoryEmoji } from '../utils/categoryHelpers';

const REASONS: WasteReason[] = [
  'Expired',
  'Spoiled',
  'Cooked too much',
  "Didn't like it",
  'Bought too much',
  'Other',
];

export const WasteSaverView: React.FC = () => {
  const {
    wasteSaverScore,
    wasteRecords,
    recordManualWaste,
    userProfile,
    expiredGroceries,
    activeGroceries,
  } = useApp();

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<GroceryCategory>('Vegetables');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('pieces');
  const [price, setPrice] = useState<number>(35);
  const [reason, setReason] = useState<WasteReason>('Expired');

  const handleRecordWaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    recordManualWaste({
      itemName: itemName.trim(),
      category,
      quantity: Number(quantity) || 1,
      unit,
      price: Number(price) || 0,
      reason,
    });

    setItemName('');
    setPrice(35);
  };

  const totalWasteLoss = wasteRecords.reduce((sum, r) => sum + (r.price || 0), 0);

  // SVG circular calculation
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (wasteSaverScore / 100) * circumference;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="bg-[#FAF6ED] rounded-3xl p-6 sm:p-7 border border-[#E8E0D0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#2F543C] text-xs font-bold shadow-xs mb-2">
            <Recycle className="w-3.5 h-3.5 text-[#3F6E4E]" />
            <span>Zero-Waste Kitchen Tracker</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A2820]">
            Waste Saver & Food Recording
          </h2>
          <p className="text-xs text-[#52685B]">
            Maintain your sustainability score, record discarded food, and build actionable zero-waste kitchen habits.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E4DA] text-right">
          <span className="text-xs text-[#52685B] block">Total Recorded Waste</span>
          <span className="text-2xl font-bold text-red-600 font-mono">
            {userProfile.currency}{totalWasteLoss}
          </span>
        </div>
      </div>

      {/* Grid: Large Circular Score & Score Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Circular Score Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DA] shadow-xs flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3F6E4E] mb-4">
            Sustainable Kitchen Index
          </span>

          {/* SVG Circular Progress */}
          <div className="relative w-44 h-44 my-2 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="#EFEBE2"
                strokeWidth="12"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="#3F6E4E"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-[#1A2820] font-mono">
                {wasteSaverScore}
              </span>
              <span className="text-xs font-semibold text-[#52685B]">
                / 100
              </span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#1A2820] mt-3">
            ♻️ Waste Saver Score
          </h3>
          <p className="text-xs text-[#4F6457] mt-1 italic">
            “Great! You consumed most groceries before expiry.”
          </p>

          <div className="mt-5 w-full p-3 rounded-2xl bg-[#F8FAF8] border border-[#D8E6DC] text-left text-xs text-[#2F543C] space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#3F6E4E]" />
              Status: Excellent Preservation
            </div>
            <p className="text-[11px] text-[#55695E]">
              You are on pace to save ~₹540 in grocery waste this month.
            </p>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#F7F4EC] border border-[#E8E4DA] text-[10px] text-[#63796D] flex items-start gap-1.5 text-left">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#55695E]" />
            <span>
              This is a project-defined metric calculated from your inventory turnover, consumption logs, and waste reports. It does not represent a medically or scientifically validated index.
            </span>
          </div>
        </div>

        {/* Score Breakdown & Tips */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-[#1A2820] uppercase tracking-wider">
              Score Drivers & Assessment
            </h4>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#F8FAF8] border border-[#D5E6DA] flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1A2820]">
                    1. Consumed Before Expiry Rate
                  </h5>
                  <p className="text-[11px] text-[#55695E]">
                    Percentage of fresh goods eaten or cooked into recipes.
                  </p>
                </div>
                <span className="text-sm font-bold text-[#2F543C] font-mono">
                  92% (+38 pts)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1A2820]">
                    2. Unaddressed Expired Items
                  </h5>
                  <p className="text-[11px] text-[#55695E]">
                    {expiredGroceries.length} expired item(s) currently sitting in inventory.
                  </p>
                </div>
                <span className="text-sm font-bold text-amber-700 font-mono">
                  -4 pts
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1A2820]">
                    3. Logged Food Waste Ratio
                  </h5>
                  <p className="text-[11px] text-[#55695E]">
                    {wasteRecords.length} recorded discard incident(s) this month.
                  </p>
                </div>
                <span className="text-sm font-bold text-amber-700 font-mono">
                  -8 pts
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF8] border border-[#D5E6DA] flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#1A2820]">
                    4. Shopping Replenishment Efficiency
                  </h5>
                  <p className="text-[11px] text-[#55695E]">
                    Anti-duplicate checking avoids over-buying pantry staples.
                  </p>
                </div>
                <span className="text-sm font-bold text-[#2F543C] font-mono">
                  High (+16 pts)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Zero-Waste Habits */}
          <div className="bg-[#F4EFE6] rounded-3xl p-6 border border-[#E3DCCF]">
            <h4 className="text-xs font-bold text-[#1A2820] uppercase tracking-wider mb-2.5">
              Pro Tips to Reach 95+ Score:
            </h4>
            <ul className="text-xs text-[#4F6457] space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3F6E4E]" />
                <span>Cook recipes using ingredients from the 🔴 "Use First" list today.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3F6E4E]" />
                <span>Move fresh bread or extra berries to the freezer to pause the expiry clock.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3F6E4E]" />
                <span>Review the "Don't Buy Yet" list before heading to the market.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Waste Recording Form & Waste History Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Waste Entry Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-xs">
          <div className="flex items-center gap-2 text-rose-700 pb-3 border-b border-[#F0EBE0] mb-4">
            <Trash2 className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#1A2820]">Record Food Waste</h3>
          </div>

          <form onSubmit={handleRecordWaste} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#1A2820] mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Moldy bread, Stale milk, Spoiled spinach"
                className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1A2820] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GroceryCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs text-[#1A2820]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2820] mb-1">
                  Estimated Loss ({userProfile.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs text-[#1A2820]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1A2820] mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs text-[#1A2820]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2820] mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs text-[#1A2820]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A2820] mb-1">
                Reason *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as WasteReason)}
                className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs text-[#1A2820]"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 mt-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Log Waste Record</span>
            </button>
          </form>
        </div>

        {/* History Log Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0] mb-4">
              <h3 className="text-base font-bold text-[#1A2820]">
                Food Waste History Log
              </h3>
              <span className="text-xs text-[#52685B]">
                {wasteRecords.length} recorded entries
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1A2820]">
                <thead className="bg-[#F7F4EC] text-[#55695E] uppercase text-[10px]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold">Item</th>
                    <th className="px-3 py-2 font-semibold">Qty</th>
                    <th className="px-3 py-2 font-semibold">Reason</th>
                    <th className="px-3 py-2 font-semibold text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EEE4]">
                  {wasteRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#FAF8F5]">
                      <td className="px-3 py-2.5 font-mono text-[11px] text-[#55695E]">
                        {rec.date}
                      </td>
                      <td className="px-3 py-2.5 font-bold flex items-center gap-1.5">
                        <span>{getCategoryEmoji(rec.category)}</span>
                        <span>{rec.itemName}</span>
                      </td>
                      <td className="px-3 py-2.5 text-[#55695E]">
                        {rec.quantity} {rec.unit}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                          {rec.reason}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-red-600">
                        {userProfile.currency}{rec.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
