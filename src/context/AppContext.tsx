import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ActiveView,
  AppNotification,
  GroceryCategory,
  GroceryItem,
  GroceryStatus,
  Recipe,
  ShoppingItem,
  UserProfile,
  WasteReason,
  WasteRecord,
} from '../types';
import {
  defaultUser,
  getOffsetDate,
  initialGroceries,
  initialShoppingList,
  initialWasteRecords,
  smartRecipeLibrary,
} from '../mockData';

interface AppContextType {
  groceries: GroceryItem[];
  wasteRecords: WasteRecord[];
  shoppingList: ShoppingItem[];
  recipes: Recipe[];
  savedRecipeIds: string[];
  notifications: AppNotification[];
  userProfile: UserProfile;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  // Grocery actions
  addGrocery: (item: Omit<GroceryItem, 'id'>) => void;
  updateGrocery: (id: string, updates: Partial<GroceryItem>) => void;
  deleteGrocery: (id: string) => void;
  markAsConsumed: (id: string) => void;
  markAsWasted: (id: string, reason: WasteReason) => void;
  // Waste actions
  recordManualWaste: (waste: {
    itemName: string;
    category: GroceryCategory;
    quantity: number;
    unit: string;
    price: number;
    reason: WasteReason;
  }) => void;
  // Shopping actions
  addShoppingItem: (item: Omit<ShoppingItem, 'id'>) => void;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;
  moveShoppingItemToGroceries: (id: string) => void;
  // Recipes actions
  toggleSaveRecipe: (id: string) => void;
  cookRecipe: (recipe: Recipe) => void;
  // Notification actions
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  // User actions
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  // State management
  resetToDemoData: () => void;
  exportDataAsJSON: () => void;
  importDataFromJSON: (jsonStr: string) => boolean;
  // Computed metrics
  getDaysRemaining: (expiryDate: string) => number;
  getItemStatus: (expiryDate: string) => GroceryStatus;
  activeGroceries: GroceryItem[];
  expiringSoonGroceries: GroceryItem[];
  expiredGroceries: GroceryItem[];
  useFirstGroceries: GroceryItem[];
  potentialWasteCost: number;
  wasteSaverScore: number;
  smartAlert: { title: string; message: string; items: string[] } | null;
  recommendedPurchases: {
    name: string;
    category: GroceryCategory;
    frequency: string;
    reason: string;
    urgent: boolean;
  }[];
  dontBuyYetItems: {
    name: string;
    currentStock: string;
    reason: string;
  }[];
  // Modals state helper
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isRecordWasteOpen: boolean;
  setIsRecordWasteOpen: (open: boolean) => void;
  itemToWaste: GroceryItem | null;
  setItemToWaste: (item: GroceryItem | null) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  editingItem: GroceryItem | null;
  setEditingItem: (item: GroceryItem | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  GROCERIES: 'shelfsense_groceries_v2',
  WASTE: 'shelfsense_waste_v2',
  SHOPPING: 'shelfsense_shopping_v2',
  SAVED_RECIPES: 'shelfsense_saved_recipes_v2',
  USER: 'shelfsense_user_v2',
  NOTIFICATIONS: 'shelfsense_notifs_v2',
};

export const getDaysRemaining = (expiryDateStr: string): number => {
  if (!expiryDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(expiryDateStr);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export const getItemStatus = (expiryDateStr: string): GroceryStatus => {
  const days = getDaysRemaining(expiryDateStr);
  if (days < 0) return 'Expired';
  if (days <= 3) return 'Expiring Soon';
  return 'Fresh';
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize user
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return defaultUser;
  });

  // Active view: start at dashboard if authenticated, else landing
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    return userProfile.isAuthenticated ? 'dashboard' : 'landing';
  });

  // Groceries
  const [groceries, setGroceries] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GROCERIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse groceries', e);
      }
    }
    return initialGroceries;
  });

  // Waste records
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WASTE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse waste records', e);
      }
    }
    return initialWasteRecords;
  });

  // Shopping list
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOPPING);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse shopping list', e);
      }
    }
    return initialShoppingList;
  });

  // Saved recipe IDs
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved recipes', e);
      }
    }
    return ['r-1'];
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notifications', e);
      }
    }
    return [
      {
        id: 'n-1',
        type: 'warning',
        title: 'Fresh Cow Milk expires tomorrow',
        message: '1 Litre in Fridge needs attention to prevent ₹45 waste.',
        date: 'Just now',
        isRead: false,
        actionView: 'expiry',
      },
      {
        id: 'n-2',
        type: 'warning',
        title: 'Ripe Red Tomatoes should be used soon',
        message: 'Expires in 2 days. Try making Egg Tomato Sandwich!',
        date: '1 hr ago',
        isRead: false,
        actionView: 'recipes',
      },
      {
        id: 'n-3',
        type: 'shopping',
        title: 'Recommended purchase: Milk',
        message: 'You may need milk soon based on your 4-5 day consumption cycle.',
        date: '2 hrs ago',
        isRead: false,
        actionView: 'shopping',
      },
      {
        id: 'n-4',
        type: 'success',
        title: 'Waste Saver Milestone',
        message: 'You avoided wasting 5 items this month and kept your score above 80!',
        date: 'Yesterday',
        isRead: true,
        actionView: 'waste-saver',
      },
    ];
  });

  // UI Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [isRecordWasteOpen, setIsRecordWasteOpen] = useState(false);
  const [itemToWaste, setItemToWaste] = useState<GroceryItem | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GROCERIES, JSON.stringify(groceries));
  }, [groceries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WASTE, JSON.stringify(wasteRecords));
  }, [wasteRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOPPING, JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(savedRecipeIds));
  }, [savedRecipeIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Active groceries (excluding consumed and wasted items)
  const activeGroceries = useMemo(() => {
    return groceries.filter((item) => !item.isConsumed && !item.isWasted);
  }, [groceries]);

  // Expiring soon: 0 to 3 days
  const expiringSoonGroceries = useMemo(() => {
    return activeGroceries.filter((item) => {
      const days = getDaysRemaining(item.expiryDate);
      return days >= 0 && days <= 3;
    });
  }, [activeGroceries]);

  // Expired: < 0 days
  const expiredGroceries = useMemo(() => {
    return activeGroceries.filter((item) => {
      const days = getDaysRemaining(item.expiryDate);
      return days < 0;
    });
  }, [activeGroceries]);

  // Use First priority items (sorted by days remaining)
  const useFirstGroceries = useMemo(() => {
    return [...activeGroceries]
      .filter((item) => getDaysRemaining(item.expiryDate) <= 3)
      .sort((a, b) => getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate));
  }, [activeGroceries]);

  // Potential waste cost
  const potentialWasteCost = useMemo(() => {
    return [...expiredGroceries, ...expiringSoonGroceries].reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
  }, [expiredGroceries, expiringSoonGroceries]);

  // Dynamic Waste Saver Score (82 default baseline, reacts to consumed/wasted actions)
  const wasteSaverScore = useMemo(() => {
    const totalConsumed = groceries.filter((g) => g.isConsumed).length;
    const totalWasted = groceries.filter((g) => g.isWasted).length + wasteRecords.length;
    const expiredCount = expiredGroceries.length;

    let base = 82;
    base += totalConsumed * 2; // reward consuming
    base -= totalWasted * 2.5; // penalize recorded waste
    base -= expiredCount * 4; // penalize unaddressed expired items

    return Math.max(25, Math.min(98, Math.round(base)));
  }, [groceries, wasteRecords, expiredGroceries]);

  // Smart Alert banner text
  const smartAlert = useMemo(() => {
    if (expiringSoonGroceries.length === 0) return null;
    const itemNames = expiringSoonGroceries.slice(0, 2).map((i) => i.name.toLowerCase());
    const namesStr = itemNames.join(' and ');
    return {
      title: 'Smart Alert',
      message: `Your ${namesStr || 'items'} are likely to expire within 2–3 days.`,
      items: itemNames,
    };
  }, [expiringSoonGroceries]);

  // Smart Shopping Recommendations & "Don't Buy Yet"
  const recommendedPurchases = useMemo(() => {
    const recs = [];
    const hasMilk = activeGroceries.some(
      (g) => g.name.toLowerCase().includes('milk') && getDaysRemaining(g.expiryDate) > 2
    );
    if (!hasMilk) {
      recs.push({
        name: 'Fresh Milk',
        category: 'Dairy' as GroceryCategory,
        frequency: 'Usually consumed every 4–5 days',
        reason: 'Current milk inventory is expiring or low',
        urgent: true,
      });
    }

    const hasEggs = activeGroceries.some((g) => g.name.toLowerCase().includes('egg'));
    if (!hasEggs) {
      recs.push({
        name: 'Farm Fresh Eggs',
        category: 'Dairy' as GroceryCategory,
        frequency: 'Essential protein staple',
        reason: 'Zero egg inventory currently logged',
        urgent: false,
      });
    }

    const hasGreens = activeGroceries.some(
      (g) =>
        (g.name.toLowerCase().includes('spinach') || g.name.toLowerCase().includes('coriander')) &&
        getDaysRemaining(g.expiryDate) > 1
    );
    if (!hasGreens) {
      recs.push({
        name: 'Fresh Salad Greens',
        category: 'Vegetables' as GroceryCategory,
        frequency: 'Weekly healthy staple',
        reason: 'Replenish low leafy greens inventory',
        urgent: false,
      });
    }

    return recs;
  }, [activeGroceries]);

  const dontBuyYetItems = useMemo(() => {
    const list = [];
    const rice = activeGroceries.find((g) => g.name.toLowerCase().includes('rice'));
    if (rice) {
      list.push({
        name: 'Basmati Rice',
        currentStock: `${rice.quantity} ${rice.unit}`,
        reason: `You already have ${rice.quantity} ${rice.unit} with ${getDaysRemaining(rice.expiryDate)} days remaining.`,
      });
    }

    const oats = activeGroceries.find((g) => g.name.toLowerCase().includes('oat'));
    if (oats) {
      list.push({
        name: 'Rolled Oats',
        currentStock: `${oats.quantity} ${oats.unit}`,
        reason: `Pantry is well-stocked with ${oats.quantity} ${oats.unit}.`,
      });
    }

    const oil = activeGroceries.find((g) => g.name.toLowerCase().includes('oil'));
    if (oil) {
      list.push({
        name: 'Olive Oil',
        currentStock: `${oil.quantity} ${oil.unit}`,
        reason: 'Current bottle will last ~4-6 more months.',
      });
    }

    return list;
  }, [activeGroceries]);

  // Actions
  const addGrocery = (itemData: Omit<GroceryItem, 'id'>) => {
    const newItem: GroceryItem = {
      ...itemData,
      id: `g-${Date.now()}`,
    };
    setGroceries((prev) => [newItem, ...prev]);

    // Check if added item is expiring soon
    const days = getDaysRemaining(newItem.expiryDate);
    if (days <= 2) {
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'warning',
        title: `⚠️ ${newItem.name} expires soon`,
        message: `${newItem.name} expires in ${days === 0 ? 'today' : days === 1 ? 'tomorrow' : `${days} days`}. Use it first!`,
        date: 'Just now',
        isRead: false,
        actionView: 'expiry',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const updateGrocery = (id: string, updates: Partial<GroceryItem>) => {
    setGroceries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteGrocery = (id: string) => {
    setGroceries((prev) => prev.filter((item) => item.id !== id));
  };

  const markAsConsumed = (id: string) => {
    const target = groceries.find((g) => g.id === id);
    if (!target) return;

    setGroceries((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isConsumed: true,
              consumedDate: new Date().toISOString().split('T')[0],
            }
          : item
      )
    );

    // Fire confetti for consuming food before waste
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#4E7A58', '#8CAE93', '#E8863A', '#FBBF24'],
    });

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'success',
      title: `Saved ${target.name}!`,
      message: `You consumed ${target.name} before expiry and saved ${userProfile.currency}${target.price}.`,
      date: 'Just now',
      isRead: false,
      actionView: 'waste-saver',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const markAsWasted = (id: string, reason: WasteReason) => {
    const target = groceries.find((g) => g.id === id);
    if (!target) return;

    setGroceries((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isWasted: true,
              wastedDate: new Date().toISOString().split('T')[0],
              wasteReason: reason,
            }
          : item
      )
    );

    // Record waste
    const newWasteRecord: WasteRecord = {
      id: `w-${Date.now()}`,
      groceryId: target.id,
      itemName: target.name,
      category: target.category,
      quantity: target.quantity,
      unit: target.unit,
      price: target.price,
      reason,
      date: new Date().toISOString().split('T')[0],
    };
    setWasteRecords((prev) => [newWasteRecord, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'warning',
      title: `Recorded waste: ${target.name}`,
      message: `Marked as wasted due to "${reason}". Potential waste insights updated.`,
      date: 'Just now',
      isRead: false,
      actionView: 'insights',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const recordManualWaste = (wasteData: {
    itemName: string;
    category: GroceryCategory;
    quantity: number;
    unit: string;
    price: number;
    reason: WasteReason;
  }) => {
    const record: WasteRecord = {
      ...wasteData,
      id: `w-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setWasteRecords((prev) => [record, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'warning',
      title: `Food waste recorded`,
      message: `Logged ${record.itemName} (${userProfile.currency}${record.price}) under ${record.reason}.`,
      date: 'Just now',
      isRead: false,
      actionView: 'insights',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Shopping actions
  const addShoppingItem = (itemData: Omit<ShoppingItem, 'id'>) => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: `s-${Date.now()}`,
    };
    setShoppingList((prev) => [newItem, ...prev]);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const moveShoppingItemToGroceries = (id: string) => {
    const item = shoppingList.find((s) => s.id === id);
    if (!item) return;

    // Convert to grocery item
    const newGrocery: GroceryItem = {
      id: `g-${Date.now()}`,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: getOffsetDate(7), // Default 7 days
      price: item.estimatedPrice,
      storageLocation: 'Fridge',
      notes: item.notes || 'Purchased from shopping list',
    };
    setGroceries((prev) => [newGrocery, ...prev]);
    // Remove from shopping list
    setShoppingList((prev) => prev.filter((s) => s.id !== id));

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#4E7A58', '#8CAE93'],
    });
  };

  // Recipe actions
  const toggleSaveRecipe = (id: string) => {
    setSavedRecipeIds((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id]
    );
  };

  const cookRecipe = (recipe: Recipe) => {
    // Mark matching ingredients in active inventory as consumed
    const usedNames = recipe.expiringIngredientsUsed.map((n) => n.toLowerCase());
    let consumedCount = 0;

    setGroceries((prev) =>
      prev.map((item) => {
        const matches = usedNames.some((u) => item.name.toLowerCase().includes(u));
        if (matches && !item.isConsumed && !item.isWasted) {
          consumedCount++;
          return {
            ...item,
            isConsumed: true,
            consumedDate: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      })
    );

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#3F6E4E', '#DE7E36', '#FBBF24', '#38A169'],
    });

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'success',
      title: `Cooked: ${recipe.title}! 🍳`,
      message: `Used ${recipe.expiringIngredientsUsed.join(', ')} before expiry. Great job saving food!`,
      date: 'Just now',
      isRead: false,
      actionView: 'waste-saver',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // User
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const loginUser = (email: string, name?: string) => {
    setUserProfile((prev) => ({
      ...prev,
      email,
      name: name || prev.name,
      isAuthenticated: true,
    }));
    setActiveView('dashboard');
  };

  const logoutUser = () => {
    setUserProfile((prev) => ({ ...prev, isAuthenticated: false }));
    setActiveView('landing');
  };

  // Reset to demo data
  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.GROCERIES);
    localStorage.removeItem(STORAGE_KEYS.WASTE);
    localStorage.removeItem(STORAGE_KEYS.SHOPPING);
    localStorage.removeItem(STORAGE_KEYS.SAVED_RECIPES);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);

    setGroceries(initialGroceries);
    setWasteRecords(initialWasteRecords);
    setShoppingList(initialShoppingList);
    setSavedRecipeIds(['r-1']);
    setUserProfile(defaultUser);
    setActiveView('dashboard');

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  // Export / Import
  const exportDataAsJSON = () => {
    const state = {
      groceries,
      wasteRecords,
      shoppingList,
      savedRecipeIds,
      userProfile,
      version: '2.0',
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shelfsense-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataFromJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.groceries && Array.isArray(data.groceries)) {
        setGroceries(data.groceries);
      }
      if (data.wasteRecords && Array.isArray(data.wasteRecords)) {
        setWasteRecords(data.wasteRecords);
      }
      if (data.shoppingList && Array.isArray(data.shoppingList)) {
        setShoppingList(data.shoppingList);
      }
      if (data.userProfile) {
        setUserProfile(data.userProfile);
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        groceries,
        wasteRecords,
        shoppingList,
        recipes: smartRecipeLibrary,
        savedRecipeIds,
        notifications,
        userProfile,
        activeView,
        setActiveView,
        addGrocery,
        updateGrocery,
        deleteGrocery,
        markAsConsumed,
        markAsWasted,
        recordManualWaste,
        addShoppingItem,
        toggleShoppingItem,
        removeShoppingItem,
        moveShoppingItemToGroceries,
        toggleSaveRecipe,
        cookRecipe,
        markNotificationRead,
        clearAllNotifications,
        updateUserProfile,
        loginUser,
        logoutUser,
        resetToDemoData,
        exportDataAsJSON,
        importDataFromJSON,
        getDaysRemaining,
        getItemStatus,
        activeGroceries,
        expiringSoonGroceries,
        expiredGroceries,
        useFirstGroceries,
        potentialWasteCost,
        wasteSaverScore,
        smartAlert,
        recommendedPurchases,
        dontBuyYetItems,
        isAddModalOpen,
        setIsAddModalOpen,
        isRecordWasteOpen,
        setIsRecordWasteOpen,
        itemToWaste,
        setItemToWaste,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        editingItem,
        setEditingItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
