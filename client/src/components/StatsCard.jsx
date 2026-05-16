function StatsCard({ title, value, subtitle, icon, trendDirection, trendValue }) {
  return (
    <div className="bg-[#0B1120] border border-[#1A2234] rounded-3xl p-6 w-full h-full shadow-xl relative overflow-hidden group">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition duration-500"></div>

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 font-medium text-sm tracking-wide">{title}</h3>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 border border-white/5">
          {icon}
        </div>
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 break-words">{value}</h2>
      
      <div className="flex items-center gap-2">
        {trendDirection === "up" && (
          <span className="text-emerald-400 text-sm font-medium flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
            {trendValue}
          </span>
        )}
        {trendDirection === "down" && (
          <span className="text-red-400 text-sm font-medium flex items-center gap-1 bg-red-400/10 px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
            </svg>
            {trendValue}
          </span>
        )}
        <span className="text-gray-500 text-sm">{subtitle}</span>
      </div>
    </div>
  );
}

export default StatsCard;
