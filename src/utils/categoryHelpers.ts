import { GroceryCategory, StorageLocation } from '../types';

export const CATEGORIES: GroceryCategory[] = [
  'Fruits',
  'Vegetables',
  'Dairy',
  'Meat',
  'Bakery',
  'Grains',
  'Snacks',
  'Beverages',
  'Frozen',
  'Other',
];

export const STORAGE_LOCATIONS: StorageLocation[] = [
  'Fridge',
  'Freezer',
  'Pantry',
  'Countertop',
];

export const getCategoryEmoji = (category: GroceryCategory): string => {
  switch (category) {
    case 'Fruits':
      return '🍎';
    case 'Vegetables':
      return '🥬';
    case 'Dairy':
      return '🥛';
    case 'Meat':
      return '🍗';
    case 'Bakery':
      return '🍞';
    case 'Grains':
      return '🌾';
    case 'Snacks':
      return '🥨';
    case 'Beverages':
      return '🧃';
    case 'Frozen':
      return '🧊';
    case 'Other':
    default:
      return '📦';
  }
};

export const getCategoryBadgeStyle = (category: GroceryCategory): string => {
  switch (category) {
    case 'Fruits':
      return 'bg-amber-50 text-amber-800 border-amber-200/60';
    case 'Vegetables':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
    case 'Dairy':
      return 'bg-sky-50 text-sky-800 border-sky-200/60';
    case 'Meat':
      return 'bg-rose-50 text-rose-800 border-rose-200/60';
    case 'Bakery':
      return 'bg-orange-50 text-orange-800 border-orange-200/60';
    case 'Grains':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200/60';
    case 'Snacks':
      return 'bg-purple-50 text-purple-800 border-purple-200/60';
    case 'Beverages':
      return 'bg-cyan-50 text-cyan-800 border-cyan-200/60';
    case 'Frozen':
      return 'bg-indigo-50 text-indigo-800 border-indigo-200/60';
    case 'Other':
    default:
      return 'bg-stone-50 text-stone-700 border-stone-200/60';
  }
};

export const getStatusBadge = (status: 'Fresh' | 'Expiring Soon' | 'Expired', daysRemaining: number) => {
  if (status === 'Expired') {
    return {
      text: `Expired (${Math.abs(daysRemaining)}d ago)`,
      bg: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
    };
  }
  if (status === 'Expiring Soon') {
    let label = 'Expiring Soon';
    if (daysRemaining === 0) label = 'Expires Today';
    else if (daysRemaining === 1) label = 'Expires Tomorrow';
    else label = `Expires in ${daysRemaining} days`;

    return {
      text: label,
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
    };
  }
  return {
    text: `Fresh (${daysRemaining}d left)`,
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  };
};
