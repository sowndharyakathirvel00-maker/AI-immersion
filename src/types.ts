export type GroceryCategory =
  | 'Fruits'
  | 'Vegetables'
  | 'Dairy'
  | 'Meat'
  | 'Bakery'
  | 'Grains'
  | 'Snacks'
  | 'Beverages'
  | 'Frozen'
  | 'Other';

export type StorageLocation = 'Fridge' | 'Freezer' | 'Pantry' | 'Countertop';

export type GroceryStatus = 'Fresh' | 'Expiring Soon' | 'Expired';

export interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  quantity: number;
  unit: string;
  purchaseDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  price: number; // in configured currency (e.g. ₹)
  storageLocation: StorageLocation;
  imageUrl?: string;
  notes?: string;
  isConsumed?: boolean;
  consumedDate?: string;
  isWasted?: boolean;
  wastedDate?: string;
  wasteReason?: WasteReason;
}

export type WasteReason =
  | 'Expired'
  | 'Spoiled'
  | 'Cooked too much'
  | "Didn't like it"
  | 'Bought too much'
  | 'Other';

export interface WasteRecord {
  id: string;
  groceryId?: string;
  itemName: string;
  category: GroceryCategory;
  quantity: number;
  unit: string;
  price: number;
  reason: WasteReason;
  date: string; // YYYY-MM-DD
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: GroceryCategory;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  isCompleted: boolean;
  notes?: string;
  addedFromRecommendation?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Intermediate';
  servings: number;
  calories?: number;
  tags: string[];
  imageUrl?: string;
  ingredients: {
    name: string;
    amount: string;
    matchedInPantry?: boolean;
    isExpiringSoon?: boolean;
  }[];
  instructions: string[];
  expiringIngredientsUsed: string[];
}

export interface AppNotification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'shopping';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  actionView?: string;
  relatedItemId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  householdSize: number;
  currency: string; // '₹', '$', '€', '£'
  isAuthenticated: boolean;
  joinedDate: string;
  dietaryPreferences?: string[];
}

export type ActiveView =
  | 'dashboard'
  | 'groceries'
  | 'expiry'
  | 'recipes'
  | 'shopping'
  | 'insights'
  | 'waste-saver'
  | 'predictions'
  | 'settings'
  | 'landing';
