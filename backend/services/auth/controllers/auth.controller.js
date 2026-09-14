import { app } from "../config/firebase.js"
import { getAuth } from "firebase-admin/auth"
import User from "../models/user.model.js"
import crypto from "crypto"
import redis from "../../../shared/redis/redis.js"
export const login = async (req, res) => {
  try {
    const { token } = req.body
    if (!token) {
      return res.status(400).json({ message: "Firebase ID token is required" })
    }

    const decoded = await getAuth(app).verifyIdToken(token)

    let user = await User.findOne({
      $or: [{ firebaseUid: decoded.uid }, { email: decoded.email }]
    })

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name || decoded.displayName || (decoded.email ? decoded.email.split('@')[0] : 'User'),
        email: decoded.email,
        avatar: decoded.picture || ""
      })
    } else if (user.firebaseUid !== decoded.uid) {
      user.firebaseUid = decoded.uid
      if (decoded.picture) user.avatar = decoded.picture
      await user.save()
    }

    const sessionId = crypto.randomUUID()
    await redis.set(`user-session-${user?._id}`, sessionId, "EX", 7 * 24 * 60 * 60)
    await redis.set(`session-${sessionId}`, JSON.stringify({
      name: user.name,
      _id: user._id,
      email: user.email,
      avatar: user.avatar,
      credits: user.credits
    }), "EX", 7 * 24 * 60 * 60)

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json(user)
  } catch (error) {
    console.error("Auth login error:", error)
    return res.status(500).json({ message: `login error: ${error.message || error}` })
  }
}

export const logout = async (req, res) => {
  try {
    const sessionId = req.cookies?.session

    if (sessionId) {
      await redis.del(`session-${sessionId}`)
    }
    res.clearCookie("session")
    return res.status(200).json({ message: "Logout successfully" })

  } catch (error) {
    return res.status(500).json({ message: `logout error ${error}` })
  }
}

export const getMe = async (req, res) => {
  try {
    const sessionId = req.cookies?.session
    if (!sessionId) {
      return res.status(401).json({ message: "No session found" })
    }

    const sessionDataStr = await redis.get(`session-${sessionId}`)
    if (!sessionDataStr) {
      return res.status(401).json({ message: "Session expired or invalid" })
    }

    const sessionData = JSON.parse(sessionDataStr)
    const user = await User.findById(sessionData._id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: `getMe error ${error}` })
  }
}




export const deductCredits = async (req, res) => {
  try {
    const { userId, amount } = req.body
    if (!userId) {
      return res.status(401).json({ message: "userId not found" })
    }
    const user = await User.findOneAndUpdate(
      { _id: userId, credits: { $gte: amount } },
      {
        $inc: {
          credits: -amount
        }
      }, { returnDocument: "after" }).select("credits")

    if (!user) {
      return res.status(401).json({ message: "insufficient credits" })
    }
    const sessionId = await redis.get(`user-session-${userId}`)
    await redis.set(`session-${sessionId}`, JSON.stringify({
      name: user.name,
      _id: user._id,
      email: user.email,
      avatar: user.avatar,
      credits: user.credits
    }), "EX", 7 * 24 * 60 * 60)
return res.status(200).json({ credits:user.credits })
  } catch (error) {
       return res.status(500).json({ message: `deduct credits ${error}` })
  }
}

export const addCredits = async (req, res) => {
  try {
    const { userId,credits } = req.body
    console.log("credits",credits)
    if (!userId) {
      return res.status(401).json({ message: "userId not found" })
    }
   
    const user=await User.findById(userId)

    if (!user) {
      return res.status(401).json({ message: "user not found" })
    }

    user.credits=(user.credits || 0) + Number(credits)
    await user.save()
    const sessionId = await redis.get(`user-session-${userId}`)
    await redis.set(`session-${sessionId}`, JSON.stringify({
      name: user.name,
      _id: user._id,
      email: user.email,
      avatar: user.avatar,
      credits: user.credits
    }), "EX", 7 * 24 * 60 * 60)
return res.status(200).json(user.credits)
  } catch (error) {
       return res.status(500).json({ message: `add credits ${error}` })
  }
}