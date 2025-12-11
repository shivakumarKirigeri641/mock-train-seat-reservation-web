import React from "react";
import { useNavigate } from "react-router";

const AboutMe = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* --- Navigation Bar --- */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex-shrink-0 font-bold text-2xl tracking-tighter text-white cursor-pointer"
            >
              ServerPe<span className="text-indigo-500">.in</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <button
                onClick={() => navigate("/")}
                className="hover:text-indigo-400 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/api-pricing")}
                className="hover:text-indigo-400 transition-colors"
              >
                API Pricing
              </button>
              <button
                onClick={() => navigate("/general-api-documentation")}
                className="hover:text-indigo-400 transition-colors"
              >
                API Documentation
              </button>
              <button
                onClick={() => navigate("/about-me")}
                className="text-indigo-400 font-semibold"
              >
                About Me
              </button>
              <button
                onClick={() => navigate("/contact-me")}
                className="hover:text-indigo-400 transition-colors"
              >
                Contact Me
              </button>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => navigate("/user-login")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all"
              >
                Start using mock APIs
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 animate-fade-in-up">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              <span className="text-6xl">👨‍💻</span>
            </div>
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center">
              👨‍🦱
              <h1 className="text-4xl font-bold text-pink-400 mb-2 italic">
                Shivakumar V K
              </h1>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Software Engineer & Creator
            </h1>
            <p className="text-xl text-indigo-400 font-medium">
              12+ Years of Professional Experience in the IT Industry
            </p>
          </div>
        </div>

        {/* The Story / Philosophy */}
        <div className="space-y-12">
          <section className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg
                className="w-32 h-32 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-500">#</span> My Approach
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              I believe in an individual approach towards empowering frontend
              developers. Often, UI teams are blocked waiting for backend
              services to be ready. My goal is to bridge that gap with robust,
              ready-to-use <strong>DESI APIs</strong> that reflect the
              complexity of real-world Indian systems.
            </p>
          </section>

          <section className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-2xl p-10 text-center shadow-2xl relative">
            <div className="absolute top-4 left-4 text-6xl opacity-10">🇮🇳</div>
            <div className="absolute bottom-4 right-4 text-6xl opacity-10">
              🚀
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight">
              "Local is Vocal"
            </h2>
            <p className="text-gray-200 text-xl leading-relaxed italic max-w-2xl mx-auto">
              Why go global when we can build world-class solutions right here?
              These APIs are crafted with the Indian context in mind—from
              intricate Train Reservation logic to diverse Vehicle
              Specifications. Let's build products that resonate with our roots
              while matching global standards.
            </p>
            <div className="mt-8">
              <span className="inline-block bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase shadow-lg">
                Made in India, For the World
              </span>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-2">
                For UI Developers
              </h3>
              <p className="text-gray-400 text-sm">
                Stop mocking JSON files manually. Get dynamic responses, error
                states, and realistic latency to test your loading skeletons and
                error boundaries effectively.
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-2">
                For QA Engineers
              </h3>
              <p className="text-gray-400 text-sm">
                Validate edge cases like "Waiting List" PNRs, "Sold Out" trains,
                and specific HTTP error codes without needing a live production
                database.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 pt-8 pb-8 text-center mt-auto">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} ServerPe.in. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AboutMe;
