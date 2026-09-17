import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AddGroceryModal } from './components/AddGroceryModal';
import { RecordWasteModal } from './components/RecordWasteModal';
import { AuthModal } from './views/AuthModal';
import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { GroceriesView } from './views/GroceriesView';
import { ExpiryTrackerView } from './views/ExpiryTrackerView';
import { RecipeSuggestionsView } from './views/RecipeSuggestionsView';
import { SmartShoppingView } from './views/SmartShoppingView';
import { InsightsView } from './views/InsightsView';
import { WasteSaverView } from './views/WasteSaverView';
import { PredictionsView } from './views/PredictionsView';
import { SettingsView } from './views/SettingsView';

const MainAppContent: React.FC = () => {
  const { activeView } = useApp();

  if (activeView === 'landing') {
    return (
      <>
        <LandingPage />
        <AuthModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A2820] flex flex-col md:flex-row antialiased selection:bg-[#3F6E4E]/20">
      {/* Navigation Sidebar (Desktop) + Bottom Nav (Mobile) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'groceries' && <GroceriesView />}
          {activeView === 'expiry' && <ExpiryTrackerView />}
          {activeView === 'recipes' && <RecipeSuggestionsView />}
          {activeView === 'shopping' && <SmartShoppingView />}
          {activeView === 'insights' && <InsightsView />}
          {activeView === 'waste-saver' && <WasteSaverView />}
          {activeView === 'predictions' && <PredictionsView />}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <AddGroceryModal />
      <RecordWasteModal />
      <NotificationDrawer />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
