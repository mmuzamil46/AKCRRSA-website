const dotenv = require('dotenv');
dotenv.config();

console.log("Checking Environment Variables...");
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log("FIREBASE_SERVICE_ACCOUNT is present.");
    console.log("Length: " + process.env.FIREBASE_SERVICE_ACCOUNT.length);
    console.log("First 20 chars: " + process.env.FIREBASE_SERVICE_ACCOUNT.substring(0, 20));
} else {
    console.error("FIREBASE_SERVICE_ACCOUNT is MISSING.");
}

console.log("\nAttempting to load config/firebase.js...");
try {
    const { bucket } = require('./config/firebase');
    if (bucket) {
        console.log("SUCCESS: Bucket exported successfully.");
    } else {
        console.error("FAILURE: Bucket is undefined.");
    }
} catch (error) {
    console.error("CRITICAL ERROR requiring firebase.js:", error);
}
