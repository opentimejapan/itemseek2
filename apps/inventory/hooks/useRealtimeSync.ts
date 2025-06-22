'use client';

import { useEffect } from 'react';
import { useRealtimeInventory, useWebSocketStore } from '@itemseek/websocket';
import { useInventoryStore } from '../lib/store';

export function useRealtimeSync() {
  const { items, updateItem, deleteItem, updateQuantity } = useInventoryStore();
  const { editingItems, addNotification } = useWebSocketStore();

  const {
    startEditing,
    stopEditing,
    acknowledgeLowStock,
  } = useRealtimeInventory({
    onItemCreated: (item) => {
      // Add the new item to local store
      useInventoryStore.getState().addItem(item);
      
      // Show notification
      addNotification({
        id: `item-created-${Date.now()}`,
        type: 'success',
        title: 'New Item Added',
        message: `${item.name} has been added to inventory`,
        timestamp: new Date(),
      });
    },
    
    onItemUpdated: ({ item, changes }) => {
      // Update local store
      updateItem(item.id, item);
      
      // Show notification if significant change
      if (changes.quantity !== undefined) {
        addNotification({
          id: `item-updated-${Date.now()}`,
          type: 'info',
          title: 'Item Updated',
          message: `${item.name} quantity changed to ${item.quantity}`,
          timestamp: new Date(),
        });
      }
    },
    
    onItemDeleted: (itemId) => {
      const item = items.find(i => i.id === itemId);
      deleteItem(itemId);
      
      if (item) {
        addNotification({
          id: `item-deleted-${Date.now()}`,
          type: 'warning',
          title: 'Item Deleted',
          message: `${item.name} has been removed from inventory`,
          timestamp: new Date(),
        });
      }
    },
    
    onQuantityChanged: ({ itemId, newQuantity, reason }) => {
      updateQuantity(itemId, newQuantity);
      
      const item = items.find(i => i.id === itemId);
      if (item) {
        addNotification({
          id: `quantity-changed-${Date.now()}`,
          type: 'info',
          title: 'Quantity Updated',
          message: `${item.name}: ${newQuantity} ${item.unit} ${reason ? `(${reason})` : ''}`,
          timestamp: new Date(),
        });
      }
    },
    
    onLowStockAlert: (alertItems) => {
      alertItems.forEach(item => {
        addNotification({
          id: `low-stock-${item.id}`,
          type: 'warning',
          title: 'Low Stock Alert',
          message: `${item.name} is running low (${item.quantity} ${item.unit} remaining)`,
          timestamp: new Date(),
          persistent: true,
          actions: [
            {
              label: 'Reorder',
              action: 'reorder',
              data: { itemId: item.id }
            },
            {
              label: 'Acknowledge',
              action: 'acknowledge',
              data: { itemId: item.id }
            }
          ]
        });
      });
    },
    
    onOutOfStockAlert: (itemId) => {
      const item = items.find(i => i.id === itemId);
      if (item) {
        addNotification({
          id: `out-of-stock-${itemId}`,
          type: 'error',
          title: 'Out of Stock',
          message: `${item.name} is now out of stock!`,
          timestamp: new Date(),
          persistent: true,
          actions: [
            {
              label: 'Reorder Now',
              action: 'reorder',
              data: { itemId, urgent: true }
            }
          ]
        });
      }
    },
  });

  // Check for items being edited by others
  const getItemEditStatus = (itemId: string) => {
    return editingItems.get(itemId);
  };

  return {
    startEditing,
    stopEditing,
    acknowledgeLowStock,
    getItemEditStatus,
    editingItems,
  };
}