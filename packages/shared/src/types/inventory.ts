export interface InventoryItem {
  id: string;
  organizationId: string;
  name: string;
  sku: string;
  barcode?: string;
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  unit: string;
  category: string;
  subcategory?: string;
  location: string;
  sublocation?: string;
  cost?: number;
  price?: number;
  supplier?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  images?: string[];
  lastCountedAt?: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reason?: string;
  reference?: string;
  userId: string;
  createdAt: Date;
}

export interface InventoryCount {
  id: string;
  itemId: string;
  expectedQuantity: number;
  actualQuantity: number;
  variance: number;
  location: string;
  userId: string;
  notes?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  parentId?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  metadata?: Record<string, any>;
}

export interface Location {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  type: 'warehouse' | 'store' | 'storage' | 'other';
  address?: string;
  parentId?: string;
  capacity?: number;
  metadata?: Record<string, any>;
}