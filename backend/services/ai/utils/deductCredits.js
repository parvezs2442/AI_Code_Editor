import "dotenv/config"
import axios from "axios"

export const deductCredits = async ({ userId, amount }) => {
    try {  
        const authUrl = process.env.AUTH_SERVICE || "http://localhost:3001"
        const { data } = await axios.post(`${authUrl}/user/deduct-credits`, { userId, amount })
        return data
    } catch (error) {
        console.error("Deduct credits error:", error.response?.data?.message || error.message)
        return null
    }
}