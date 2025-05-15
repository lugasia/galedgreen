'use server';
// import { db } from '@/lib/firebase'; // Firebase import removed
import type { Order, OrderItem } from '@/lib/types';
import { getCollection } from './mongodbService';
import { ObjectId } from 'mongodb';
import { updatePlant } from './plantService';
import { getPlantById } from './plantService';
// import { collection, getDocs, addDoc, doc, updateDoc, query, orderBy, Timestamp, serverTimestamp } from 'firebase/firestore';

// const ORDERS_COLLECTION = 'orders';

interface MongoOrder extends Order {
  _id: ObjectId;
}

function mapMongoOrderToOrder(mongoOrder: MongoOrder): Order {
  const { _id, ...orderData } = mongoOrder;
  return orderData;
}

// Mock data for demonstration purposes
let mockOrders: Order[] = [];

// Helper to simulate server-side delay and potential errors
const simulateApiCall = <T>(data: T, shouldFail = false): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Simulated network error"));
      } else {
        resolve(JSON.parse(JSON.stringify(data))); // Deep clone for objects/arrays
      }
    }, 500);
  });
};

export async function getOrders(): Promise<Order[]> {
  const collection = await getCollection('orders');
  const mongoOrders = await collection.find({}).sort({ createdAt: -1 }).toArray() as MongoOrder[];
  return mongoOrders.map(mapMongoOrderToOrder);
}

export async function addOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  const collection = await getCollection('orders');
  const newOrder: Omit<MongoOrder, '_id'> = {
    ...orderData,
    id: `order_${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Decrease stock for each plant in the order
  for (const item of orderData.items) {
    const plant = await getPlantById(item.plantId);
    if (!plant) {
      throw new Error(`Plant with ID ${item.plantId} not found.`);
    }
    if (plant.stock < item.quantity) {
      throw new Error(`Insufficient stock for plant ${plant.name}. Available: ${plant.stock}, requested: ${item.quantity}.`);
    }
    await updatePlant(item.plantId, { stock: plant.stock - item.quantity });
  }
  
  const result = await collection.insertOne(newOrder);
  const insertedOrder = await collection.findOne({ _id: result.insertedId }) as MongoOrder;
  return mapMongoOrderToOrder(insertedOrder);
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const collection = await getCollection('orders');
  const order = await getOrderById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  
  // If the order is being canceled, restore the stock for each plant
  if (status === 'canceled' && order.status !== 'canceled') {
    for (const item of order.items) {
      const plant = await getPlantById(item.plantId);
      if (plant) {
        await updatePlant(item.plantId, { stock: plant.stock + item.quantity });
      }
    }
  }
  
  const result = await collection.updateOne(
    { id: orderId },
    { 
      $set: { 
        status,
        updatedAt: new Date()
      }
    }
  );
  
  if (result.matchedCount === 0) {
    throw new Error("Order not found");
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const collection = await getCollection('orders');
  const mongoOrder = await collection.findOne({ id: orderId }) as MongoOrder | null;
  return mongoOrder ? mapMongoOrderToOrder(mongoOrder) : null;
}

export async function deleteOrder(orderId: string): Promise<void> {
  const collection = await getCollection('orders');
  const result = await collection.deleteOne({ id: orderId });
  
  if (result.deletedCount === 0) {
    throw new Error("Order not found for deletion");
  }
}

// Function to initialize mock orders if needed for testing
export async function initializeMockOrders(orders: Order[]): Promise<void> {
  mockOrders = orders.map(order => ({
    ...order,
    // Ensure createdAt is a Date object if it's coming from JSON/Timestamp-like structure
    createdAt: order.createdAt ? new Date((order.createdAt as any).seconds ? (order.createdAt as any).seconds * 1000 : order.createdAt) : new Date(),
    updatedAt: order.updatedAt ? new Date((order.updatedAt as any).seconds ? (order.updatedAt as any).seconds * 1000 : order.updatedAt) : new Date(),
  }));
  console.log("Mock orders initialized.");
}