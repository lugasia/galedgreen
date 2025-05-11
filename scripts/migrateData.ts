// This script is a placeholder for MongoDB data migration.
// It needs to be updated with MongoDB connection logic and data insertion methods.

// import { MongoClient } from 'mongodb'; // Example MongoDB driver
import type { Plant, Category } from '@/lib/types'; // Assuming types remain similar
import fs from 'node:fs';
import path from 'node:path';

// Placeholder: Replace with your MongoDB connection string and database/collection names
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'plantNurseryDB'; // Example database name
const PLANTS_COLLECTION = 'plants';
const CATEGORIES_COLLECTION = 'categories';

// Expected structure of a row from the Google Sheet (after parsing to JSON)
interface SheetPlantData {
  'שם הצמח': string;
  'קטגוריה': string;
  'גובה מקסימלי': string;
  'תנאי אור': string;
  'השקיה': string;
  'שימושים': string;
  'תמונה': string; // URL
  'מלאי': number | string;
  'תיאור נוסף'?: string;
}

const JSON_DATA_PATH = './plant-data.json';

async function connectToDB() {
  // const client = new MongoClient(MONGO_URI);
  // await client.connect();
  // return client.db(DB_NAME);
  console.warn("MongoDB connection logic not yet implemented in migrateDataMongo.ts");
  return null; // Placeholder
}

async function getOrCreateCategory(db: any, name: string): Promise<string | null> {
  if (!db) return null; // Return null if db connection failed
  const trimmedName = name ? name.trim() : '';
  if (!trimmedName) {
    console.warn(`Invalid or empty category name received. Using default category 'Uncategorized'.`);
    name = 'Uncategorized';
  } else {
    name = trimmedName;
  }

  const categoriesCollection = db.collection(CATEGORIES_COLLECTION);
  let category = await categoriesCollection.findOne({ name: name });

  if (category) {
    return category._id.toString();
  } else {
    console.log(`Category "${name}" not found, creating new one.`);
    const newCategoryData = { name: name, icon: 'Tags' }; // Default icon
    try {
      const result = await categoriesCollection.insertOne(newCategoryData);
      console.log(`Created category: ${name} (ID: ${result.insertedId})`);
      return result.insertedId.toString();
    } catch (e) {
      console.error(`Failed to create category "${name}":`, e);
      throw e; 
    }
  }
}

async function migratePlants(db: any, plantData: SheetPlantData[]) {
  if (!db) {
    console.error("Database connection failed. Migration aborted.");
    return;
  }

  const plantsCollection = db.collection(PLANTS_COLLECTION);
  let migratedCount = 0;
  let skippedCount = 0;

  console.log(`Starting migration for ${plantData.length} plants to MongoDB...`);

  for (const [index, item] of plantData.entries()) {
    const plantName = String(item['שם הצמח'] || '').trim();
    if (!plantName) {
      console.warn(`Skipping row ${index + 1} due to missing or empty plant name:`, item);
      skippedCount++;
      continue;
    }

    const categoryName = String(item['קטגוריה'] || 'Uncategorized').trim();
    let categoryId: string | null;
    try {
        categoryId = await getOrCreateCategory(db, categoryName);
        if (!categoryId) {
          console.error(`Could not process category for plant "${plantName}". Skipping this plant.`);
          skippedCount++;
          continue;
        }
    } catch (error) {
        console.error(`Error processing category for plant "${plantName}":`, error);
        skippedCount++;
        continue;
    }
    
    let stock = 0;
    if (item['מלאי'] !== undefined && item['מלאי'] !== null && String(item['מלאי']).trim() !== '') {
        const parsedStock = parseInt(String(item['מלאי']), 10);
        if (!isNaN(parsedStock)) {
            stock = parsedStock;
        } else {
            console.warn(`Invalid stock value for "${plantName}": "${item['מלאי']}". Setting stock to 0.`);
        }
    } else {
        console.warn(`Missing stock value for "${plantName}". Setting stock to 0.`);
    }

    const plantDocData = {
      name: plantName,
      categoryId: categoryId, // Store category ID as string
      imageUrl: item['תמונה'] && String(item['תמונה']).trim() !== '' ? String(item['תמונה']).trim() : `https://picsum.photos/seed/${encodeURIComponent(plantName)}/400/300`,
      height: String(item['גובה מקסימלי'] || 'N/A').trim(),
      watering: String(item['השקיה'] || 'N/A').trim(),
      uses: String(item['שימושים'] || 'N/A').trim(),
      light: String(item['תנאי אור'] || 'N/A').trim(),
      stock: stock,
      description: String(item['תיאור נוסף'] || '').trim(),
      createdAt: new Date(), // Use JavaScript Date objects for MongoDB
      updatedAt: new Date(), // Use JavaScript Date objects for MongoDB
    };

    try {
      await plantsCollection.insertOne(plantDocData);
      migratedCount++;
      console.log(`Migrated ${plantName}`);
    } catch (e) {
      console.error(`Error inserting plant "${plantName}":`, e);
      skippedCount++;
    }
  }
  
  console.log(`\nMigration Summary:`);
  console.log(`--------------------`);
  console.log(`Total plants processed (rows in JSON): ${plantData.length}`);
  console.log(`Successfully migrated: ${migratedCount}`);
  console.log(`Skipped: ${skippedCount}`);

  if (migratedCount > 0) {
    console.log("\nIMPORTANT: Image URLs are from the original sheet. Consider migrating them to a suitable storage solution for MongoDB.");
  }
  console.log("Data migration to MongoDB complete (simulated).");
}

