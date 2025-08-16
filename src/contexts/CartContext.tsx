import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, BaseProduct, CartSummary, CartConfiguration } from '../types/cart';
import { CartService } from '../services/cart';
import { logger } from '@/utils/logger';

interface CartContextType<T extends BaseProduct = BaseProduct> {
  cartItems: CartItem<T>[];
  loading: boolean;
  totalItems: number;
  subtotal: number;
  cartSummary: CartSummary;
  addToCart: (item: CartItem<T>) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps<T extends BaseProduct = BaseProduct> {
  children: ReactNode;
  config?: CartConfiguration;
}

export function CartProvider<T extends BaseProduct = BaseProduct>({ 
  children, 
  config 
}: CartProviderProps<T>) {
  const [cartItems, setCartItems] = useState<CartItem<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
    itemCount: 0
  });

  // Create cart service instance with config
  const cartService = new CartService<T>(config);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const items = await cartService.getCartItems();
      const summary = await cartService.getCartSummary();
      setCartItems(items);
      setCartSummary(summary);
    } catch (error) {
      logger.error('Error loading cart items:', error, { function: 'loadCartItems', component: 'CartProvider' });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: CartItem<T>) => {
    try {
      await cartService.addToCart(item);
      await loadCartItems();
    } catch (error) {
      logger.error('Error adding to cart:', error, { function: 'addToCart', component: 'CartProvider', itemId: item.id });
      throw error;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await cartService.updateQuantity(itemId, quantity);
      await loadCartItems();
    } catch (error) {
      logger.error('Error updating quantity:', error, { function: 'updateQuantity', component: 'CartProvider', itemId, quantity });
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await cartService.removeFromCart(itemId);
      await loadCartItems();
    } catch (error) {
      logger.error('Error removing from cart:', error, { function: 'removeFromCart', component: 'CartProvider', itemId });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await loadCartItems();
    } catch (error) {
      logger.error('Error clearing cart:', error, { function: 'clearCart', component: 'CartProvider' });
      throw error;
    }
  };

  const refreshCart = async () => {
    await loadCartItems();
  };

  const isInCart = (productId: number): boolean => {
    return cartItems.some(item => item.id === productId);
  };

  const totalItems = cartSummary.itemCount;
  const subtotal = cartSummary.subtotal;

  const value: CartContextType<T> = {
    cartItems,
    loading,
    totalItems,
    subtotal,
    cartSummary,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    isInCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart<T extends BaseProduct = BaseProduct>() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context as CartContextType<T>;
}