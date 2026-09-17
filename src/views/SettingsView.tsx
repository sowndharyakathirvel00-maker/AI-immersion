import React, { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Coins,
  Shield,
  RotateCcw,
  Download,
  Trash2,
  Check,
  Sparkles,
  Heart,
  Globe,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    resetToDemoData,
    groceries,
    wasteRecords,
    shoppingList,
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [currency, setCurrency] = useState(userProfile.currency);
  const [householdSize, setHouseholdSize] = useState(userProfile.householdSize);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Dietary options
  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Non-Veg',
    'Dairy-Free',
    'Gluten-Free',
    'Pescatarian',
    'Nut Allergy',
  ];

  const handleDietaryToggle = (item: string) => {
    const current = userProfile.dietaryPreferences || [];
    const next = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item];
    updateUserProfile({ dietaryPreferences: next });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      currency,
      householdSize: Number(householdSize) || 1,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const exportObject = {
      userProfile,
      groceries,
      wasteRecords,
      shoppingList,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `shelfsense-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="bg-[#FAF6ED] rounded-3xl p-6 sm:p-7 border border-[#E8E0D0] shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#2F543C] text-xs font-bold shadow-xs mb-2">
            <Settings className="w-3.5 h-3.5 text-[#3F6E4E]" />
            <span>Preferences & Data Management</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A2820]">
            Kitchen Settings
          </h2>
          <p className="text-xs text-[#52685B]">
            Configure household size, preferred currency, alert notifications, and export options.
          </p>
        </div>
      </div>

      {/* Profile & Household Configuration */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E4DA] shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE0]">
          <h3 className="text-base font-bold text-[#1A2820] flex items-center gap-2">
            <User className="w-4 h-4 text-[#3F6E4E]" />
            Household Profile
          </h3>
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Settings saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1.5">
              Display Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            >
              <option value="₹">₹ (INR - Indian Rupee)</option>
              <option value="$">$ (USD - US Dollar)</option>
              <option value="€">€ (EUR - Euro)</option>
              <option value="£">£ (GBP - British Pound)</option>
              <option value="A$">A$ (AUD - Australian Dollar)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1.5">
              Household Size (Persons)
            </label>
            <input
              type="number"
              min="1"
              max="15"
              value={householdSize}
              onChange={(e) => setHouseholdSize(parseInt(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            />
            <p className="text-[10px] text-[#6E8276] mt-1">
              Adjusts recipe portion sizes and replenishment velocity heuristics.
            </p>
          </div>
        </div>

        {/* Dietary Preferences */}
        <div>
          <label className="block text-xs font-semibold text-[#1A2820] mb-2">
            Dietary Preferences & Allergens
          </label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((opt) => {
              const active = (userProfile.dietaryPreferences || []).includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleDietaryToggle(opt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#3F6E4E] text-white shadow-xs'
                      : 'bg-[#F2EEE4] text-[#283A2E] hover:bg-[#EAE5D9]'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#3F6E4E] hover:bg-[#345B40] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Save Profile Settings
          </button>
        </div>
      </form>

      {/* Notifications Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E4DA] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#1A2820] flex items-center gap-2 pb-3 border-b border-[#F0EBE0]">
          <Bell className="w-4 h-4 text-[#3F6E4E]" />
          Alerts & Notifications
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] cursor-pointer">
            <div>
              <span className="text-xs font-bold text-[#1A2820] block">
                Daily Morning Expiry Digest
              </span>
              <span className="text-[11px] text-[#55695E]">
                Get a quick snapshot at 8:00 AM of items expiring within 48 hours.
              </span>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-[#3F6E4E] rounded focus:ring-[#3F6E4E]"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] cursor-pointer">
            <div>
              <span className="text-xs font-bold text-[#1A2820] block">
                Recipe Suggestions On Fresh Spoilage Risk
              </span>
              <span className="text-[11px] text-[#55695E]">
                Notify when 2 or more ingredients are ready to be combined into a meal.
              </span>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-[#3F6E4E] rounded focus:ring-[#3F6E4E]"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] cursor-pointer">
            <div>
              <span className="text-xs font-bold text-[#1A2820] block">
                Audio Feedback & Completion Confetti
              </span>
              <span className="text-[11px] text-[#55695E]">
                Celebrate every time you consume food on time or rescue ingredients.
              </span>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-[#3F6E4E] rounded focus:ring-[#3F6E4E]"
            />
          </label>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E4DA] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#1A2820] flex items-center gap-2 pb-3 border-b border-[#F0EBE0]">
          <Shield className="w-4 h-4 text-[#3F6E4E]" />
          Data Controls & Privacy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportData}
            className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] hover:bg-[#F2EEE4] text-left transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1A2820] mb-1">
                <Download className="w-4 h-4 text-[#3F6E4E]" />
                Export Local Backup (JSON)
              </div>
              <p className="text-[11px] text-[#55695E]">
                Download all groceries, recipes, and waste records to your computer.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#3F6E4E] mt-3">
              Download JSON →
            </span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all demo groceries, shopping lists, and waste records to initial sample data?')) {
                resetToDemoData();
              }
            }}
            className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#FCDDC8] hover:bg-[#FEEDDF] text-left transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#DE7E36] mb-1">
                <RotateCcw className="w-4 h-4 text-[#DE7E36]" />
                Restore Complete Demo State
              </div>
              <p className="text-[11px] text-[#69564A]">
                Repopulates fresh sample groceries, expiring alerts, recipes, and charts.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#DE7E36] mt-3">
              Reset Demo Data →
            </span>
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="p-6 rounded-3xl bg-[#F4EFE6] border border-[#E3DCCF] text-center space-y-2">
        <h4 className="text-sm font-bold text-[#1A2820]">
          ShelfSense v1.0.0 – Smart Grocery Expiry & Food Waste Manager
        </h4>
        <p className="text-xs text-[#52685B] max-w-lg mx-auto leading-relaxed">
          Crafted for modern households to stop throwing money into the trash bin. Built with a sustainable, zero-waste kitchen mindset.
        </p>
      </div>
    </div>
  );
};
