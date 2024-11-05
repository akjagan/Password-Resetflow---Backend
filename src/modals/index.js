import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI) // Removed deprecated options
  .then(() => console.log("MongoDB connected...."))
  .catch((err) => console.log("MongoDB connection error:", err));

export default mongoose;