import { useState, useEffect } from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router";
import axios from "axios";
// Adjust this path to where your SVG file is located
import ServerPeLogo from "../images/ServerPe_Logo.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  // State for mobile menu toggling
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for Testimonials
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/mockapis/serverpeuser/testimonials`
        );
        setTestimonials(response?.data?.data);
      } catch (error) {
        console.error("Failed to fetch testimonials, using fallback.", error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* --- Navigation Bar --- */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group border-2 bg-transparent"
            >
              <img
                src={ServerPeLogo}
                alt="ServerPe Logo"
                className="w-35 h-16 group-hover:scale-105 transition-transform"
              />
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

              <button
                onClick={() => navigate("/general-api-documentation")}
                className="hover:text-indigo-400 transition-colors focus:outline-none"
              >
                API Documentation
              </button>

              <a
                href="/about-me"
                className="hover:text-indigo-400 transition-colors"
              >
                About Me
              </a>
              <a
                href="/contact-me"
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

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                <span className="text-2xl">☰</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- Mobile Menu Dropdown --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-b border-gray-700 absolute w-full left-0 z-50">
            <div className="px-4 py-4 flex flex-col space-y-3 shadow-2xl">
              <a
                href="/"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
              >
                Home
              </a>
              <a
                href="/general-api-pricing"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
              >
                API Pricing
              </a>
              <button
                onClick={() => {
                  navigate("/general-api-documentation");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
              >
                API Documentation
              </button>
              <a
                href="/about-me"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
              >
                About Me
              </a>
              <a
                href="/contact-me"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
              >
                Contact Me
              </a>
              <div className="pt-2 border-t border-gray-700">
                <button
                  onClick={() => {
                    navigate("/user-login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-4 py-2 text-indigo-400 font-semibold hover:bg-gray-700 rounded-lg"
                >
                  Start using mock APIs
                </button>
              </div>
            </div>
          </div>
        )}
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
          catalog of mock services. From massive automotive databases to complex
          train reservation flows.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
            onClick={() => navigate("/user-login")}
          >
            Start using mock APIs
          </button>

          <div className="flex flex-col items-center text-sm max-w-2xl mt-4">
            <p className="text-red-300 font-medium bg-red-900/10 px-6 py-3 rounded-lg border border-red-900/30">
              <strong>Disclaimer:</strong> These mock APIs are strictly for
              learning, practicing Web-UI, training, and testing purposes only.
            </p>
          </div>
        </div>
      </section>

      {/* Available API Categories */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
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
              <div className="w-14 h-14 bg-orange-900/30 text-orange-400 border border-orange-500/20 flex items-center justify-center rounded-xl">
                <span className="text-3xl">📍</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
              Post Office PIN Code APIs
            </h3>
            <p className="text-gray-400 mt-3 leading-relaxed">
              Access 1.5 Lakh+ distinct PIN codes with location details.
            </p>
          </div>

          {/* Card 2: Car Specs */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:bg-gray-750 transition-all hover:border-gray-600 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-9xl">🏎️</span>
            </div>
            <div className="mb-6">
              <div className="w-14 h-14 bg-blue-900/30 text-blue-400 border border-blue-500/20 flex items-center justify-center rounded-xl">
                <span className="text-3xl">🚗</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Car Technical Specs APIs
            </h3>
            <p className="text-gray-400 mt-3 leading-relaxed">
              Data for 54,000+ cars with over 200 technical specs each.
            </p>
          </div>

          {/* Card 3: Bike Specs */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:bg-gray-750 transition-all hover:border-gray-600 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-9xl">🏍️</span>
            </div>
            <div className="mb-6">
              <div className="w-14 h-14 bg-green-900/30 text-green-400 border border-green-500/20 flex items-center justify-center rounded-xl">
                <span className="text-3xl">🛵</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
              Bike Technical Specs APIs
            </h3>
            <p className="text-gray-400 mt-3 leading-relaxed">
              Data for 42,500+ bikes featuring 90+ specifications.
            </p>
          </div>

          {/* Card 4: Train Reservation */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:bg-gray-750 transition-all hover:border-gray-600 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-9xl">🚄</span>
            </div>
            <div className="mb-6">
              <div className="w-14 h-14 bg-purple-900/30 text-purple-400 border border-purple-500/20 flex items-center justify-center rounded-xl">
                <span className="text-3xl">🎫</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
              Mock Train Reservation APIs
            </h3>
            <p className="text-gray-400 mt-3 leading-relaxed">
              Covers 9,000+ trains with PNR, availability, and SMS simulation.
            </p>
          </div>
        </div>
      </section>

      {/* --- NEW: Upcoming API Categories Section --- */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-3 mb-10">
          <h2 className="text-2xl font-bold text-white border-l-4 border-yellow-500 pl-4">
            Upcoming API Categories
          </h2>
          <span className="bg-yellow-500/10 text-yellow-500 text-[10px] uppercase px-2 py-1 rounded border border-yellow-500/20 font-bold animate-pulse">
            Coming Soon
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming 1: IFSC */}
          <div className="bg-gray-800/40 border border-dashed border-gray-700 rounded-2xl p-6 relative">
            <div className="text-3xl mb-4">🏦</div>
            <h3 className="text-lg font-bold text-gray-200">
              IFSC Details API
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Fetch complete bank details including name, branch, district, and
              state using a single IFSC code.
            </p>
          </div>

          {/* Upcoming 2: Vahan */}
          <div className="bg-gray-800/40 border border-dashed border-gray-700 rounded-2xl p-6 relative">
            <div className="text-3xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-gray-200">Mock Vahan APIs</h3>
            <p className="text-gray-500 text-sm mt-2">
              Get mock vehicle registration, owner info, insurance validity, and
              PUC status via vehicle number.
            </p>
          </div>

          {/* Upcoming 3: Bus */}
          <div className="bg-gray-800/40 border border-dashed border-gray-700 rounded-2xl p-6 relative">
            <div className="text-3xl mb-4">🚌</div>
            <h3 className="text-lg font-bold text-gray-200">
              Mock Bus Reservation
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Advanced simulation for seat selection, bus schedules, and full
              reservation workflow testing.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-800/50 border-y border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-10 text-center md:text-left border-l-4 border-indigo-500 pl-4">
            What Developers Says...
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {testimonials?.map((t) => (
              <div
                key={t.id}
                className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl border border-gray-700">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{t.user_name}</h4>
                    <p className="text-indigo-400 text-xs uppercase tracking-wide font-medium">
                      {t.category_name}
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed italic">
                  "{t.message}"
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/testimonials")}
              className="text-indigo-400 hover:text-indigo-300 font-medium text-sm flex items-center justify-center gap-1 mx-auto group"
            >
              Load More Testimonials{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 pt-12 pb-8 text-center mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default HomePage;
