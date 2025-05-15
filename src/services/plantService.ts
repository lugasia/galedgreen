'use server';
import type { Plant, Category } from '@/lib/types';
import { getCollection } from './mongodbService';
import { getCategories as getCategoriesFromService, clearCachedCategories } from './categoryService';
import { ObjectId } from 'mongodb';

interface RawPlantData {
  Name?: string;
  Category?: string;
  "גובה"?: string;
  "השקיה"?: string;
  "שימושים"?: string;
  Tag?: string;
  Stock?: string;
  Thumbnail?: string;
}

interface MongoPlant extends Plant {
  _id: ObjectId;
}

let allCategories: Category[] | null = null;

async function getCategoryMap(): Promise<Map<string, string>> {
  const categories = await getCategoriesFromService();
  return new Map(categories.map(cat => [cat.name, cat.id]));
}

function mapMongoPlantToPlant(mongoPlant: MongoPlant): Plant {
  const { _id, ...plantData } = mongoPlant;
  return plantData;
}

export async function getPlants(): Promise<Plant[]> {
  const collection = await getCollection('plants');
  const count = await collection.countDocuments();
  console.log('Total plants in collection:', count);
  const mongoPlants = await collection.find({}).limit(5).toArray() as MongoPlant[];
  console.log('First few plants in collection:', mongoPlants);
  return mongoPlants.map(mapMongoPlantToPlant);
}

export async function getPlantsWithCategories(): Promise<Plant[]> {
  const collection = await getCollection('plants');
  const mongoPlants = await collection.find({}).toArray() as MongoPlant[];
  const categories = await getCategoriesFromService();
  const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
  const defaultCategoryForDisplay = { id: "unknown", name: "לא משויך", icon: "Tags" };

  return mongoPlants.map(mongoPlant => {
    const plant = mapMongoPlantToPlant(mongoPlant);
    return {
      ...plant,
      category: categoryMap.get(plant.categoryId) || { ...defaultCategoryForDisplay, id: plant.categoryId },
    };
  });
}

export async function getPlantById(plantId: string): Promise<Plant | null> {
  const collection = await getCollection('plants');
  console.log('getPlantById called with plantId:', plantId);
  const query = { id: plantId };
  console.log('getPlantById query:', query);
  const allPlants = await collection.find({}).toArray();
  console.log('All plants in collection:', allPlants.map(p => p.id));
  allPlants.forEach(p => {
    const isEqual = p.id === plantId;
    console.log(`Comparing: '${p.id}' (length ${p.id.length}) === '${plantId}' (length ${plantId.length}) =>`, isEqual);
  });
  const mongoPlant = await collection.findOne(query) as MongoPlant | null;
  console.log('getPlantById result:', mongoPlant);
  if (mongoPlant) {
    const plant = mapMongoPlantToPlant(mongoPlant);
    const categories = await getCategoriesFromService();
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
    const defaultCategoryForDisplay = { id: "unknown", name: "לא משויך", icon: "Tags" };
    return { ...plant, category: categoryMap.get(plant.categoryId) || { ...defaultCategoryForDisplay, id: plant.categoryId } };
  }
  return null;
}

export async function addPlant(plantData: Omit<Plant, 'id' | 'category' | 'createdAt' | 'updatedAt'>): Promise<Plant> {
  const collection = await getCollection('plants');
  const newPlant: Omit<MongoPlant, '_id'> = {
    ...plantData,
    id: `${plantData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await collection.insertOne(newPlant);
  const insertedPlant = await collection.findOne({ _id: result.insertedId }) as MongoPlant;
  const plant = mapMongoPlantToPlant(insertedPlant);
  const category = (await getCategoriesFromService()).find(c => c.id === plant.categoryId);
  const defaultCategoryForDisplay = { id: "unknown", name: "לא משויך", icon: "Tags" };
  return { ...plant, category: category || { ...defaultCategoryForDisplay, id: plant.categoryId } };
}

export async function updatePlant(plantId: string, plantData: Partial<Omit<Plant, 'id' | 'category' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  const collection = await getCollection('plants');
  console.log('updatePlant called with:', { plantId, plantData });
  const result = await collection.updateOne(
    { id: plantId },
    { $set: { ...plantData, updatedAt: new Date() } }
  );
  console.log('updatePlant result:', result);
  if (result.matchedCount === 0) {
    console.error('updatePlant: Plant not found for update', { plantId });
    throw new Error("Plant not found for update");
  }
}

export async function deletePlant(plantId: string): Promise<void> {
  const collection = await getCollection('plants');
  const result = await collection.deleteOne({ id: plantId });
  
  if (result.deletedCount === 0) {
    throw new Error("Plant not found for deletion");
  }
}

export async function importPlantsFromJson(jsonData: RawPlantData[]): Promise<void> {
  const collection = await getCollection('plants');
  const categoryMap = await getCategoryMap();
  const defaultCategory = (await getCategoriesFromService()).find(cat => cat.name.toLowerCase() === "uncategorized") || 
                         (await getCategoriesFromService())[0];
  const defaultCategoryId = defaultCategory.id;

  const plants = jsonData
    .map((item, index) => {
      const plantName = item.Name?.trim();
      if (!plantName) return null;

      const categoryName = item.Category?.trim();
      let categoryId = categoryName ? categoryMap.get(categoryName) : defaultCategoryId;
      
      if (!categoryId && categoryName) {
        console.warn(`Plant "${plantName}" has category "${categoryName}" but no matching ID found. Assigning to default category "${defaultCategory.name}".`);
        categoryId = defaultCategoryId;
      } else if (!categoryId && !categoryName) {
        categoryId = defaultCategoryId;
      }
      
      let stock = 0;
      if (item.Stock !== undefined && item.Stock !== null && String(item.Stock).trim() !== '') {
        const parsedStock = parseInt(String(item.Stock), 10);
        if (!isNaN(parsedStock)) {
          stock = parsedStock;
        }
      }

      let imageUrl = `https://picsum.photos/seed/${encodeURIComponent(plantName)}/400/300`;
      const rawThumbnail = item.Thumbnail;
      if (rawThumbnail) {
        let cleanedThumbnail = String(rawThumbnail).replace(/[\n\r]+/g, ' ').trim();
        if (cleanedThumbnail && (cleanedThumbnail.startsWith('http://') || cleanedThumbnail.startsWith('https://'))) {
          try {
            new URL(cleanedThumbnail);
            imageUrl = cleanedThumbnail;
          } catch (e) {
            console.warn(`Invalid URL structure for plant "${plantName}" thumbnail: "${cleanedThumbnail}". Using placeholder.`);
          }
        }
      }
      
      return {
        id: `${plantName.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        name: plantName,
        categoryId: categoryId || defaultCategoryId,
        imageUrl: imageUrl,
        height: item["גובה"]?.trim() || 'N/A',
        watering: item["השקיה"]?.trim() || 'N/A',
        uses: item["שימושים"]?.trim() || 'N/A',
        light: item.Tag?.trim() || 'N/A',
        stock: stock,
        description: item["שימושים"]?.trim() || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    })
    .filter(plant => plant !== null) as Omit<MongoPlant, '_id'>[];

  if (plants.length > 0) {
    await collection.insertMany(plants);
  }
}

export async function clearCachedPlantData(): Promise<void> {
  allCategories = null;
  await clearCachedCategories();
}
