import { StorageService } from './storage';
import { CartItem, BaseProduct, CartSummary, CartConfiguration, DEFAULT_CART_CONFIG } from '../types/cart';

const CART_STORAGE_KEY = 'cart_items';

export class CartService<T extends BaseProduct = BaseProduct> {
  private config: CartConfiguration;

  constructor(config?: CartConfiguration) {
    this.config = { ...DEFAULT_CART_CONFIG, ...config };
  }

  async getCartItems(): Promise<CartItem<T>[]> {
    try {
      const cartItems = await StorageService.getAppObject<CartItem<T>[]>(CART_STORAGE_KEY);
      return cartItems || [];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  async saveCartItems(cartItems: CartItem<T>[]): Promise<void> {
    try {
      await StorageService.setAppObject(CART_STORAGE_KEY, cartItems);
    } catch (error) {
      console.error('Error saving cart items:', error);
      throw error;
    }
  }

  async addToCart(item: CartItem<T>): Promise<void> {
    try {
      const cartItems = await this.getCartItems();
      
      // Check if item already exists in cart (match by id, color, size, variant)
      const existingItemIndex = cartItems.findIndex(
        cartItem => cartItem.id === item.id && 
        cartItem.selectedColor === item.selectedColor && 
        cartItem.selectedSize === item.selectedSize &&
        cartItem.selectedVariant === item.selectedVariant
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item to cart
        cartItems.push({
          ...item,
          addedAt: new Date().toISOString()
        });
      }

      await this.saveCartItems(cartItems);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateCartItem(itemId: number, updates: Partial<CartItem<T>>): Promise<void> {
    try {
      const cartItems = await this.getCartItems();
      const itemIndex = cartItems.findIndex(item => item.id === itemId);

      if (itemIndex >= 0) {
        cartItems[itemIndex] = { ...cartItems[itemIndex], ...updates };
        await this.saveCartItems(cartItems);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  async removeFromCart(itemId: number): Promise<void> {
    try {
      const cartItems = await this.getCartItems();
      const filteredItems = cartItems.filter(item => item.id !== itemId);
      await this.saveCartItems(filteredItems);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async updateQuantity(itemId: number, quantity: number): Promise<void> {
    try {
      if (quantity <= 0) {
        await this.removeFromCart(itemId);
        return;
      }

      await this.updateCartItem(itemId, { quantity });
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }

  async clearCart(): Promise<void> {
    try {
      await StorageService.removeAppItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  async getCartSummary(): Promise<CartSummary> {
    try {
      const cartItems = await this.getCartItems();
      const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      const shipping = subtotal >= (this.config.freeShippingThreshold || 100) 
        ? 0 
        : (this.config.defaultShippingCost || 10);
      
      const tax = subtotal * (this.config.taxRate || 0.08);
      const discount = 0; // Can be extended for discount logic
      const total = subtotal + shipping + tax - discount;

      return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        itemCount
      };
    } catch (error) {
      console.error('Error calculating cart summary:', error);
      return {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0,
        itemCount: 0
      };
    }
  }

  async isInCart(productId: number): Promise<boolean> {
    try {
      const cartItems = await this.getCartItems();
      return cartItems.some(item => item.id === productId);
    } catch (error) {
      console.error('Error checking if item is in cart:', error);
      return false;
    }
  }

  // Utility methods
  async getTotalItems(): Promise<number> {
    const summary = await this.getCartSummary();
    return summary.itemCount;
  }

  async getSubtotal(): Promise<number> {
    const summary = await this.getCartSummary();
    return summary.subtotal;
  }
}

// Create a default instance for backward compatibility
export const defaultCartService = new CartService();