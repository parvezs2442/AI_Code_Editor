import express from "express";
import dotenv from "dotenv";
dotenv.config();
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import redis from "../shared/redis/redis.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());

const PORT = process.env.PORT || 3000;

// Middleware to resolve user ID from session cookie in Redis and inject into headers
const injectUserFromSession = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;
    if (sessionId) {
      const sessionStr = await redis.get(`session-${sessionId}`);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session?._id) {
          req.headers["x-user-id"] = session._id.toString();
        }
      }
    }
  } catch (err) {
    console.error("Gateway session lookup error:", err.message);
  }
  next();
};

app.use("/api/auth", proxy(process.env.AUTH_URL, {
  parseReqBody: false,
  proxyErrorHandler: function (err, res, next) {
    return res.status(503).json({
      success: false,
      message: "Auth service is unavailable. Please ensure backend/services/auth is running on port 3001.",
    });
  },
}));

// Route /api/me alias directly to auth service /me
app.use("/api/me", proxy(process.env.AUTH_URL, {
  parseReqBody: false,
  proxyReqPathResolver: function () {
    return "/me";
  },
  proxyErrorHandler: function (err, res, next) {
    return res.status(503).json({
      success: false,
      message: "Auth service is unavailable. Please ensure backend/services/auth is running on port 3001.",
    });
  },
}));

app.use(
  "/api/project",
  injectUserFromSession,
  proxy(process.env.PROJECT_URL, {
    parseReqBody: false,
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      if (srcReq.headers["x-user-id"]) {
        proxyReqOpts.headers["x-user-id"] = srcReq.headers["x-user-id"];
      }
      return proxyReqOpts;
    },
    proxyErrorHandler: function (err, res, next) {
      return res.status(503).json({
        success: false,
        message: "Project service is unavailable. Please ensure backend/services/project is running on port 3002.",
      });
    },
  })
);

app.use(
  "/api/file",
  injectUserFromSession,
  proxy(process.env.FILE_URL, {
    parseReqBody: false,
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      if (srcReq.headers["x-user-id"]) {
        proxyReqOpts.headers["x-user-id"] = srcReq.headers["x-user-id"];
      }
      return proxyReqOpts;
    },
    proxyErrorHandler: function (err, res, next) {
      return res.status(503).json({
        success: false,
        message: "File service is unavailable. Please ensure backend/services/file is running on port 3003.",
      });
    },
  })
);

app.use(
  "/api/ai",
  injectUserFromSession,
  proxy(process.env.AI_URL || "http://localhost:8004", {
    parseReqBody: false,
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      if (srcReq.headers["x-user-id"]) {
        proxyReqOpts.headers["x-user-id"] = srcReq.headers["x-user-id"];
      }
      return proxyReqOpts;
    },
    proxyErrorHandler: function (err, res, next) {
      return res.status(503).json({
        success: false,
        message: "AI service is unavailable. Please ensure backend/services/ai is running on port 8004.",
      });
    },
  })
);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Hello from Gateway Service",
  });
});

app.listen(PORT, () => {
  console.log(`Gateway is running at ${PORT}`);
});