import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'projects' | 'starred'
  const [activeTab, setActiveTab] = useState("projects");

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

  // Deleting & Star Toggling State
  const [deletingId, setDeletingId] = useState(null);
  const [starringId, setStarringId] = useState(null);

  // User Dropdown State
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

  const handleToggleStar = async (e, projectId) => {
    e.stopPropagation();
    try {
      setStarringId(projectId);
      const response = await axios.patch(
        `http://localhost:3000/api/project/${projectId}/star`,
        {},
        { withCredentials: true }
      );

      if (response.data && response.data.project) {
        setProjects((prev) =>
          prev.map((p) =>
            p._id === projectId ? { ...p, isStarred: response.data.project.isStarred } : p
          )
        );
      }
    } catch (error) {
      console.error("Star toggle error:", error);
    } finally {
      setStarringId(null);
    }
  };

  const handleDeleteProject = async (e, projectId, name) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`
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

  const starredProjects = projects.filter((p) => p.isStarred);

  const displayedProjects = (activeTab === "starred" ? starredProjects : projects).filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0d0f14] text-gray-200 flex flex-row font-sans selection:bg-indigo-500/30">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-gray-800/80 bg-[#12141c] flex flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen">
        <div>
          {/* Brand Logo & Name */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-gray-800/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
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
            <span className="font-extrabold text-lg text-white tracking-tight">
              CodeCloud
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {/* Projects Tab */}
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                activeTab === "projects"
                  ? "bg-[#1c202d] text-white shadow-sm border border-gray-700/60"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#181b26]"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-4 h-4 ${
                    activeTab === "projects" ? "text-indigo-400" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <span>Projects</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-gray-800/80 text-gray-400">
                {projects.length}
              </span>
            </button>

            {/* Starred Tab */}
            <button
              onClick={() => setActiveTab("starred")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                activeTab === "starred"
                  ? "bg-[#1c202d] text-white shadow-sm border border-gray-700/60"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#181b26]"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-4 h-4 ${
                    activeTab === "starred"
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-400"
                  }`}
                  fill={activeTab === "starred" ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <span>Starred</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-gray-800/80 text-amber-400/80">
                {starredProjects.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Upgrade Plan Card (matching reference UI) */}
        <div className="p-4 m-3 rounded-2xl bg-[#171a24] border border-gray-800/80 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          <h4 className="text-xs font-bold text-gray-100 uppercase tracking-wider mb-1">
            Upgrade Plan
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
            Upgrade to Pro for unlimited cloud containers & real-time team collaboration.
          </p>
          <button
            onClick={() => alert("Pro membership features coming soon!")}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white text-gray-900 hover:bg-gray-100 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>Upgrade Now</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-gray-800/60 bg-[#12141c]/60 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
          {/* Search or Quick Status */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="relative w-full">
              <svg
                className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
                className="w-full pl-10 pr-4 py-2 bg-[#0a0d14] border border-gray-800 rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
              />
            </div>
          </div>

          {/* Right Header items: Theme icon & User menu */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Moon Indicator */}
            <div
              className="w-9 h-9 rounded-xl bg-[#171a24] border border-gray-800/80 flex items-center justify-center text-gray-400"
              title="Dark theme active"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 py-1 px-2.5 rounded-xl hover:bg-[#1c202d] transition-colors border border-transparent hover:border-gray-800 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  {getInitials(user?.name)}
                </div>
                <span className="text-sm font-medium text-gray-200 hidden sm:inline-block">
                  {user?.name || "Developer"}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#171a24] border border-gray-800 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-800/80">
                    <p className="text-xs font-semibold text-white truncate">
                      {user?.name || "Developer"}
                    </p>
                    <p className="text-[11px] text-gray-400 font-mono truncate">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-gray-800/50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8 max-w-7xl w-full">
          {/* Welcome Header + "+ New Project" Button (matching screenshot layout) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                Welcome Back, {user?.name || "Developer"} 👋
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Ready to build something amazing today?
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all transform active:scale-95 cursor-pointer self-start sm:self-auto"
            >
              <svg className="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Project</span>
            </button>
          </div>

          {/* Section Heading: "Recent Projects" or "Starred Projects" */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white tracking-wide">
              {activeTab === "starred" ? "Starred Projects" : "Recent Projects"}
            </h2>

            <span className="text-xs text-gray-500 font-mono">
              {displayedProjects.length} project{displayedProjects.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Projects Grid */}
          {loadingProjects ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-gray-400">Loading your workspaces...</p>
            </div>
          ) : displayedProjects.length === 0 ? (
            <div className="border border-dashed border-gray-800 rounded-2xl p-14 flex flex-col items-center justify-center text-center bg-[#12141c]/40">
              <div className="w-12 h-12 rounded-2xl bg-gray-800/50 flex items-center justify-center text-gray-400 mb-3">
                {activeTab === "starred" ? (
                  <svg className="w-6 h-6 text-amber-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-200 mb-1">
                {activeTab === "starred"
                  ? "No Starred Projects"
                  : searchQuery
                  ? "No matching projects found"
                  : "No Projects Created Yet"}
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mb-5">
                {activeTab === "starred"
                  ? "Click the star icon on any project card to bookmark it for quick access."
                  : searchQuery
                  ? "Try searching with a different term."
                  : "Get started by initializing your first cloud repository."}
              </p>
              {activeTab === "projects" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayedProjects.map((project) => {
                const langBadge = getLanguageColor(project.language);
                const isDeleting = deletingId === project._id;
                const isStarring = starringId === project._id;

                return (
                  <div
                    key={project._id}
                    onClick={() => alert(`Opening Code Editor for project: "${project.name}" (ID: ${project._id})`)}
                    className="h-44 p-5 rounded-2xl bg-[#141721]/90 border border-gray-800/90 hover:border-gray-700 hover:bg-[#181c28] transition-all duration-200 flex flex-col justify-between cursor-pointer group shadow-lg relative overflow-hidden"
                  >
                    {/* Top Row: Title & Star Button (matching reference screenshot) */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {project.name}
                        </h3>

                        {/* Star / Unstar Button */}
                        <button
                          onClick={(e) => handleToggleStar(e, project._id)}
                          disabled={isStarring}
                          className="p-1 rounded-lg hover:bg-gray-800/80 transition-colors cursor-pointer text-gray-500 hover:text-amber-400 shrink-0"
                          title={project.isStarred ? "Remove star" : "Star project"}
                        >
                          <svg
                            className={`w-4 h-4 transition-transform duration-150 active:scale-125 ${
                              project.isStarred
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-500 hover:text-gray-300"
                            }`}
                            fill={project.isStarred ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {project.description || "No description provided."}
                      </p>
                    </div>

                    {/* Bottom Row: Language Pill & Delete Trash Icon (matching reference screenshot) */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-800/60">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${langBadge.bg} ${langBadge.text} ${langBadge.border}`}
                      >
                        {langBadge.label}
                      </span>

                      {/* Delete Icon (bottom right trash can) */}
                      <button
                        onClick={(e) => handleDeleteProject(e, project._id, project.name)}
                        disabled={isDeleting}
                        className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        {isDeleting ? (
                          <div className="w-3.5 h-3.5 border-2 border-rose-400/30 border-t-rose-400 rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.6"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* CREATE PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#161922] border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
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
                  placeholder="e.g. Calculator"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0e1017] border border-gray-800 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. for simple calculation"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0e1017] border border-gray-800 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                  Language / Environment
                </label>
                <select
                  value={projectLang}
                  onChange={(e) => setProjectLang(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0e1017] border border-gray-800 rounded-xl text-sm text-gray-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
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
                  className="px-5 py-2.5 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50 text-xs font-semibold rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
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
