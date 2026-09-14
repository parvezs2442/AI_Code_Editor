import File from "../models/file.model.js";
import { buildTree } from "../utils/buildTree.js";
import redis from "../../../shared/redis/redis.js";

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
      console.error("Error resolving session in file controller:", e.message);
    }
  }
  return null;
};

export const createRootFolder = async (req, res) => {
  try {
    const { projectId, projectName } = req.body;
    const userId = await getUserIdFromRequest(req);

    if (!projectId || !projectName) {
      return res.status(400).json({ message: "projectId and projectName are required" });
    }

    // Check if root folder already exists for this project
    let rootFolder = await File.findOne({
      projectId,
      parentId: null,
      type: "folder",
      isDeleted: false,
    });

    if (!rootFolder) {
      rootFolder = await File.create({
        owner: userId || projectId,
        projectId,
        name: projectName,
        type: "folder",
        parentId: null,
      });

      // Also create a starter file (index.js) inside rootFolder
      await File.create({
        owner: userId || projectId,
        projectId,
        name: "index.js",
        type: "file",
        parentId: rootFolder._id,
        content: "// Welcome to your project!\nconsole.log('Hello, World!');\n",
        language: "javascript",
        extension: "js",
        size: 56,
      });
    }

    return res.status(201).json(rootFolder);
  } catch (error) {
    return res.status(500).json({ message: `createRootFolder error: ${error.message}` });
  }
};

export const createFolder = async (req, res) => {
  try {
    const { projectId, name, parentId } = req.body;
    const userId = await getUserIdFromRequest(req);

    if (!projectId || !name || !parentId) {
      return res.status(400).json({ message: "projectId, name, and parentId are required" });
    }

    const folder = await File.create({
      owner: userId || projectId,
      projectId,
      name,
      type: "folder",
      parentId,
    });

    return res.status(201).json(folder);
  } catch (error) {
    return res.status(500).json({ message: `createFolder error: ${error.message}` });
  }
};

export const createFile = async (req, res) => {
  try {
    const { projectId, name, parentId, content = "", language = "plaintext" } = req.body;
    const userId = await getUserIdFromRequest(req);

    if (!projectId || !name || !parentId) {
      return res.status(400).json({ message: "projectId, name, and parentId are required" });
    }

    const extension = name.includes(".") ? name.split(".").pop() : "";

    const file = await File.create({
      owner: userId || projectId,
      projectId,
      name,
      parentId,
      type: "file",
      content,
      language,
      extension,
      size: content.length,
    });

    return res.status(201).json(file);
  } catch (error) {
    return res.status(500).json({ message: `createFile error: ${error.message}` });
  }
};

export const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (name !== undefined) {
      file.name = name;
      if (name.includes(".")) {
        file.extension = name.split(".").pop();
      }
    }

    if (content !== undefined) {
      file.content = content;
      file.size = content.length;
    }

    await file.save();
    return res.status(200).json(file);
  } catch (error) {
    return res.status(500).json({ message: `updateFile error: ${error.message}` });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Recursively soft-delete children if it's a folder
    const deleteRecursive = async (targetId) => {
      const children = await File.find({ parentId: targetId });
      for (const child of children) {
        await deleteRecursive(child._id);
      }
      await File.findByIdAndUpdate(targetId, { isDeleted: true });
    };

    await deleteRecursive(id);

    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: `deleteFile error: ${error.message}` });
  }
};

export const getFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ _id: id, isDeleted: false });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json(file);
  } catch (error) {
    return res.status(500).json({ message: `getFile error: ${error.message}` });
  }
};

export const getTree = async (req, res) => {
  try {
    const { projectId } = req.params;

    const files = await File.find({
      projectId,
      isDeleted: false,
    }).sort({ type: -1, name: 1 }); // folders first, then alphabetical

    const tree = buildTree(files);

    return res.status(200).json(tree);
  } catch (error) {
    return res.status(500).json({ message: `getTree error: ${error.message}` });
  }
};