async function main() {
  console.log("Starting data migration script for Gal-Ed Greens (MongoDB)...");
  console.log("===================================================");
  console.log("INFO: This script reads plant data from 'plant-data.json' in your project root.");
  console.log("      It assumes the JSON is an array of objects matching the Google Sheet structure.");
  console.log("      Example object: { \"שם הצמח\": \"Aloe Vera\", \"קטגוריה\": \"Succulents\", ... }");
  console.log("      Categories will be created if they don't exist (with a default 'Tags' icon).");
  console.log("      Image URLs from the sheet are stored directly.");
  console.log("WARNING: Ensure your MongoDB instance is running and accessible.");
  console.log("         Backup your MongoDB data before running if you have existing data.");
  console.log("------------------------------------------------------------------------------------");
  
  let plantData: SheetPlantData[] = [];
  try {
    const filePath = path.resolve(process.cwd(), JSON_DATA_PATH);

    if (!fs.existsSync(filePath)) {
      console.error(`ERROR: Data file not found at ${filePath}`);
      console.error(`Please create '${JSON_DATA_PATH}' in your project root with the plant data (array of objects).`);
      console.error("You can typically export a Google Sheet as CSV, then convert it to JSON. Ensure the JSON is an array of objects.");
      console.log("Migration aborted.");
      return;
    }

    const fileContents = fs.readFileSync(filePath, 'utf-8');
    plantData = JSON.parse(fileContents);

    if (!Array.isArray(plantData)) {
      console.error(`ERROR: Data in ${JSON_DATA_PATH} is not a JSON array. Please check the file format.`);
      console.log("Migration aborted.");
      return;
    }
    if (plantData.length === 0) {
      console.log("INFO: No plant data found in the JSON file. Nothing to migrate.");
      console.log("Migration finished.");
      return;
    }
    
    const dbInstance = await connectToDB();
    if (dbInstance) {
      await migratePlants(dbInstance, plantData);
      // Close MongoDB connection if necessary
      // await dbInstance.client.close();
    } else {
      console.error("Failed to connect to MongoDB. Migration cannot proceed.");
    }

  } catch (error) {
    console.error("FATAL ERROR during migration process:", error);
    if (error instanceof SyntaxError) {
        console.error("This might be due to an invalid JSON format in 'plant-data.json'. Please validate the JSON (e.g., using an online JSON validator).");
    }
    console.log("Migration aborted due to error.");
  } finally {
    console.log("===================================================");
    console.log("MongoDB migration script finished execution.");
  }
}

// How to run this script:
// 1. Ensure you have a MongoDB instance running and accessible.
// 2. Set the MONGODB_URI environment variable (e.g., in a .env file if not already set).
// 3. Create `plant-data.json` in the project root.
// 4. Install the MongoDB driver: `npm install mongodb`
// 5. Run from your project root: `npx tsx ./scripts/migrateDataMongo.ts` 
//    (or `yarn migrate:data` if you updated package.json script)

main();