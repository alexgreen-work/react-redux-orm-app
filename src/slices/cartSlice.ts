// src/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  productId: number;
  variationId: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

interface AddToCartPayload {
  productId: number;
  variationId: number;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<AddToCartPayload>) {
      const { productId, variationId } = action.payload;
      const existingItem = state.items.find(
        item => item.productId === productId && item.variationId === variationId
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ productId, variationId, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<{ productId: number; variationId: number }>) {
      state.items = state.items.filter(
        item => !(item.productId === action.payload.productId && item.variationId === action.payload.variationId)
      );
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
