'use client';

import React from 'react';
import { MobileCard, TouchButton } from '@itemseek2/ui-mobile';
import { useRealtimeSync } from '../hooks/useRealtimeSync';
import type { InventoryItem as Item } from '../lib/store';

interface InventoryItemProps {
  item: Item;
  onUpdate: (quantity: number) => void;
  isBeingEdited?: boolean;
  editedBy?: string;
}

export function InventoryItem({ item, onUpdate, isBeingEdited, editedBy }: InventoryItemProps) {
  const isLowStock = item.quantity <= item.minQuantity;
  const { startEditing, stopEditing } = useRealtimeSync();
  
  const handleQuantityUpdate = (newQuantity: number) => {
    startEditing(item.id);
    onUpdate(newQuantity);
    // Stop editing after a short delay to show the update
    setTimeout(() => stopEditing(item.id), 1000);
  };
  
  return (
    <MobileCard className={`mb-3 relative ${isBeingEdited ? 'ring-2 ring-blue-400' : ''}`}>
      {isBeingEdited && editedBy && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
          {editedBy} editing...
        </div>
      )}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
          <p className="text-sm text-gray-500">Location: {item.location}</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
            {item.quantity}
          </p>
          <p className="text-sm text-gray-500">{item.unit}</p>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <TouchButton
          size="sm"
          variant="secondary"
          onClick={() => handleQuantityUpdate(Math.max(0, item.quantity - 1))}
        >
          -
        </TouchButton>
        <TouchButton
          size="sm"
          variant="secondary"
          onClick={() => handleQuantityUpdate(item.quantity + 1)}
        >
          +
        </TouchButton>
        {isLowStock && (
          <TouchButton size="sm" variant="danger" className="ml-auto">
            Reorder
          </TouchButton>
        )}
      </div>
    </MobileCard>
  );
}