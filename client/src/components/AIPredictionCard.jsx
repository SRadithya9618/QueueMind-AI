import React from "react";

const AIPredictionCard = ({ prediction, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 mb-10 animate-pulse">
        <h1 className="text-white text-4xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Analyzing queue patterns...</h1>
        <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-white/10 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <FiActivity size={24} />
          </div>
          <h1 className="text-white text-3xl font-bold">AI Queue Intelligence</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <p className="text-blue-400 text-sm uppercase font-bold mb-2">Peak Crowd</p>
            <p className="text-white text-2xl font-bold">Expected at 6:00 PM</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <p className="text-purple-400 text-sm uppercase font-bold mb-2">Wait Increase</p>
            <p className="text-white text-2xl font-bold">+12 mins predicted</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <p className="text-green-400 text-sm uppercase font-bold mb-2">Staffing Rec.</p>
            <p className="text-white text-2xl font-bold">3 Counters Active</p>
          </div>
        </div>
        <p className="text-gray-400 mt-6 italic">"AI predicts a surge in traffic soon. Ensure all counters are ready for optimal flow."</p>
      </div>
    );
  }

  if (!prediction) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 mb-10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-white text-3xl font-bold">AI Queue Insights</h1>
      </div>

      {typeof prediction === "string" ? (
        <div className="text-white text-lg leading-relaxed whitespace-pre-line">
          {prediction}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-blue-400 font-medium mb-2 uppercase tracking-wider text-sm">Estimated Wait</p>
              <p className="text-white text-4xl font-bold">{prediction?.estimatedWaitTime} mins</p>
            </div>
            <div>
              <p className="text-purple-400 font-medium mb-2 uppercase tracking-wider text-sm">Rush Prediction</p>
              <p className="text-white text-4xl font-bold">{prediction?.rushPrediction}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/90 text-xl leading-relaxed italic">
              "{prediction?.efficiencyInsight}"
            </p>
            <p className="text-gray-400 mt-4 text-lg">
              Best time to visit: <span className="text-white font-semibold">{prediction?.bestVisitingHour}</span>
            </p>
          </div>

          {prediction?.staffingRecommendation && (
            <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
              <p className="text-blue-300">
                <span className="font-bold">Staffing Tip:</span> {prediction?.staffingRecommendation}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIPredictionCard;
