import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectToMongoDB = async () => {
	const uri = process.env.MONGO_DB_URI;
	try {
		if (uri) {
			try {
				await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
				console.log("Connected to MongoDB");
				return;
			} catch (err) {
				console.log(`Could not connect to external/local MongoDB (${err.message}).`);
			}
		}

		console.log("Starting embedded persistent MongoDB server as automatic fallback...");
		const { MongoMemoryServer } = await import("mongodb-memory-server");

		// Ensure permanent local database storage directory exists
		const dbPath = path.resolve(__dirname, "../../.mongodb-data");
		if (!fs.existsSync(dbPath)) {
			fs.mkdirSync(dbPath, { recursive: true });
		}

		// Prevent mongodb-memory-server from cleaning up data on exit
		process.env.MONGOMS_CLEANUP = "false";

		const mongoServer = await MongoMemoryServer.create({
			instance: {
				dbPath,
				storageEngine: "wiredTiger",
			},
		});

		const memoryUri = mongoServer.getUri();
		await mongoose.connect(memoryUri);
		console.log(`Connected to Permanent Local MongoDB at: ${memoryUri}`);
		console.log(`Data stored permanently in: ${dbPath}`);

		// Ensure graceful shutdown without deleting data files
		const handleShutdown = async () => {
			try {
				await mongoose.disconnect();
				await mongoServer.stop({ doCleanup: false });
			} catch (err) {
				console.error("Error stopping mongo server:", err.message);
			}
			process.exit(0);
		};

		process.on("SIGINT", handleShutdown);
		process.on("SIGTERM", handleShutdown);
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;

