'use server';
import type { Category } from '@/lib/types';
import { getCollection } from './mongodbService';
import { ObjectId } from 'mongodb';

interface MongoCategory extends Category {
  _id: ObjectId;
}

function mapMongoCategoryToCategory(mongoCategory: MongoCategory): Category {
  const { _id, ...categoryData } = mongoCategory;
  return categoryData;
}

export async function getCategories(): Promise<Category[]> {
  const collection = await getCollection('categories');
  const mongoCategories = await collection.find({}).toArray() as MongoCategory[];
  return mongoCategories.map(mapMongoCategoryToCategory);
}

export async function addCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
  const collection = await getCollection('categories');
  const newCategory: Omit<MongoCategory, '_id'> = {
    id: categoryData.name.toLowerCase().replace(/\s+/g, '-') || `category-${Date.now()}`,
    ...categoryData
  };

  const result = await collection.insertOne(newCategory);
  const insertedCategory = await collection.findOne({ _id: result.insertedId }) as MongoCategory;
  return mapMongoCategoryToCategory(insertedCategory);
}

export async function updateCategory(categoryId: string, categoryData: Partial<Omit<Category, 'id'>>): Promise<void> {
  const collection = await getCollection('categories');
  const result = await collection.updateOne(
    { id: categoryId },
    { $set: categoryData }
  );
  
  if (result.matchedCount === 0) {
    throw new Error("Category not found");
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const collection = await getCollection('categories');
  const result = await collection.deleteOne({ id: categoryId });
  
  if (result.deletedCount === 0) {
    throw new Error("Category not found for deletion");
  }
}

export async function clearCachedCategories(): Promise<void> {
  // No need to clear cache as we're using MongoDB directly
}
