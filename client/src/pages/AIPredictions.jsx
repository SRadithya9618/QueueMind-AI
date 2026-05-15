import React from "react";

const AIPredictions = () => {
  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold mb-4">
            AI Predictions
          </h1>

          <p className="text-gray-400 text-xl">
            Smart queue forecasting powered by Gemini AI.
          </p>

        </div>

        {/* AI CARDS */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          <div className="
            bg-gradient-to-r
            from-blue-500
            to-purple-500
            rounded-3xl
            p-8
          ">

            <p className="text-white/80 mb-4">
              Peak Rush Hour
            </p>

            <h1 className="text-5xl font-bold mb-3">
              5 PM
            </h1>

            <p className="text-white/90">
              Highest customer traffic predicted.
            </p>

          </div>

          <div className="
            bg-[#0B1120]
            border
            border-[#1A2234]
            rounded-3xl
            p-8
          ">

            <p className="text-gray-400 mb-4">
              Average Wait
            </p>

            <h1 className="text-5xl font-bold text-white mb-3">
              12m
            </h1>

            <p className="text-gray-400">
              AI estimated waiting time.
            </p>

          </div>

          <div className="
            bg-[#0B1120]
            border
            border-[#1A2234]
            rounded-3xl
            p-8
          ">

            <p className="text-gray-400 mb-4">
              Best Visiting Time
            </p>

            <h1 className="text-5xl font-bold text-green-400 mb-3">
              2 PM
            </h1>

            <p className="text-gray-400">
              Lowest queue traffic predicted.
            </p>

          </div>

        </div>

        {/* AI INSIGHT */}

        <div className="
          bg-gradient-to-r
          from-blue-500
          to-purple-500
          rounded-[32px]
          p-10
        ">

          <h1 className="text-4xl font-bold mb-6">
            Gemini AI Insights
          </h1>

          <p className="text-xl leading-relaxed text-white/90">
            Based on historical trends and current queue activity,
            AI predicts higher demand during evening hours.
            Customers are recommended to visit before 3 PM
            for reduced waiting times.
          </p>

        </div>

      </div>

    </div>
  );
};

export default AIPredictions;