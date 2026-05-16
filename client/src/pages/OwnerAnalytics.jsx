import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FiLogOut,
  FiLayout,
  FiUsers,
  FiBarChart2,
  FiUser,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";

function OwnerAnalytics() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dailyData, setDailyData] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [queueStats, setQueueStats] = useState({
    completed: 0,
    cancelled: 0,
    avgWaitTime: 0,
    totalQueues: 0,
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/queue/business");
      const queues = res.data || [];

      // Calculate stats
      const completed = queues.filter((q) => q.status === "completed").length;
      const cancelled = queues.filter((q) => q.status === "cancelled").length;
      const avgWait =
        queues.length > 0
          ? Math.round(
              queues.reduce((sum, q) => sum + (q.waitTime || 0), 0) /
                queues.length
            )
          : 0;

      setQueueStats({
        completed,
        cancelled,
        avgWaitTime: avgWait,
        totalQueues: queues.length,
      });

      // Daily data (mock - you can enhance with real date tracking)
      const mockDailyData = [
        { day: "Monday", customers: 40, completed: 38, cancelled: 2 },
        { day: "Tuesday", customers: 65, completed: 60, cancelled: 5 },
        { day: "Wednesday", customers: 55, completed: 52, cancelled: 3 },
        { day: "Thursday", customers: 75, completed: 70, cancelled: 5 },
        { day: "Friday", customers: 85, completed: 78, cancelled: 7 },
        { day: "Saturday", customers: 95, completed: 88, cancelled: 7 },
      ];
      setDailyData(mockDailyData);

      // Peak hours data (mock)
      const mockPeakHours = [
        { hour: "9 AM", customers: 12 },
        { hour: "12 PM", customers: 35 },
        { hour: "3 PM", customers: 28 },
        { hour: "6 PM", customers: 42 },
        { hour: "8 PM", customers: 22 },
      ];
      setPeakHours(mockPeakHours);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen w-full flex overflow-x-hidden"
      style={{
        background:
          "linear-gradient(135deg, #050816 0%, #0b1230 40%, #21002e 100%)",
      }}
    >
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          absolute
          md:relative
          z-50
          w-[280px]
          h-full
          bg-[#0B1120]
          border-r
          border-[#1A2234]
          flex
          flex-col
          justify-between
          px-6
          py-8
          transition-transform
          duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* TOP */}
        <div>
          {/* LOGO */}
          <div
            onClick={() => navigate("/dashboard/owner")}
            className="flex items-center gap-3 mb-14 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
              Q
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">QueueMind</h1>
              <p className="text-blue-400 text-sm">AI</p>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="flex flex-col gap-3 mt-10">
            <button
              onClick={() => navigate("/dashboard/owner")}
              className="w-full text-left px-6 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-3"
            >
              <FiLayout className="text-xl" />
              Dashboard
            </button>

            <button
              onClick={() => navigate("/owner/live-queue")}
              className="w-full text-left px-6 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-3"
            >
              <FiActivity className="text-xl" />
              Live Queue
            </button>

            <button
              onClick={() => navigate("/owner/customers")}
              className="w-full text-left px-6 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-3"
            >
              <FiUsers className="text-xl" />
              Customers
            </button>

            <button
              onClick={() => navigate("/owner/analytics")}
              className="w-full text-left px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium cursor-pointer flex items-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105 transition-all duration-300"
            >
              <FiBarChart2 className="text-xl" />
              Analytics
            </button>
          </div>
        </div>

        {/* PROFILE */}
        <div>
          <div className="bg-[#0d1730]/60 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-4 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl">
              <FiUser />
            </div>
            <div>
              <h2 className="text-white font-semibold">{user?.name || "Owner"}</h2>
              <p className="text-gray-400 text-sm">
                {user?.role || "Business Owner"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-300 cursor-pointer flex items-center gap-3 group"
          >
            <FiLogOut className="group-hover:rotate-12 transition-transform" />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0 overflow-y-auto px-4 sm:px-6 md:px-10 py-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-400 text-lg">
                Monitor your queue performance and insights
              </p>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 flex items-center gap-4 w-full h-full">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 text-2xl">
              <FiActivity />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Queues</p>
              <h3 className="text-white text-xl sm:text-2xl font-bold break-words">
                {queueStats.totalQueues}
              </h3>
            </div>
          </div>

          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 flex items-center gap-4 w-full h-full">
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400 text-2xl">
              ✓
            </div>
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <h3 className="text-white text-xl sm:text-2xl font-bold break-words">
                {queueStats.completed}
              </h3>
            </div>
          </div>

          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 flex items-center gap-4 w-full h-full">
            <div className="p-3 bg-red-500/20 rounded-xl text-red-400 text-2xl">
              ✕
            </div>
            <div>
              <p className="text-gray-400 text-sm">Cancelled</p>
              <h3 className="text-white text-xl sm:text-2xl font-bold break-words">
                {queueStats.cancelled}
              </h3>
            </div>
          </div>

          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 flex items-center gap-4 w-full h-full">
            <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400 text-2xl">
              ⏱
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Wait Time</p>
              <h3 className="text-white text-xl sm:text-2xl font-bold break-words">
                {queueStats.avgWaitTime} min
              </h3>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* DAILY CUSTOMERS CHART */}
            <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 sm:p-8">
              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-blue-400" />
                Weekly Customers
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1d2942" />
                  <XAxis stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1120",
                      border: "1px solid #1d2942",
                      borderRadius: "12px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Bar dataKey="customers" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar
                    dataKey="completed"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* PEAK HOURS CHART */}
            <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 sm:p-8">
              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                <FiActivity className="text-purple-400" />
                Peak Hours
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={peakHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1d2942" />
                  <XAxis stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1120",
                      border: "1px solid #1d2942",
                      borderRadius: "12px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* QUEUE STATUS PIE CHART */}
            <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 sm:p-8">
              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                <FiBarChart2 className="text-pink-400" />
                Queue Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Completed", value: queueStats.completed || 1 },
                      { name: "Cancelled", value: queueStats.cancelled || 1 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[queueStats.completed, queueStats.cancelled].map(
                      (entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1120",
                      border: "1px solid #1d2942",
                      borderRadius: "12px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* COMPLETION RATE */}
            <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 sm:p-8">
              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-green-400" />
                Completion Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Completion Rate</span>
                    <span className="text-green-400 font-bold">
                      {queueStats.totalQueues > 0
                        ? Math.round(
                            (queueStats.completed / queueStats.totalQueues) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      style={{
                        width: `${
                          queueStats.totalQueues > 0
                            ? (queueStats.completed / queueStats.totalQueues) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1d2942]">
                  <p className="text-gray-400 text-sm mb-2">Performance</p>
                  <p className="text-white font-bold">
                    {queueStats.completed} of {queueStats.totalQueues} queues
                    completed
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {queueStats.cancelled} queues cancelled
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerAnalytics;
