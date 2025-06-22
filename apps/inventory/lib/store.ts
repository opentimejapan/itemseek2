import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  category: string;
  location: string;
  lastUpdated: Date;
}

interface InventoryStore {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  deleteItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set) => ({
      items: [
        {
          id: '1',
          name: 'White Towels',
          sku: 'TWL-001',
          quantity: 150,
          minQuantity: 50,
          unit: 'pieces',
          category: 'Linen',
          location: 'Storage A1',
          lastUpdated: new Date()
        },
        {
          id: '2',
          name: 'Hand Soap',
          sku: 'SOP-001',
          quantity: 45,
          minQuantity: 100,
          unit: 'bottles',
          category: 'Amenities',
          location: 'Storage B2',
          lastUpdated: new Date()
        }
      ],
      addItem: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              id: Date.now().toString(),
              lastUpdated: new Date()
            }
          ]
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity, lastUpdated: new Date() }
              : item
          )
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        })),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, ...updates, lastUpdated: new Date() }
              : item
          )
        }))
    }),
    {
      name: 'inventory-storage'
    }
  )
);