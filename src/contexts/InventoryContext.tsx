import React, { createContext, useState, useEffect, useContext } from 'react';

// Types
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  image?: string;
  lowStockThreshold: number;
  description?: string;
  dateAdded: string;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  addItem: (item: Omit<InventoryItem, 'id' | 'dateAdded' | 'lastUpdated'>) => Promise<InventoryItem>;
  updateItem: (id: string, item: Partial<InventoryItem>) => Promise<InventoryItem>;
  deleteItem: (id: string) => Promise<void>;
  getItem: (id: string) => InventoryItem | undefined;
  getLowStockItems: () => InventoryItem[];
  getInventoryValue: () => number;
  getPotentialProfit: () => number;
}

// Mock data for frontend demo
const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Electronics" },
  { id: "cat-2", name: "Groceries" },
  { id: "cat-3", name: "Clothing" },
  { id: "cat-4", name: "Stationery" },
  { id: "cat-5", name: "Household" }
];

const MOCK_ITEMS: InventoryItem[] = [
  {
    id: "item-1",
    name: "Smartphone",
    category: "Electronics",
    sku: "ELEC-001",
    purchasePrice: 350,
    salePrice: 499.99,
    quantity: 12,
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    lowStockThreshold: 5,
    description: "Latest model smartphone with 6.5 inch display",
    dateAdded: "2024-04-15T10:30:00Z",
    lastUpdated: "2024-04-15T10:30:00Z"
  },
  {
    id: "item-2",
    name: "Laptop",
    category: "Electronics",
    sku: "ELEC-002",
    purchasePrice: 650,
    salePrice: 899.99,
    quantity: 8,
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    lowStockThreshold: 3,
    description: "15-inch laptop with 16GB RAM and 512GB SSD",
    dateAdded: "2024-04-12T14:20:00Z",
    lastUpdated: "2024-04-14T09:15:00Z"
  },
  {
    id: "item-3",
    name: "T-Shirt",
    category: "Clothing",
    sku: "CLO-001",
    purchasePrice: 8.5,
    salePrice: 19.99,
    quantity: 45,
    image: "https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    lowStockThreshold: 10,
    description: "Cotton t-shirt, available in multiple sizes",
    dateAdded: "2024-04-10T11:00:00Z",
    lastUpdated: "2024-04-10T11:00:00Z"
  },
  {
    id: "item-4",
    name: "Notebook",
    category: "Stationery",
    sku: "STAT-001",
    purchasePrice: 2.5,
    salePrice: 4.99,
    quantity: 120,
    image: "https://images.pexels.com/photos/6363791/pexels-photo-6363791.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    lowStockThreshold: 20,
    description: "80-page ruled notebook",
    dateAdded: "2024-04-08T15:45:00Z",
    lastUpdated: "2024-04-08T15:45:00Z"
  },
  {
    id: "item-5",
    name: "Headphones",
    category: "Electronics",
    sku: "ELEC-003",
    purchasePrice: 35,
    salePrice: 59.99,
    quantity: 4,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    lowStockThreshold: 5,
    description: "Wireless over-ear headphones with noise cancellation",
    dateAdded: "2024-04-05T13:20:00Z",
    lastUpdated: "2024-04-13T10:10:00Z"
  },
  {
    id: "item-6",
    name: "Rice (5kg)",
    category: "Groceries",
    sku: "GROC-001",
    purchasePrice: 12,
    salePrice: 18.99,
    quantity: 30,
    image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    lowStockThreshold: 8,
    description: "Premium jasmine rice, 5kg package",
    dateAdded: "2024-04-02T09:30:00Z",
    lastUpdated: "2024-04-12T16:20:00Z"
  }
];

// Create context
const InventoryContext = createContext<InventoryContextType>({} as InventoryContextType);

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check for stored data
        const storedItems = localStorage.getItem('inventoryItems');
        const storedCategories = localStorage.getItem('inventoryCategories');
        
        // Set initial data
        setItems(storedItems ? JSON.parse(storedItems) : MOCK_ITEMS);
        setCategories(storedCategories ? JSON.parse(storedCategories) : MOCK_CATEGORIES);
      } catch (err) {
        setError('Failed to load inventory data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('inventoryItems', JSON.stringify(items));
    }
  }, [items]);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('inventoryCategories', JSON.stringify(categories));
    }
  }, [categories]);

  // Add a new inventory item
  const addItem = async (item: Omit<InventoryItem, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    try {
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const now = new Date().toISOString();
      const newItem: InventoryItem = {
        ...item,
        id: `item-${Date.now()}`,
        dateAdded: now,
        lastUpdated: now
      };
      
      setItems(prevItems => [...prevItems, newItem]);
      return newItem;
    } catch (err) {
      setError('Failed to add item');
      throw err;
    }
  };

  // Update an existing item
  const updateItem = async (id: string, itemUpdate: Partial<InventoryItem>) => {
    try {
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedItems = items.map(item => {
        if (item.id === id) {
          return { 
            ...item, 
            ...itemUpdate, 
            lastUpdated: new Date().toISOString() 
          };
        }
        return item;
      });
      
      setItems(updatedItems);
      const updatedItem = updatedItems.find(item => item.id === id);
      
      if (!updatedItem) {
        throw new Error('Item not found');
      }
      
      return updatedItem;
    } catch (err) {
      setError('Failed to update item');
      throw err;
    }
  };

  // Delete an item
  const deleteItem = async (id: string) => {
    try {
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete item');
      throw err;
    }
  };

  // Get a specific item
  const getItem = (id: string) => {
    return items.find(item => item.id === id);
  };

  // Get items with low stock
  const getLowStockItems = () => {
    return items.filter(item => item.quantity <= item.lowStockThreshold);
  };

  // Calculate total inventory value (purchase price * quantity)
  const getInventoryValue = () => {
    return items.reduce((sum, item) => sum + (item.purchasePrice * item.quantity), 0);
  };

  // Calculate potential profit (sale price - purchase price) * quantity
  const getPotentialProfit = () => {
    return items.reduce((sum, item) => 
      sum + ((item.salePrice - item.purchasePrice) * item.quantity), 0);
  };

  const value = {
    items,
    categories,
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    getItem,
    getLowStockItems,
    getInventoryValue,
    getPotentialProfit
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};