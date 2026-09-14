import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0d14] text-gray-200 flex flex-col font-sans relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-gray-800/60 bg-[#0d1117]/60 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
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
            <span className="font-bold text-lg text-white tracking-tight">CodeCloud</span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Dashboard ({user?.name || "Account"})</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 py-20 relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
          Cloud Collaborative Code Editor
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Write, Run & Collaborate <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Directly in the Browser
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed">
          A high-performance cloud-native development environment with real-time sync, microservices architecture, and dedicated workspace isolation.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xl shadow-indigo-500/30 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              Open Dashboard
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xl shadow-indigo-500/30 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                Create Free Account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#161b22] hover:bg-[#1f242d] text-gray-300 hover:text-white border border-gray-800 text-sm font-medium rounded-xl transition-all cursor-pointer"
              >
                Sign In to Workspace
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16 w-full text-left">
          <div className="p-5 rounded-xl bg-[#121620]/60 border border-gray-800/80 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              ⚡
            </div>
            <h3 className="text-white text-sm font-semibold mb-1">Fast Cloud Runtime</h3>
            <p className="text-xs text-gray-400">Microservice-driven execution environment with instant responses.</p>
          </div>

          <div className="p-5 rounded-xl bg-[#121620]/60 border border-gray-800/80 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
              🔒
            </div>
            <h3 className="text-white text-sm font-semibold mb-1">Protected Workspaces</h3>
            <p className="text-xs text-gray-400">End-to-end authentication guard ensuring your code stays private.</p>
          </div>

          <div className="p-5 rounded-xl bg-[#121620]/60 border border-gray-800/80 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              🌐
            </div>
            <h3 className="text-white text-sm font-semibold mb-1">Multi-Service Architecture</h3>
            <p className="text-xs text-gray-400">Robust Gateway routing traffic dynamically across services.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} CodeCloud. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;