import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const response = await API.post("/auth/login", { email, password });
      
      console.log(response.data);
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      if (response.data.user?.role === "owner") {
        navigate("/dashboard/owner");
      } else {
        navigate("/dashboard/customer");
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div
      className="
        min-h-screen
        overflow-x-hidden
        flex
        flex-col
        lg:flex-row
        bg-black
      "
    >

      {/* LEFT SIDE */}

      <div
        className="
          w-full
          lg:w-1/2
          bg-gradient-to-br
          from-blue-600
          via-blue-500
          to-purple-500
          flex
          flex-col
          justify-center
          px-6
          sm:px-10
          lg:px-12
          relative
        "
      >

        {/* LOGO */}

        <Link
          to="/"
          className="
            absolute
            top-8
            left-6
            sm:left-10
            lg:top-12
            lg:left-12
            flex
            items-center
            gap-3
            text-white
            no-underline
            
          "
        >

          <div
            className="
              w-11
              h-11
              rounded-full
              bg-white/20
              backdrop-blur-md
              flex
              items-center
              justify-center
              font-bold
              text-white
              text-lg
              
            "
          >
            ✦
          </div>

          <div>

            <h1 className="text-3xl font-bold leading-none">
              QueueMind
            </h1>

            <p className="text-sm text-white/80">
              AI
            </p>
            

          </div>

        </Link>

        {/* CONTENT */}

        <div className="w-full max-w-[450px] mt-28">

          {/* BADGE */}

          {/* <div
            className="
              inline-block
              px-5
              py-2
              rounded-full
              bg-white/20
              backdrop-blur-md
              text-white
              text-sm
              font-medium
              mb-10
            "
          >
            ✨ AI Queue Intelligence
          </div> */}

          {/* HEADING */}

          <h1
            className="
              text-3xl
              sm:text-4xl
              lg:text-[40px]
              font-bold
              text-white
              leading-[1.1]
              mb-8
              break-words
              
            "
          >
            Welcome back to the future of queue management.
          </h1>

          {/* SUBTEXT */}

          <p
            className="
              text-white/90
              text-lg
              sm:text-xl
              lg:text-2xl
              leading-relaxed
              mb-14
              max-w-[520px]
            "
          >
            Predict waits, book tokens and run your
            business faster — all from one premium dashboard.
          </p>

          {/* STATS */}

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex gap-5">

            {/* CARD 1 */}

            <div
              className="
                bg-white/10
                backdrop-blur-md
                rounded-3xl
                px-6
                lg:px-8
                py-6
                w-full
                lg:w-[180px]
              "
            >

              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold break-words">
                94%
              </h2>

              <p className="text-white/80 text-lg mt-2">
                Accuracy
              </p>

            </div>

            {/* CARD 2 */}

            <div
              className="
                bg-white/10
                backdrop-blur-md
                rounded-3xl
                px-6
                lg:px-8
                py-6
                w-full
                lg:w-[180px]
              "
            >

              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold break-words">
                40%
              </h2>

              <p className="text-white/80 text-lg mt-2">
                Less wait
              </p>

            </div>

            {/* CARD 3 */}

            <div
              className="
                bg-white/10
                backdrop-blur-md
                rounded-3xl
                px-6
                lg:px-8
                py-6
                w-full
                lg:w-[180px]
              "
            >

              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold break-words">
                1.2k
              </h2>

              <p className="text-white/80 text-lg mt-2">
                Businesses
              </p>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        

      </div>

      {/* RIGHT SIDE */}

      <div
        className="
          w-full
          lg:w-1/2
          bg-[#050816]
          flex
          items-center
          justify-center
          px-6
          sm:px-10
          py-10
          lg:py-0
        
        "
      >

        {/* LOGIN CARD */}

        <div
          className="
            w-full
            max-w-[450px]
            bg-[#0B1120]
            border
            border-[#1A2234]
            rounded-[36px]
            px-6
            sm:px-10
            py-8
            lg:py-0
            shadow-2xl
          "
        >

          {/* TITLE */}

          <h1
            className="
              text-3xl
              sm:text-4xl
              lg:text-[40px]
              font-bold
              text-white
              leading-none
              mb-4
              mt-4
            "
          >
            Sign in
          </h1>

          {/* SUBTITLE */}

          <p
            className="
              text-gray-400
              text-lg
              mb-8
              sm:mb-12
            "
          >
            Welcome back. Enter your details to continue.
          </p>

          {/* FORM */}

          <form
            onSubmit={handleLogin}
            className="
              flex
              flex-col
              gap-5
              sm:gap-3
            "
          >

            {/* EMAIL */}

            <div>

              <label
                className="
                  text-sm
                  text-gray-400
                  block
                  mb-3
                  tracking-wider
                "
              >
                EMAIL
              </label>

              <div className="relative">

                <span
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                  "
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="you@gmail.com"
                  className="
                    w-full
                    bg-[#111827]
                    border
                    border-gray-700
                    rounded-2xl
                    pl-16
                    pr-5
                    py-5
                    text-white
                    text-lg
                    outline-none
                    focus:border-blue-500
                    placeholder-gray-500
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label
                className="
                  text-sm
                  text-gray-400
                  block
                  mb-3
                  tracking-wider
                "
              >
                PASSWORD
              </label>

              <div className="relative">

                <span
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                  "
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••"
                  className="
                    w-full
                    bg-[#111827]
                    border
                    border-gray-700
                    rounded-2xl
                    pl-16
                    pr-5
                    py-5
                    text-white
                    text-lg
                    outline-none
                    focus:border-blue-500
                    placeholder-gray-500
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                />

              </div>

            </div>

            {/* OPTIONS */}

            <div className="flex items-center justify-between gap-3">

              <label
                className="
                  flex
                  items-center
                  gap-3
                  text-gray-300
                  text-base
                  sm:text-lg
                "
              >

                <input
                  type="checkbox"
                  className="w-5 h-5"
                />

                Remember me

              </label>

              <button
                type="button"
                disabled={loading}
                className="
                  text-blue-400
                  hover:text-blue-300
                  text-base
                  sm:text-lg
                  whitespace-nowrap
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                Forgot?
              </button>

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="
                w-full
                mt-2
                sm:mt-0
                py-5
                rounded-2xl
                inline-flex
                items-center
                justify-center
                gap-3
                text-white
                text-lg
                sm:text-xl
                font-semibold
                bg-gradient-to-r
                from-blue-500
                via-blue-400
                to-pink-500
                hover:scale-[1.02]
                transition-all
                duration-300
                cursor-pointer
                min-h-[64px]
                disabled:cursor-not-allowed
                disabled:opacity-80
                disabled:hover:scale-100
              "
            >
              {loading && (
                <span
                  aria-hidden="true"
                  className="
                    h-5
                    w-5
                    shrink-0
                    rounded-full
                    border-2
                    border-white/40
                    border-t-white
                    animate-spin
                  "
                />
              )}
              <span className="leading-none">
                {loading ? "Please wait..." : "Sign in →"}
              </span>
            </button>

          </form>

          {/* FOOTER */}

          <p
            className="
              text-center
              text-gray-400
              text-base
              sm:text-lg
              mt-6
              sm:mt-10
              mb-2
              lg:mb-0
            "
          >

            No account?{" "}

            <Link
              to="/register"
              className="
                text-blue-400
                hover:text-blue-300
                font-semibold
              "
            >
              Create one
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
