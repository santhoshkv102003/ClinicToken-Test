import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Patient from "./models/patient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error("MONGO_URI is undefined");
    process.exit(1);
}

mongoose.connect(MONGODB_URI, { dbName: "hospital_tokens" })
    .then(async () => {
        console.log("Connected to MongoDB successfully!");
        console.log("Database:", mongoose.connection.name);

        console.log("\nFetching patients...");
        const patients = await Patient.find({});

        if (patients.length === 0) {
            console.log("No patients found in the database. (Collection exists but is empty)");
        } else {
            console.log(`Found ${patients.length} patient(s):`);
            patients.forEach(p => {
                console.log(` - [${p.status}] ${p.name} (ID: ${p._id})`);
            });
        }

        process.exit(0);
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
