// import { useState } from "react";
import API from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function AddQueue() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [avgServiceTime, setAvgServiceTime] = useState("");
  const [maxQueueSize, setMaxQueueSize] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      await API.post(
        "/business",
        {
          name,
          type,
          address,
          avgServiceTime,
          maxQueueSize,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Queue Created Successfully");
      navigate("/dashboard/owner");

    } catch (error) {

      console.log(error);

      alert("Failed to create queue");

    }
  };

  return (

    <div
      className="
        min-h-screen
        bg-[#050816]
        flex
        items-center
        justify-center
        px-6
        py-10
        overflow-x-hidden
      "
    >

      <div
        className="
          w-full
          max-w-[600px]
          bg-[#0B1120]
          border
          border-[#1A2234]
          rounded-[30px]
          p-6
          sm:p-10
        "
      >

        <h1
          className="
            text-3xl
            sm:text-4xl
            font-bold
            text-white
            mb-8
          "
        >
          Add Queue
        </h1>

        <form
          onSubmit={handleSubmit}
          className="
            flex
            flex-col
            gap-5
          "
        >

          <input
            type="text"
            placeholder="Business Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              bg-[#111827]
              border
              border-gray-700
              rounded-xl
              px-5
              py-4
              text-white
              outline-none
            "
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="
              bg-[#111827]
              border
              border-gray-700
              rounded-xl
              px-5
              py-4
              text-white
              outline-none
              appearance-none
            "
          >
            <option value="" disabled>Select Business Type</option>
            <option value="hospital">Hospital</option>
            <option value="salon">Salon</option>
            <option value="restaurant">Restaurant</option>
            <option value="others">Others</option>
          </select>

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="
              bg-[#111827]
              border
              border-gray-700
              rounded-xl
              px-5
              py-4
              text-white
              outline-none
            "
          />

          <input
            type="number"
            placeholder="Average Service Time"
            value={avgServiceTime}
            onChange={(e) => setAvgServiceTime(e.target.value)}
            className="
              bg-[#111827]
              border
              border-gray-700
              rounded-xl
              px-5
              py-4
              text-white
              outline-none
            "
          />

          <input
            type="number"
            placeholder="Max Queue Size"
            value={maxQueueSize}
            onChange={(e) => setMaxQueueSize(e.target.value)}
            className="
              bg-[#111827]
              border
              border-gray-700
              rounded-xl
              px-5
              py-4
              text-white
              outline-none
            "
          />

          <button
            type="submit"
            className="
              mt-4
              bg-gradient-to-r
              from-blue-500
              to-purple-500
              py-4
              rounded-xl
              text-white
              font-semibold
              hover:scale-[1.02]
              transition
              duration-300
            "
          >
            Create Queue
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddQueue;
