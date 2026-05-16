import {
  FiActivity,
  FiBarChart2,
  FiClock,
  FiCpu,
  FiMapPin,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const predictionCards = [
  {
    label: "Peak Rush Hour",
    value: "5 PM",
    detail: "Highest customer traffic predicted.",
    icon: <FiTrendingUp />,
    tone: "from-blue-500 to-purple-500 text-white",
    valueClass: "text-white",
  },
  {
    label: "Average Wait",
    value: "12m",
    detail: "AI estimated waiting time.",
    icon: <FiClock />,
    tone: "from-[#0B1120] to-[#111827] text-gray-400 border border-[#1A2234]",
    valueClass: "text-white",
  },
  {
    label: "Best Visiting Time",
    value: "2 PM",
    detail: "Lowest queue traffic predicted.",
    icon: <FiMapPin />,
    tone: "from-[#0B1120] to-[#111827] text-gray-400 border border-[#1A2234]",
    valueClass: "text-green-400",
  },
];

const demandTimeline = [
  { time: "10 AM", level: "Low", height: "h-16", color: "from-green-500 to-blue-500" },
  { time: "12 PM", level: "Moderate", height: "h-24", color: "from-blue-500 to-purple-500" },
  { time: "2 PM", level: "Best", height: "h-12", color: "from-green-400 to-emerald-500" },
  { time: "4 PM", level: "Rising", height: "h-28", color: "from-purple-500 to-pink-500" },
  { time: "5 PM", level: "Peak", height: "h-40", color: "from-pink-500 to-blue-500" },
  { time: "7 PM", level: "High", height: "h-32", color: "from-purple-500 to-blue-500" },
];

const recommendations = [
  "Visit before 3 PM for shorter waiting time.",
  "Avoid the 5 PM to 7 PM peak window.",
  "Book token early if visiting during evening hours.",
];

const AIPredictions = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        min-h-screen
        bg-[#020817]
        text-white
        px-4
        sm:px-6
        lg:px-10
        py-8
        lg:py-10
        overflow-x-hidden
      "
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="min-w-0">
            <p className="text-blue-400 font-semibold tracking-[4px] text-sm mb-4">
              QUEUEMIND AI
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 break-words">
              AI Predictions
            </h1>

            <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed">
              Smart queue forecasting powered by Gemini AI, built to help you
              pick the right visiting window and avoid high-rush periods.
            </p>
          </div>

          <div
            className="
              bg-gradient-to-r
              from-blue-500/10
              to-purple-500/10
              border
              border-blue-500/20
              rounded-3xl
              p-5
              min-w-full
              sm:min-w-[260px]
              lg:min-w-[300px]
            "
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <FiCpu />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Prediction Confidence</p>
                <h2 className="text-2xl font-bold">94%</h2>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {predictionCards.map((card) => (
            <div
              key={card.label}
              className={`
                bg-gradient-to-br
                ${card.tone}
                rounded-3xl
                p-6
                sm:p-8
                h-full
                min-h-[210px]
                transition-all
                duration-300
                hover:scale-[1.02]
              `}
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <p className="text-sm uppercase tracking-wider font-semibold opacity-80">
                  {card.label}
                </p>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl shrink-0">
                  {card.icon}
                </div>
              </div>

              <h2
                className={`
                  text-4xl
                  sm:text-5xl
                  font-bold
                  mb-4
                  break-words
                  ${card.valueClass}
                `}
              >
                {card.value}
              </h2>

              <p className="leading-relaxed opacity-90 break-words">
                {card.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
          <div className="xl:col-span-2 bg-[#0B1120] border border-[#1A2234] rounded-[32px] p-6 sm:p-8 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Daily Demand Forecast
                </h2>
                <p className="text-gray-400">
                  Predicted crowd movement across today&apos;s queue windows.
                </p>
              </div>

              <div className="flex items-center gap-2 text-blue-400 bg-blue-500/10 px-4 py-2 rounded-full text-sm font-semibold w-fit">
                <FiActivity />
                Live model
              </div>
            </div>

            <div className="flex items-end gap-4 sm:gap-6 min-h-[230px] overflow-x-auto pb-2">
              {demandTimeline.map((item) => (
                <div
                  key={item.time}
                  className="min-w-[70px] flex-1 flex flex-col items-center justify-end gap-3"
                >
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">{item.level}</p>
                    <p className="text-sm font-semibold text-gray-300">
                      {item.time}
                    </p>
                  </div>
                  <div
                    className={`
                      w-full
                      max-w-[56px]
                      ${item.height}
                      rounded-t-3xl
                      bg-gradient-to-t
                      ${item.color}
                      shadow-[0_0_24px_rgba(59,130,246,0.18)]
                    `}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-[32px] p-6 sm:p-8 backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-2xl mb-6 shadow-[0_0_30px_rgba(59,130,246,0.35)]">
              <FiZap />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Gemini AI Insights
            </h2>

            <p className="text-gray-300 leading-relaxed mb-8">
              Based on historical trends and current queue activity, AI predicts
              higher demand during evening hours.
            </p>

            <div className="space-y-4">
              {recommendations.map((item) => (
                <div
                  key={item}
                  className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-3"
                >
                  <FiBarChart2 className="text-blue-400 mt-1 shrink-0" />
                  <p className="text-gray-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#0B1120] border border-[#1A2234] rounded-[32px] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Recommended Action
              </h2>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-4xl">
                Book your token during the low-rush window and keep notifications
                enabled so QueueMind AI can alert you when queue movement changes.
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard/customer")}
              className="
                w-full
                lg:w-auto
                px-8
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-blue-500
                to-purple-500
                text-white
                font-semibold
                hover:scale-[1.02]
                transition
                cursor-pointer
                whitespace-nowrap
              "
            >
              View Nearby Queues
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictions;
