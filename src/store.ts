// src/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ormReducer from './ormReducer';
import cartReducer, { CartState } from './slices/cartSlice';
import ordersReducer, { OrdersState } from './slices/ordersSlice';

// Универсальная функция для загрузки состояния из localStorage по ключу
function loadState<T>(key: string): T | undefined {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as T;
  } catch (error) {
    console.error(`Ошибка загрузки состояния для ${key}:`, error);
    return undefined;
  }
}

// Универсальная функция для сохранения состояния в localStorage по ключу
function saveState<T>(key: string, state: T) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error(`Ошибка сохранения состояния для ${key}:`, error);
  }
}

const preloadedCartState = loadState<CartState>('cart');
const preloadedOrdersState = loadState<OrdersState>('orders');

const rootReducer = combineReducers({
  orm: ormReducer,
  cart: cartReducer,
  orders: ordersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    cart: preloadedCartState,
    orders: preloadedOrdersState,
  },
});

store.subscribe(() => {
  const state = store.getState();
  saveState<CartState>('cart', state.cart);
  saveState<OrdersState>('orders', state.orders);
});

export type AppDispatch = typeof store.dispatch;
