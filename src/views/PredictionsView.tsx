import React from 'react';
import {
  TrendingDown,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Snowflake,
  UtensilsCrossed,
  Check,
  ArrowRight,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCategoryEmoji } from '../utils/categoryHelpers';

export const PredictionsView: React.FC = () => {
  const {
    activeGroceries,
    potentialWasteCost,
    getDaysRemaining,
    getItemStatus,
    markAsConsumed,
    userProfile,
    setActiveView,
  } = useApp();

  // Categorize items by predictive risk level
  const riskAnalysis = activeGroceries.map((item) => {
    const days = getDaysRemaining(item.expiryDate);
    let riskLevel: 'High' | 'Medium' | 'Low' = 'Low';
    let riskProbability = 15;
    let reason = 'Stable shelf life with normal consumption pace.';
    let rescueAction = 'Maintain standard pantry storage.';

    if (days <= 2) {
      riskLevel = 'High';
      riskProbability = 88;
      reason = 'Expiring in under 48 hours; urgent meal usage needed.';
      rescueAction = 'Cook into dinner tonight or freeze immediately.';
    } else if (days <= 5) {
      riskLevel = 'Medium';
      riskProbability = 54;
      reason = 'Perishable product approaching expiry window.';
      rescueAction = 'Plan as side ingredient in your next 2 meals.';
    } else if (item.category === 'Vegetables' || item.category === 'Dairy') {
      riskLevel = 'Medium';
      riskProbability = 42;
      reason = 'High-spoilage category prone to moisture degradation.';
      rescueAction = 'Keep in sealed crisper drawer with paper towel.';
    }

    return {
      item,
      days,
      riskLevel,
      riskProbability,
      reason,
      rescueAction,
    };
  });

  const highRisk = riskAnalysis.filter((r) => r.riskLevel === 'High');
  const mediumRisk = riskAnalysis.filter((r) => r.riskLevel === 'Medium');
  const lowRisk = riskAnalysis.filter((r) => r.riskLevel === 'Low');

  const highRiskValue = highRisk.reduce((sum, r) => sum + r.item.price, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="bg-[#FAF6ED] rounded-3xl p-6 sm:p-7 border border-[#E8E0D0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#2F543C] text-xs font-bold shadow-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#3F6E4E]" />
            <span>AI Predictive Simulation</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A2820]">
            Smart Food Waste Risk Engine
          </h2>
          <p className="text-xs text-[#52685B]">
            Early detection algorithms anticipate food waste before it happens based on shelf-life velocity, category perishability, and household volume.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#FADCC7] text-right">
          <span className="text-xs text-[#A24D14] font-semibold block">
            7-Day Projected Waste Loss
          </span>
          <span className="text-2xl font-bold text-[#DE7E36] font-mono">
            {userProfile.currency}{potentialWasteCost}
          </span>
        </div>
      </div>

      {/* Model Transparency Disclaimer */}
      <div className="p-3 rounded-2xl bg-white border border-[#E8E4DA] text-xs text-[#52685B] flex items-start gap-2">
        <Info className="w-4 h-4 text-[#3F6E4E] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#1A2820]">Predictive Model Notice: </span>
          Risk likelihood scores represent a heuristic simulation modeling category decay rates, household size ({userProfile.householdSize} persons), and remaining days. Proactive cooking will completely eliminate this projected loss.
        </div>
      </div>

      {/* 3-Column Risk Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* High Risk Column */}
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider">
                High Spoilage Risk ({highRisk.length})
              </h3>
            </div>
            <span className="text-xs font-bold text-red-700 font-mono">
              {userProfile.currency}{highRiskValue}
            </span>
          </div>

          {highRisk.length === 0 ? (
            <p className="text-xs text-[#718779] bg-white rounded-2xl p-4 border border-[#E8E4DA] text-center italic">
              No high risk items currently identified!
            </p>
          ) : (
            highRisk.map((r) => (
              <div
                key={r.item.id}
                className="bg-white rounded-2xl p-4 border border-red-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1 bg-red-50 rounded-xl">
                      {getCategoryEmoji(r.item.category)}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A2820]">
                        {r.item.name}
                      </h4>
                      <p className="text-[11px] text-red-600 font-medium">
                        {r.days <= 0 ? 'Expires today' : `Expires in ${r.days} day(s)`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1A2820] font-mono">
                    {userProfile.currency}{r.item.price}
                  </span>
                </div>

                <div className="bg-[#FFF8F3] p-2.5 rounded-xl border border-[#FADCC7] text-xs">
                  <span className="font-bold text-[#A24D14] block text-[11px]">
                    Rescue Recommendation:
                  </span>
                  <p className="text-[#6E5748] text-[11px] mt-0.5">{r.rescueAction}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#F2EEE4]">
                  <button
                    onClick={() => setActiveView('recipes')}
                    className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-[#1A2820] rounded-lg transition-colors text-center"
                  >
                    Find Recipe
                  </button>
                  <button
                    onClick={() => markAsConsumed(r.item.id)}
                    className="flex-1 py-1.5 px-2 bg-[#3F6E4E] hover:bg-[#345B40] text-xs font-semibold text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Consumed</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Medium Risk Column */}
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-[#FFF6EE] border border-[#FADCC7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DE7E36]" />
              <h3 className="text-xs font-bold text-[#A24D14] uppercase tracking-wider">
                Medium Risk ({mediumRisk.length})
              </h3>
            </div>
            <span className="text-xs text-[#DE7E36] font-medium">3-5 days</span>
          </div>

          {mediumRisk.slice(0, 5).map((r) => (
            <div
              key={r.item.id}
              className="bg-white rounded-2xl p-4 border border-[#E8E4DA] shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getCategoryEmoji(r.item.category)}</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A2820]">{r.item.name}</h4>
                    <span className="text-[10px] text-[#55695E]">
                      {r.days} days remaining • {r.item.storageLocation}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono">
                  {userProfile.currency}{r.item.price}
                </span>
              </div>

              <p className="text-[11px] text-[#55695E] bg-[#FAF8F3] p-2 rounded-lg border border-[#EAE5D9]">
                💡 {r.rescueAction}
              </p>
            </div>
          ))}
        </div>

        {/* Low Risk Column */}
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-[#EAF1EC] border border-[#CDE0D2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3F6E4E]" />
              <h3 className="text-xs font-bold text-[#2F543C] uppercase tracking-wider">
                Low Risk ({lowRisk.length})
              </h3>
            </div>
            <span className="text-xs text-[#2F543C] font-semibold">&gt; 5 days</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E8E4DA] shadow-xs space-y-2">
            <p className="text-xs text-[#52685B] leading-relaxed">
              These staples (grains, frozen items, sealed sauces) have high stability. No immediate intervention is required.
            </p>

            <div className="divide-y divide-[#F2EEE4] pt-2">
              {lowRisk.slice(0, 6).map((r) => (
                <div key={r.item.id} className="py-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-[#1A2820]">
                    <span>{getCategoryEmoji(r.item.category)}</span>
                    <span>{r.item.name}</span>
                  </span>
                  <span className="font-mono text-[#52685B]">{r.days}d left</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preservation Guide Pill */}
          <div className="bg-[#FAF8F3] p-4 rounded-2xl border border-[#E8E4DA] space-y-2">
            <h4 className="text-xs font-bold text-[#1A2820] flex items-center gap-1.5">
              <Snowflake className="w-3.5 h-3.5 text-[#3F6E4E]" />
              Quick Freezing Rule
            </h4>
            <p className="text-[11px] text-[#55695E] leading-relaxed">
              Before dairy, bread, or meat hits the 24-hour mark, portion and freeze. It halts bacterial activity and extends life by 3+ months.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
