import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Check,
  Trash2,
  Edit2,
  Calendar,
  Layers,
  MapPin,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GroceryCategory, GroceryItem } from '../types';
import { CATEGORIES, getCategoryEmoji, getStatusBadge } from '../utils/categoryHelpers';

export const GroceriesView: React.FC = () => {
  const {
    activeGroceries,
    setIsAddModalOpen,
    setEditingItem,
    deleteGrocery,
    markAsConsumed,
    setIsRecordWasteOpen,
    setItemToWaste,
    userProfile,
    getDaysRemaining,
    getItemStatus,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedStorage, setSelectedStorage] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'expiry' | 'name' | 'price' | 'quantity'>('expiry');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter & Sort
  const filteredItems = useMemo(() => {
    return activeGroceries
      .filter((item) => {
        // Search query
        if (
          searchQuery &&
          !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'All') {
          const status = getItemStatus(item.expiryDate);
          if (status !== selectedStatus) return false;
        }

        // Storage filter
        if (selectedStorage !== 'All' && item.storageLocation !== selectedStorage) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'expiry') {
          return getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'price') {
          return b.price - a.price;
        }
        if (sortBy === 'quantity') {
          return b.quantity - a.quantity;
        }
        return 0;
      });
  }, [activeGroceries, searchQuery, selectedCategory, selectedStatus, selectedStorage, sortBy]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A2820]">
            Kitchen Inventory
          </h2>
          <p className="text-xs text-[#52685B]">
            {activeGroceries.length} total items in stock across pantry, fridge, and freezer
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-xl p-1 border border-[#D5DDD7]">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#3F6E4E] text-white shadow-xs'
                  : 'text-[#52685B] hover:text-[#1A2820]'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-[#3F6E4E] text-white shadow-xs'
                  : 'text-[#52685B] hover:text-[#1A2820]'
              }`}
            >
              Table
            </button>
          </div>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
            id="add-grocery-page-btn"
            className="px-4 py-2 bg-[#3F6E4E] hover:bg-[#345B40] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-[#3F6E4E]/25 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Grocery</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E4DA] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#788C80] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groceries by name, notes or category..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs sm:text-sm text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E] focus:outline-none"
            />
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#788C80] flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            >
              <option value="expiry">Sort: Expiry (Earliest First)</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="price">Sort: Price (High to Low)</option>
              <option value="quantity">Sort: Quantity</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#FBF9F5] border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            >
              <option value="All">All Statuses</option>
              <option value="Expiring Soon">🟡 Expiring Soon (≤3d)</option>
              <option value="Fresh">🟢 Fresh (&gt;3d)</option>
              <option value="Expired">🔴 Expired</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Scrollable Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-[#3F6E4E] text-white shadow-xs'
                : 'bg-[#F2EEE4] text-[#283A2E] hover:bg-[#EAE5D9]'
            }`}
          >
            All Categories ({activeGroceries.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = activeGroceries.filter((g) => g.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-[#3F6E4E] text-white shadow-xs'
                    : 'bg-[#F2EEE4] text-[#283A2E] hover:bg-[#EAE5D9]'
                }`}
              >
                <span>{getCategoryEmoji(cat)}</span>
                <span>{cat}</span>
                {count > 0 && <span className="opacity-75 text-[11px]">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content: Grid or Table */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E4DA]">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF1EC] text-[#3F6E4E] flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1A2820]">No groceries match your filter</h3>
          <p className="text-xs text-[#52685B] mt-1 max-w-sm mx-auto">
            Try resetting your search or category selection, or add new groceries to your inventory.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedStatus('All');
              setSelectedStorage('All');
            }}
            className="mt-4 px-4 py-2 bg-[#EAE5D9] hover:bg-[#E0DBCF] text-xs font-semibold text-[#1A2820] rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const days = getDaysRemaining(item.expiryDate);
            const status = getItemStatus(item.expiryDate);
            const badge = getStatusBadge(status, days);

            return (
              <div
                key={item.id}
                id={`grocery-card-${item.id}`}
                className="bg-white rounded-2xl p-4 border border-[#E8E4DA] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#FBF9F5] border border-[#E8E4DA] flex items-center justify-center text-xl flex-shrink-0">
                        {getCategoryEmoji(item.category)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1A2820] leading-snug line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-[#55695E] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#788C80]" />
                          {item.storageLocation} • {item.category}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#1A2820] font-mono whitespace-nowrap">
                      {userProfile.currency}{item.price}
                    </span>
                  </div>

                  {/* Quantity and Expiry */}
                  <div className="bg-[#FAF8F3] rounded-xl p-2.5 space-y-1.5 my-2 border border-[#EAE5D9]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#55695E]">Quantity:</span>
                      <span className="font-semibold text-[#1A2820]">
                        {item.quantity} {item.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#55695E] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Expiry Date:
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-[#1A2820]">
                        {item.expiryDate}
                      </span>
                    </div>
                  </div>

                  {/* Notes if any */}
                  {item.notes && (
                    <p className="text-[11px] text-[#63796D] italic line-clamp-1 px-1 mb-2">
                      “{item.notes}”
                    </p>
                  )}
                </div>

                {/* Card Footer: Status Badge & Actions */}
                <div className="pt-3 border-t border-[#F2EEE4] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.text}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsAddModalOpen(true);
                        }}
                        title="Edit Item"
                        className="p-1.5 rounded-lg text-[#55695E] hover:text-[#1A2820] hover:bg-[#EAE5D9] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteGrocery(item.id)}
                        title="Delete Item"
                        className="p-1.5 rounded-lg text-[#55695E] hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setItemToWaste(item);
                        setIsRecordWasteOpen(true);
                      }}
                      className="py-1.5 px-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200/80 transition-colors text-center"
                    >
                      Wasted
                    </button>
                    <button
                      onClick={() => markAsConsumed(item.id)}
                      className="py-1.5 px-2 text-xs font-semibold text-white bg-[#3F6E4E] hover:bg-[#345B40] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Consumed</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-[#E8E4DA] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1A2820]">
              <thead className="bg-[#F7F4EC] border-b border-[#E8E4DA] text-[#55695E] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-semibold">Item Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Quantity</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Expiry Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EEE4]">
                {filteredItems.map((item) => {
                  const days = getDaysRemaining(item.expiryDate);
                  const status = getItemStatus(item.expiryDate);
                  const badge = getStatusBadge(status, days);

                  return (
                    <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="px-4 py-3 font-bold flex items-center gap-2">
                        <span>{getCategoryEmoji(item.category)}</span>
                        <span>{item.name}</span>
                      </td>
                      <td className="px-4 py-3 text-[#55695E]">{item.category}</td>
                      <td className="px-4 py-3 font-semibold">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-[#55695E]">{item.storageLocation}</td>
                      <td className="px-4 py-3 font-mono">{item.expiryDate}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border inline-flex items-center gap-1 ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold font-mono">
                        {userProfile.currency}{item.price}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => markAsConsumed(item.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-white bg-[#3F6E4E] hover:bg-[#345B40] rounded-lg transition-colors"
                          >
                            Consumed
                          </button>
                          <button
                            onClick={() => {
                              setItemToWaste(item);
                              setIsRecordWasteOpen(true);
                            }}
                            className="px-2 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                          >
                            Wasted
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1 text-[#55695E] hover:text-[#1A2820]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteGrocery(item.id)}
                            className="p-1 text-[#55695E] hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
