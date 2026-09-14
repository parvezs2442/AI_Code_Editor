
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

app.use("/api/auth" , proxy(process.env.AUTH_URL, {
    parseReqBody: false
}))
app.use("/api/project" , proxy(process.env.PROJECT_URL, {
    parseReqBody: false
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