import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  RotateCcw,
  Sparkles,
  UtensilsCrossed,
  ShoppingBag,
  TrendingDown,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCategoryEmoji, getStatusBadge } from '../utils/categoryHelpers';

export const DashboardView: React.FC = () => {
  const {
    userProfile,
    activeGroceries,
    expiringSoonGroceries,
    expiredGroceries,
    potentialWasteCost,
    useFirstGroceries,
    smartAlert,
    wasteSaverScore,
    markAsConsumed,
    setIsAddModalOpen,
    setActiveView,
    getDaysRemaining,
    getItemStatus,
    setIsRecordWasteOpen,
    setItemToWaste,
  } = useApp();

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Circular score stroke calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (wasteSaverScore / 100) * circumference;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A2820]">
            {getGreeting()}, {userProfile.name.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-[#52685B] mt-0.5">
            Here’s what needs your attention in your kitchen today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveView('recipes')}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#D5DDD7] hover:bg-[#F2EFE8] text-xs font-semibold text-[#283A2E] flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#3F6E4E]" />
            <span>Recipe Ideas</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#3F6E4E] hover:bg-[#345B40] text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-sm shadow-[#3F6E4E]/30"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Grocery</span>
          </button>
        </div>
      </div>

      {/* Smart Alert Banner */}
      {smartAlert && (
        <div
          id="dashboard-smart-alert"
          className="p-4 rounded-2xl bg-[#FFF6EE] border border-[#FADCC7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FDE8D7] text-[#DE7E36] mt-0.5 sm:mt-0 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#A24D14] uppercase tracking-wider block">
                ⚠️ {smartAlert.title}
              </span>
              <p className="text-xs sm:text-sm font-medium text-[#1A2820]">
                {smartAlert.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-center self-end">
            <button
              onClick={() => setActiveView('recipes')}
              className="px-3 py-1.5 text-xs font-semibold text-[#8B400E] bg-white border border-[#F5CDAD] hover:bg-[#FEEFE2] rounded-lg transition-colors"
            >
              Find Recipe
            </button>
            <button
              onClick={() => setActiveView('expiry')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#DE7E36] hover:bg-[#C96B25] rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              <span>View Expiring Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Groceries */}
        <div
          id="summary-card-groceries"
          onClick={() => setActiveView('groceries')}
          className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-xs hover:shadow-sm hover:border-[#CBD8CE] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#52685B]">Groceries</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF1EC] text-[#3F6E4E] flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#1A2820]">
              {activeGroceries.length}
            </span>
            <span className="text-xs text-[#52685B] font-medium">Items</span>
          </div>
          <p className="text-[11px] text-[#718779] mt-2 flex items-center gap-1">
            <span>In pantry & fridge</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Card 2: Expiring Soon */}
        <div
          id="summary-card-expiring"
          onClick={() => setActiveView('expiry')}
          className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-xs hover:shadow-sm hover:border-[#FADCC7] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#A24D14]">Expiring Soon</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF1E8] text-[#DE7E36] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#DE7E36]">
              {expiringSoonGroceries.length}
            </span>
            <span className="text-xs text-[#DE7E36] font-medium">Items</span>
          </div>
          <p className="text-[11px] text-[#A24D14] mt-2 flex items-center gap-1">
            <span>Needs attention within 3 days</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Card 3: Expired */}
        <div
          id="summary-card-expired"
          onClick={() => setActiveView('groceries')}
          className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-xs hover:shadow-sm hover:border-red-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-red-700">Expired</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-red-600">
              {expiredGroceries.length}
            </span>
            <span className="text-xs text-red-700 font-medium">Item</span>
          </div>
          <p className="text-[11px] text-red-600 mt-2 flex items-center gap-1">
            <span>Action required</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Card 4: Potential Waste */}
        <div
          id="summary-card-potential-waste"
          onClick={() => setActiveView('predictions')}
          className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-xs hover:shadow-sm hover:border-[#D5E3D8] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#52685B]">Potential Waste</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAE6DC] text-[#2F543C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#1A2820] font-mono">
              {userProfile.currency}{potentialWasteCost}
            </span>
          </div>
          <p className="text-[11px] text-[#52685B] mt-2 flex items-center gap-1">
            <span>Value of at-risk food</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* Main Grid: Use First + Waste Saver Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): 🔴 Use First Section */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <h3 className="text-lg font-bold text-[#1A2820]">🔴 Use First</h3>
              <span className="text-xs text-[#52685B] hidden sm:inline">
                – Groceries closest to expiry
              </span>
            </div>

            <button
              onClick={() => setActiveView('expiry')}
              className="text-xs font-semibold text-[#3F6E4E] hover:text-[#2F543C] flex items-center gap-1"
            >
              <span>View Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {useFirstGroceries.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#E8E4DA] text-center">
              <div className="w-12 h-12 rounded-full bg-[#EAF1EC] text-[#3F6E4E] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#1A2820]">No groceries expiring soon!</h4>
              <p className="text-xs text-[#52685B] mt-1">
                Your pantry is fresh and well-managed. Add new groceries anytime.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {useFirstGroceries.slice(0, 4).map((item) => {
                const days = getDaysRemaining(item.expiryDate);
                const status = getItemStatus(item.expiryDate);
                const badge = getStatusBadge(status, days);

                return (
                  <div
                    key={item.id}
                    id={`use-first-card-${item.id}`}
                    className="bg-white rounded-2xl p-4 border border-[#E8E4DA] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
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

                      <span className="text-xs font-bold text-[#1A2820] font-mono whitespace-nowrap">
                        {userProfile.currency}{item.price}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#F2EEE4] flex items-center justify-between">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {badge.text}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setItemToWaste(item);
                            setIsRecordWasteOpen(true);
                          }}
                          title="Record as wasted"
                          className="px-2 py-1 text-[11px] text-[#8C9E93] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Wasted
                        </button>
                        <button
                          onClick={() => markAsConsumed(item.id)}
                          id={`mark-consumed-btn-${item.id}`}
                          className="px-3 py-1.5 bg-[#3F6E4E] hover:bg-[#345B40] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1 active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Use Today</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Recipe Recommendation Teaser */}
          <div className="bg-[#F3EFE6] rounded-2xl p-4 sm:p-5 border border-[#E3DCCF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#DE7E36] flex items-center justify-center font-bold text-lg shadow-xs">
                🍳
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1A2820]">
                  Cook Before It Expires: Egg & Tomato Sandwich
                </h4>
                <p className="text-xs text-[#52685B]">
                  Uses 3 of your expiring ingredients (Eggs, Tomatoes, Bread).
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('recipes')}
              className="px-4 py-2 bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#283A2E] rounded-xl border border-[#D5DDD7] transition-colors whitespace-nowrap self-start sm:self-center"
            >
              See Recipe Details →
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): ♻️ Waste Saver Score Card */}
        <div className="lg:col-span-4">
          <div
            id="dashboard-waste-saver-score-card"
            className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-xs flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-[#F0EBE0] mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3F6E4E] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Sustainability Metric
              </span>
              <button
                onClick={() => setActiveView('waste-saver')}
                className="text-xs font-semibold text-[#52685B] hover:text-[#1A2820]"
              >
                Details →
              </button>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-36 h-36 my-2 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="#E9E5DB"
                  strokeWidth="9"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="#3F6E4E"
                  strokeWidth="9"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-[#1A2820] font-mono tracking-tight">
                  {wasteSaverScore}
                </span>
                <span className="text-[11px] font-semibold text-[#52685B] -mt-1">
                  / 100
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold text-[#1A2820] mt-2">
              ♻️ Waste Saver Score
            </h3>

            <p className="text-xs text-[#4F6457] mt-1.5 leading-relaxed max-w-xs">
              “Great! You consumed most groceries before expiry.”
            </p>

            {/* Factors breakdown */}
            <div className="w-full mt-5 pt-4 border-t border-[#F0EBE0] space-y-2 text-left">
              <p className="text-[11px] font-bold text-[#1A2820] uppercase tracking-wider mb-2">
                Score Evaluation Factors:
              </p>

              <div className="flex items-center justify-between text-xs py-1 border-b border-[#FAF7F0]">
                <span className="text-[#55695E] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#3F6E4E]" />
                  Consumed before expiry
                </span>
                <span className="font-semibold text-[#2F543C] font-mono">92%</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-b border-[#FAF7F0]">
                <span className="text-[#55695E] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Expired items recorded
                </span>
                <span className="font-semibold text-amber-700 font-mono">
                  {expiredGroceries.length}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-b border-[#FAF7F0]">
                <span className="text-[#55695E] flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-[#DE7E36]" />
                  Food waste recorded
                </span>
                <span className="font-semibold text-[#DE7E36] font-mono">Low</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-[#55695E] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#3F6E4E]" />
                  Shopping efficiency
                </span>
                <span className="font-semibold text-[#2F543C] font-mono">High</span>
              </div>
            </div>

            {/* Scientific disclaimer badge as mandated in Section 7 */}
            <div className="mt-4 p-2.5 rounded-xl bg-[#F6F4EE] border border-[#E8E4DA] text-[10px] text-[#697E71] flex items-start gap-1.5 text-left">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#55695E]" />
              <span>
                Project-defined sustainability metric based on inventory turnover and waste records. Not a medical or regulatory validation.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
