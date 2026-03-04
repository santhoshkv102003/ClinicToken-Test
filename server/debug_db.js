import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly point to .env file in server directory
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("Checking MongoDB connection...");
console.log("MONGO_URI defined:", !!process.env.MONGO_URI);
if (process.env.MONGO_URI) {
    // Mask the URI for security in logs, showing only protocol and host if possible
    const masked = process.env.MONGO_URI.replace(/:([^@]+)@/, ":****@");
    console.log("MONGO_URI:", masked);
}

mongoose
    .connect(process.env.MONGO_URI, { dbName: "hospital_tokens" })
    .then(() => {
        console.log("MongoDB connection SUCCESS ✅");
        process.exit(0);
    })
    .catch((err) => {
        console.error("MongoDB connection FAILED ❌");
        console.error(err);
        process.exit(1);
    });
