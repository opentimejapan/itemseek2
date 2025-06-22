'use client';

import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { useWebSocketStore } from './store';

interface InventoryCallbacks {
  onItemCreated?: (item: any) => void;
  onItemUpdated?: (data: { item: any; changes: any }) => void;
  onItemDeleted?: (itemId: string) => void;
  onQuantityChanged?: (data: {
    itemId: string;
    previousQuantity: number;
    newQuantity: number;
    reason?: string;
  }) => void;
  onLowStockAlert?: (items: any[]) => void;
  onOutOfStockAlert?: (itemId: string) => void;
  onMovementCreated?: (movement: any) => void;
  onCountCompleted?: (count: any) => void;
}

export function useRealtimeInventory(callbacks: InventoryCallbacks = {}) {
  const { setItemEditing } = useWebSocketStore();
  
  const events = {
    'inventory:item:created': callbacks.onItemCreated || (() => {}),
    'inventory:item:updated': callbacks.onItemUpdated || (() => {}),
    'inventory:item:deleted': callbacks.onItemDeleted || (() => {}),
    'inventory:quantity:changed': callbacks.onQuantityChanged || (() => {}),
    'inventory:lowstock:alert': callbacks.onLowStockAlert || (() => {}),
    'inventory:outofstock:alert': callbacks.onOutOfStockAlert || (() => {}),
    'inventory:movement:created': callbacks.onMovementCreated || (() => {}),
    'inventory:count:completed': callbacks.onCountCompleted || (() => {}),
    
    // Collaborative editing
    'inventory:item:locked': (data: { itemId: string; lockedBy: string }) => {
      setItemEditing(data.itemId, data.lockedBy);
    },
    'inventory:item:unlocked': (data: { itemId: string }) => {
      setItemEditing(data.itemId, null);
    },
  };

  const { emit } = useWebSocket(events);

  // Editing notifications
  const startEditing = (itemId: string) => {
    emit('inventory:item:editing', itemId);
  };

  const stopEditing = (itemId: string) => {
    emit('inventory:item:editing:done', itemId);
  };

  // Bulk operations
  const startBulkOperation = (type: string, itemIds: string[]) => {
    emit('inventory:bulk:start', { type, itemIds });
  };

  // Low stock acknowledgment
  const acknowledgeLowStock = (itemId: string) => {
    emit('inventory:lowstock:acknowledge', itemId);
  };

  return {
    startEditing,
    stopEditing,
    startBulkOperation,
    acknowledgeLowStock,
  };
}