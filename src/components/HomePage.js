import { useState } from "react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  // State for mobile menu toggling (optional, but good for responsiveness)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* --- Navigation Bar --- */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 font-bold text-2xl tracking-tighter text-white">
              ServerPe<span className="text-indigo-500">.in</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="/" className="hover:text-indigo-400 transition-colors">
                Home
              </a>
              <a
                href="/general-api-pricing"
                className="hover:text-indigo-400 transition-colors"
              >
                API Pricing
              </a>

              {/* API Documentation Link */}
              <button
                onClick={() => navigate("/general-api-documentation")}
                className="hover:text-indigo-400 transition-colors focus:outline-none"
              >
                API Documentation
              </button>

              <a
                href="/about"
                className="hover:text-indigo-400 transition-colors"
              >
                About Me
              </a>
              <a
                href="/contact"
                className="hover:text-indigo-400 transition-colors"
              >
                Contact Me
              </a>
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

            {/* Mobile menu button (Hamburger) - simplified for this view */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                <span className="text-2xl">☰</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block mb-6 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-indigo-400 text-sm font-medium">
          Comprehensive Mock Data Suite
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
          Realistic Mock APIs for <br />
          <span className="text-indigo-500">Modern UI Development</span>
        </h1>

        <p className="text-lg text-gray-400 mt-6 max-w-3xl mx-auto leading-relaxed">
          Accelerate your frontend development and testing with our diverse
          catalog of mock services. From automotive specifications to complex
          train reservation flows with simulated SMS.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
            onClick={() => {
              navigate("/user-login");
            }}
          >
            Start using mock APIs
          </button>

          <div className="flex flex-col items-center text-sm max-w-2xl mt-4">
            <p className="text-red-300 font-medium bg-red-900/10 px-6 py-3 rounded-lg border border-red-900/30">
              <strong>Disclaimer:</strong> These mock APIs are strictly for
              learning, practicing Web-UI, training, and testing purposes only.
              No real-world scenarios, real bookings, or live databases are
              connected here.
            </p>
          </div>
        </div>
      </section>

      {/* API Categories / Highlights */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-white mb-10 text-center md:text-left border-l-4 border-indigo-500 pl-4">
          Available API Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Post Office */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:bg-gray-750 transition-all hover:border-gray-600 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-9xl">📮</span>
            </div>
            <div className="mb-6">
              <div className="w-14 h-14 bg-orange-900/30 text-orange-400 border border-orange-500/20 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-3xl">📍</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
              Post Office PIN Code APIs
            </h3>
            <p className="text-gray-400 mt-3 leading-relaxed">
              Access a vast database of mock postal information. Query by
              region, district, or PIN code to test address auto-completion
              forms and location-based logic in your applications.
            </p>
            <div className="mt-6">
              <span
                className="text-sm text-orange-400 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/general-api-documentation")}
              >
                View Documentation &rarr;
              </span>
            </div>
          </div>

          {/* Card 2: Car Specs */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:bg-gray-750 transition-all hover:border-gray-600 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-9xl">🏎️</span>
            </div>
            <div className="mb-6">
              <div className="w-14 h-14 bg-blue-900/30 text-blue-400 border border-blue-500/20 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-3xl">🚗</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Car Technical Specs APIs
            </h3>
            <p className="text-gray-400 mt-3 leading-relaxed">
              Detailed technical data for various automobile manufacturers and
              models. Fetch engine specs, dimensions, fuel types, and feature
              lists to build automotive comparison tools or catalogs.
            </p>
            <div className="mt-6">
              <span
                className="text-sm text-blue-400 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/general-api-documentation")}
              >
                View Documentation &rarr;
              </span>
            </div>
          </div>

          {/* Card 3: Bike Specs */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:bg-gray-750 transition-all hover:border-gray-600 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-9xl">🏍️</span>
            </div>
            <div className="mb-6">
              <div className="w-14 h-14 bg-green-900/30 text-green-400 border border-green-500/20 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-3xl">🛵</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
              Bike Technical Specs APIs
            </h3>
            <p className="text-gray-400 mt-3 leading-relaxed">
              Comprehensive specifications for two-wheelers. Includes mock data
              for mileage, power, torque, and chassis details. Ideal for
              e-commerce or review aggregator projects.
            </p>
            <div className="mt-6">
              <span
                className="text-sm text-green-400 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/general-api-documentation")}
              >
                View Documentation &rarr;
              </span>
            </div>
          </div>

          {/* Card 4: Train Reservation */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:bg-gray-750 transition-all hover:border-gray-600 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-9xl">🚄</span>
            </div>
            <div className="mb-6">
              <div className="w-14 h-14 bg-purple-900/30 text-purple-400 border border-purple-500/20 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎫</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
              Mock Train Reservation APIs
            </h3>
            <p className="text-gray-400 mt-3 leading-relaxed">
              End-to-end simulation of a booking engine. Includes seat
              availability, PNR status, and cancellation logic.
              <span className="block mt-2 text-indigo-300 font-medium text-sm">
                ✨ Feature: Mock booking SMS will be triggered to your provided
                mobile number upon successful API call.
              </span>
            </p>
            <div className="mt-6">
              <span
                className="text-sm text-purple-400 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/general-api-documentation")}
              >
                View Documentation &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Bottom CTA */}
      <footer className="border-t border-gray-800 bg-gray-900 pt-12 pb-8 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} ServerPe.in. All rights reserved. <br />
          Designed for Developers, by Developers.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
