import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "index.js",
    },
    content: {
      type: String,
      default: "// Write your code here\nconsole.log('Hello from Cloud Code Editor!');\n",
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    language: {
      type: String,
      default: "javascript",
      enum: ["javascript", "python", "html", "cpp", "java"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      index: true,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    files: {
      type: [fileSchema],
      default: () => [
        {
          name: "index.js",
          content: "// Write your code here\nconsole.log('Hello from Cloud Code Editor!');\n",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
