import { google } from 'googleapis';
import { MongoClient } from 'mongodb';
import type { Plant, Category } from '../src/lib/types';
import path from 'path';
import fs from 'fs/promises';

// MongoDB configuration
const MONGODB_URI = 'mongodb+srv://amir:5OPBfitlnpv4zx6h@cluster0.w5zcbbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'greendb';

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SHEET_ID = '1QnXwXwXwXwXwXwXwXwXwXwXwXwXwXwXwXwXwXwXwXwXw'; // Replace with your sheet ID
const RANGE = 'Sheet1!A2:H'; // Adjust based on your sheet's range

interface SheetPlantData {
  'שם הצמח': string;
  'קטגוריה': string;
  'גובה מקסימלי': string;
  'תנאי אור': string;
  'השקיה': string;
  'שימושים': string;
  'תמונה': string;
  'מלאי': string;
}

async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), 'credentials.json'),
    scopes: SCOPES,
  });

  return google.sheets({ version: 'v4', auth });
}

async function downloadImage(url: string, plantName: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const buffer = await response.arrayBuffer();
    const imagePath = path.join(process.cwd(), 'public', 'images', `${plantName.toLowerCase().replace(/\s+/g, '-')}.jpg`);
    
    await fs.mkdir(path.dirname(imagePath), { recursive: true });
    await fs.writeFile(imagePath, Buffer.from(buffer));
    
    return `/images/${plantName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  } catch (error) {
    console.error(`Error downloading image for ${plantName}:`, error);
    return `https://picsum.photos/seed/${encodeURIComponent(plantName)}/400/300`;
  }
}

async function importData() {
  const sheets = await getGoogleSheetsClient();
  const mongoClient = await MongoClient.connect(MONGODB_URI);
  const db = mongoClient.db(DB_NAME);

  try {
    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in the sheet.');
      return;
    }

    // Process categories
    const categoryNames = new Set<string>();
    rows.forEach((row: any[]) => {
      if (row[1] && row[1].trim() !== '') {
        categoryNames.add(row[1].trim());
      }
    });

    const categories: Category[] = Array.from(categoryNames).map((name, index) => ({
      id: name.toLowerCase().replace(/\s+/g, '-') || `category-${index}`,
      name: name,
      icon: 'Tags',
    }));

    // Add default category if none exists
    if (categories.length === 0) {
      categories.push({
        id: 'uncategorized',
        name: 'Uncategorized',
        icon: 'Tags',
      });
    }

    // Import categories
    const categoriesCollection = db.collection('categories');
    await categoriesCollection.deleteMany({});
    await categoriesCollection.insertMany(categories);
    console.log(`Imported ${categories.length} categories`);

    // Create category map
    const categoryMap = new Map(categories.map(cat => [cat.name, cat.id]));
    const defaultCategory = categories.find(cat => cat.name.toLowerCase() === 'uncategorized') || categories[0];

    // Process and import plants
    const plants: Plant[] = [];
    for (const [index, row] of rows.entries()) {
      const plantName = row[0]?.trim();
      if (!plantName) {
        console.warn(`Skipping row ${index + 1} due to missing plant name`);
        continue;
      }

      const categoryName = row[1]?.trim() || 'Uncategorized';
      const categoryId = categoryMap.get(categoryName) || defaultCategory.id;

      let stock = 0;
      if (row[7] !== undefined && row[7] !== null && String(row[7]).trim() !== '') {
        const parsedStock = parseInt(String(row[7]), 10);
        if (!isNaN(parsedStock)) {
          stock = parsedStock;
        }
      }

      // Download and store image
      const imageUrl = row[6] ? await downloadImage(row[6], plantName) : 
        `https://picsum.photos/seed/${encodeURIComponent(plantName)}/400/300`;

      plants.push({
        id: `${plantName.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        name: plantName,
        categoryId: categoryId,
        imageUrl: imageUrl,
        height: row[2]?.trim() || 'N/A',
        watering: row[4]?.trim() || 'N/A',
        uses: row[5]?.trim() || 'N/A',
        light: row[3]?.trim() || 'N/A',
        stock: stock,
        description: row[5]?.trim() || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Import plants
    const plantsCollection = db.collection('plants');
    await plantsCollection.deleteMany({});
    await plantsCollection.insertMany(plants);
    console.log(`Imported ${plants.length} plants`);

    // Import default settings
    const settingsCollection = db.collection('settings');
    await settingsCollection.deleteMany({});
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
    await mongoClient.close();
  }
}

importData().catch(console.error); 