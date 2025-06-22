import { z } from 'zod';

export const CreateInventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  quantity: z.number().int().min(0),
  minQuantity: z.number().int().min(0),
  maxQuantity: z.number().int().min(0).optional(),
  unit: z.string().min(1, 'Unit is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  sublocation: z.string().optional(),
  cost: z.number().min(0).optional(),
  price: z.number().min(0).optional(),
  supplier: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  expiryDate: z.date().optional(),
});

export const UpdateInventoryItemSchema = CreateInventoryItemSchema.partial();

export const InventoryMovementSchema = z.object({
  itemId: z.string(),
  type: z.enum(['in', 'out', 'adjustment', 'transfer']),
  quantity: z.number().int().min(1),
  fromLocation: z.string().optional(),
  toLocation: z.string().optional(),
  reason: z.string().optional(),
  reference: z.string().optional(),
});

export const InventoryCountSchema = z.object({
  itemId: z.string(),
  actualQuantity: z.number().int().min(0),
  location: z.string(),
  notes: z.string().optional(),
});

export type CreateInventoryItemInput = z.infer<typeof CreateInventoryItemSchema>;
export type UpdateInventoryItemInput = z.infer<typeof UpdateInventoryItemSchema>;
export type InventoryMovementInput = z.infer<typeof InventoryMovementSchema>;
export type InventoryCountInput = z.infer<typeof InventoryCountSchema>;