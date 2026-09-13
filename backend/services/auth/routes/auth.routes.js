
import express from "express"
import { getMe, login, logout, register } from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/register", register)
router.post("/login", login)
router.post("/logout", authMiddleware, logout)
router.get("/getMe", authMiddleware, getMe)


export default router;