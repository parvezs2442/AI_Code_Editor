import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Projects state
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Project Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectLang, setProjectLang] = useState("javascript");
  const [isCreating, setIsCreating] = useState(false);
  const [modalError, setModalError] = useState("");

  // Deleting State
  const [deletingId, setDeletingId] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await axios.get("http://localhost:3000/api/project/all", {
        withCredentials: true,
      });
      if (response.data && response.data.projects) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error(
        "Fetch projects error:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setModalError("Project name is required");
      return;
    }

    setModalError("");
    setIsCreating(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/project/create",
        {
          name: projectName,
          description: projectDesc,
          language: projectLang,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.project) {
        setProjects((prev) => [response.data.project, ...prev]);
        setIsModalOpen(false);
        setProjectName("");
        setProjectDesc("");
        setProjectLang("javascript");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Failed to create project";
      setModalError(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId, projectName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(projectId);
      await axios.delete(`http://localhost:3000/api/project/${projectId}`, {
        withCredentials: true,
      });
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (error) {
      alert(
        "Delete error: " +
          (error.response?.data?.message || error.message || "Failed to delete project")
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getLanguageColor = (lang) => {
    switch (lang) {
      case "python":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-400",
          border: "border-blue-500/20",
          label: "Python",
        };
      case "html":
        return {
          bg: "bg-amber-500/10",
          text: "text-amber-400",
          border: "border-amber-500/20",
          label: "HTML / CSS",
        };
      case "cpp":
        return {
          bg: "bg-purple-500/10",
          text: "text-purple-400",
          border: "border-purple-500/20",
          label: "C++",
        };
      case "java":
        return {
          bg: "bg-rose-500/10",
          text: "text-rose-400",
          border: "border-rose-500/20",
          label: "Java",
        };
      case "javascript":
      default:
        return {
          bg: "bg-yellow-500/10",
          text: "text-yellow-400",
          border: "border-yellow-500/20",
          label: "JavaScript",
        };
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0a0d14] text-gray-200 flex flex-col font-sans relative">
      {/* Top Navigation Bar */}
      <header className="border-b border-gray-800/80 bg-[#121620]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">CodeCloud</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                Workspace
              </span>
            </div>
          </div>

          {/* Right User Bar & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#0a0d14]/70 border border-gray-800 px-3 py-1.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {getInitials(user?.name)}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-medium text-gray-200 leading-tight">{user?.name || "Developer"}</p>
                <p className="text-gray-500 text-[11px] truncate max-w-[150px]">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all duration-150 cursor-pointer"
              title="Logout session"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-[#121620] border border-indigo-500/20 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-mono font-semibold">
              Authenticated Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 mb-2">
              Welcome back, {user?.name || "Developer"}! 👋
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Manage your cloud repositories, create multi-language projects, and launch browser development environments.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                + Create New Project
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#121620]/70 border border-gray-800/80 rounded-xl p-5 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-gray-400">TOTAL PROJECTS</span>
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            </div>
            <p className="text-2xl font-bold text-white">{projects.length}</p>
            <p className="text-xs text-gray-500 mt-1">Active user workspaces in database</p>
          </div>

          <div className="bg-[#121620]/70 border border-gray-800/80 rounded-xl p-5 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-gray-400">AUTH STATUS</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xl font-bold text-white">Active Session</p>
            <p className="text-xs text-gray-500 mt-1">JWT verified via HTTP-Only cookie</p>
          </div>

          <div className="bg-[#121620]/70 border border-gray-800/80 rounded-xl p-5 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-gray-400">PROJECT SERVICE</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                Port :3002
              </span>
            </div>
            <p className="text-xl font-bold text-white">CRUD Service Online</p>
            <p className="text-xs text-gray-500 mt-1">Connected to MongoDB Project Cluster</p>
          </div>
        </div>

        {/* Projects Section Header & Search */}
        <div className="bg-[#121620]/90 border border-gray-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Your Projects</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Browse and manage all code repositories created by your account
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <svg
                  className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-[#0a0d14] border border-gray-800 rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchProjects}
                className="p-2 bg-[#0a0d14] hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                title="Refresh projects list"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              {/* Create New Project CTA */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Project</span>
              </button>
            </div>
          </div>

          {/* Projects Listing */}
          {loadingProjects ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-gray-400">Loading your projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="border border-dashed border-gray-800 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-gray-800/60 flex items-center justify-center text-gray-500 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-300 mb-1">
                {searchQuery ? "No matching projects" : "No Projects Found"}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mb-5">
                {searchQuery
                  ? "Try searching for a different project name or clear your filter."
                  : "You haven't created any projects yet. Start building something awesome!"}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => {
                const langBadge = getLanguageColor(project.language);
                const isDeleting = deletingId === project._id;

                return (
                  <div
                    key={project._id}
                    className="bg-[#0a0d14]/70 border border-gray-800 hover:border-indigo-500/40 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 group hover:shadow-xl hover:shadow-indigo-500/5"
                  >
                    <div>
                      {/* Card Header: Language badge & Delete action */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md border ${langBadge.bg} ${langBadge.text} ${langBadge.border}`}
                        >
                          {langBadge.label}
                        </span>

                        <button
                          onClick={() => handleDeleteProject(project._id, project.name)}
                          disabled={isDeleting}
                          className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Project"
                        >
                          {isDeleting ? (
                            <div className="w-3.5 h-3.5 border-2 border-rose-400/30 border-t-rose-400 rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Project Title & Description */}
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1.5">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 min-h-[32px] leading-relaxed">
                        {project.description || "No description provided."}
                      </p>
                    </div>

                    {/* Card Footer: Metadata & Open Button */}
                    <div className="mt-5 pt-4 border-t border-gray-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500 font-mono">
                        {project.files?.length || 1} file{(project.files?.length || 1) > 1 ? "s" : ""}
                      </span>

                      <button
                        onClick={() => alert(`Opening Code Editor for project: "${project.name}" (ID: ${project._id})`)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        <span>Open Editor</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* CREATE PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#121620] border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Create New Project</h3>
              <p className="text-xs text-gray-400 mt-1">
                Initialize a new code repository with starter files
              </p>
            </div>

            {/* Modal Error Banner */}
            {modalError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{modalError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My React App"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-gray-800 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Brief summary of your project..."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-gray-800 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                  Language / Environment
                </label>
                <select
                  value={projectLang}
                  onChange={(e) => setProjectLang(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0a0d14] border border-gray-800 rounded-xl text-sm text-gray-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="javascript">JavaScript (Node.js / Web)</option>
                  <option value="python">Python 3</option>
                  <option value="html">HTML5 / CSS / JS</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-white bg-transparent border border-gray-800 rounded-xl hover:bg-gray-800/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    "Create Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
