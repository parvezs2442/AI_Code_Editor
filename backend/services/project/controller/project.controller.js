import mongoose from "mongoose";
import Project from "../model/Project.js";

const getStarterFiles = (language) => {
  switch (language) {
    case "python":
      return [
        {
          name: "main.py",
          content: "# Write your Python code here\nprint('Hello from Cloud Code Editor!')\n",
        },
      ];
    case "html":
      return [
        {
          name: "index.html",
          content:
            "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Cloud App</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>\n",
        },
      ];
    case "cpp":
      return [
        {
          name: "main.cpp",
          content:
            "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello from Cloud Code Editor!\" << endl;\n    return 0;\n}\n",
        },
      ];
    case "java":
      return [
        {
          name: "Main.java",
          content:
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello from Cloud Code Editor!\");\n    }\n}\n",
        },
      ];
    case "javascript":
    default:
      return [
        {
          name: "index.js",
          content: "// Write your JavaScript code here\nconsole.log('Hello from Cloud Code Editor!');\n",
        },
      ];
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description, language = "javascript" } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const files = getStarterFiles(language);

    const project = await Project.create({
      name: name.trim(),
      description: (description || "").trim(),
      language,
      user: req.user.userId,
      files,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const filter = { user: req.user.userId };
    if (req.query.starred === "true") {
      filter.isStarred = true;
    }

    const projects = await Project.find(filter).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get Projects Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    const project = await Project.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get Project By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

export const toggleStarProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    const project = await Project.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized",
      });
    }

    project.isStarred = !project.isStarred;
    await project.save();

    return res.status(200).json({
      success: true,
      message: project.isStarred ? "Project starred" : "Project unstarred",
      isStarred: project.isStarred,
      project,
    });
  } catch (error) {
    console.error("Toggle Star Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle star status",
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    const { name, description, language, files, isStarred } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (language !== undefined) updateData.language = language;
    if (files !== undefined) updateData.files = files;
    if (isStarred !== undefined) updateData.isStarred = isStarred;

    const project = await Project.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update Project Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    const project = await Project.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      projectId: id,
    });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};
