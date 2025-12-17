const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Config from Environment Variables (Safe way)
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
  : null;

let bucket;

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    bucket = admin.storage().bucket();
    console.log("Firebase Storage Initialized");
} else {
    console.warn("Firebase Service Account not found. Uploads will fail.");
}

module.exports = { bucket };
