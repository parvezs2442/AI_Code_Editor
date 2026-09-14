
import express from "express"
import dotenv from "dotenv"
dotenv.config();
import proxy from "express-http-proxy"
import cors from "cors"

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

const PORT = process.env.PORT || 3000

app.use("/api/auth", proxy(process.env.AUTH_URL, {
    parseReqBody: false,
    proxyErrorHandler: function (err, res, next) {
        return res.status(503).json({
            success: false,
            message: "Auth service is unavailable. Please ensure backend/services/auth is running on port 3001."
        });
    }
}))
app.use("/api/project", proxy(process.env.PROJECT_URL, {
    parseReqBody: false,
    proxyErrorHandler: function (err, res, next) {
        return res.status(503).json({
            success: false,
            message: "Project service is unavailable. Please ensure backend/services/project is running on port 3002."
        }); 
    }
}))

app.use("/api/file", proxy(process.env.FILE_URL, {
    parseReqBody: false,
    proxyErrorHandler: function (err, res, next) {
        return res.status(503).json({
            success: false,
            message: "File service is unavailable. Please ensure backend/services/project is running on port 3003."
        }); 
    }
}))

app.get("/", (req,res) => {
    return res.status(200).json({
        success:true,
        message:"Hello from Gateway Service"
    })
})


app.listen(PORT, () => {
    console.log(`Gateway is running at ${PORT}`)
})