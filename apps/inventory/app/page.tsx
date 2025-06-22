'use client';

import { useState } from 'react';
import { 
  MobileNav, 
  MobileCard, 
  TouchButton,
  BottomSheet,
  SwipeableList,
  SwipeableListItem
} from '@itemseek2/ui-mobile';
import { useInventoryStore } from '../lib/store';
import { useRealtimeSync } from '../hooks/useRealtimeSync';
import { InventoryItem } from '../components/InventoryItem';
import { QuickActions } from '../components/QuickActions';
import { SearchBar } from '../components/SearchBar';
import { NotificationCenter } from '../components/NotificationCenter';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { NetworkErrorHandler } from '../components/NetworkErrorHandler';

const navItems = [
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'scan', label: 'Scan', icon: '📷' },
  { id: 'orders', label: 'Orders', icon: '📋' },
  { id: 'reports', label: 'Reports', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { items, updateQuantity, deleteItem } = useInventoryStore();
  const { editingItems } = useRealtimeSync();

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Connection Status */}
      <ConnectionStatus />
      
      {/* Network Error Handler */}
      <NetworkErrorHandler />
      
      {/* Notifications */}
      <NotificationCenter />
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 safe-area-top">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4">
        <QuickActions onActionSelect={() => setIsQuickActionOpen(true)} />
      </div>

      {/* Inventory List */}
      <SwipeableList className="px-4">
        {filteredItems.map((item) => (
          <SwipeableListItem
            key={item.id}
            rightActions={[
              {
                id: 'delete',
                label: 'Delete',
                color: 'danger',
                onClick: () => deleteItem(item.id)
              }
            ]}
          >
            <InventoryItem
              item={item}
              onUpdate={(quantity) => updateQuantity(item.id, quantity)}
              isBeingEdited={editingItems.has(item.id)}
              editedBy={editingItems.get(item.id)}
            />
          </SwipeableListItem>
        ))}
      </SwipeableList>

      {/* Add Item Button */}
      <div className="fixed bottom-24 right-4 z-20">
        <TouchButton
          variant="primary"
          size="lg"
          className="rounded-full shadow-lg"
          onClick={() => setIsQuickActionOpen(true)}
        >
          +
        </TouchButton>
      </div>

      {/* Bottom Navigation */}
      <MobileNav
        items={navItems}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {/* Quick Action Sheet */}
      <BottomSheet
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        title="Quick Actions"
      >
        <div className="space-y-3">
          <TouchButton fullWidth variant="primary">
            Add New Item
          </TouchButton>
          <TouchButton fullWidth variant="secondary">
            Scan Barcode
          </TouchButton>
          <TouchButton fullWidth variant="secondary">
            Import from CSV
          </TouchButton>
          <TouchButton fullWidth variant="secondary">
            Quick Count
          </TouchButton>
        </div>
      </BottomSheet>
    </div>
  );
}