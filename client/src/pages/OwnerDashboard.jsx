import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import socket from "../socket";
import toast from "react-hot-toast";

import NotificationBell from "../components/NotificationBell";

import {
  FiLogOut,
  FiLayout,
  FiClock,
  FiUsers,
  FiMapPin,
  FiBell,
  FiTrendingUp,
  FiUser,
  FiActivity,
  FiBarChart2
} from "react-icons/fi";
import { FaCheck, FaUsers, FaClock, FaTimes } from "react-icons/fa";
function OwnerDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();
  const [queues, setQueues] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    const fetchLiveQueues = async () => {
      try {
        const res = await API.get("/queue/business");
        setQueues(res.data);
        
        // Join business room for sockets
        if (res.data.length > 0 && res.data[0].business) {
          socket.emit("join_business", res.data[0].business);
        } else {
           const bizRes = await API.get("/business");
           if (bizRes.data.length > 0) {
             socket.emit("join_business", bizRes.data[0]._id);
           }
        }

        if (res.data.length > 0) {
          fetchAIInsights(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAIInsights = async (currentQueues) => {
      setAiLoading(true);
      setAiError(null);
      try {
        // Get owner's business with business ID
        const bizRes = await API.get("/business");
        
        if (!bizRes.data || bizRes.data.length === 0) {
          setPrediction("Business not found. Please set up your business profile.");
          return;
        }
        
        const businessId = bizRes.data[0]._id;
        
        // Send only businessId to backend - backend will fetch all real data
        const res = await API.post("/ai/predict", {
          businessId: businessId
        });

        if (res.data.success) {
          setPrediction(res.data.prediction);
        } else {
          setPrediction("AI temporarily unavailable.");
        }
      } catch (error) {
        console.error("AI Insights Error:", error);
        // Fallback message
        setPrediction(
          "Queue data is currently limited. Try visiting during non-peak hours."
        );
      } finally {
        setAiLoading(false);
      }
    };

    fetchLiveQueues();

    // Socket Listeners
    socket.on("queueBooked", (newEntry) => {
      setQueues((prev) => {
        // Avoid duplicates if already added by other means
        if (prev.find(q => q._id === newEntry._id)) return prev;
        return [...prev, newEntry];
      });
      toast.success(`New Token: #${newEntry.tokenNumber}`, {
        style: { background: "#0B1120", color: "#fff", border: "1px solid #1A2234" }
      });
    });

    socket.on("queueUpdated", (updatedEntry) => {
      setQueues((prev) => prev.map(q => q._id === updatedEntry._id ? { ...q, ...updatedEntry } : q));
      
      if (updatedEntry.status === 'called') {
        toast(`Token #${updatedEntry.tokenNumber} is called!`, { icon: '🔔' });
      }
    });

    return () => {
      socket.off("queueBooked");
      socket.off("queueUpdated");
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const updateQueueStatus = async (queueId, status) => {
    try {
      await API.put(`/queue/${queueId}/status`, { status });
      // Refresh live queues after update
      const res = await API.get("/queue/business");
      setQueues(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to update queue");
    }
  };

  return (

    <div
      className="
        min-h-screen
        w-full
        flex
        overflow-x-hidden
      "
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
            onClick={() =>
              navigate(
                user?.role === "owner"
                  ? "/dashboard/owner"
                  : "/dashboard/customer"
              )
            }
            className="
              flex
              items-center
              gap-3
              mb-14
              cursor-pointer
            "
          >

            <div
              className="
                w-11
                h-11
                rounded-full
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                flex
                items-center
                justify-center
                text-white
                font-bold
                text-lg
              "
            >
              Q
            </div>

            <div>

              <h1
                className="
                  text-white
                  text-xl
                  font-bold
                "
              >
                QueueMind
              </h1>

              <p
                className="
                  text-blue-400
                  text-sm
                "
              >
                AI
              </p>

            </div>

          </div>

          {/* NAVIGATION */}

          <div className="flex flex-col gap-3 mt-10">

            <button
              onClick={() => navigate("/dashboard/owner")}
              className="
                w-full
                text-left
                px-6
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
                font-medium
                cursor-pointer
                flex
                items-center
                gap-3
                shadow-[0_0_20px_rgba(37,99,235,0.3)]
                hover:scale-105
                transition-all
                duration-300
              "
            >
              <FiLayout className="text-xl" />
              Dashboard
            </button>

            <button
              onClick={() => navigate("/owner/live-queue")}
              className="
                w-full
                text-left
                px-6
                py-4
                rounded-2xl
                text-gray-400
                hover:bg-white/5
                hover:text-white
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer
                flex
                items-center
                gap-3
              "
            >
              <FiActivity className="text-xl" />
              Live Queue
            </button>

            <button
              onClick={() => navigate("/owner/customers")}
              className="
                w-full
                text-left
                px-6
                py-4
                rounded-2xl
                text-gray-400
                hover:bg-white/5
                hover:text-white
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer
                flex
                items-center
                gap-3
              "
            >
              <FiUsers className="text-xl" />
              Customers
            </button>

            <button
              onClick={() => navigate("/owner/analytics")}
              className="
                w-full
                text-left
                px-6
                py-4
                rounded-2xl
                text-gray-400
                hover:bg-white/5
                hover:text-white
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer
                flex
                items-center
                gap-3
              "
            >
              <FiBarChart2 className="text-xl" />
              Analytics
            </button>

          </div>

        </div>

        {/* PROFILE */}

        <div>
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

      <div
        className="
          flex-1
          overflow-y-auto
          px-4
          sm:px-6
          md:px-10
          py-8
        "
      >

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-start sm:items-center gap-4 min-w-0">
              <button 
                className="md:hidden text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Owner Dashboard</h1>
                <p className="text-gray-400 text-lg">Manage queues and customers with AI.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
              <NotificationBell />
              <button
                onClick={() => navigate("/owner/add-queue")}
                className="
                  bg-gradient-to-r
                  from-blue-500
                  to-purple-500
                  px-6
                  py-4
                  rounded-2xl
                  text-white
                  font-semibold
                  cursor-pointer
                  w-full
                  sm:w-auto
                "
              >
                + Add Queue
              </button>
            </div>
          </div>

        {/* STATS */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
            mb-10
          "
        >

          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 flex items-center gap-4 w-full h-full">
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400 text-2xl">
              <FaCheck />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <h3 className="text-white text-xl sm:text-2xl font-bold break-words">24</h3>
            </div>
          </div>

          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 flex items-center gap-4 w-full h-full">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 text-2xl">
              <FaUsers />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Queue</p>
              <h3 className="text-white text-xl sm:text-2xl font-bold break-words">{queues.filter(q => q.status === 'waiting').length}</h3>
            </div>
          </div>

          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 flex items-center gap-4 w-full h-full">
            <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400 text-2xl">
              <FaClock />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Wait Time</p>
              <h3 className="text-white text-xl sm:text-2xl font-bold break-words">~5 min</h3>
            </div>
          </div>

          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 flex items-center gap-4 w-full h-full">
            <div className="p-3 bg-red-500/20 rounded-xl text-red-400 text-2xl">
              <FaTimes />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Cancelled</p>
              <h3 className="text-white text-xl sm:text-2xl font-bold break-words">3</h3>
            </div>
          </div>

        </div>

        {/* AI INSIGHTS */}
        <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 sm:p-8 mb-10 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-blue-400" />
            AI Predictions
          </h3>
          {aiLoading ? (
            <p className="text-gray-400">Loading predictions...</p>
          ) : prediction ? (
            <div className="space-y-3 text-gray-300">
              {typeof prediction === "string" ? (
                <p className="whitespace-pre-line text-green-400">{prediction}</p>
              ) : (
                <>
                  <p>✓ Peak crowd expected at {prediction?.peakHour || "6 PM"}</p>
                  <p>✓ Estimated wait increase: +{prediction?.waitIncrease || "12"} mins</p>
                  <p>✓ Best staff allocation: {prediction?.recommendedStaff || "3"} counters</p>
                </>
              )}
            </div>
          ) : (
            <p className="text-gray-400">No predictions available yet</p>
          )}
        </div>

        {/* LIVE QUEUE SUMMARY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-1 bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6">
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <FiActivity className="text-blue-400" />
              Current Queue
            </h3>
            <div className="space-y-3">
              {queues.filter(q => q.status === "waiting" || q.status === "called").slice(0, 5).map(q => (
                <div key={q._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-white font-mono font-bold">#{q.tokenNumber}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${q.status === 'called' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {q.status === 'called' ? 'In Progress' : 'Waiting'}
                  </span>
                </div>
              ))}
              {queues.filter(q => q.status === "waiting" || q.status === "called").length === 0 && (
                <p className="text-gray-500 text-sm italic">Queue is empty</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-center">
            <h3 className="text-white text-xl sm:text-2xl font-bold mb-2 break-words">Queue Mind Optimization</h3>
            <p className="text-gray-300">
              Your queue is currently operating at <span className="text-green-400 font-bold">85% efficiency</span>. 
              {queues.filter(q => q.status === 'waiting').length > 5 ? " Consider opening another counter to reduce wait times." : " Flow is optimal for current staffing."}
            </p>
          </div>
        </div>

        {/* LIVE QUEUE TABLE */}
        <div
          className="
            bg-[#0d1730]/80
            backdrop-blur-xl
            border
            border-[#1d2942]
            rounded-[32px]
            p-6
            sm:p-8
            mb-10
            shadow-2xl
          "
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
            <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
              <FiActivity size={24} />
            </div>
            <h3 className="text-white text-xl sm:text-2xl font-bold break-words">Queue Management</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-[#1d2942]">
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold">Token</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold">Customer</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold">Time</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queues.slice(0, 10).map(q => (
                  <tr key={q._id} className="border-b border-[#1d2942] hover:bg-white/5 transition">
                    <td className="px-4 py-4 text-white font-mono font-bold">#{q.tokenNumber}</td>
                    <td className="px-4 py-4 text-gray-300">{q.customerName || "Guest"}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        q.status === 'called' ? 'bg-blue-500/20 text-blue-400' :
                        q.status === 'waiting' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {q.status === 'called' ? 'In Progress' : q.status === 'waiting' ? 'Waiting' : 'Completed'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400">{q.createdAt ? new Date(q.createdAt).toLocaleTimeString() : '10:30 AM'}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateQueueStatus(q._id, 'called')}
                          className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm font-semibold border border-blue-500/20 hover:border-blue-500/50"
                        >
                          Call Next
                        </button>
                        <button
                          onClick={() => updateQueueStatus(q._id, 'cancelled')}
                          className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition text-sm font-semibold border border-yellow-500/20 hover:border-yellow-500/50"
                        >
                          Skip Customer
                        </button>
                        <button
                          onClick={() => updateQueueStatus(q._id, 'completed')}
                          className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition text-sm font-semibold border border-green-500/20 hover:border-green-500/50"
                        >
                          Complete Queue
                        </button>
                        <button
                          onClick={() => updateQueueStatus(q._id, 'cancelled')}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm font-semibold border border-red-500/20 hover:border-red-500/50"
                        >
                          Cancel Queue
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {queues.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400">No queues available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ANALYTICS */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
            mb-20
          "
        >

          {/* <div
            className="
              bg-[#0B1120]
              border
              border-[#1A2234]
              rounded-3xl
              p-8
              h-[300px]
            "
          >

            <h1
              className="
                text-white
                text-2xl
                font-bold
                mb-5
              "
            >
              Peak Hours
            </h1>

          </div> */}

          {/* <div
            className="
              bg-[#0B1120]
              border
              border-[#1A2234]
              rounded-3xl
              p-8
              h-[300px]
            "
          >

            <h1
              className="
                text-white
                text-2xl
                font-bold
                mb-5
              "
            >
              Daily Analytics
            </h1>

          </div> */}

        </div>

      </div>

    </div>
  );
}

export default OwnerDashboard;
