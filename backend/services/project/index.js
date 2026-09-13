

import express from "express"
import dotenv from "dotenv"
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3002

app.get("/", (req,res) => {
    return res.status(200).json({
        success:true,
        message:"Hello from Project Service"
    })
})


app.listen(PORT, () => {
    console.log(`Project Service is running at ${PORT}`)
})