import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import socket from "../socket";
import toast from "react-hot-toast";

function MyQueues() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [queues, setQueues] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchMyQueues = async () => {
      try {
        const response = await API.get("/queue/user");
        setQueues(response.data);
        
        // Join rooms for each business in the queue
        response.data.forEach(q => {
          if (q.business?._id) {
            socket.emit("join_business", q.business._id);
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyQueues();

    socket.on("queueUpdated", (updatedEntry) => {
      setQueues((prev) => prev.map(q => q._id === updatedEntry._id ? { ...q, ...updatedEntry } : q));
      
      if (updatedEntry.status === 'called') {
        toast.success("Your turn is near! You've been called.", {
          duration: 6000,
          icon: '🔔',
          style: { background: "#0B1120", color: "#fff", border: "1px solid #1A2234" }
        });
      } else if (updatedEntry.status === 'completed') {
        toast.success("Visit completed. Thank you!");
      }
    });

    return () => {
      socket.off("queueUpdated");
    };
  }, []);

  const activeQueues = queues.filter(q => q.status === 'waiting' || q.status === 'called');
  const historyQueues = queues.filter(q => q.status === 'completed' || q.status === 'cancelled');

  return (
    <div className="h-screen bg-[#050816] flex overflow-hidden">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`absolute md:relative z-50 w-[280px] h-full bg-[#0B1120] border-r border-[#1A2234] flex flex-col justify-between px-6 py-8 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div>
          <div 
            onClick={() =>
              navigate(
                user?.role === "owner"
                  ? "/dashboard/owner"
                  : "/dashboard/customer"
              )
            }
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
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate("/dashboard/customer")} className="text-gray-400 hover:bg-[#111827] hover:text-white rounded-2xl px-5 py-4 text-left transition cursor-pointer">
              Dashboard
            </button>
            <button onClick={() => navigate("/my-queues")} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl px-5 py-4 text-left font-medium cursor-pointer">
              My Queues
            </button>
            <button onClick={() => navigate("/nearby-businesses")} className="text-gray-400 hover:bg-[#111827] hover:text-white rounded-2xl px-5 py-4 text-left transition cursor-pointer">
              Nearby Businesses
            </button>
            <button onClick={() => navigate("/ai-predictions")} className="text-gray-400 hover:bg-[#111827] hover:text-white rounded-2xl px-5 py-4 text-left transition cursor-pointer">
              AI Predictions
            </button>
            <button onClick={() => navigate("/notifications")} className="text-gray-400 hover:bg-[#111827] hover:text-white rounded-2xl px-5 py-4 text-left transition cursor-pointer">
              Notifications
            </button>
          </div>
        </div>

        {/* PROFILE */}
        <div className="mt-auto">
          <div
            className="
              bg-[#111827]
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
              "
            ></div>
            <div>
              <h2
                className="
                  text-white
                  font-semibold
                "
              >
                {user?.name || "Customer"}
              </h2>
              <p
                className="
                  text-gray-400
                  text-sm
                "
              >
                {user?.role || "Customer"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-300 mt-4 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">My Queues</h1>
              <p className="text-gray-400 text-lg">Manage your active tokens and history.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white/5 animate-pulse rounded-[32px]"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* ACTIVE QUEUES SECTION */}
            <section>
              <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                Active Tokens
                <span className="bg-blue-500/20 text-blue-400 text-sm px-3 py-1 rounded-full">{activeQueues.length}</span>
              </h2>

              {activeQueues.length === 0 ? (
                <div className="bg-[#0B1120] border border-dashed border-[#1A2234] rounded-[32px] p-20 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-2">No Active Queues</h3>
                  <p className="text-gray-400">Book a token from the dashboard to see it here.</p>
                  <button onClick={() => navigate("/dashboard/customer")} className="mt-8 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl transition">
                    Book Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {activeQueues.map((q) => {
                    const position = q.position || 0;
                    const totalWaiting = 15; // Mock total or dynamic if available
                    const progress = Math.max(0, 100 - (position * 5)); // Just a mock progress logic

                    return (
                      <div key={q._id} className="bg-gradient-to-br from-[#0B1120] to-[#111827] border border-[#1A2234] rounded-[32px] p-8 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500">
                        {/* Status Glow */}
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 ${q.status === 'called' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>

                        <div className="flex flex-col lg:flex-row justify-between gap-10">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${q.status === 'called' ? 'bg-blue-500 text-white' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                {q.status}
                              </span>
                              <span className="text-gray-500 text-sm">Booked {new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            
                            <h2 className="text-white text-3xl font-bold mb-1">{q.business?.name}</h2>
                            <p className="text-gray-400 text-lg mb-8">{q.business?.address || "Premium Service Center"}</p>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-white/5 rounded-2xl p-4">
                                <p className="text-gray-500 text-xs uppercase mb-1">Token</p>
                                <p className="text-white text-2xl font-bold">#{q.tokenNumber}</p>
                              </div>
                              <div className="bg-white/5 rounded-2xl p-4">
                                <p className="text-gray-500 text-xs uppercase mb-1">Position</p>
                                <p className="text-blue-400 text-2xl font-bold">{q.position}</p>
                              </div>
                              <div className="bg-white/5 rounded-2xl p-4">
                                <p className="text-gray-500 text-xs uppercase mb-1">Wait Time</p>
                                <p className="text-purple-400 text-2xl font-bold">{q.estimatedWait}m</p>
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-1/3 flex flex-col justify-center">
                            <div className="mb-4 flex justify-between items-end">
                              <p className="text-white font-medium">Queue Progress</p>
                              <p className="text-blue-400 text-sm font-bold">{progress}% Complete</p>
                            </div>
                            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <p className="text-gray-500 text-sm mt-4 text-center">
                              {q.status === 'called' ? "Please proceed to the counter immediately." : `${q.position - 1} customers ahead of you.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* AI INSIGHTS BAR */}
            {activeQueues.length > 0 && (
              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-[32px] p-8 flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold">AI Queue Prediction</h3>
                  <p className="text-gray-400">Based on current movement, your turn is expected in <span className="text-white font-bold">{activeQueues[0].estimatedWait} minutes</span>. Rush levels are <span className="text-green-400 font-bold">Moderate</span>.</p>
                </div>
              </div>
            )}

            {/* HISTORY SECTION */}
            <section>
              <h2 className="text-white text-2xl font-bold mb-6">Queue History</h2>
              <div className="bg-[#0B1120] border border-[#1A2234] rounded-[32px] overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#1A2234] bg-white/5">
                      <th className="px-8 py-5 text-gray-400 font-medium">Business</th>
                      <th className="px-8 py-5 text-gray-400 font-medium">Date</th>
                      <th className="px-8 py-5 text-gray-400 font-medium">Token</th>
                      <th className="px-8 py-5 text-gray-400 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A2234]">
                    {historyQueues.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-8 py-10 text-center text-gray-500">No previous tokens found.</td>
                      </tr>
                    ) : (
                      historyQueues.map((q) => (
                        <tr key={q._id} className="hover:bg-white/5 transition">
                          <td className="px-8 py-6">
                            <p className="text-white font-bold">{q.business?.name}</p>
                            <p className="text-gray-500 text-sm">{q.business?.type}</p>
                          </td>
                          <td className="px-8 py-6 text-gray-300">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-6 text-gray-300 font-mono">#{q.tokenNumber}</td>
                          <td className="px-8 py-6 text-right">
                            <span className={`px-4 py-1 rounded-full text-xs font-bold ${q.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              {q.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyQueues;
