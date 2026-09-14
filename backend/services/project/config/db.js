import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Project Service Database Connected");
  } catch (error) {
    console.error("Error connecting Project Service DB:", error);
    throw error;
  }
};

export default dbConnect;
