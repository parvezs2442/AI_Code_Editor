import "dotenv/config"
import axios from "axios"

export const addCredits = async ({ userId, credits }) => {
    try {  
        const authUrl = process.env.AUTH_SERVICE || "http://localhost:3001"
        const { data } = await axios.post(`${authUrl}/user/add-credits`, { userId, credits })
        return data
    } catch (error) {
        console.error("Add credits error:", error.response?.data || error.message)
        return null
    }
}