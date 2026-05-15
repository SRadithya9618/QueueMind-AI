function QueueHistory({ queues }) {
  return (
    <div className="bg-[#0B1120] border border-[#1A2234] rounded-3xl p-6 shadow-xl w-full">
      <h3 className="text-xl font-bold text-white mb-6">Recent Bookings</h3>
      
      <div className="flex flex-col gap-4">
        {queues.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No queue history found.</p>
        ) : (
          queues.map((queue) => (
            <div key={queue._id} className="flex items-center justify-between p-4 bg-[#111827] rounded-2xl border border-[#1F2937]">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-400">
                  #{queue.tokenNumber}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{queue.business.businessName}</h4>
                  <p className="text-sm text-gray-500">{new Date(queue.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                {queue.status === "waiting" && (
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-semibold">
                    Waiting
                  </span>
                )}
                {queue.status === "completed" && (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-semibold">
                    Completed
                  </span>
                )}
                {queue.status === "cancelled" && (
                  <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-semibold">
                    Cancelled
                  </span>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default QueueHistory;
