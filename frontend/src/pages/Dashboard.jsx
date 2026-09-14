import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-gray-800/80 bg-[#161b22]/70 backdrop-blur-md sticky top-0 z-50">
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
                v1.0-beta
              </span>
            </div>
          </div>

          {/* Right User Bar & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#0d1117]/60 border border-gray-800 px-3 py-1.5 rounded-xl">
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
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-[#161b22] border border-indigo-500/20 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-mono font-semibold">
              Authenticated Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 mb-2">
              Welcome back, {user?.name || "Developer"}! 👋
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your distributed cloud code editor is ready. You are securely logged in as{" "}
              <span className="text-gray-200 font-mono bg-gray-800/80 px-2 py-0.5 rounded text-xs">
                {user?.email}
              </span>
              . Only authorized developers can access this dashboard.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => alert("Project creator will open here!")}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </button>

              <button
                onClick={() => alert("Editor workspace opening...")}
                className="inline-flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-gray-700 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Open Terminal
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats / Environment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#161b22]/70 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-gray-400">AUTH STATUS</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xl font-bold text-white">Active Session</p>
            <p className="text-xs text-gray-500 mt-1">JWT verification via HTTP-Only cookie</p>
          </div>

          <div className="bg-[#161b22]/70 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-gray-400">MICROSERVICES</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                Gateway :3000
              </span>
            </div>
            <p className="text-xl font-bold text-white">Auth & Project</p>
            <p className="text-xs text-gray-500 mt-1">API routes proxied through Gateway</p>
          </div>

          <div className="bg-[#161b22]/70 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-gray-400">USER ID</span>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
            <p className="text-sm font-mono text-gray-300 truncate" title={user?.id}>
              {user?.id || "N/A"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Database identity verified</p>
          </div>
        </div>

        {/* Recent Workspaces / Projects Placeholder */}
        <div className="bg-[#161b22]/70 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Your Projects</h2>
            <span className="text-xs text-gray-500 font-mono">0 active instances</span>
          </div>

          <div className="border border-dashed border-gray-800 rounded-xl p-10 flex flex-col items-center justify-center text-center">
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
            <h3 className="text-sm font-medium text-gray-300 mb-1">No Projects Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mb-4">
              Get started by creating your first collaborative code repository or sandbox.
            </p>
            <button
              onClick={() => alert("Creating new workspace...")}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
            >
              + Create Project
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
