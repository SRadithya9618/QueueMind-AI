import { useNavigate } from "react-router-dom";

function Placeholder({ title }) {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#050816] flex flex-col items-center justify-center text-white px-6">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center break-words">
        {title}
      </h1>
      <p className="text-gray-400 text-lg sm:text-xl mb-10 text-center max-w-[600px]">
        This page is currently under construction. Please check back later.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 rounded-2xl text-lg font-medium hover:scale-[1.02] transition"
      >
        Go Back
      </button>
    </div>
  );
}

export default Placeholder;
