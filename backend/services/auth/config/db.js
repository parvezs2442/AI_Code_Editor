import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

const dbConnect = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected")

    }catch(error){
        console.log("Error connecting db ", error)
        throw error;
    }
}

export default dbConnect;