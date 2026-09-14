import redis from "../../../shared/redis/redis.js";
import Project from "../models/project.model.js";

const getUserIdFromRequest = async (req) => {
  let userId = req.headers["x-user-id"];
  if (userId) return userId;

  const sessionId = req.cookies?.session;
  if (sessionId) {
    try {
      const sessionStr = await redis.get(`session-${sessionId}`);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session?._id) {
          return session._id.toString();
        }
      }
    } catch (e) {
      console.error("Error resolving session in project controller:", e.message);
    }
  }
  return null;
};

export const createProject = async (req, res) => {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
    }

    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      owner: userId,
      name: name.trim(),
      description: (description || "").trim(),
    });

    const key = `projects-${userId}`;
    await redis.del(key);

    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: `Create project error: ${error.message}` });
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
    }

    const key = `projects-${userId}`;
    let result = await redis.get(key);
    if (result) {
      return res.status(200).json(JSON.parse(result));
    }

    const projects = await Project.find({
      owner: userId,
    }).sort({ updatedAt: -1 });

    await redis.set(key, JSON.stringify(projects), "EX", 3600);

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: `Get projects error: ${error.message}` });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.lastOpenedAt = new Date();
    await project.save();

    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: `Get project by id error: ${error.message}` });
  }
};

export const getStarredProjects = async (req, res) => {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
    }

    const key = `starred-projects-${userId}`;
    let result = await redis.get(key);
    if (result) {
      return res.status(200).json(JSON.parse(result));
    }

    const projects = await Project.find({
      owner: userId,
      starred: true,
    }).sort({ updatedAt: -1 });

    await redis.set(key, JSON.stringify(projects), "EX", 3600);

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: `Get starred projects error: ${error.message}` });
  }
};

export const toggleStar = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await getUserIdFromRequest(req);

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.starred = !project.starred;
    await project.save();

    const actualUserId = userId || project.owner.toString();
    await redis.del(`starred-projects-${actualUserId}`);
    await redis.del(`projects-${actualUserId}`);

    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: `Toggle star error: ${error.message}` });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await getUserIdFromRequest(req);

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const actualUserId = userId || project.owner.toString();
    await redis.del(`projects-${actualUserId}`);
    await redis.del(`starred-projects-${actualUserId}`);

    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: `Project delete error: ${error.message}` });
  }
};
