const { ProjectsClient } = require('firebase-admin/node_modules/@google-cloud/resource-manager');
const dotenv = require('dotenv');
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

console.log("Checking Project Permissions...");

// Just print the project ID from the key
console.log(`Key is for Project ID: ${serviceAccount.project_id}`);
console.log(`Client Email: ${serviceAccount.client_email}`);

// We can't easily list projects with just a service account often, 
// but we can try to verify the credential structure is sound by just logging it.
if (serviceAccount.private_key && serviceAccount.private_key.includes('BEGIN PRIVATE KEY')) {
    console.log("Private Key format looks correct.");
} else {
    console.error("Private Key format looks WRONG.");
}
