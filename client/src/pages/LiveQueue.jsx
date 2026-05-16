import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import socket from "../socket";
import toast from "react-hot-toast";
import NotificationBell from "../components/NotificationBell";
import { FiLayout, FiActivity, FiUsers, FiBarChart2, FiLogOut, FiUser, FiPlay, FiCheckCircle, FiXCircle } from "react-icons/fi";

function LiveQueue() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchLiveQueue = async () => {
      try {
        const res = await API.get("/queue/business");
        setQueues(res.data);

        // Join business room for sockets
        if (res.data.length > 0 && res.data[0].business) {
          socket.emit("join_business", res.data[0].business);
        } else {
          // Fallback if no data, fetch business ID separately if needed
          const bizRes = await API.get("/business");
          if (bizRes.data.length > 0) {
            socket.emit("join_business", bizRes.data[0]._id);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveQueue();

    socket.on("queueBooked", (newEntry) => {
      setQueues((prev) => [...prev, newEntry]);
      toast.success("New Customer Joined!", {
        style: { background: "#0B1120", color: "#fff", border: "1px solid #1A2234" }
      });
    });

    socket.on("queueUpdated", (updatedEntry) => {
      setQueues((prev) => prev.map(q => q._id === updatedEntry._id ? { ...q, ...updatedEntry } : q));
    });

    return () => {
      socket.off("queueBooked");
      socket.off("queueUpdated");
    };
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/queue/${id}/status`, { status });
      toast.success(`Token marked as ${status}`);
    } catch (err) {
      toast.error("Failed to update status");
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredQueues = queues.filter((q) => {
    const matchesSearch = 
      q.customer?.name?.toLowerCase()?.includes(search.toLowerCase()) || 
      q.tokenNumber?.toString()?.includes(search);
    
    const matchesFilter = filter === "all" || q.status === filter;
    return matchesSearch && matchesFilter;
  });

  const activeQueues = queues.filter(q => q.status === 'waiting' || q.status === 'called');

  const stats = {
    active: activeQueues.length,
    completed: queues.filter(q => q.status === 'completed').length,
    cancelled: queues.filter(q => q.status === 'cancelled').length,
    avgWait: activeQueues.length > 0 ? activeQueues[0].estimatedWait : 0
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
          absolute md:relative z-50 w-[280px] h-full bg-[#0B1120]/80 backdrop-blur-2xl border-r border-[#1A2234] 
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
            <button onClick={() => navigate("/owner/live-queue")} className="w-full text-left px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium cursor-pointer flex items-center gap-3 hover:scale-105 transition-all duration-300">
              <FiActivity />
              Live Queue
            </button>
            <button onClick={() => navigate("/owner/customers")} className="w-full text-left px-6 py-4 rounded-2xl text-gray-300 hover:bg-[#111827] hover:text-white transition duration-300 cursor-pointer flex items-center gap-3 hover:scale-105">
              <FiUsers />
              Customers
            </button>
            <button onClick={() => navigate("/owner/analytics")} className="w-full text-left px-6 py-4 rounded-2xl text-gray-300 hover:bg-[#111827] hover:text-white transition duration-300 cursor-pointer flex items-center gap-3 hover:scale-105">
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
      <div className="flex-1 min-w-0 overflow-y-auto px-4 sm:px-6 md:px-10 py-8">
        {/* TOPBAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-white text-3xl md:text-4xl font-bold">Live Queue</h1>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
              <p className="text-gray-400 text-lg">Manage realtime customer flow and queue operations.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
            <NotificationBell />
            <button onClick={() => navigate("/owner/add-queue")} className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 rounded-2xl text-white font-semibold cursor-pointer w-full sm:w-auto">
              + Add Queue
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Active Tokens', value: stats.active, trend: 'Online' },
            { label: 'Completed Today', value: stats.completed, trend: 'Today' },
            { label: 'Avg Wait Time', value: `${stats.avgWait}m`, trend: 'AI Est.' },
            { label: 'Cancelled', value: stats.cancelled, trend: 'Recent' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0B1120] border border-[#1A2234] rounded-3xl p-6 sm:p-7 w-full h-full transition-all duration-300 hover:border-blue-500/50 group">
              <div className="flex justify-between items-start mb-3">
                <p className="text-gray-400">{stat.label}</p>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{stat.trend}</span>
              </div>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold break-words group-hover:scale-105 transition-transform duration-300">{stat.value}</h1>
            </div>
          ))}
        </div>

        {/* FILTERS & SEARCH */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
          <div className="flex bg-[#0B1120] p-1.5 rounded-2xl border border-[#1A2234] overflow-x-auto whitespace-nowrap scrollbar-hide">
            {['all', 'waiting', 'called', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${filter === tab ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:w-96">
            <input
              type="text"
              placeholder="Search by customer or token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#111827] border border-[#1A2234] rounded-2xl px-6 py-4 w-full text-white outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* QUEUE TABLE */}
        <div className="bg-[#0B1120] border border-[#1A2234] rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-white/5 border-b border-[#1A2234]">
                <tr>
                  <th className="px-8 py-6 text-gray-400 font-semibold uppercase tracking-wider text-xs">Token</th>
                  <th className="px-8 py-6 text-gray-400 font-semibold uppercase tracking-wider text-xs">Customer</th>
                  <th className="px-8 py-6 text-gray-400 font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="px-8 py-6 text-gray-400 font-semibold uppercase tracking-wider text-xs">Position</th>
                  <th className="px-8 py-6 text-gray-400 font-semibold uppercase tracking-wider text-xs">Wait Time</th>
                  <th className="px-8 py-6 text-gray-400 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2234]">
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="6" className="px-8 py-10">
                        <div className="h-8 bg-white/5 rounded-lg w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredQueues.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="text-white text-2xl font-bold">No Active Queue</h3>
                        <p className="text-gray-400">There are no customers currently in the live queue.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredQueues.map((q) => (
                    <tr key={q._id} className="hover:bg-white/5 transition duration-300">
                      <td className="px-8 py-6">
                        <div className="bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 text-white font-mono text-xl font-bold">
                          #{q.tokenNumber}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-white font-bold">{q.customer?.name || "Guest Customer"}</p>
                        <p className="text-gray-500 text-xs">{new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                          q.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          q.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          q.status === 'called' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 
                          'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-gray-300 font-medium">
                        {q.status === 'waiting' || q.status === 'called' ? q.position : '-'}
                      </td>
                      <td className="px-8 py-6 text-gray-300 font-medium">
                        {q.status === 'waiting' || q.status === 'called' ? `${q.estimatedWait}m` : '-'}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-3">
                          {q.status === 'waiting' && (
                            <button 
                              onClick={() => handleStatusUpdate(q._id, 'called')}
                              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/20"
                            >
                              Call Next
                            </button>
                          )}
                          {(q.status === 'waiting' || q.status === 'called') && (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(q._id, 'completed')}
                                className="p-2.5 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white border border-green-500/20 rounded-xl transition"
                                title="Complete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(q._id, 'cancelled')}
                                className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition"
                                title="Cancel"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveQueue;
