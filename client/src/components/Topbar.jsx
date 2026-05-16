function Topbar({ user }) {
  return (
    <div className="h-20 w-full flex items-center justify-between px-4 sm:px-6 md:px-10 border-b border-[#1A2234] bg-[#050816]">
      <div>
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* NOTIFICATIONS */}
        <button className="relative text-gray-400 hover:text-white transition">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#050816]"></span>
        </button>

        {/* PROFILE */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1F2937] flex flex-col items-center justify-center overflow-hidden border border-gray-700">
             <span className="text-gray-300 font-bold">{user?.name ? user?.name.charAt(0).toUpperCase() : 'U'}</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-white">{user?.name || "User"}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role || "Role"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
