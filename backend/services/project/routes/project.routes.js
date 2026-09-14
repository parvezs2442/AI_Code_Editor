import express from "express";
import {
  createProject,
  getProjects,
  getStarredProjects,
  getProjectById,
  toggleStar,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();

// Primary endpoints matching frontend/features/project.js
router.post("/", createProject);
router.get("/", getProjects);
router.get("/starred", getStarredProjects);
router.get("/:id", getProjectById);
router.patch("/:id", toggleStar);
router.delete("/:id", deleteProject);

// Backward-compatible aliases
router.post("/create", createProject);
router.get("/all", getProjects);
router.patch("/:id/star", toggleStar);

export default router;
