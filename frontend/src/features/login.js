import { api } from "../utils/axios"

export const login=async (token) => {
    try {
        const {data}=await api.post("/api/auth/login",{token})
        return data
    } catch (error) {
        const serverMsg = error?.response?.data?.message || error?.response?.data || error.message
        console.error("login API error:", serverMsg)
        return { error: serverMsg }
    }
}