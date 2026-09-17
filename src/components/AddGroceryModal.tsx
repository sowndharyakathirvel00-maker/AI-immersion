import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, MapPin, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GroceryCategory, StorageLocation } from '../types';
import { CATEGORIES, STORAGE_LOCATIONS, getCategoryEmoji } from '../utils/categoryHelpers';
import { getOffsetDate } from '../mockData';

export const AddGroceryModal: React.FC = () => {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    editingItem,
    setEditingItem,
    addGrocery,
    updateGrocery,
    userProfile,
  } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<GroceryCategory>('Vegetables');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('pieces');
  const [purchaseDate, setPurchaseDate] = useState(getOffsetDate(0));
  const [expiryDate, setExpiryDate] = useState(getOffsetDate(5));
  const [price, setPrice] = useState<number>(40);
  const [storageLocation, setStorageLocation] = useState<StorageLocation>('Fridge');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Pre-fill when editing
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
      setQuantity(editingItem.quantity);
      setUnit(editingItem.unit);
      setPurchaseDate(editingItem.purchaseDate);
      setExpiryDate(editingItem.expiryDate);
      setPrice(editingItem.price);
      setStorageLocation(editingItem.storageLocation);
      setNotes(editingItem.notes || '');
      setImageUrl(editingItem.imageUrl || '');
    } else {
      // Defaults for new item
      setName('');
      setCategory('Vegetables');
      setQuantity(1);
      setUnit('pieces');
      setPurchaseDate(getOffsetDate(0));
      setExpiryDate(getOffsetDate(4));
      setPrice(40);
      setStorageLocation('Fridge');
      setNotes('');
      setImageUrl('');
    }
  }, [editingItem, isAddModalOpen]);

  if (!isAddModalOpen) return null;

  const handleClose = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      updateGrocery(editingItem.id, {
        name: name.trim(),
        category,
        quantity: Number(quantity) || 1,
        unit,
        purchaseDate,
        expiryDate,
        price: Number(price) || 0,
        storageLocation,
        notes: notes.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });
    } else {
      addGrocery({
        name: name.trim(),
        category,
        quantity: Number(quantity) || 1,
        unit,
        purchaseDate,
        expiryDate,
        price: Number(price) || 0,
        storageLocation,
        notes: notes.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });
    }

    handleClose();
  };

  // Quick pick expiry buttons
  const quickPickExpiry = (days: number) => {
    setExpiryDate(getOffsetDate(days));
  };

  return (
    <div
      id="add-grocery-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity overflow-y-auto animate-fadeIn"
      onClick={handleClose}
    >
      <div
        id="add-grocery-modal-dialog"
        className="w-full max-w-lg bg-[#FBF9F5] rounded-2xl shadow-2xl border border-[#E8E4DA] p-6 max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DA]">
          <div>
            <h2 className="text-lg font-bold text-[#1A2820]">
              {editingItem ? 'Edit Grocery Item' : 'Add New Grocery'}
            </h2>
            <p className="text-xs text-[#52685B]">
              Track freshness, storage location & prevent food waste
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#52685B] hover:bg-[#EAE5D9] transition-colors"
            id="close-add-grocery-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1.5">
              Grocery Item Name *
            </label>
            <input
              type="text"
              required
              id="grocery-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fresh Milk, Red Tomatoes, Whole Wheat Bread"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DDD7] text-sm text-[#1A2820] placeholder-[#8A9C91] focus:outline-none focus:ring-2 focus:ring-[#3F6E4E] focus:border-transparent transition-all"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#52685B]" />
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 justify-center transition-all ${
                    category === cat
                      ? 'bg-[#3F6E4E] text-white border-[#3F6E4E] shadow-xs'
                      : 'bg-white text-[#283A2E] border-[#DCE4DE] hover:bg-[#F2EFE8]'
                  }`}
                >
                  <span>{getCategoryEmoji(cat)}</span>
                  <span className="truncate">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1A2820] mb-1.5">
                Quantity *
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                id="grocery-quantity-input"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DDD7] text-sm text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A2820] mb-1.5">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DDD7] text-sm text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
              >
                <option value="pieces">pieces</option>
                <option value="grams">grams</option>
                <option value="kg">kg</option>
                <option value="Litre">Litre</option>
                <option value="ml">ml</option>
                <option value="Loaf">Loaf</option>
                <option value="pack">pack</option>
                <option value="bottle">bottle</option>
                <option value="bunch">bunch</option>
                <option value="box">box</option>
              </select>
            </div>
          </div>

          {/* Expiry Date with Quick Select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#1A2820] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#52685B]" />
                Expiry Date *
              </label>
              <span className="text-[11px] text-[#55695E]">Quick select:</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => quickPickExpiry(1)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#EAE6DC] hover:bg-[#DED9CD] text-[#283A2E] font-medium transition-colors"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => quickPickExpiry(3)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#EAE6DC] hover:bg-[#DED9CD] text-[#283A2E] font-medium transition-colors"
              >
                In 3 Days
              </button>
              <button
                type="button"
                onClick={() => quickPickExpiry(7)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#EAE6DC] hover:bg-[#DED9CD] text-[#283A2E] font-medium transition-colors"
              >
                In 1 Week
              </button>
              <button
                type="button"
                onClick={() => quickPickExpiry(14)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#EAE6DC] hover:bg-[#DED9CD] text-[#283A2E] font-medium transition-colors"
              >
                In 2 Weeks
              </button>
              <button
                type="button"
                onClick={() => quickPickExpiry(30)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#EAE6DC] hover:bg-[#DED9CD] text-[#283A2E] font-medium transition-colors"
              >
                In 1 Month
              </button>
            </div>

            <input
              type="date"
              required
              id="grocery-expiry-input"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DDD7] text-sm text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            />
          </div>

          {/* Price and Purchase Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1A2820] mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#52685B]" />
                Price ({userProfile.currency})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                id="grocery-price-input"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DDD7] text-sm text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A2820] mb-1.5">
                Purchase Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DDD7] text-sm text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
              />
            </div>
          </div>

          {/* Storage Location */}
          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#52685B]" />
              Storage Location
            </label>
            <div className="grid grid-cols-4 gap-2">
              {STORAGE_LOCATIONS.map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setStorageLocation(loc)}
                  className={`py-2 px-2 text-xs rounded-xl font-medium border text-center transition-all ${
                    storageLocation === loc
                      ? 'bg-[#3F6E4E] text-white border-[#3F6E4E] shadow-xs'
                      : 'bg-white text-[#283A2E] border-[#DCE4DE] hover:bg-[#F2EFE8]'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Image URL */}
          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#52685B]" />
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1.5">
              Kitchen Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Keep in airtight container, use for weekend curry"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D5DDD7] text-xs text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-[#E8E4DA] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-[#52685B] hover:text-[#1A2820] hover:bg-[#EAE5D9] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-grocery-btn"
              className="px-5 py-2 text-sm font-semibold text-white bg-[#3F6E4E] hover:bg-[#345B40] rounded-xl shadow-sm shadow-[#3F6E4E]/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-[#D3E2D6]" />
              <span>{editingItem ? 'Save Changes' : 'Add to Inventory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
