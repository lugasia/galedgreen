'use server';
// import { db } from '@/lib/firebase'; // Firebase import removed
import type { AppSettings } from '@/lib/types';
import { defaultSettings } from '@/lib/types'; // Import default settings
import { getCollection } from './mongodbService';
import { ObjectId } from 'mongodb';
// import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; // Firebase imports removed

// const SETTINGS_COLLECTION = 'settings';
// const SETTINGS_DOC_ID = 'appConfig'; // Single document for all app settings

interface MongoSettings extends AppSettings {
  _id: ObjectId;
}

const SETTINGS_DOC_ID = 'appConfig';

function mapMongoSettingsToSettings(mongoSettings: MongoSettings): AppSettings {
  const { _id, ...settingsData } = mongoSettings;
  return settingsData;
}

// Helper to simulate server-side delay and potential errors
const simulateApiCall = <T>(data: T, shouldFail = false): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Simulated network error"));
      } else {
        resolve(JSON.parse(JSON.stringify(data))); // Deep clone
      }
    }, 500);
  });
};

export async function getSettings(): Promise<AppSettings | null> {
  const collection = await getCollection('settings');
  const mongoSettings = await collection.findOne({ id: SETTINGS_DOC_ID }) as MongoSettings | null;
  
  if (mongoSettings) {
    return mapMongoSettingsToSettings(mongoSettings);
  }
  
  // If no settings exist, create default settings
  const defaultMongoSettings: Omit<MongoSettings, '_id'> = {
    ...defaultSettings,
    id: SETTINGS_DOC_ID
  };
  
  const result = await collection.insertOne(defaultMongoSettings);
  const insertedSettings = await collection.findOne({ _id: result.insertedId }) as MongoSettings;
  return mapMongoSettingsToSettings(insertedSettings);
}

export async function updateSettings(settingsData: Partial<Omit<AppSettings, 'id'>>): Promise<void> {
  const collection = await getCollection('settings');
  const result = await collection.updateOne(
    { id: SETTINGS_DOC_ID },
    { $set: settingsData },
    { upsert: true }
  );
  
  if (result.matchedCount === 0 && !result.upsertedId) {
    throw new Error("Failed to update settings");
  }
}

// Function to reset settings to default
export async function resetSettings(): Promise<void> {
  const collection = await getCollection('settings');
  await collection.updateOne(
    { id: SETTINGS_DOC_ID },
    { $set: { ...defaultSettings, id: SETTINGS_DOC_ID } },
    { upsert: true }
  );
}