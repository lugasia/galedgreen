import fs from 'node:fs/promises';
import path from 'node:path';
import { MongoClient } from 'mongodb';
import type { Plant, Category } from '../src/lib/types';

const MONGODB_URI = 'mongodb+srv://amir:5OPBfitlnpv4zx6h@cluster0.w5zcbbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'greendb';
const JSON_DATA_PATH = path.resolve(process.cwd(), 'plant-data.json');

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

async function importData() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);

  try {
    // Read and parse JSON data
    const fileContents = await fs.readFile(JSON_DATA_PATH, 'utf-8');
    const jsonData: RawPlantData[] = JSON.parse(fileContents);

    // Extract and import categories
    const categoryNames = new Set<string>();
    jsonData.forEach(item => {
      if (item.Category && item.Category.trim() !== "") {
        categoryNames.add(item.Category.trim());
      }
    });

    const categories: Category[] = Array.from(categoryNames).map((name, index) => ({
      id: name.toLowerCase().replace(/\s+/g, '-') || `category-${index}`,
      name: name,
      icon: 'Tags',
    })).sort((a, b) => a.name.localeCompare(b.name));

    // Add default category if none exists
    if (categories.length === 0) {
      categories.push({
        id: "uncategorized",
        name: "Uncategorized",
        icon: "Tags"
      });
    }

    // Import categories
    const categoriesCollection = db.collection('categories');
    await categoriesCollection.deleteMany({}); // Clear existing categories
    await categoriesCollection.insertMany(categories);
    console.log(`Imported ${categories.length} categories`);

    // Create category map for plant import
    const categoryMap = new Map(categories.map(cat => [cat.name, cat.id]));
    const defaultCategory = categories.find(cat => cat.name.toLowerCase() === "uncategorized") || categories[0];
    const defaultCategoryId = defaultCategory.id;

    // Import plants
    const plants: Plant[] = jsonData
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
      .filter(plant => plant !== null) as Plant[];

    const plantsCollection = db.collection('plants');
    await plantsCollection.deleteMany({}); // Clear existing plants
    await plantsCollection.insertMany(plants);
    console.log(`Imported ${plants.length} plants`);

    // Import default settings
    const settingsCollection = db.collection('settings');
    await settingsCollection.deleteMany({}); // Clear existing settings
    await settingsCollection.insertOne({
      id: 'appConfig',
      siteName: 'GreenDB',
      siteDescription: 'Your Plant Database',
      contactEmail: 'contact@greendb.com',
      contactPhone: '',
      address: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
      },
      theme: {
        primaryColor: '#4CAF50',
        secondaryColor: '#8BC34A',
        accentColor: '#FFC107',
      },
      features: {
        enableOrders: true,
        enableReviews: true,
        enableWishlist: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('Imported default settings');

    console.log('Data import completed successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await client.close();
  }
}

importData().catch(console.error); 