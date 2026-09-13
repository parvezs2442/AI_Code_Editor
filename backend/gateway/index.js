
import express from "express"
import dotenv from "dotenv"
dotenv.config();
import proxy from "express-http-proxy"


const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

app.use("/api/auth" , proxy(process.env.AUTH_URL))
app.use("/api/project" , proxy(process.env.PROJECT_URL))

app.get("/", (req,res) => {
    return res.status(200).json({
        success:true,
        message:"Hello from Gateway Service"
    })
})


app.listen(PORT, () => {
    console.log(`Gateway is running at ${PORT}`)
})