import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import socket from "../socket";
import toast from "react-hot-toast";
import { FiLayout, FiActivity, FiUsers, FiBarChart2, FiLogOut, FiUser, FiTrendingUp, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

const bookingData = [
  { name: 'Mon', bookings: 12 },
  { name: 'Tue', bookings: 18 },
  { name: 'Wed', bookings: 25 },
  { name: 'Thu', bookings: 20 },
  { name: 'Fri', bookings: 32 },
  { name: 'Sat', bookings: 45 },
  { name: 'Sun', bookings: 38 },
];

const pieData = [
  { name: 'Completed', value: 85, color: '#10B981' },
  { name: 'Cancelled', value: 15, color: '#EF4444' },
];

const waitTimeData = [
  { hour: '9AM', wait: 5 },
  { hour: '11AM', wait: 15 },
  { hour: '1PM', wait: 25 },
  { hour: '3PM', wait: 12 },
  { hour: '5PM', wait: 35 },
  { hour: '7PM', wait: 20 },
];

function Analytics() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #050816 0%, #0b1230 40%, #21002e 100%)"
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
          absolute md:relative z-50 w-[280px] h-full bg-[#0B1120] border-r border-[#1A2234] 
          flex flex-col justify-between px-6 py-8 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div>
          <div 
            onClick={() =>
              navigate(
                user?.role === "owner"
                  ? "/dashboard/owner"
                  : "/dashboard/customer"
              )
            }
            className="flex items-center gap-3 mb-14 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg group-hover:rotate-[360deg] transition-transform duration-700">
              Q
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">QueueMind</h1>
              <p className="text-blue-400 text-sm">AI</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-10">
            <button onClick={() => navigate("/dashboard/owner")} className="w-full text-left px-6 py-4 rounded-2xl text-gray-300 hover:bg-[#111827] hover:text-white transition duration-300 cursor-pointer flex items-center gap-3 hover:scale-105">
              <FiLayout />
              Dashboard
            </button>
            <button onClick={() => navigate("/owner/live-queue")} className="w-full text-left px-6 py-4 rounded-2xl text-gray-300 hover:bg-[#111827] hover:text-white transition duration-300 cursor-pointer flex items-center gap-3 hover:scale-105">
              <FiActivity />
              Live Queue
            </button>
            <button onClick={() => navigate("/owner/customers")} className="w-full text-left px-6 py-4 rounded-2xl text-gray-300 hover:bg-[#111827] hover:text-white transition duration-300 cursor-pointer flex items-center gap-3 hover:scale-105">
              <FiUsers />
              Customers
            </button>
            <button onClick={() => navigate("/owner/analytics")} className="w-full text-left px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium cursor-pointer flex items-center gap-3 hover:scale-105 transition-all duration-300">
              <FiBarChart2 />
              Analytics
            </button>
          </div>
        </div>

        {/* PROFILE */}
        <div className="mt-auto">
          <div
            className="
              bg-[#0d1730]/60
              backdrop-blur-xl
              border
              border-[#1d2942]
              rounded-3xl
              p-4
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                w-14
                h-14
                rounded-full
                bg-gradient-to-r
                from-blue-500
                to-purple-500
                flex
                items-center
                justify-center
                text-white
                text-xl
              "
            >
              <FiUser />
            </div>
            <div>
              <h2
                className="
                  text-white
                  font-semibold
                "
              >
                {user?.name || "Owner"}
              </h2>
              <p
                className="
                  text-gray-400
                  text-sm
                "
              >
                {user?.role || "Business Owner"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-300 mt-4 cursor-pointer flex items-center gap-3 group"
          >
            <FiLogOut className="group-hover:rotate-12 transition-transform" />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
        {/* TOPBAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-gray-400 text-lg">Real-time performance insights for your business.</p>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Customers', value: '1,284', trend: '+12%', icon: <FiUsers /> },
            { label: 'Completed Today', value: '42', trend: '+5%', icon: <FiCheckCircle /> },
            { label: 'Cancelled', value: '3', trend: '-2%', icon: <FiXCircle /> },
            { label: 'Avg Wait Time', value: '14m', trend: '-3m', icon: <FiClock /> },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-7 transition hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] group">
              <div className="flex justify-between items-start mb-3">
                <p className="text-gray-400 group-hover:text-blue-400 transition-colors">{stat.label}</p>
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <h1 className="text-white text-5xl font-bold">{stat.value}</h1>
                <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* BAR CHART */}
          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-[32px] p-8 hover:border-blue-500/30 transition-all">
            <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
              <FiBarChart2 className="text-blue-500" />
              Weekly Bookings
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A2234" vertical={false} />
                  <XAxis dataKey="name" stroke="#6B7280" axisLine={false} tickLine={false} />
                  <YAxis stroke="#6B7280" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1120', border: '1px solid #1A2234', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="bookings" fill="url(#colorBar)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LINE CHART */}
          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-[32px] p-8 hover:border-blue-500/30 transition-all">
            <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
              <FiClock className="text-purple-500" />
              Wait Time Trends
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waitTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A2234" vertical={false} />
                  <XAxis dataKey="hour" stroke="#6B7280" axisLine={false} tickLine={false} />
                  <YAxis stroke="#6B7280" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1120', border: '1px solid #1A2234', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="wait" stroke="#3B82F6" strokeWidth={4} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-[32px] p-8 hover:border-blue-500/30 transition-all">
            <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
              <FiCheckCircle className="text-green-500" />
              Queue Efficiency
            </h2>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1120', border: '1px solid #1A2234', borderRadius: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI INSIGHTS CARD */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-white text-3xl font-bold">AI Analytics Insight</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-gray-400 text-lg">Peak Rush Hour</span>
                <span className="text-white font-bold text-xl">5:00 PM - 7:00 PM</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-gray-400 text-lg">Efficiency Score</span>
                <span className="text-green-400 font-bold text-xl">94%</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-gray-400 text-lg">Rec. Staffing</span>
                <span className="text-blue-400 font-bold text-xl">3 Counters</span>
              </div>
            </div>

            <p className="mt-8 text-white/80 text-lg leading-relaxed italic border-l-4 border-blue-500 pl-4">
              "AI predicts a 20% increase in bookings for tomorrow morning. Consider opening the extra counter at 10 AM."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
