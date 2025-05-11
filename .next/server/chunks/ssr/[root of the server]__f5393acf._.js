module.exports = {

"[project]/src/lib/types.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "defaultSettings": (()=>defaultSettings)
});
const defaultSettings = {
    nurseryName: "משתלת גל-עד",
    whatsappNumber: "",
    nurseryEmail: ""
};
}}),
"[externals]/mongodb [external] (mongodb, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}}),
"[project]/src/services/mongodbService.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "closeConnection": (()=>closeConnection),
    "connectToDatabase": (()=>connectToDatabase),
    "getCollection": (()=>getCollection)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
const MONGODB_URI = 'mongodb+srv://amir:5OPBfitlnpv4zx6h@cluster0.w5zcbbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'greendb';
let cachedClient = null;
let cachedDb = null;
async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return {
            client: cachedClient,
            db: cachedDb
        };
    }
    const client = await __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"].connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    cachedClient = client;
    cachedDb = db;
    return {
        client,
        db
    };
}
async function getCollection(collectionName) {
    const { db } = await connectToDatabase();
    return db.collection(collectionName);
}
async function closeConnection() {
    if (cachedClient) {
        await cachedClient.close();
        cachedClient = null;
        cachedDb = null;
    }
}
}}),
"[project]/src/services/settingsService.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"00048d1e57a9138193cd903dd57987bd6d82ad3061":"resetSettings","008ad05d17691a04611e39115ada6f420443016cf3":"getSettings","40f65d6d4622a26b3e31513841fded597d03a859df":"updateSettings"} */ __turbopack_context__.s({
    "getSettings": (()=>getSettings),
    "resetSettings": (()=>resetSettings),
    "updateSettings": (()=>updateSettings)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/types.ts [app-rsc] (ecmascript)"); // Import default settings
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/mongodbService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
const SETTINGS_DOC_ID = 'appConfig';
function mapMongoSettingsToSettings(mongoSettings) {
    const { _id, ...settingsData } = mongoSettings;
    return settingsData;
}
// Helper to simulate server-side delay and potential errors
const simulateApiCall = (data, shouldFail = false)=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            if (shouldFail) {
                reject(new Error("Simulated network error"));
            } else {
                resolve(JSON.parse(JSON.stringify(data))); // Deep clone
            }
        }, 500);
    });
};
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getSettings() {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('settings');
    const mongoSettings = await collection.findOne({
        id: SETTINGS_DOC_ID
    });
    if (mongoSettings) {
        return mapMongoSettingsToSettings(mongoSettings);
    }
    // If no settings exist, create default settings
    const defaultMongoSettings = {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defaultSettings"],
        id: SETTINGS_DOC_ID
    };
    const result = await collection.insertOne(defaultMongoSettings);
    const insertedSettings = await collection.findOne({
        _id: result.insertedId
    });
    return mapMongoSettingsToSettings(insertedSettings);
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateSettings(settingsData) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('settings');
    const result = await collection.updateOne({
        id: SETTINGS_DOC_ID
    }, {
        $set: settingsData
    }, {
        upsert: true
    });
    if (result.matchedCount === 0 && !result.upsertedId) {
        throw new Error("Failed to update settings");
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ resetSettings() {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('settings');
    await collection.updateOne({
        id: SETTINGS_DOC_ID
    }, {
        $set: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defaultSettings"],
            id: SETTINGS_DOC_ID
        }
    }, {
        upsert: true
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getSettings,
    updateSettings,
    resetSettings
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSettings, "008ad05d17691a04611e39115ada6f420443016cf3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateSettings, "40f65d6d4622a26b3e31513841fded597d03a859df", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resetSettings, "00048d1e57a9138193cd903dd57987bd6d82ad3061", null);
}}),
"[project]/src/services/categoryService.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"000c211730d13e848c15253ca06cd26d11e6940e9c":"getCategories","009e06250d772a7cc5c56170051a28a5b180124d95":"clearCachedCategories","406bef2a73316d5fa29fb2666be2fa986f5cf25600":"deleteCategory","4075071496c20b7bc85090c807ee81404351e47b6d":"addCategory","605da8f00ee17e96c5f84ded99d8b36f5737375702":"updateCategory"} */ __turbopack_context__.s({
    "addCategory": (()=>addCategory),
    "clearCachedCategories": (()=>clearCachedCategories),
    "deleteCategory": (()=>deleteCategory),
    "getCategories": (()=>getCategories),
    "updateCategory": (()=>updateCategory)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/mongodbService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
function mapMongoCategoryToCategory(mongoCategory) {
    const { _id, ...categoryData } = mongoCategory;
    return categoryData;
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getCategories() {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('categories');
    const mongoCategories = await collection.find({}).toArray();
    return mongoCategories.map(mapMongoCategoryToCategory);
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ addCategory(categoryData) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('categories');
    const newCategory = {
        id: categoryData.name.toLowerCase().replace(/\s+/g, '-') || `category-${Date.now()}`,
        ...categoryData
    };
    const result = await collection.insertOne(newCategory);
    const insertedCategory = await collection.findOne({
        _id: result.insertedId
    });
    return mapMongoCategoryToCategory(insertedCategory);
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateCategory(categoryId, categoryData) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('categories');
    const result = await collection.updateOne({
        id: categoryId
    }, {
        $set: categoryData
    });
    if (result.matchedCount === 0) {
        throw new Error("Category not found");
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ deleteCategory(categoryId) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('categories');
    const result = await collection.deleteOne({
        id: categoryId
    });
    if (result.deletedCount === 0) {
        throw new Error("Category not found for deletion");
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ clearCachedCategories() {
// No need to clear cache as we're using MongoDB directly
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    clearCachedCategories
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCategories, "000c211730d13e848c15253ca06cd26d11e6940e9c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addCategory, "4075071496c20b7bc85090c807ee81404351e47b6d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateCategory, "605da8f00ee17e96c5f84ded99d8b36f5737375702", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteCategory, "406bef2a73316d5fa29fb2666be2fa986f5cf25600", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(clearCachedCategories, "009e06250d772a7cc5c56170051a28a5b180124d95", null);
}}),
"[project]/src/services/plantService.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"0010bbf337cb59c41dd0f26be3f2d2409ed79bb662":"getPlantsWithCategories","005ec9875aab2a218dc55eb399eb4dddd799f70288":"clearCachedPlantData","00c70ccfbed662ef7b1629745f6b1378ad819043f7":"getPlants","4003f8149b467e61cfd276437f0fa2c162667d905e":"addPlant","4017980dc72df10f11396320c4a9230478c2e510ed":"importPlantsFromJson","40a125f45f37c82df6ca370c3f7ef0b6dd3b5bc1c0":"getPlantById","40b80b82dc062307c59a9337f421859d58c1bbc7ba":"deletePlant","6066e95e26058683482bd7c1918b859054211e8334":"updatePlant"} */ __turbopack_context__.s({
    "addPlant": (()=>addPlant),
    "clearCachedPlantData": (()=>clearCachedPlantData),
    "deletePlant": (()=>deletePlant),
    "getPlantById": (()=>getPlantById),
    "getPlants": (()=>getPlants),
    "getPlantsWithCategories": (()=>getPlantsWithCategories),
    "importPlantsFromJson": (()=>importPlantsFromJson),
    "updatePlant": (()=>updatePlant)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/mongodbService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/categoryService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
let allCategories = null;
async function getCategoryMap() {
    const categories = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategories"])();
    return new Map(categories.map((cat)=>[
            cat.name,
            cat.id
        ]));
}
function mapMongoPlantToPlant(mongoPlant) {
    const { _id, ...plantData } = mongoPlant;
    return plantData;
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getPlants() {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('plants');
    const mongoPlants = await collection.find({}).toArray();
    return mongoPlants.map(mapMongoPlantToPlant);
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getPlantsWithCategories() {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('plants');
    const mongoPlants = await collection.find({}).toArray();
    const categories = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategories"])();
    const categoryMap = new Map(categories.map((cat)=>[
            cat.id,
            cat
        ]));
    const defaultCategoryForDisplay = {
        id: "unknown",
        name: "לא משויך",
        icon: "Tags"
    };
    return mongoPlants.map((mongoPlant)=>{
        const plant = mapMongoPlantToPlant(mongoPlant);
        return {
            ...plant,
            category: categoryMap.get(plant.categoryId) || {
                ...defaultCategoryForDisplay,
                id: plant.categoryId
            }
        };
    });
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getPlantById(plantId) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('plants');
    const mongoPlant = await collection.findOne({
        id: plantId
    });
    if (mongoPlant) {
        const plant = mapMongoPlantToPlant(mongoPlant);
        const categories = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategories"])();
        const categoryMap = new Map(categories.map((cat)=>[
                cat.id,
                cat
            ]));
        const defaultCategoryForDisplay = {
            id: "unknown",
            name: "לא משויך",
            icon: "Tags"
        };
        return {
            ...plant,
            category: categoryMap.get(plant.categoryId) || {
                ...defaultCategoryForDisplay,
                id: plant.categoryId
            }
        };
    }
    return null;
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ addPlant(plantData) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('plants');
    const newPlant = {
        ...plantData,
        id: `${plantData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const result = await collection.insertOne(newPlant);
    const insertedPlant = await collection.findOne({
        _id: result.insertedId
    });
    const plant = mapMongoPlantToPlant(insertedPlant);
    const category = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategories"])()).find((c)=>c.id === plant.categoryId);
    const defaultCategoryForDisplay = {
        id: "unknown",
        name: "לא משויך",
        icon: "Tags"
    };
    return {
        ...plant,
        category: category || {
            ...defaultCategoryForDisplay,
            id: plant.categoryId
        }
    };
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updatePlant(plantId, plantData) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('plants');
    const result = await collection.updateOne({
        id: plantId
    }, {
        $set: {
            ...plantData,
            updatedAt: new Date()
        }
    });
    if (result.matchedCount === 0) {
        throw new Error("Plant not found for update");
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ deletePlant(plantId) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('plants');
    const result = await collection.deleteOne({
        id: plantId
    });
    if (result.deletedCount === 0) {
        throw new Error("Plant not found for deletion");
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ importPlantsFromJson(jsonData) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('plants');
    const categoryMap = await getCategoryMap();
    const defaultCategory = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategories"])()).find((cat)=>cat.name.toLowerCase() === "uncategorized") || (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategories"])())[0];
    const defaultCategoryId = defaultCategory.id;
    const plants = jsonData.map((item, index)=>{
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
            updatedAt: new Date()
        };
    }).filter((plant)=>plant !== null);
    if (plants.length > 0) {
        await collection.insertMany(plants);
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ clearCachedPlantData() {
    allCategories = null;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clearCachedCategories"])();
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getPlants,
    getPlantsWithCategories,
    getPlantById,
    addPlant,
    updatePlant,
    deletePlant,
    importPlantsFromJson,
    clearCachedPlantData
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPlants, "00c70ccfbed662ef7b1629745f6b1378ad819043f7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPlantsWithCategories, "0010bbf337cb59c41dd0f26be3f2d2409ed79bb662", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPlantById, "40a125f45f37c82df6ca370c3f7ef0b6dd3b5bc1c0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addPlant, "4003f8149b467e61cfd276437f0fa2c162667d905e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updatePlant, "6066e95e26058683482bd7c1918b859054211e8334", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deletePlant, "40b80b82dc062307c59a9337f421859d58c1bbc7ba", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(importPlantsFromJson, "4017980dc72df10f11396320c4a9230478c2e510ed", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(clearCachedPlantData, "005ec9875aab2a218dc55eb399eb4dddd799f70288", null);
}}),
"[project]/.next-internal/server/app/admin/plants/edit/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/services/settingsService.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/services/plantService.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/services/categoryService.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}}),
"[project]/.next-internal/server/app/admin/plants/edit/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/services/settingsService.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/services/plantService.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/services/categoryService.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/settingsService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/plantService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/categoryService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/plants/edit/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/services/settingsService.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/services/plantService.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/services/categoryService.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/admin/plants/edit/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/services/settingsService.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/services/plantService.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/services/categoryService.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00048d1e57a9138193cd903dd57987bd6d82ad3061": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resetSettings"]),
    "000c211730d13e848c15253ca06cd26d11e6940e9c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategories"]),
    "0010bbf337cb59c41dd0f26be3f2d2409ed79bb662": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPlantsWithCategories"]),
    "005ec9875aab2a218dc55eb399eb4dddd799f70288": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clearCachedPlantData"]),
    "008ad05d17691a04611e39115ada6f420443016cf3": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSettings"]),
    "009e06250d772a7cc5c56170051a28a5b180124d95": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clearCachedCategories"]),
    "00c70ccfbed662ef7b1629745f6b1378ad819043f7": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPlants"]),
    "4003f8149b467e61cfd276437f0fa2c162667d905e": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addPlant"]),
    "4017980dc72df10f11396320c4a9230478c2e510ed": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["importPlantsFromJson"]),
    "406bef2a73316d5fa29fb2666be2fa986f5cf25600": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteCategory"]),
    "4075071496c20b7bc85090c807ee81404351e47b6d": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addCategory"]),
    "40a125f45f37c82df6ca370c3f7ef0b6dd3b5bc1c0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPlantById"]),
    "40b80b82dc062307c59a9337f421859d58c1bbc7ba": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deletePlant"]),
    "40f65d6d4622a26b3e31513841fded597d03a859df": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSettings"]),
    "605da8f00ee17e96c5f84ded99d8b36f5737375702": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCategory"]),
    "6066e95e26058683482bd7c1918b859054211e8334": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updatePlant"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/settingsService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/plantService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/categoryService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/plants/edit/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/services/settingsService.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/services/plantService.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/services/categoryService.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/admin/plants/edit/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/services/settingsService.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/services/plantService.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/services/categoryService.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00048d1e57a9138193cd903dd57987bd6d82ad3061": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00048d1e57a9138193cd903dd57987bd6d82ad3061"]),
    "000c211730d13e848c15253ca06cd26d11e6940e9c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["000c211730d13e848c15253ca06cd26d11e6940e9c"]),
    "0010bbf337cb59c41dd0f26be3f2d2409ed79bb662": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["0010bbf337cb59c41dd0f26be3f2d2409ed79bb662"]),
    "005ec9875aab2a218dc55eb399eb4dddd799f70288": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["005ec9875aab2a218dc55eb399eb4dddd799f70288"]),
    "008ad05d17691a04611e39115ada6f420443016cf3": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["008ad05d17691a04611e39115ada6f420443016cf3"]),
    "009e06250d772a7cc5c56170051a28a5b180124d95": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["009e06250d772a7cc5c56170051a28a5b180124d95"]),
    "00c70ccfbed662ef7b1629745f6b1378ad819043f7": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00c70ccfbed662ef7b1629745f6b1378ad819043f7"]),
    "4003f8149b467e61cfd276437f0fa2c162667d905e": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4003f8149b467e61cfd276437f0fa2c162667d905e"]),
    "4017980dc72df10f11396320c4a9230478c2e510ed": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4017980dc72df10f11396320c4a9230478c2e510ed"]),
    "406bef2a73316d5fa29fb2666be2fa986f5cf25600": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["406bef2a73316d5fa29fb2666be2fa986f5cf25600"]),
    "4075071496c20b7bc85090c807ee81404351e47b6d": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4075071496c20b7bc85090c807ee81404351e47b6d"]),
    "40a125f45f37c82df6ca370c3f7ef0b6dd3b5bc1c0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40a125f45f37c82df6ca370c3f7ef0b6dd3b5bc1c0"]),
    "40b80b82dc062307c59a9337f421859d58c1bbc7ba": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40b80b82dc062307c59a9337f421859d58c1bbc7ba"]),
    "40f65d6d4622a26b3e31513841fded597d03a859df": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40f65d6d4622a26b3e31513841fded597d03a859df"]),
    "605da8f00ee17e96c5f84ded99d8b36f5737375702": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["605da8f00ee17e96c5f84ded99d8b36f5737375702"]),
    "6066e95e26058683482bd7c1918b859054211e8334": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["6066e95e26058683482bd7c1918b859054211e8334"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/plants/edit/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/services/settingsService.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/services/plantService.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/services/categoryService.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$plantService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$services$2f$categoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/plants/edit/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/services/settingsService.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/services/plantService.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/services/categoryService.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/admin/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/admin/plants/edit/[id]/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/admin/plants/edit/[id]/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/admin/plants/edit/[id]/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/admin/plants/edit/[id]/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/admin/plants/edit/[id]/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/admin/plants/edit/[id]/page.tsx", "default");
}}),
"[project]/src/app/admin/plants/edit/[id]/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/admin/plants/edit/[id]/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/admin/plants/edit/[id]/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$plants$2f$edit$2f5b$id$5d2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/admin/plants/edit/[id]/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/plants/edit/[id]/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__f5393acf._.js.map