import React, { useEffect, useState } from "react";
import API from "../api/axios";

const QueueHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/queue/user");
        setHistory(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white px-6 md:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => window.history.back()}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-4xl md:text-5xl font-bold">Queue History</h1>
        </div>

        <div className="bg-[#0B1120] border border-[#1A2234] rounded-[32px] p-8 md:p-12 backdrop-blur-xl">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-xl">No queue history found yet.</p>
              <p className="text-gray-600 mt-2">Book a token to start your journey!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {history.map((q) => (
                <div 
                  key={q._id} 
                  className="bg-white/5 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition hover:bg-white/10"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                      <span className="text-blue-400 font-bold text-2xl">#{q.tokenNumber}</span>
                    </div>
                    <div>
                      <h2 className="text-white text-2xl font-bold mb-1">
                        {q.business?.name || "Business Name"}
                      </h2>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(q.createdAt).toLocaleDateString("en-US", { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest ${
                      q.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      q.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {q.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueHistory;
