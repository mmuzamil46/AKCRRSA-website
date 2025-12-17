const admin = require('firebase-admin');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const logFile = 'creation-log-fix.txt';
function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

    log(`[${new Date().toISOString()}] Starting creation (v2) for: ${bucketName}`);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    const bucket = admin.storage().bucket(bucketName);

    bucket.create({
        location: 'US-CENTRAL1',
        storageClass: 'STANDARD'
    }).then(() => {
        log(`SUCCESS: Bucket ${bucketName} created!`);
    }).catch(err => {
        log(`ERROR code: ${err.code}`);
        log(`ERROR message: ${err.message}`);
        if (err.code === 409) {
             log("Note: Bucket might already exist (409).");
        }
    });

} catch (e) {
    log(`CRITICAL SETUP ERROR: ${e.message}`);
}
