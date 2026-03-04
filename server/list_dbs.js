import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error("MONGO_URI is undefined");
    process.exit(1);
}

// Mask URI for log
const masked = MONGODB_URI.replace(/:([^@]+)@/, ":****@");
console.log("Connecting to:", masked);

mongoose.connect(MONGODB_URI, { dbName: "hospital_tokens" })
    .then(async () => {
        const info = {
            host: mongoose.connection.host,
            databaseName: mongoose.connection.name,
            port: mongoose.connection.port,
            databases: [],
            collections: []
        };

        const admin = mongoose.connection.db.admin();
        try {
            const result = await admin.listDatabases();
            info.databases = result.databases;
        } catch (e) {
            info.db_error = e.message;
        }

        const collections = await mongoose.connection.db.listCollections().toArray();
        info.collections = collections.map(c => c.name);

        const fs = await import('fs');
        fs.writeFileSync('db_info.json', JSON.stringify(info, null, 2));
        console.log("Written to db_info.json");

        process.exit(0);
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
