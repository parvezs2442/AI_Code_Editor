import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controller/project.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// All project routes require authentication
router.use(authMiddleware);

router.post("/create", createProject);
router.get("/all", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
