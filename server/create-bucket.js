const admin = require('firebase-admin');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const logFile = 'creation-log.txt';
function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

    log(`[${new Date().toISOString()}] Starting creation for: ${bucketName}`);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    admin.storage().createBucket(bucketName, {
        location: 'US-CENTRAL1', 
        storageClass: 'STANDARD'
    }).then(([bucket]) => {
        log(`SUCCESS: Bucket ${bucket.name} created!`);
    }).catch(err => {
        log(`ERROR code: ${err.code}`);
        log(`ERROR message: ${err.message}`);
        if (err.errors) {
            err.errors.forEach(e => log(` - Error detail: ${e.message}`));
        }
    });

} catch (e) {
    log(`CRITICAL SETUP ERROR: ${e.message}`);
}
