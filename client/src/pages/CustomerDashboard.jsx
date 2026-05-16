import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import AIPredictionCard from "../components/AIPredictionCard";
import NotificationBell from "../components/NotificationBell";
import socket from "../socket";
import toast from "react-hot-toast";
import {
  FiLayout,
  FiClock,
  FiLogOut,
  FiUser,
  FiActivity,
  FiMapPin,
  FiTrendingUp,
  FiCpu,
} from "react-icons/fi";

import { MdHistory } from "react-icons/md";
function CustomerDashboard() {
  const user = (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored && stored !== "undefined" ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  })();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await API.get("/business");
        if (Array.isArray(response.data)) {
          setBusinesses(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchHistory = async () => {
      try {
        const response = await API.get("/queue/user");
        if (Array.isArray(response.data)) {
          setHistory(response.data);
          
          // Join rooms
          response.data.forEach(q => {
            if (q.business?._id) {
              socket.emit("join_business", q.business._id);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchBusinesses();
    fetchHistory();

    socket.on("queueUpdated", (updatedEntry) => {
      if (updatedEntry) {
        setHistory((prev) => Array.isArray(prev) ? prev.map(q => q._id === updatedEntry._id ? { ...q, ...updatedEntry } : q) : []);
      }
    });

    return () => {
      socket.off("queueUpdated");
    };
  }, []);

  const fetchAIInsights = async (business) => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await API.post("/ai/predict", {
        businessId: business._id,
      });

      let responseText = res.data.prediction;
      if (responseText.length > 250) {
        responseText = responseText.slice(0, 250) + "...";
      }
      setPrediction(responseText);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setPrediction(
        "Rush expected between 5PM - 8PM. Best visiting time: Morning hours."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleBookToken = async (businessId) => {
    try {
      await API.post("/queue/book", { businessId });
      toast.success("Token booked successfully!", {
        style: { background: "#0B1120", color: "#fff", border: "1px solid #1A2234" }
      });
      // Join room
      socket.emit("join_business", businessId);
      // Refresh history
      const response = await API.get("/queue/user");
      if (Array.isArray(response.data)) {
        setHistory(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to book token");
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
          fixed
          md:relative
          inset-y-0
          left-0
          z-50
          w-[280px]
          h-screen
          md:h-full
          bg-[#0B1120]
          border-r
          border-[#1A2234]
          flex
          flex-col
          justify-start
          md:justify-between
          gap-8
          md:gap-0
          px-6
          py-8
          overflow-y-auto
          md:overflow-y-visible
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
              mb-8
              md:mb-14
              cursor-pointer
              group
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
                group-hover:rotate-[360deg]
                transition-transform
                duration-700
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

          <div
            className="
              flex
              flex-col
              gap-2
              md:gap-3
            "
          >

            <button
              onClick={() => navigate("/dashboard/customer")}
              className="
                bg-gradient-to-r
                from-blue-500
                to-purple-500
                text-white
                rounded-2xl
                px-5
                py-4
                text-left
                font-medium
                cursor-pointer
                flex
                items-center
                gap-3
                hover:scale-105
                transition-all
                duration-300
              "
            >
              <FiLayout />
              Dashboard
            </button>

            <button
              onClick={() => navigate("/my-queues")}
              className="
                text-gray-400
                hover:bg-[#111827]
                hover:text-white
                rounded-2xl
                px-5
                py-4
                text-left
                transition
                cursor-pointer
                flex
                items-center
                gap-3
                hover:scale-105
              "
            >
              <FiActivity />
              My Queues
            </button>

            <button
              onClick={() => navigate("/ai-predictions")}
              className="
                text-gray-400
                hover:bg-[#111827]
                hover:text-white
                rounded-2xl
                px-5
                py-4
                text-left
                transition
                cursor-pointer
                flex
                items-center
                gap-3
                hover:scale-105
              "
            >
              <FiCpu />
              AI Predictions
            </button>

            <button
              onClick={() => navigate("/customer/queue-history")}
              className="
                text-gray-400
                hover:bg-[#111827]
                hover:text-white
                rounded-2xl
                px-5
                py-4
                text-left
                transition
                cursor-pointer
                flex
                items-center
                gap-3
                hover:scale-105
              "
            >
              <MdHistory />
              Queue History
            </button>

          </div>

        </div>

        {/* PROFILE */}

        <div className="mt-2 md:mt-0 shrink-0">
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
              min-w-0
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
                shrink-0
              "
            >
              <FiUser />
            </div>

            <div className="min-w-0">

              <h2
                className="
                  text-white
                  font-semibold
                  truncate
                "
              >
                {user?.name || "Customer"}
              </h2>

              <p
                className="
                  text-gray-400
                  text-sm
                  truncate
                "
              >
                {user?.role || "Queue Participant"}
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

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 overflow-y-auto px-4 sm:px-6 md:px-10 py-8 custom-scrollbar">
        {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            {/* LEFT */}
            <div className="flex items-start sm:items-center gap-4 min-w-0">
              <button
                className="md:hidden text-white cursor-pointer"
                onClick={() => setIsSidebarOpen(true)}
              >
                ☰
              </button>
              <div>
                <h1 className="text-white text-3xl sm:text-4xl font-bold mb-2 break-words">
                  Customer Dashboard
                </h1>
                <p className="text-gray-400 text-base sm:text-lg">
                  Manage your queues smarter with AI.
                </p>
              </div>
            </div>
            {/* RIGHT */}
            <div className="flex items-center gap-4 w-full lg:w-auto min-w-0">
              <div className="relative w-full lg:w-[350px]">
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    bg-[#111827]
                    border
                    border-[#1A2234]
                    rounded-2xl
                    px-6
                    py-4
                    w-full
                    text-white
                    outline-none
                    focus:border-blue-500/50
                    transition-all
                  "
                />
              </div>
              <NotificationBell />
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* CARD */}
            <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 sm:p-7 w-full h-full transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] group">
              <div className="flex justify-between items-start mb-4">
                <p className="text-gray-400 group-hover:text-blue-400 transition-colors">
                  Active Queues
                </p>
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <FiActivity size={20} />
                </div>
              </div>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold break-words">
                {
                  history.filter(
                    q => q.status === "waiting" || q.status === "called"
                  ).length
                }
              </h1>
            </div>
            <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 sm:p-7 w-full h-full transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] group">
              <div className="flex justify-between items-start mb-4">
                <p className="text-gray-400 group-hover:text-purple-400 transition-colors">
                  Average Wait
                </p>
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <FiClock size={20} />
                </div>
              </div>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold break-words">
                {
                  history.length > 0
                    ? "15m"
                    : "0m"
                }
              </h1>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-6 sm:p-7 w-full h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(59,130,246,0.3)] group">
              <div className="flex justify-between items-start mb-4">
                <p className="text-white/80">
                  AI Efficiency
                </p>
                <div className="p-2 bg-white/20 rounded-lg text-white">
                  <FiTrendingUp size={20} />
                </div>
              </div>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold break-words">
                94%
              </h1>
            </div>
          </div>

          {/* AI CARD */}
          <AIPredictionCard
            prediction={prediction}
            loading={aiLoading}
            error={aiError}
          />

          {!prediction && !aiLoading && (
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-10 mb-10">
              <h1 className="text-white text-3xl sm:text-4xl font-bold mb-5 break-words">AI Queue Insights</h1>
              <p className="text-white/80 text-lg sm:text-xl leading-relaxed break-words">
                Select a business below to get real-time AI-powered queue predictions and visiting recommendations.
              </p>
            </div>
          )}

          {/* NEARBY */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <h1 className="text-white text-3xl font-bold">Nearby Businesses</h1>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar">
              {['All', 'Hospital', 'Salon', 'Restaurant'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-300 ${
                    categoryFilter === cat 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                    : 'bg-[#111827] text-gray-400 border border-[#1A2234] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* BUSINESS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {businesses
              .filter((b) => b?.name?.toLowerCase()?.includes(search.toLowerCase()))
              .filter((b) => categoryFilter === 'All' || b?.type?.toLowerCase() === categoryFilter.toLowerCase())
              .map((business) => (
                <div key={business._id} className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6 sm:p-7 transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div className="min-w-0">
                      <h2 className="text-white text-xl sm:text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors break-words">{business.name}</h2>
                      <p className="text-gray-400 flex items-center gap-2 capitalize">
                        <FiMapPin className="text-blue-500" />
                        {business.type}
                      </p>
                    </div>
                    <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-500/20">Open</div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed line-clamp-2">{business.description || `${business.name} is a top-rated ${business.type || 'business'} in your area.`}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => handleBookToken(business._id)} className="w-full sm:flex-1 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-[0_10px_20px_rgba(59,130,246,0.2)] transition-all cursor-pointer hover:scale-[1.02]">
                      Book Token
                    </button>
                    <button onClick={() => fetchAIInsights(business)} className="w-full sm:w-auto px-6 py-4 rounded-2xl text-white font-semibold bg-[#111827]/50 border border-white/10 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-2">
                      <FiCpu />
                      AI Insight
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
}

export default CustomerDashboard;
