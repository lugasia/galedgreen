import type { LucideIcon } from 'lucide-react';
// Removed: import type { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  icon?: string; // Store Lucide icon name as string
}

export interface Plant {
  id: string;
  name:string;
  categoryId: string; 
  category?: Category; // Optional: for client-side convenience after resolving
  imageUrl: string;
  imageBase64?: string; // Add this line for base64 images
  height: string; 
  watering: string; 
  uses: string; 
  light: string; 
  stock: number;
  description?: string;
  createdAt?: Date; // Changed from Timestamp
  updatedAt?: Date; // Changed from Timestamp
}

export interface CartItem extends Plant {
  quantity: number;
}

export interface OrderItem {
  plantId: string;
  plantName: string;
  quantity: number;
  price: number; // Assuming price is always 0 for now
}

export interface Order {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number; 
  status: "open" | "closed" | "canceled";
  createdAt: Date; // Changed from Timestamp
  updatedAt?: Date; // Changed from Timestamp
  whatsappMessage?: string; 
}

export interface AppSettings {
  id?: string; // Document ID in Firestore, e.g., "current"
  nurseryName: string;
  whatsappNumber: string;
  nurseryEmail: string;
}

// Default settings, used as a fallback or initial state
export const defaultSettings: AppSettings = {
  nurseryName: "משתלת גל-עד",
  whatsappNumber: "", // Admin should fill this via settings page
  nurseryEmail: "", // Admin should fill this via settings page
};