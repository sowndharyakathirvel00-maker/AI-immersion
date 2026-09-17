import React from 'react';
import {
  Home,
  ShoppingBag,
  Clock,
  UtensilsCrossed,
  ShoppingCart,
  BarChart3,
  Recycle,
  BrainCircuit,
  Settings,
  Leaf,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveView } from '../types';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    expiringSoonGroceries,
    expiredGroceries,
    shoppingList,
    wasteSaverScore,
    userProfile,
    logoutUser,
    activeGroceries,
  } = useApp();

  const totalAlerts = expiringSoonGroceries.length + expiredGroceries.length;
  const pendingShopping = shoppingList.filter((s) => !s.isCompleted).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'groceries', label: 'My Groceries', icon: ShoppingBag, badge: activeGroceries.length },
    {
      id: 'expiry',
      label: 'Expiry Tracker',
      icon: Clock,
      badge: totalAlerts > 0 ? totalAlerts : undefined,
      badgeColor: expiredGroceries.length > 0 ? 'bg-red-500 text-white' : 'bg-[#DE7E36] text-white',
    },
    { id: 'recipes', label: 'Recipe Suggestions', icon: UtensilsCrossed },
    {
      id: 'shopping',
      label: 'Smart Shopping',
      icon: ShoppingCart,
      badge: pendingShopping > 0 ? pendingShopping : undefined,
    },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    {
      id: 'waste-saver',
      label: 'Waste Saver',
      icon: Recycle,
      badge: `${wasteSaverScore}%`,
      badgeColor: 'bg-[#3F6E4E] text-white font-mono',
    },
    { id: 'predictions', label: 'Waste Forecast', icon: BrainCircuit },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="desktop-sidebar"
        className="hidden md:flex md:w-64 lg:w-72 flex-col flex-shrink-0 border-r border-[#E8E4DA] bg-[#F7F4EC] h-screen sticky top-0 p-4 justify-between select-none"
      >
        <div className="flex flex-col gap-6">
          {/* Logo Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2.5 text-left group"
              id="sidebar-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-[#3F6E4E] flex items-center justify-center text-white shadow-sm shadow-[#3F6E4E]/20 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 text-[#D3E2D6]" />
              </div>
              <div>
                <span className="font-semibold text-lg tracking-tight text-[#1A2820] flex items-center gap-1.5">
                  ShelfSense
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#E4ECE6] text-[#2F543C] border border-[#CBDCCF]">
                    Pro
                  </span>
                </span>
                <p className="text-[11px] text-[#55695E]">Smart Kitchen & Expiry</p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#3F6E4E] text-white shadow-sm shadow-[#3F6E4E]/25 font-semibold'
                      : 'text-[#283A2E] hover:bg-[#EAE5D9] hover:text-[#1A2820]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-[#52685B]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        item.badgeColor ||
                        (isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#E3DED2] text-[#33463B]')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card / User Profile */}
        <div className="flex flex-col gap-3 pt-4 border-t border-[#E8E4DA]">
          {/* Eco Progress Badge */}
          <button
            onClick={() => setActiveView('waste-saver')}
            className="p-3 rounded-xl bg-[#EAF1EC] border border-[#CDE0D2] text-left hover:bg-[#E2EDE5] transition-colors group"
            id="sidebar-waste-score-card"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[#2F543C] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3F6E4E]" />
                Waste Saver Score
              </span>
              <span className="text-xs font-bold text-[#2F543C] font-mono">
                {wasteSaverScore}/100
              </span>
            </div>
            <div className="w-full bg-[#CBDCCF] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#3F6E4E] h-full rounded-full transition-all duration-500"
                style={{ width: `${wasteSaverScore}%` }}
              />
            </div>
            <p className="text-[11px] text-[#4A6454] mt-1.5 flex items-center justify-between">
              <span>Status: Optimal</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </button>

          {/* User Profile Bar */}
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/60 border border-[#E8E4DA]/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#3F6E4E] text-white flex items-center justify-center font-bold text-xs">
                {userProfile.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-[#1A2820] truncate">
                  {userProfile.name}
                </p>
                <p className="text-[10px] text-[#55695E]">
                  {userProfile.householdSize} member household
                </p>
              </div>
            </div>
            <button
              onClick={logoutUser}
              title="Sign Out / Switch to Landing"
              className="p-1.5 rounded-md text-[#55695E] hover:text-red-700 hover:bg-red-50 transition-colors"
              id="sidebar-logout-btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F7F4EC]/95 backdrop-blur-md border-t border-[#E8E4DA] px-2 py-1.5 flex items-center justify-around shadow-lg"
        aria-label="Mobile Navigation"
      >
        {[
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'groceries', label: 'Groceries', icon: ShoppingBag, badge: activeGroceries.length },
          { id: 'expiry', label: 'Expiry', icon: Clock, badge: totalAlerts > 0 ? totalAlerts : undefined },
          { id: 'recipes', label: 'Recipes', icon: UtensilsCrossed },
          { id: 'shopping', label: 'Shop', icon: ShoppingCart },
          { id: 'waste-saver', label: 'Waste', icon: Recycle },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setActiveView(item.id as ActiveView)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg relative transition-colors ${
                isActive ? 'text-[#3F6E4E] font-semibold' : 'text-[#5A6E62]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 text-[9px] font-bold bg-[#DE7E36] text-white px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
