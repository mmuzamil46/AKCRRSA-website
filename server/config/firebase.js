const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Config from Environment Variables (Safe way)
let serviceAccount = null;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        console.warn("WARNING: FIREBASE_SERVICE_ACCOUNT is missing from .env");
    }
} catch (error) {
    console.error("ERROR: Failed to parse FIREBASE_SERVICE_ACCOUNT JSON. Check regular expressions/newlines in .env");
    console.error(error.message);
}

let bucket;

if (serviceAccount) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
        bucket = admin.storage().bucket();
        console.log("Firebase Storage Initialized Successfully");
    } catch (error) {
        console.error("ERROR: Failed to initialize Firebase Admin", error);
    }
} else {
    console.warn("Firebase Service Account not found. Uploads will fail.");
}

module.exports = { bucket };
