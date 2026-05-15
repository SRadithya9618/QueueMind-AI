import { Link } from "react-router-dom";

function NotFound() {

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#050816]
        via-[#0B1D51]
        to-[#3B0A45]
        flex
        items-center
        justify-center
        px-6
      "
    >

      <div
        className="
          text-center
          max-w-[800px]
        "
      >

        {/* 404 */}

        <h1
          className="
            text-[180px]
            font-bold
            leading-none
            bg-gradient-to-r
            from-blue-400
            to-pink-400
            bg-clip-text
            text-transparent
          "
        >
          404
        </h1>

        {/* TITLE */}

        <h2
          className="
            text-white
            text-6xl
            font-bold
            mb-6
          "
        >
          Page not found
        </h2>

        {/* DESCRIPTION */}

        <p
          className="
            text-gray-300
            text-2xl
            leading-relaxed
            mb-12
          "
        >
          The page you are looking for
          does not exist or has been moved.
        </p>

        {/* BUTTONS */}

        <div
          className="
            flex
            items-center
            justify-center
            gap-6
          "
        >

          <Link to="/">

            <button
              className="
                bg-gradient-to-r
                from-blue-500
                to-purple-500
                px-10
                py-5
                rounded-2xl
                text-xl
                font-semibold
                text-white
              "
            >
              Go Home
            </button>

          </Link>

          <Link to="/login">

            <button
              className="
                border
                border-[#2B315A]
                bg-[#141933]
                px-10
                py-5
                rounded-2xl
                text-xl
                font-semibold
                text-white
              "
            >
              Login
            </button>

          </Link>

        </div>

      </div>

    </div>
  );
}

export default NotFound;