import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import socket from "../socket";
import toast from "react-hot-toast";
import NotificationBell from "../components/NotificationBell";

function Customers() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [customers, setCustomers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await API.get("/queue/business");
        setCustomers(res.data);
        
        // Join business room for sockets if data exists
        if (res.data.length > 0 && res.data[0].business) {
          socket.emit("join_business", res.data[0].business);
        } else {
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

    fetchCustomers();

    // Socket Listeners
    socket.on("queueBooked", (newEntry) => {
      setCustomers((prev) => [...prev, newEntry]);
      toast.success(`New Customer: ${newEntry.customer?.name || 'Token #' + newEntry.tokenNumber}`);
    });

    socket.on("queueUpdated", (updatedEntry) => {
      setCustomers((prev) => prev.map(q => q._id === updatedEntry._id ? { ...q, ...updatedEntry } : q));
    });

    return () => {
      socket.off("queueBooked");
      socket.off("queueUpdated");
    };
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = 
      c.customer?.name?.toLowerCase()?.includes(search.toLowerCase()) || 
      c.tokenNumber?.toString()?.includes(search);
    
    const matchesFilter = 
      filter === "all" || 
      (filter === "waiting" && (c.status === "waiting" || c.status === "called")) ||
      c.status === filter;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: customers.length,
    waiting: customers.filter(c => c.status === "waiting" || c.status === "called").length,
    completed: customers.filter(c => c.status === "completed").length,
    cancelled: customers.filter(c => c.status === "cancelled").length
  };

  return (
    <div className="min-h-screen w-full bg-[#050816] flex overflow-x-hidden">
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

          <div className="flex flex-col gap-3 mt-10">
            <button onClick={() => navigate("/dashboard/owner")} className="w-full text-left px-6 py-4 rounded-2xl text-gray-300 hover:bg-[#111827] hover:text-white transition duration-300 cursor-pointer">
              Dashboard
            </button>
            <button onClick={() => navigate("/owner/live-queue")} className="w-full text-left px-6 py-4 rounded-2xl text-gray-300 hover:bg-[#111827] hover:text-white transition duration-300 cursor-pointer">
              Live Queue
            </button>
            <button onClick={() => navigate("/owner/customers")} className="w-full text-left px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium cursor-pointer">
              Customers
            </button>
            <button onClick={() => navigate("/owner/analytics")} className="w-full text-left px-6 py-4 rounded-2xl text-gray-300 hover:bg-[#111827] hover:text-white transition duration-300 cursor-pointer">
              Analytics
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
                {user?.name || "Owner"}
              </h2>
              <p
                className="
                  text-gray-400
                  text-sm
                "
              >
                {user?.role || "Owner"}
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
        {/* TOPBAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Customers Management</h1>
              <p className="text-gray-400 text-lg">Detailed view of all queue participants.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <button onClick={() => navigate("/owner/add-queue")} className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 rounded-2xl text-white font-semibold cursor-pointer">
              + Add Queue
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Customers', value: stats.total, color: 'blue' },
            { label: 'Waiting', value: stats.waiting, color: 'yellow' },
            { label: 'Completed', value: stats.completed, color: 'green' },
            { label: 'Cancelled', value: stats.cancelled, color: 'red' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0B1120] border border-[#1A2234] rounded-3xl p-7 transition-all duration-300 hover:border-blue-500/50 group">
              <p className="text-gray-400 mb-3">{stat.label}</p>
              <h1 className="text-white text-5xl font-bold group-hover:scale-105 transition-transform duration-300">{stat.value}</h1>
            </div>
          ))}
        </div>

        {/* FILTERS & SEARCH */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
          <div className="flex bg-[#0B1120] p-1.5 rounded-2xl border border-[#1A2234] overflow-x-auto whitespace-nowrap">
            {['all', 'waiting', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${filter === tab ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:w-96">
            <input
              type="text"
              placeholder="Search by name or token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#111827] border border-[#1A2234] rounded-2xl px-6 py-4 w-full text-white outline-none focus:border-blue-500/50 transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 absolute right-6 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* CUSTOMER TABLE */}
        <div className="bg-[#0B1120] border border-[#1A2234] rounded-[32px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-white/5 border-b border-[#1A2234]">
                <tr>
                  <th className="px-8 py-6 text-gray-400 font-semibold uppercase tracking-wider text-sm">Customer</th>
                  <th className="px-8 py-6 text-gray-400 font-semibold uppercase tracking-wider text-sm">Token</th>
                  <th className="px-8 py-6 text-gray-400 font-semibold uppercase tracking-wider text-sm">Status</th>
                  <th className="px-8 py-6 text-gray-400 font-semibold uppercase tracking-wider text-sm">Position</th>
                  <th className="px-8 py-6 text-gray-400 font-semibold uppercase tracking-wider text-sm">Wait Time</th>
                  <th className="px-8 py-6 text-gray-400 font-semibold uppercase tracking-wider text-sm">Booked At</th>
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
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-xl font-medium">No customers found in queue</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c._id} className="hover:bg-white/5 transition duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {(c.customer?.name || "C").charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-bold">{c.customer?.name || "Guest Customer"}</p>
                            <p className="text-gray-500 text-xs">{c.customer?.email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-gray-300 font-mono text-lg">#{c.tokenNumber}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                          c.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                          c.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                          c.status === 'called' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                          'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-gray-300">
                        {c.status === 'waiting' || c.status === 'called' ? `Pos: ${c.position}` : '-'}
                      </td>
                      <td className="px-8 py-6 text-gray-300">
                        {c.status === 'waiting' || c.status === 'called' ? `${c.estimatedWait} mins` : '-'}
                      </td>
                      <td className="px-8 py-6 text-gray-500 text-sm">
                        {new Date(c.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
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

export default Customers;
