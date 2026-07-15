import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const DB = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

mongoose.connect(DB).then(() => {
  console.log("Database connection successful");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
