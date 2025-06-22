'use client';

import React from 'react';
import { MobileCard, TouchButton } from '@itemseek2/ui-mobile';
import type { InventoryItem as Item } from '../lib/store';

interface InventoryItemProps {
  item: Item;
  onUpdate: (quantity: number) => void;
}

export function InventoryItem({ item, onUpdate }: InventoryItemProps) {
  const isLowStock = item.quantity <= item.minQuantity;
  
  return (
    <MobileCard className="mb-3">
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
          onClick={() => onUpdate(Math.max(0, item.quantity - 1))}
        >
          -
        </TouchButton>
        <TouchButton
          size="sm"
          variant="secondary"
          onClick={() => onUpdate(item.quantity + 1)}
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