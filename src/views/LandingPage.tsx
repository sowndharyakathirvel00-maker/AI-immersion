import React, { useState } from 'react';
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  CookingPot,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  HeartHandshake,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';

export const LandingPage: React.FC = () => {
  const { setActiveView, userProfile } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const openSignup = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1E2E25] flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b border-[#E8E4DA] bg-[#FBF9F5]/90 backdrop-blur-md sticky top-0 z-30 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#3F6E4E] flex items-center justify-center text-white shadow-sm shadow-[#3F6E4E]/20">
            <Leaf className="w-5 h-5 text-[#D3E2D6]" />
          </div>
          <div>
            <span className="font-bold text-lg text-[#1A2820] tracking-tight">ShelfSense</span>
            <p className="text-[11px] text-[#55695E] hidden sm:block">Smart Grocery & Food Waste Manager</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {userProfile.isAuthenticated ? (
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#3F6E4E] hover:bg-[#345B40] rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={openLogin}
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#2F543C] hover:text-[#1A2820] transition-colors"
                id="landing-login-btn"
              >
                Log In
              </button>
              <button
                onClick={openSignup}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#3F6E4E] hover:bg-[#345B40] rounded-xl shadow-sm shadow-[#3F6E4E]/25 transition-all"
                id="landing-get-started-btn"
              >
                Get Started Free
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-6 lg:px-12 pt-12 pb-16 lg:pt-20 lg:pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#2F543C] text-xs font-semibold mb-6 border border-[#D8D2C4]">
                <Sparkles className="w-3.5 h-3.5 text-[#3F6E4E]" />
                <span>Zero-Waste Kitchen Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A2820] leading-[1.15] mb-6">
                “Use What You Have. <br />
                <span className="text-[#3F6E4E]">Waste Less.”</span>
              </h1>

              <p className="text-base sm:text-lg text-[#4E6255] max-w-xl leading-relaxed mb-8">
                Track your groceries, stay ahead of expiry dates, and make smarter food decisions with ShelfSense.
              </p>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (userProfile.isAuthenticated) {
                      setActiveView('dashboard');
                    } else {
                      openSignup();
                    }
                  }}
                  id="landing-hero-cta"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#3F6E4E] hover:bg-[#345B40] text-white font-semibold rounded-xl shadow-lg shadow-[#3F6E4E]/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base group"
                >
                  <span>Start Managing Groceries</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={scrollToHowItWorks}
                  id="landing-see-how-btn"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#D5DDD7] hover:bg-[#F2EFE8] text-[#283A2E] font-semibold rounded-xl transition-all text-sm sm:text-base"
                >
                  See How It Works
                </button>
              </div>

              {/* Trust pill */}
              <div className="flex items-center gap-6 mt-10 pt-6 border-t border-[#E8E4DA] text-xs text-[#55695E]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#3F6E4E]" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#3F6E4E]" />
                  <span>Interactive instant demo</span>
                </div>
              </div>
            </div>

            {/* Right Pantry Graphic / Interactive Mockup */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Background decorative blob */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#E4ECE6] to-[#F2EFE8] rounded-3xl -rotate-1 transform -z-10" />

                {/* Main Visual Card: Smart Kitchen Shelf */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#E8E4DA]">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE0] mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold text-[#1A2820] ml-2">ShelfSense Live Pantry</span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF1EC] text-[#2F543C]">
                      4 Items Expiring Soon
                    </span>
                  </div>

                  {/* Pantry Shelves Preview */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-[#FFF8F3] border border-[#FCDDC8] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1 bg-white rounded-xl shadow-xs">🥛</span>
                        <div>
                          <p className="text-xs font-bold text-[#1A2820]">Fresh Cow Milk</p>
                          <p className="text-[11px] text-[#A24D14] font-medium">Expires Tomorrow • Fridge</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#A24D14]">₹45</span>
                        <span className="block text-[10px] text-white bg-[#DE7E36] px-2 py-0.5 rounded-md font-semibold mt-0.5">
                          Use First
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FFF8F3] border border-[#FCDDC8] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1 bg-white rounded-xl shadow-xs">🍅</span>
                        <div>
                          <p className="text-xs font-bold text-[#1A2820]">Ripe Red Tomatoes</p>
                          <p className="text-[11px] text-[#A24D14] font-medium">Expires in 2 days • Countertop</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#A24D14]">₹35</span>
                        <span className="block text-[10px] text-white bg-[#DE7E36] px-2 py-0.5 rounded-md font-semibold mt-0.5">
                          Use First
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F6FAF7] border border-[#D5E6DA] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1 bg-white rounded-xl shadow-xs">🍞</span>
                        <div>
                          <p className="text-xs font-bold text-[#1A2820]">Whole Wheat Bread</p>
                          <p className="text-[11px] text-[#3B6649] font-medium">Expires in 3 days • Pantry</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#1A2820]">₹50</span>
                        <span className="block text-[10px] text-[#2F543C] bg-[#E3EFE6] px-2 py-0.5 rounded-md font-semibold mt-0.5">
                          Fresh
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Waste Saver Mini Badge */}
                  <div className="mt-4 pt-4 border-t border-[#F0EBE0] flex items-center justify-between bg-[#F8FAF8] -mx-2 -mb-2 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#3F6E4E] text-white flex items-center justify-center font-bold text-xs">
                        82%
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1A2820]">Waste Saver Score</p>
                        <p className="text-[10px] text-[#55695E]">Top 15% sustainable kitchen</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveView('dashboard')}
                      className="text-xs font-semibold text-[#3F6E4E] hover:underline"
                    >
                      Open Demo →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three Core Feature Cards */}
        <section className="px-6 lg:px-12 py-16 bg-[#F4EFE6] border-y border-[#E8E4DA]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2820] mb-3">
                Built for the Mindful Kitchen
              </h2>
              <p className="text-sm text-[#52685B]">
                Three interconnected pillars that turn grocery chaos into proactive cooking and measurable savings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Track */}
              <div
                id="feature-card-track"
                className="bg-white rounded-3xl p-8 border border-[#E4DDD0] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF1EC] text-[#3F6E4E] flex items-center justify-center mb-6">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2820] mb-2">Track</h3>
                  <p className="text-base font-semibold text-[#3F6E4E] mb-3">
                    “Know exactly what is in your kitchen.”
                  </p>
                  <p className="text-sm text-[#52685B] leading-relaxed">
                    Catalog pantry, fridge, and freezer items with intuitive expiry reminders, quantity units, and storage locations so nothing gets hidden behind jars.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#F2ECE0] flex items-center gap-2 text-xs font-medium text-[#52685B]">
                  <Clock className="w-4 h-4 text-[#3F6E4E]" />
                  <span>Real-time timeline sorting</span>
                </div>
              </div>

              {/* Card 2: Predict */}
              <div
                id="feature-card-predict"
                className="bg-white rounded-3xl p-8 border border-[#E4DDD0] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF2E8] text-[#DE7E36] flex items-center justify-center mb-6">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2820] mb-2">Predict</h3>
                  <p className="text-base font-semibold text-[#DE7E36] mb-3">
                    “Identify groceries at risk of being wasted.”
                  </p>
                  <p className="text-sm text-[#52685B] leading-relaxed">
                    Demo ML forecasting analyzes your household consumption velocity, warning you before perishables spoil and identifying recurring waste patterns.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#F2ECE0] flex items-center gap-2 text-xs font-medium text-[#52685B]">
                  <AlertTriangle className="w-4 h-4 text-[#DE7E36]" />
                  <span>Early risk alerts & forecasts</span>
                </div>
              </div>

              {/* Card 3: Save */}
              <div
                id="feature-card-save"
                className="bg-white rounded-3xl p-8 border border-[#E4DDD0] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF1EC] text-[#2F543C] flex items-center justify-center mb-6">
                    <CookingPot className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2820] mb-2">Save</h3>
                  <p className="text-base font-semibold text-[#2F543C] mb-3">
                    “Reduce food waste and unnecessary spending.”
                  </p>
                  <p className="text-sm text-[#52685B] leading-relaxed">
                    Convert expiring items into delicious zero-waste recipes, avoid buying duplicates with smart recommendations, and track money saved in real-time.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#F2ECE0] flex items-center gap-2 text-xs font-medium text-[#52685B]">
                  <HeartHandshake className="w-4 h-4 text-[#3F6E4E]" />
                  <span>Cook-before-it-expires engine</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How ShelfSense Works Section */}
        <section id="how-it-works-section" className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#3F6E4E] mb-2 block">
              Streamlined Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2820] mb-4">
              How ShelfSense Works
            </h2>
            <p className="text-sm text-[#52685B]">
              A continuous, effortless cycle that keeps groceries fresh and grocery budgets intact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DA] relative">
              <div className="w-10 h-10 rounded-xl bg-[#3F6E4E] text-white flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-[#1A2820] mb-2">Add Groceries</h4>
              <p className="text-xs text-[#52685B] leading-relaxed">
                Log purchases quickly with smart expiry presets and storage categories (Fridge, Pantry, Freezer).
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DA] relative">
              <div className="w-10 h-10 rounded-xl bg-[#DE7E36] text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-[#1A2820] mb-2">Monitor Expiry</h4>
              <p className="text-xs text-[#52685B] leading-relaxed">
                Our timeline organizes what to eat Today, Tomorrow, or this week, flagging potential waste before it happens.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DA] relative">
              <div className="w-10 h-10 rounded-xl bg-[#4A6D55] text-white flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-[#1A2820] mb-2">Get Smart Suggestions</h4>
              <p className="text-xs text-[#52685B] leading-relaxed">
                Discover step-by-step recipes built dynamically from items in your fridge that need to be used first.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E4DA] relative">
              <div className="w-10 h-10 rounded-xl bg-[#2F543C] text-white flex items-center justify-center font-bold text-sm mb-4">
                4
              </div>
              <h4 className="text-base font-bold text-[#1A2820] mb-2">Reduce Waste</h4>
              <p className="text-xs text-[#52685B] leading-relaxed">
                Watch your Waste Saver score climb, curb duplicate grocery shopping, and measure real money saved.
              </p>
            </div>
          </div>
        </section>

        {/* Sustainability & Impact Section */}
        <section className="px-6 lg:px-12 py-16 bg-[#EAF1EC] border-t border-[#CDE0D2]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2F543C] mb-2 block">
                  Household Impact
                </span>
                <h2 className="text-3xl font-bold text-[#1A2820] mb-4">
                  Estimated Food & Money Saved
                </h2>
                <p className="text-sm text-[#465D4F] leading-relaxed mb-6">
                  The average household discards up to 30% of perishable groceries each year. ShelfSense helps families turn that lost food into wholesome meals and real financial savings.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-[#D5E3D8] shadow-xs">
                    <span className="text-2xl font-bold text-[#2F543C] font-mono">₹6,400+</span>
                    <p className="text-xs text-[#5A6E62] mt-1 font-medium">Average Annual Money Saved</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#D5E3D8] shadow-xs">
                    <span className="text-2xl font-bold text-[#3F6E4E] font-mono">48 kg</span>
                    <p className="text-xs text-[#5A6E62] mt-1 font-medium">Edible Food Diverted From Landfill</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#D5E3D8] shadow-xs col-span-2 sm:col-span-1">
                    <span className="text-2xl font-bold text-[#2F543C] font-mono">120 kg</span>
                    <p className="text-xs text-[#5A6E62] mt-1 font-medium">CO₂ Equivalent Mitigated</p>
                  </div>
                </div>
              </div>

              {/* Interactive Quote / Callout */}
              <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-[#D5E3D8] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#E2ECE4] text-[#2F543C] flex items-center justify-center font-bold text-lg">
                    🌱
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#1A2820]">“I stopped throwing away half my produce.”</h4>
                    <p className="text-xs text-[#55695E]">Active Kitchen Household • Mumbai</p>
                  </div>
                </div>
                <p className="text-xs text-[#4F6457] leading-relaxed italic">
                  “Before ShelfSense, leafy greens and milk were constantly spoiling in the back of my fridge. Now the daily 'Use First' list and sandwich recommendations give me immediate dinner ideas using whatever is about to expire.”
                </p>

                <div className="mt-6 pt-5 border-t border-[#F0EBE0] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1A2820]">
                    Ready to transform your kitchen?
                  </span>
                  <button
                    onClick={() => {
                      if (userProfile.isAuthenticated) {
                        setActiveView('dashboard');
                      } else {
                        openSignup();
                      }
                    }}
                    className="px-4 py-2 bg-[#3F6E4E] hover:bg-[#345B40] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                  >
                    Open Live App
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E4DA] bg-[#F7F4EC] px-6 lg:px-12 py-8 text-center text-xs text-[#55695E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#3F6E4E]" />
            <span className="font-semibold text-[#1A2820]">ShelfSense</span>
            <span>– Smart Grocery Expiry & Food Waste Manager</span>
          </div>
          <p>© {new Date().getFullYear()} ShelfSense. Made with mindfulness for sustainable homes.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};
