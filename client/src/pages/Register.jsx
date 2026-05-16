import { useState } from "react";
import {
  Link,
} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user?.role === "owner") {
        navigate("/dashboard/owner");
      } else {
        navigate("/dashboard/customer");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (

    <div
      className="
        min-h-screen
        flex
        flex-col
        lg:flex-row
        overflow-x-hidden
        bg-black
      "
    >

      {/* LEFT SIDE */}

      <div
        className="
          w-full
          lg:w-1/2
          bg-[#050816]
          flex
          flex-col
          justify-start
          pt-12
          px-6
          sm:px-10
          lg:px-24
          pb-10
          lg:pb-0
        "
      >

        {/* LOGO */}

        <div className="w-full max-w-[450px] mb-10">

          <Link
            to="/"
            className="
              flex
              items-center
              gap-3
              text-white
              no-underline
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-full
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                flex
                items-center
                justify-center
                font-bold
                text-white
              "
            >
              Q
            </div>

            <div>

              <h1
                className="
                  text-xl
                  font-bold
                  leading-tight
                "
              >
                QueueMind
              </h1>

              <p
                className="
                  text-sm
                  text-blue-400
                  leading-tight
                "
              >
                AI
              </p>

            </div>

          </Link>

        </div>

        {/* CARD */}

        <div
          className="
            w-full
            max-w-[450px]
            bg-[#0B1120]
            border
            border-[#1A2234]
            rounded-[30px]
            px-6
            sm:px-8
            py-3
            shadow-2xl
          "
        >

          {/* TITLE */}

          <h5
            className="
              text-2xl
              sm:text-[30px]
              leading-tight
              font-bold
              text-white
              mb-2
            "
          >
            Create your account
          </h5>

          {/* SUBTITLE */}

          <p
            className="
              text-gray-400
              mb-8
              text-sm
            "
          >
            Join QueueMind AI in less than 30 seconds.
          </p>

          {/* FORM */}

          <form
            onSubmit={handleRegister}
            className="
              flex
              flex-col
              gap-5
            "
          >

            {/* FULL NAME */}

            <div>

              <label
                className="
                  text-xs
                  text-gray-400
                  block
                  mb-2
                  tracking-wider
                "
              >
                FULL NAME
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0"
                    />

                  </svg>

                </span>

                <input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="
                    w-full
                    bg-[#111827]
                    border
                    border-gray-700
                    rounded-xl
                    pl-12
                    pr-4
                    py-[14px]
                    text-white
                    outline-none
                    focus:border-blue-500
                    placeholder-gray-500
                  "
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label
                className="
                  text-xs
                  text-gray-400
                  block
                  mb-2
                  tracking-wider
                "
              >
                EMAIL
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />

                  </svg>

                </span>

                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full
                    bg-[#111827]
                    border
                    border-gray-700
                    rounded-xl
                    pl-12
                    pr-4
                    py-[14px]
                    text-white
                    outline-none
                    focus:border-blue-500
                    placeholder-gray-500
                  "
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label
                className="
                  text-xs
                  text-gray-400
                  block
                  mb-2
                  tracking-wider
                "
              >
                PASSWORD
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />

                  </svg>

                </span>

                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full
                    bg-[#111827]
                    border
                    border-gray-700
                    rounded-xl
                    pl-12
                    pr-4
                    py-[14px]
                    text-white
                    outline-none
                    focus:border-blue-500
                    placeholder-gray-500
                  "
                />

              </div>

            </div>

            {/* ROLE */}

            <div>

              <label
                className="
                  text-xs
                  text-gray-400
                  block
                  mb-2
                  tracking-wider
                "
              >
                ACCOUNT ROLE
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="
                  w-full
                  bg-[#111827]
                  border
                  border-gray-700
                  rounded-xl
                  px-4
                  py-[14px]
                  text-white
                  outline-none
                  focus:border-blue-500
                "
              >

                <option value="customer">
                  Customer — Book and join queues
                </option>

                <option value="owner">
                  Owner — Manage your business
                </option>

              </select>

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              className="
                mt-3
                w-full
                py-[14px]
                rounded-2xl
                text-white
                font-semibold
                bg-gradient-to-r
                from-blue-500
                via-blue-400
                to-pink-500
                hover:scale-[1.02]
                transition
                duration-300
                cursor-pointer
              "
            >
              Create account →
            </button>

          </form>

          {/* LOGIN */}

          <p className="text-center text-gray-400 text-sm mt-6">

            Have an account?{" "}

            <Link
              to="/login"
              className="
                text-white
                hover:text-blue-400
                font-medium
              "
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div
        className="
          w-full
          lg:w-1/2
          bg-gradient-to-br
          from-blue-600
          via-blue-500
          to-purple-500
          flex
          items-center
          justify-center
          px-6
          sm:px-10
          lg:px-16
          py-12
          lg:py-0
        "
      >

        <div className="max-w-xl">

          {/* BADGE */}

          <div
            className="
              inline-block
              px-4
              py-2
              rounded-full
              bg-white/20
              text-white
              text-sm
              mb-10
            "
          >
            ✨ New: AI re-routing engine
          </div>

          {/* HEADING */}

          <h1
            className="
              text-3xl
              sm:text-4xl
              lg:text-[40px]
              font-bold
              text-white
              leading-[1.1]
              mb-10
              break-words
            "
          >
            Smarter queues for hospitals,
            restaurants, salons & banks.
          </h1>

          {/* TESTIMONIAL */}

          <div
            className="
              bg-white/10
              backdrop-blur-md
              rounded-[28px]
              p-7
              text-white
              w-full
            "
          >

            <p className="mb-6 text-lg">
              "QueueMind AI cut our average
              wait time by 41% in the first
              month."
            </p>

            <div className="flex items-center gap-4">

              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-white/20
                "
              ></div>

              <div>

                <h3 className="font-bold text-lg">
                  Dr. Reyes
                </h3>

                <p className="text-white/70">
                  St. Mercy Hospital
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;
