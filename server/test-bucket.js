const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

console.log(`Testing Bucket: ${bucketName}`);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucketName
});

const bucket = admin.storage().bucket();

bucket.exists().then(([exists]) => {
    if (exists) {
        console.log("SUCCESS: Bucket exists and is accessible!");
    } else {
        console.error("ERROR: Bucket does NOT exist (or 403 Forbidden).");
    }
}).catch(err => {
    console.error("CRITICAL ERROR checking bucket:", err.message);
});
