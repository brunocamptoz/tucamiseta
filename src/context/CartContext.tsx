"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { CartItem } from "@/types/product";

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; productId: string; size: string }
  | { type: "SET_QUANTITY"; productId: string; size: string; quantity: number }
  | { type: "LOAD"; items: CartItem[] }
  | { type: "CLEAR" };

const STORAGE_KEY = "camisetas10:cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) =>
          item.productId === action.item.productId &&
          item.size === action.item.size
      );
      if (existing) {
        return {
          items: state.items.map((item) =>
            item === existing
              ? { ...item, quantity: item.quantity + action.item.quantity }
              : item
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (item) =>
            !(item.productId === action.productId && item.size === action.size)
        ),
      };
    case "SET_QUANTITY":
      return {
        items: state.items.map((item) =>
          item.productId === action.productId && item.size === action.size
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    case "LOAD":
      return { items: action.items };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        dispatch({ type: "LOAD", items: JSON.parse(raw) });
      } catch {
        // ignore corrupted cart data
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const total = state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return {
      items: state.items,
      itemCount,
      total,
      addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
      removeItem: (productId, size) =>
        dispatch({ type: "REMOVE_ITEM", productId, size }),
      setQuantity: (productId, size, quantity) =>
        dispatch({ type: "SET_QUANTITY", productId, size, quantity }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
