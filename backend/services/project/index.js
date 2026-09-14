import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnect from "./config/db.js";
import projectRoutes from "./routes/project.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Hello from Project Service",
  });
});

// Project routes
app.use("/", projectRoutes);

try {
  await dbConnect();
  app.listen(PORT, () => {
    console.log(`Project Service is running at ${PORT}`);
  });
} catch (error) {
  console.error("Failed to start Project Service:", error);
  process.exit(1);
}