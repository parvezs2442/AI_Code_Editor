
import express from "express"
import dotenv from "dotenv"
import dbConnect from "./config/db.js";
import router from "./routes/auth.routes.js";
dotenv.config();


const app = express();
app.use(express.json())
const PORT = process.env.PORT || 3000

app.get("/", (req,res) => {
    return res.status(200).json({
        success:true,
        message:"Hello from Auth Service"
    })
})

app.use("/", router)

try{
    await dbConnect();
    app.listen(PORT, () => {
    console.log(`Auth Service is running at ${PORT}`)
    })
}catch(error){
    process.exit(1);
}
