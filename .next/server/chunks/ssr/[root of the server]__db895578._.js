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
"[project]/src/services/orderService.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"0022f91d9786bf625d958fc3ba355638ec3fb00a54":"getOrders","405c1fababb9aacac6bf3d698351d38aa42fb93a03":"addOrder","4064fa0d9af1849281c32829839f23aabc0cefc792":"deleteOrder","409e18aeb4399849dc4e59f8570046168554010c17":"getOrderById","40fbeb3a98d574842a6afa19ab103e19f28cdf7337":"initializeMockOrders","60235ac50a0aa7a936631106c83d699a0f0fe7646a":"updateOrderStatus"} */ __turbopack_context__.s({
    "addOrder": (()=>addOrder),
    "deleteOrder": (()=>deleteOrder),
    "getOrderById": (()=>getOrderById),
    "getOrders": (()=>getOrders),
    "initializeMockOrders": (()=>initializeMockOrders),
    "updateOrderStatus": (()=>updateOrderStatus)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/mongodbService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
function mapMongoOrderToOrder(mongoOrder) {
    const { _id, ...orderData } = mongoOrder;
    return orderData;
}
// Mock data for demonstration purposes
let mockOrders = [];
// Helper to simulate server-side delay and potential errors
const simulateApiCall = (data, shouldFail = false)=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            if (shouldFail) {
                reject(new Error("Simulated network error"));
            } else {
                resolve(JSON.parse(JSON.stringify(data))); // Deep clone for objects/arrays
            }
        }, 500);
    });
};
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getOrders() {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('orders');
    const mongoOrders = await collection.find({}).sort({
        createdAt: -1
    }).toArray();
    return mongoOrders.map(mapMongoOrderToOrder);
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ addOrder(orderData) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('orders');
    const newOrder = {
        ...orderData,
        id: `order_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const result = await collection.insertOne(newOrder);
    const insertedOrder = await collection.findOne({
        _id: result.insertedId
    });
    return mapMongoOrderToOrder(insertedOrder);
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateOrderStatus(orderId, status) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('orders');
    const result = await collection.updateOne({
        id: orderId
    }, {
        $set: {
            status,
            updatedAt: new Date()
        }
    });
    if (result.matchedCount === 0) {
        throw new Error("Order not found");
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getOrderById(orderId) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('orders');
    const mongoOrder = await collection.findOne({
        id: orderId
    });
    return mongoOrder ? mapMongoOrderToOrder(mongoOrder) : null;
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ deleteOrder(orderId) {
    const collection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$mongodbService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollection"])('orders');
    const result = await collection.deleteOne({
        id: orderId
    });
    if (result.deletedCount === 0) {
        throw new Error("Order not found for deletion");
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ initializeMockOrders(orders) {
    mockOrders = orders.map((order)=>({
            ...order,
            // Ensure createdAt is a Date object if it's coming from JSON/Timestamp-like structure
            createdAt: order.createdAt ? new Date(order.createdAt.seconds ? order.createdAt.seconds * 1000 : order.createdAt) : new Date(),
            updatedAt: order.updatedAt ? new Date(order.updatedAt.seconds ? order.updatedAt.seconds * 1000 : order.updatedAt) : new Date()
        }));
    console.log("Mock orders initialized.");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getOrders,
    addOrder,
    updateOrderStatus,
    getOrderById,
    deleteOrder,
    initializeMockOrders
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getOrders, "0022f91d9786bf625d958fc3ba355638ec3fb00a54", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addOrder, "405c1fababb9aacac6bf3d698351d38aa42fb93a03", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateOrderStatus, "60235ac50a0aa7a936631106c83d699a0f0fe7646a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getOrderById, "409e18aeb4399849dc4e59f8570046168554010c17", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteOrder, "4064fa0d9af1849281c32829839f23aabc0cefc792", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(initializeMockOrders, "40fbeb3a98d574842a6afa19ab103e19f28cdf7337", null);
}}),
"[project]/.next-internal/server/app/admin/orders/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/services/settingsService.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/services/orderService.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
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
}}),
"[project]/.next-internal/server/app/admin/orders/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/services/settingsService.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/services/orderService.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/settingsService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/orderService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/orders/page/actions.js { ACTIONS_MODULE0 => "[project]/src/services/settingsService.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/services/orderService.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/admin/orders/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/services/settingsService.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/services/orderService.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00048d1e57a9138193cd903dd57987bd6d82ad3061": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resetSettings"]),
    "0022f91d9786bf625d958fc3ba355638ec3fb00a54": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOrders"]),
    "008ad05d17691a04611e39115ada6f420443016cf3": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSettings"]),
    "405c1fababb9aacac6bf3d698351d38aa42fb93a03": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addOrder"]),
    "4064fa0d9af1849281c32829839f23aabc0cefc792": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteOrder"]),
    "409e18aeb4399849dc4e59f8570046168554010c17": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOrderById"]),
    "40f65d6d4622a26b3e31513841fded597d03a859df": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSettings"]),
    "40fbeb3a98d574842a6afa19ab103e19f28cdf7337": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initializeMockOrders"]),
    "60235ac50a0aa7a936631106c83d699a0f0fe7646a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateOrderStatus"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/settingsService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/orderService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/orders/page/actions.js { ACTIONS_MODULE0 => "[project]/src/services/settingsService.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/services/orderService.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/admin/orders/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/services/settingsService.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/services/orderService.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00048d1e57a9138193cd903dd57987bd6d82ad3061": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00048d1e57a9138193cd903dd57987bd6d82ad3061"]),
    "0022f91d9786bf625d958fc3ba355638ec3fb00a54": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["0022f91d9786bf625d958fc3ba355638ec3fb00a54"]),
    "008ad05d17691a04611e39115ada6f420443016cf3": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["008ad05d17691a04611e39115ada6f420443016cf3"]),
    "405c1fababb9aacac6bf3d698351d38aa42fb93a03": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["405c1fababb9aacac6bf3d698351d38aa42fb93a03"]),
    "4064fa0d9af1849281c32829839f23aabc0cefc792": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4064fa0d9af1849281c32829839f23aabc0cefc792"]),
    "409e18aeb4399849dc4e59f8570046168554010c17": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["409e18aeb4399849dc4e59f8570046168554010c17"]),
    "40f65d6d4622a26b3e31513841fded597d03a859df": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40f65d6d4622a26b3e31513841fded597d03a859df"]),
    "40fbeb3a98d574842a6afa19ab103e19f28cdf7337": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40fbeb3a98d574842a6afa19ab103e19f28cdf7337"]),
    "60235ac50a0aa7a936631106c83d699a0f0fe7646a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60235ac50a0aa7a936631106c83d699a0f0fe7646a"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/orders/page/actions.js { ACTIONS_MODULE0 => "[project]/src/services/settingsService.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/services/orderService.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$orders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$services$2f$settingsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$services$2f$orderService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/orders/page/actions.js { ACTIONS_MODULE0 => "[project]/src/services/settingsService.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/services/orderService.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
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
"[project]/src/app/admin/orders/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/admin/orders/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/admin/orders/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/admin/orders/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/admin/orders/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/admin/orders/page.tsx", "default");
}}),
"[project]/src/app/admin/orders/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$orders$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/admin/orders/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$orders$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/admin/orders/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$orders$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/admin/orders/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/orders/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__db895578._.js.map