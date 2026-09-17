import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GroceryCategory, WasteReason } from '../types';
import { CATEGORIES } from '../utils/categoryHelpers';

const REASONS: WasteReason[] = [
  'Expired',
  'Spoiled',
  'Cooked too much',
  "Didn't like it",
  'Bought too much',
  'Other',
];

export const RecordWasteModal: React.FC = () => {
  const {
    isRecordWasteOpen,
    setIsRecordWasteOpen,
    itemToWaste,
    setItemToWaste,
    markAsWasted,
    recordManualWaste,
    userProfile,
  } = useApp();

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<GroceryCategory>('Vegetables');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('pieces');
  const [price, setPrice] = useState<number>(40);
  const [reason, setReason] = useState<WasteReason>('Expired');

  useEffect(() => {
    if (itemToWaste) {
      setItemName(itemToWaste.name);
      setCategory(itemToWaste.category);
      setQuantity(itemToWaste.quantity);
      setUnit(itemToWaste.unit);
      setPrice(itemToWaste.price);
      setReason(itemToWaste.expiryDate && new Date(itemToWaste.expiryDate) < new Date() ? 'Expired' : 'Spoiled');
    } else {
      setItemName('');
      setCategory('Vegetables');
      setQuantity(1);
      setUnit('pieces');
      setPrice(35);
      setReason('Expired');
    }
  }, [itemToWaste, isRecordWasteOpen]);

  if (!isRecordWasteOpen) return null;

  const handleClose = () => {
    setIsRecordWasteOpen(false);
    setItemToWaste(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    if (itemToWaste) {
      markAsWasted(itemToWaste.id, reason);
    } else {
      recordManualWaste({
        itemName: itemName.trim(),
        category,
        quantity: Number(quantity) || 1,
        unit,
        price: Number(price) || 0,
        reason,
      });
    }

    handleClose();
  };

  return (
    <div
      id="record-waste-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={handleClose}
    >
      <div
        id="record-waste-modal-dialog"
        className="w-full max-w-md bg-[#FBF9F5] rounded-2xl shadow-2xl border border-[#E8E4DA] p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DA]">
          <div className="flex items-center gap-2 text-rose-700">
            <Trash2 className="w-5 h-5" />
            <h2 className="text-lg font-bold text-[#1A2820]">Record Food Waste</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#52685B] hover:bg-[#EAE5D9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#52685B] mt-2 mb-4">
          Tracking wasted food helps identify buying habits and powers your waste prediction models.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1">
              Food Item Name *
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              disabled={!!itemToWaste}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DDD7] text-sm text-[#1A2820] disabled:bg-stone-100"
              placeholder="e.g. Bread loaf, Leftover rice, Milk"
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
                disabled={!!itemToWaste}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5DDD7] text-xs text-[#1A2820]"
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
                step="any"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5DDD7] text-xs text-[#1A2820]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1A2820] mb-1">
                Quantity Wasted
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5DDD7] text-xs text-[#1A2820]"
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
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5DDD7] text-xs text-[#1A2820]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              Primary Reason for Waste *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REASONS.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setReason(r)}
                  className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    reason === r
                      ? 'bg-[#DE7E36]/15 border-[#DE7E36] text-[#A24D14] font-semibold'
                      : 'bg-white border-[#DCE4DE] text-[#283A2E] hover:bg-[#F2EFE8]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8E4DA] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-[#52685B] hover:text-[#1A2820]"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-waste-record-btn"
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Record Waste Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
