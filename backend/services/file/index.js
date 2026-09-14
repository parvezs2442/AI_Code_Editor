
import express from "express"
import dotenv from "dotenv"
import dbConnect from "./config/db.js";
import router from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();


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

app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 3003



app.get("/", (req,res) => {
    return res.status(200).json({
        success:true,
        message:"Hello from File Service"
    })
})

app.use("/", router)

try{
    await dbConnect();
    app.listen(PORT, () => {
    console.log(`File Service is running at ${PORT}`)
    })
}catch(error){
    process.exit(1);
}
