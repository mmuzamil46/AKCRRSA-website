const mongoose = require('mongoose');
const OnTimeReg = require('./models/OnTimeReg');

const run = async () => {
    try {
        // Atlas URI from .env
        const uri = 'mongodb+srv://admin:U7gnn1SFiTpxd9o5@todocluster.lktmpgp.mongodb.net/?appName=toDoCluster'; 
        const conn = await mongoose.connect(uri);
        console.log('Connected to Atlas DB');

        // List Databases
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const result = await admin.listDatabases();
        console.log('Databases:', result.databases.map(d => d.name));

        // Iterate common DBs or user specific
        const targetDBs = ['akcrrsa_cms', 'test', 'admin']; 
        
        for (const dbName of result.databases.map(d => d.name)) {
            if (['local', 'config'].includes(dbName)) continue;
            
            console.log(`\nChecking database: ${dbName}`);
            const db = mongoose.connection.useDb(dbName);
            const collections = await db.listCollections();
            console.log('Collections:', collections.map(c => c.name));

            const collectionName = collections.find(c => c.name.toLowerCase() === 'ontimeregs' || c.name.toLowerCase() === 'ontimereg');
            
            if (collectionName) {
                console.log(`Found collection: ${collectionName.name} in ${dbName}. Checking for duplicates...`);
                // Use dynamic model
                const DynamicModel = db.model('OnTimeReg', new mongoose.Schema({
                    referenceNumber: String,
                    woreda: String,
                    serviceName: String
                }, { strict: false }), collectionName.name);

                const duplicates = await DynamicModel.aggregate([
                    {
                        $group: {
                            _id: { referenceNumber: "$referenceNumber", woreda: "$woreda", serviceName: "$serviceName" },
                            uniqueIds: { $addToSet: "$_id" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $match: {
                            count: { $gt: 1 }
                        }
                    }
                ]);

                console.log(`Found ${duplicates.length} duplicate groups in ${dbName}.${collectionName.name}`);

                let deletedCount = 0;
                for (const doc of duplicates) {
                    const idsToDelete = doc.uniqueIds.slice(1); // Keep one
                    if (idsToDelete.length > 0) {
                        await DynamicModel.deleteMany({ _id: { $in: idsToDelete } });
                        deletedCount += idsToDelete.length;
                    }
                }
                if (deletedCount > 0) console.log(`Deleted ${deletedCount} records.`);
            }
        }
        
        process.exit(0);

    } catch (error) {
        console.error('Cleanup error:', error);
        process.exit(1);
    }
};

run();
