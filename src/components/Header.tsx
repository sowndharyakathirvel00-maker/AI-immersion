import React, { useState } from 'react';
import {
  Bell,
  Plus,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    notifications,
    setIsAddModalOpen,
    setIsNotificationDrawerOpen,
    resetToDemoData,
  } = useApp();

  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return { title: 'Kitchen Dashboard', subtitle: 'Real-time grocery inventory & expiry monitoring' };
      case 'groceries':
        return { title: 'My Groceries', subtitle: 'Manage pantry, fridge, and countertop stock' };
      case 'expiry':
        return { title: 'Expiry Tracker & Timeline', subtitle: 'Prioritize food consumption to prevent waste' };
      case 'recipes':
        return { title: 'Smart Recipe Suggestions', subtitle: 'Cook meals with ingredients closest to expiry' };
      case 'shopping':
        return { title: 'Smart Shopping Assistant', subtitle: 'Predictive replenishment & anti-duplicate purchase warnings' };
      case 'insights':
        return { title: 'Waste & Consumption Insights', subtitle: 'Visual analytics on consumption, expenses, and savings' };
      case 'waste-saver':
        return { title: 'Waste Saver & Record Log', subtitle: 'Track your sustainability score and record food waste' };
      case 'predictions':
        return { title: 'Food Waste Forecast & ML Pipeline', subtitle: 'Demo predictive modeling and consumption forecasting' };
      case 'settings':
        return { title: 'Preferences & Settings', subtitle: 'Household configuration, currency, and data export' };
      default:
        return { title: 'ShelfSense', subtitle: 'Smart kitchen sustainability' };
    }
  };

  const { title, subtitle } = getViewTitle();

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E8E4DA] px-4 lg:px-8 py-3.5 flex items-center justify-between transition-all"
    >
      {/* Title block */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[#1A2820]">
          {title}
        </h1>
        <p className="text-xs text-[#52685B] hidden sm:block">{subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Landing Preview Button */}
        <button
          onClick={() => setActiveView('landing')}
          title="View Public Landing Page"
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#465E50] bg-[#EAE6DC] hover:bg-[#E0DBCF] rounded-lg transition-colors"
          id="header-landing-preview-btn"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Landing Page</span>
        </button>

        {/* Reset Demo Data Button */}
        <div className="relative">
          {showConfirmReset ? (
            <div className="flex items-center gap-1 bg-white border border-[#DE7E36] rounded-lg p-1 shadow-sm">
              <span className="text-[11px] font-medium text-[#DE7E36] px-1">Reset demo?</span>
              <button
                onClick={() => {
                  resetToDemoData();
                  setShowConfirmReset(false);
                }}
                className="text-[11px] bg-[#DE7E36] text-white px-2 py-0.5 rounded font-semibold hover:bg-[#C86A25]"
                id="header-confirm-reset-btn"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="text-[11px] text-[#55695E] px-1 hover:text-black"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              title="Reset to fresh realistic demo inventory"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#52685B] hover:text-[#1A2820] hover:bg-[#EAE6DC] rounded-lg transition-colors border border-transparent hover:border-[#D8D2C4]"
              id="header-reset-demo-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          )}
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          title="Notifications"
          id="header-notification-bell"
          className="relative p-2 text-[#465E50] hover:text-[#1A2820] hover:bg-[#EAE6DC] rounded-xl transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span
              id="notification-badge-count"
              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#DE7E36] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#FBF9F5] animate-pulse"
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* + Add Grocery Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          id="header-add-grocery-btn"
          className="flex items-center gap-2 px-3.5 py-2 bg-[#3F6E4E] hover:bg-[#345B40] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-[#3F6E4E]/25 transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Grocery</span>
        </button>
      </div>
    </header>
  );
};
