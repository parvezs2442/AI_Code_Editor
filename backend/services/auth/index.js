
import express from "express"
import dotenv from "dotenv"
import dbConnect from "./config/db.js";
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



try{
    await dbConnect();
    app.listen(PORT, () => {
    console.log(`Auth Service is running at ${PORT}`)
    })
}catch(error){
    process.exit(1);
}
