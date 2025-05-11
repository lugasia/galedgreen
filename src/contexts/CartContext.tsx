"use client";

import type { Plant, CartItem } from "@/lib/types";
import React, { createContext, useReducer, useContext, useEffect, type ReactNode } from "react";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Plant }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const initialState: CartState = {
  items: [],
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (plant: Plant) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getTotalItems: () => number;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "LOAD_CART":
      return { ...state, items: action.payload };
    case "ADD_ITEM":
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex > -1) {
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
        return { ...state, items: updatedItems };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item
        ).filter(item => item.quantity > 0), // Remove if quantity is 0
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("galEdGreensCart");
      if (storedCart) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(storedCart) });
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("galEdGreensCart", JSON.stringify(state.items));
    }
  }, [state.items]);

  const addToCart = (plant: Plant) => dispatch({ type: "ADD_ITEM", payload: plant });
  const removeFromCart = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: { id } });
  const updateQuantity = (id: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const getCartTotal = () => {
    // Assuming plants are free, so total is always 0. If prices are added, calculate here.
    return 0;
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };
  

  return (
    <CartContext.Provider value={{ state, dispatch, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
