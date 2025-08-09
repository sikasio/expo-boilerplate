/**
 * Generic cart types that can be used by any app
 */

export interface BaseProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
  [key: string]: any; // Allow additional properties for app-specific products
}

export interface CartItem<T extends BaseProduct = BaseProduct> {
  id: number;
  product: T;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedVariant?: string;
  addedAt: string; // ISO string for better serialization
  [key: string]: any; // Allow additional properties for app-specific cart items
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
}

export interface CartConfiguration {
  freeShippingThreshold?: number;
  taxRate?: number;
  defaultShippingCost?: number;
}

// Default cart configuration
export const DEFAULT_CART_CONFIG: CartConfiguration = {
  freeShippingThreshold: 100,
  taxRate: 0.08,
  defaultShippingCost: 10
};