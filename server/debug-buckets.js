const { Storage } = require('firebase-admin/node_modules/@google-cloud/storage');
const dotenv = require('dotenv');
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

console.log("Initializing GCS Client...");
const storage = new Storage({
    projectId: serviceAccount.project_id,
    credentials: serviceAccount
});

console.log(`Checking project: ${serviceAccount.project_id}`);

storage.getBuckets()
    .then(([buckets]) => {
        console.log("\n--- BUCKETS FOUND ---");
        if (buckets.length === 0) {
            console.log("No buckets found! (Did you click 'Get Started' in Firebase Storage console?)");
        } else {
            buckets.forEach(bucket => {
                console.log(`Name: ${bucket.name}`);
            });
        }
    })
    .catch(err => {
        console.error("\n--- ERROR LISTING BUCKETS ---");
        console.error("Code:", err.code);
        console.error("Message:", err.message);
        if (err.code === 403) {
            console.error("Reason: Permission Denied. Service Account cannot list buckets.");
        }
    });
