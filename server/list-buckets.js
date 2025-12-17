const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

console.log("Listing buckets...");

// Initialize without storageBucket to avoid error if it's currently wrong
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Use the underlying Google Cloud Storage client
const storage = admin.storage();

storage.getBuckets().then(([buckets]) => {
    console.log("Buckets found:");
    if (buckets.length === 0) {
        console.log("No buckets found in this project.");
    }
    buckets.forEach(bucket => {
        console.log(`- ${bucket.name}`);
    });
}).catch(err => {
    console.error("Error listing buckets:", err);
});
