import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMe = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/getMe", {
        withCredentials: true,
      });

      console.log("Current user:", response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error(
        "Get Me error:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">User Profile</h2>
          <Link
            to="/dashboard"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : user ? (
          <div className="space-y-4">
            <div className="p-3 bg-[#0d1117] border border-gray-800 rounded-xl">
              <span className="text-[11px] font-mono text-gray-500 uppercase block">User ID</span>
              <p className="font-mono text-sm text-gray-300 truncate mt-0.5">{user.id}</p>
            </div>
            <div className="p-3 bg-[#0d1117] border border-gray-800 rounded-xl">
              <span className="text-[11px] font-mono text-gray-500 uppercase block">Name</span>
              <p className="text-sm font-medium text-white mt-0.5">{user.name}</p>
            </div>
            <div className="p-3 bg-[#0d1117] border border-gray-800 rounded-xl">
              <span className="text-[11px] font-mono text-gray-500 uppercase block">Email</span>
              <p className="text-sm text-gray-300 mt-0.5">{user.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-rose-400">Failed to load user profile.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;