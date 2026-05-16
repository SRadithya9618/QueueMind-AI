import { Link } from "react-router-dom";

function Home() {

  return (

    <div
      className="
        bg-gradient-to-br
        from-[#0B1D51]
        via-[#141B4D]
        to-[#3B0A45]
        min-h-screen
        text-white
        overflow-x-hidden
      "
    >

      {/* NAVBAR */}

      <nav
        className="
          flex
          items-center
          justify-between
          px-6
          md:px-16
          py-6
          md:py-8
        "
      >

        {/* LOGO */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-12
              h-12
              rounded-full
              bg-gradient-to-r
              from-cyan-400
              to-blue-500
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-xl
            "
          >
            Q
          </div>

          <div>

            <h1
              className="
                text-2xl
                font-bold
              "
            >
              QueueMind
            </h1>

            <p
              className="
                text-sm
                text-blue-300
              "
            >
              AI
            </p>

          </div>

        </div>

        {/* NAV LINKS */}

        <div
          className="
            hidden
            md:flex
            items-center
            gap-6
            lg:gap-12
            text-gray-300
            font-medium
          "
        >

          <a
            href="#features"
            className="
              cursor-pointer
              hover:text-white
              transition-all
              duration-300
            "
          >
            Features
          </a>

          <a
            href="#ai-engine"
            className="
              cursor-pointer
              hover:text-white
              transition-all
              duration-300
            "
          >
            AI Engine
          </a>

          <a
            href="#industries"
            className="
              cursor-pointer
              hover:text-white
              transition-all
              duration-300
            "
          >
            Industries
          </a>

          <a
            href="#pricing"
            className="
              cursor-pointer
              hover:text-white
              transition-all
              duration-300
            "
          >
            Pricing
          </a>

        </div>

        {/* BUTTONS */}

        <div
          className="
            hidden
            sm:flex
            items-center
            gap-3
            md:gap-5
          "
        >

          <Link to="/login">

            <button
              className="
                cursor-pointer
                text-white
                font-medium
                hover:text-blue-300
                transition-all
                duration-300
              "
            >
              Sign in
            </button>

          </Link>

          <Link to="/register">

            <button
              className="
                cursor-pointer
                bg-gradient-to-r
                from-blue-500
                to-purple-500
                px-6
                py-3
                rounded-full
                font-semibold
                hover:scale-105
                transition-all
                duration-300
              "
            >
              Get Started
            </button>

          </Link>

        </div>

      </nav>

      {/* HERO SECTION */}

      <section
        className="
          flex
          flex-col
          items-center
          text-center
          px-6
          pt-1
        "
      >

        {/* BADGE */}

        <div
          className="
            border
            border-[#2A2F5A]
            bg-[#151933]
            rounded-full
            px-6
            py-3
            text-sm
            mb-10
          "
        >
          Powered by predictive AI · Real-time queue intelligence
        </div>

        {/* MAIN HEADING */}

        <h1
          className="
            text-4xl
            md:text-6xl
            lg:text-8xl
            leading-tight
            font-bold
            max-w-[1100px]
            break-words
          "
        >

          Stop waiting in line.

          <br />

          <span
            className="
              bg-gradient-to-r
              from-blue-400
              to-pink-400
              bg-clip-text
              text-transparent
            "
          >
            Start predicting them.
          </span>

        </h1>

        {/* DESCRIPTION */}

        <p
          className="
            text-gray-300
            text-2xl
            max-w-[900px]
            mt-10
            leading-relaxed
          "
        >
          QueueMind AI forecasts crowd flow,
          books tokens instantly, and helps
          businesses run faster — for hospitals,
          restaurants, salons and banks.
        </p>

        {/* BUTTONS */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-center
            gap-6
            mt-12
            w-full
            sm:w-auto
          "
        >

          <Link to="/register">

            <button
              className="
                cursor-pointer
                bg-gradient-to-r
                from-blue-500
                to-purple-500
                px-8
                md:px-10
                py-5
                rounded-2xl
                text-lg
                font-semibold
                w-full
                sm:w-auto
                hover:scale-105
                transition-all
                duration-300
              "
            >
              Start free trial →
            </button>

          </Link>

          <Link to="/login">

            <button
              className="
                cursor-pointer
                border
                border-[#2B315A]
                bg-[#141933]
                px-8
                md:px-10
                py-5
                rounded-2xl
                text-lg
                font-semibold
                w-full
                sm:w-auto
                hover:bg-[#1B2142]
                transition-all
                duration-300
              "
            >
              Live demo
            </button>

          </Link>

        </div>

      </section>

      {/* ANALYTICS CARD */}

      <section
        className="
          px-6
          md:px-10
          mt-14
        "
      >

        <div
          className="
            bg-[#0B1120]
            border
            border-[#1A2234]
            rounded-[40px]
            p-5
          "
        >

          {/* TOP CARDS */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-4
              gap-6
              lg:gap-9
              mb-10
            "
          >

            <div
              className="
                bg-[#050B18]
                rounded-3xl
                p-6
                md:p-8
                w-full
              "
            >

              <h1
                className="
                  text-4xl
                  md:text-5xl
                  lg:text-6xl
                  font-bold
                  mb-3
                  break-words
                "
              >
                1,284
              </h1>

              <p
                className="
                  text-gray-400
                  text-xl
                "
              >
                Live tokens
              </p>

            </div>

            <div
              className="
                bg-[#050B18]
                rounded-3xl
                p-6
                md:p-8
                w-full
              "
            >

              <h1
                className="
                  text-4xl
                  md:text-5xl
                  lg:text-6xl
                  font-bold
                  mb-3
                  break-words
                "
              >
                8m 32s
              </h1>

              <p
                className="
                  text-gray-400
                  text-xl
                "
              >
                Predicted wait
              </p>

            </div>

            <div
              className="
                bg-[#050B18]
                rounded-3xl
                p-6
                md:p-8
                w-full
              "
            >

              <h1
                className="
                  text-4xl
                  md:text-5xl
                  lg:text-6xl
                  font-bold
                  mb-3
                  break-words
                "
              >
                94.2%
              </h1>

              <p
                className="
                  text-gray-400
                  text-xl
                "
              >
                Throughput
              </p>

            </div>

          </div>

          {/* GRAPH */}

          {/* <div
            className="
              bg-[#050B18]
              rounded-3xl
              h-[250px]
              flex
              items-end
              gap-4
              px-8
              pb-8
            "
          >

            <div className="w-10 h-24 rounded-t-full bg-gradient-to-t from-pink-400 to-blue-500"></div>
            <div className="w-10 h-32 rounded-t-full bg-gradient-to-t from-pink-400 to-blue-500"></div>
            <div className="w-10 h-20 rounded-t-full bg-gradient-to-t from-pink-400 to-blue-500"></div>
            <div className="w-10 h-40 rounded-t-full bg-gradient-to-t from-pink-400 to-blue-500"></div>
            <div className="w-10 h-28 rounded-t-full bg-gradient-to-t from-pink-400 to-blue-500"></div>
            <div className="w-10 h-36 rounded-t-full bg-gradient-to-t from-pink-400 to-blue-500"></div>
            <div className="w-10 h-16 rounded-t-full bg-gradient-to-t from-pink-400 to-blue-500"></div>
            <div className="w-10 h-48 rounded-t-full bg-gradient-to-t from-pink-400 to-blue-500"></div>
            <div className="w-10 h-26 rounded-t-full bg-gradient-to-t from-pink-400 to-blue-500"></div>
            <div className="w-10 h-36 rounded-t-full bg-gradient-to-t from-pink-400 to-blue-500"></div>
            <div className="w-10 h-24 rounded-t-full bg-gradient-to-t from-pink-400 to-blue-500"></div>
            <div className="w-10 h-44 rounded-t-full bg-gradient-to-t from-pink-400 to-blue-500"></div>

          </div> */}

        </div>

      </section>

      {/* FEATURES */}

      <section
        id="features"
        className="
          px-6
          md:px-20
          py-10
        "
      >

        <p
          className="
            text-blue-400
            text-center
            tracking-[4px]
            font-semibold
            mb-3
            pt-0
          "
        >
          FEATURES
        </p>

        <h4
          className="
            text-4xl
            md:text-5xl
            font-bold
            text-center
            mb-12
            md:mb-20
            break-words
          "
        >
          Built for the modern queue
        </h4>

        <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-6
              lg:gap-1
              [grid-auto-rows:1fr]
            "
          >

          {[
            "AI Predictions",
            "Instant Tokens",
            "Live Analytics",
            "Smart Scheduling",
            "Enterprise-grade",
            "Customer Delight",
          ].map((item) => (

            <div
              key={item}
              className="
                bg-[#111827]
                border
                border-[#1F2937]
                rounded-3xl
                p-6
                md:p-10
                min-h-[200px]
                lg:h-[200px]
                h-full
                w-full
              "
            >

              <h1
                className="
                  text-2xl
                  md:text-3xl
                  font-bold
                  mb-6
                  break-words
                "
              >
                {item}
              </h1>

              <p
                className="
                  text-gray-400
                  text-base
                  md:text-lg
                  leading-relaxed
                  break-words
                "
              >
                Powerful AI queue management
                designed for modern businesses.
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* AI ENGINE */}

      <section
        id="ai-engine"
        className="
          px-6
          md:px-20
          pb-20
          md:pb-32
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-8
          lg:gap-16
          items-center
        "
      >

        {/* LEFT */}

        <div>

          <p
            className="
              text-blue-400
              tracking-[4px]
              font-semibold
              mb-6
            "
          >
            AI ENGINE
          </p>

          <h5
            className="
              text-2xl
              md:text-3xl
              font-bold
              leading-tight
              mb-5
              break-words
            "
          >
            Predict crowds before they form
          </h5>

          <p
            className="
              text-gray-300
              text-lg
              md:text-xl
              leading-relaxed
              mb-5
              break-words
            "
          >
            Our prediction engine analyzes
            historical traffic, weather,
            local events and live queue signals.
          </p>

          <div
            className="
              flex
              flex-col
              gap-3
              text-lg
              md:text-xl
            "
          >

            <p>✅ Real-time demand insights</p>
            <p>✅ Optimized</p>
            <p>✅ Smart predictions</p>
            <p>✅ Continuous improvement</p>

          </div>

        </div>

        {/* RIGHT */}

        <div
          className="
            bg-[#0B1120]
            border
            border-[#1A2234]
            rounded-[40px]
            p-6
            md:p-10
            w-full
          "
        >

          {/* <div
            className="
              grid
              grid-cols-4
              gap-5
              mb-10
            "
          >

            <div className="h-36 rounded-3xl bg-gradient-to-br from-blue-500 to-pink-400"></div>
            <div className="h-48 rounded-3xl bg-gradient-to-br from-blue-500 to-pink-400"></div>
            <div className="h-40 rounded-3xl bg-gradient-to-br from-blue-500 to-pink-400"></div>
            <div className="h-28 rounded-3xl bg-gradient-to-br from-blue-500 to-pink-400"></div>

          </div> */}

          <div
            className="
              bg-[#111827]
              rounded-3xl
              p-6
            "
          >

            <h1
              className="
                text-2xl
                font-bold
                mb-3
              "
            >
              AI Insight
            </h1>

            <p
              className="
              text-gray-400
              text-base
              md:text-lg
              break-words
            "
          >
              Expected 38% surge at 1 PM.
              Recommend opening counter #4.
            </p>

          </div>

        </div>

      </section>

      {/* INDUSTRIES */}

      <section
        id="industries"
        className="
          px-6
          md:px-20
          pb-20
        "
      >

        <p
          className="
            text-blue-400
            text-center
            tracking-[4px]
            font-semibold
            mb-6
          "
        >
          INDUSTRIES
        </p>

        <h1
          className="
            text-4xl
            font-bold
            text-center
            mb-10
          "
        >
          One platform, every queue
        </h1>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
            lg:gap-3
          "
        >

          {[
            "Hospitals",
            "Restaurants",
            "Salons",
            "Banks",
          ].map((item) => (

            <div
              key={item}
              className="
                bg-[#111827]
                border
                border-[#1F2937]
                rounded-3xl
                min-h-[140px]
                lg:h-[180px]
                flex
                items-center
                justify-center
                text-2xl
                md:text-3xl
                font-bold
                text-center
              "
            >
              {item}
            </div>

          ))}

        </div>

      </section>

      {/* CTA */}

      <section
        id="pricing"
        className="
          px-6
          md:px-20
          pb-20
          md:pb-32
        "
      >

        <div
          className="
            bg-gradient-to-r
            from-blue-500
            to-pink-300
            rounded-[50px]
            py-12
            md:py-16
            px-6
            md:px-0
            text-center
          "
        >

          <h1
            className="
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-bold
              mb-8
              break-words
            "
          >
            Ready to ship smarter queues?
          </h1>

          <p
            className="
              text-lg
              md:text-2xl
              mb-12
              break-words
            "
          >
            Join hundreds of businesses using QueueMind AI.
          </p>

          <div
            className="
              flex
              flex-col
              sm:flex-row
              justify-center
              gap-6
            "
          >

            <Link to="/register" className="w-full sm:w-auto">

              <button
                className="
                  cursor-pointer
                  bg-white
                  text-black
                  px-8
                  md:px-10
                  py-5
                  rounded-2xl
                  text-lg
                  md:text-xl
                  font-semibold
                  w-full
                  hover:scale-105
                  transition-all
                  duration-300
                "
              >
                Start free trial
              </button>

            </Link>

            <Link to="/login" className="w-full sm:w-auto">

              <button
                className="
                  cursor-pointer
                  border
                  border-white
                  px-8
                  md:px-10
                  py-5
                  rounded-2xl
                  text-lg
                  md:text-xl
                  font-semibold
                  w-full
                  hover:bg-white
                  hover:text-black
                  transition-all
                  duration-300
                "
              >
                Owner demo
              </button>

            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;
