import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import { migrateOrders } from "./utils/migrateOrders.js";

dotenv.config();

const DB = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

mongoose.connect(DB).then(async () => {
  await migrateOrders();
  console.log("Database connection successful");
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Database initialization failed:", error.message);
  process.exitCode = 1;
  mongoose.disconnect();
});
