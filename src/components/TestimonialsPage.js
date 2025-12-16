import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Footer from "./Footer";

const TestimonialPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterRole, setFilterRole] = useState("All");
  const [sortOrder, setSortOrder] = useState("Latest");

  // State for data
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/mockapis/serverpeuser/testimonials`
        );
        console.log(response?.data?.data);

        // Check if data exists, otherwise use fallback
        if (response.data && response?.data?.data.length > 0) {
          // Map API response to match UI structure if necessary
          // Assuming API returns objects compatible or we normalize them here
          const formattedData = response?.data?.data.map((item, index) => ({
            id: item.id,
            name: item.user_name,
            role: item.category_name,
            text: item.message,
            avatar: item.avatar || "👤", // Default avatar if missing
            date:
              item.created_at ||
              item.date ||
              new Date().toISOString().split("T")[0],
          }));
          setTestimonials(formattedData);
        } else {
          setTestimonials(FALLBACK_TESTIMONIALS);
        }
      } catch (error) {
        console.error(
          "Failed to fetch testimonials, using fallback data:",
          error
        );
        setTestimonials(FALLBACK_TESTIMONIALS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // --- Filtering Logic ---
  const filteredTestimonials = testimonials.filter((t) => {
    if (filterRole === "All") return true;
    return t.category_name === filterRole;
  });

  // --- Sorting Logic ---
  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => {
    if (sortOrder === "Latest") {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  // Unique roles for filter dropdown
  const roles = ["All", ...new Set(testimonials.map((t) => t.role))];

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
                onClick={() => navigate("/general-api-pricing")}
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
                className="hover:text-indigo-400 transition-colors"
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

            {/* Mobile menu button (Hamburger) */}
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
          <div className="md:hidden bg-gray-800 border-b border-gray-700 animate-in slide-in-from-top-2 duration-300 absolute w-full left-0 z-50">
            <div className="px-4 py-4 flex flex-col space-y-3 shadow-2xl">
              <button
                onClick={() => navigate("/")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/general-api-pricing")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                API Pricing
              </button>
              <button
                onClick={() => navigate("/general-api-documentation")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                API Documentation
              </button>
              <button
                onClick={() => navigate("/about-me")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                About Me
              </button>
              <button
                onClick={() => navigate("/contact-me")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                Contact Me
              </button>
              <div className="pt-2 border-t border-gray-700">
                <button
                  onClick={() => navigate("/user-login")}
                  className="w-full text-left block px-4 py-2 text-indigo-400 font-semibold hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Start using mock APIs
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            What Developers Say
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            See how the community is using ServerPe to accelerate their
            development workflow.
          </p>
        </div>

        {/* --- Filters & Sorting --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-400">
              Filter by Role:
            </span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2.5 outline-none"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-400">Sort by:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2.5 outline-none"
            >
              <option value="Latest">Latest First</option>
              <option value="Oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* --- Testimonials Grid --- */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedTestimonials.length > 0 ? (
              sortedTestimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-xl hover:border-indigo-500/50 transition-colors flex flex-col h-full"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-3xl border border-gray-700 shadow-inner shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{t.name}</h4>
                      <p className="text-indigo-400 text-xs uppercase tracking-wide font-medium bg-indigo-900/30 px-2 py-1 rounded inline-block mt-1">
                        {t.role}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute -top-2 -left-2 text-4xl text-gray-700 opacity-50 font-serif">
                      "
                    </span>
                    <p className="text-gray-300 text-base leading-relaxed relative z-10 pl-2">
                      {t.text}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-700 text-right">
                    <span className="text-xs text-gray-500 font-mono">
                      {new Date(t.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No testimonials found for this filter.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-block bg-gray-800 rounded-full px-6 py-3 border border-gray-700">
            <p className="text-gray-400 text-sm">
              Want to share your experience?{" "}
              <button
                onClick={() => navigate("/contact-me")}
                className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
              >
                Send us feedback
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 pt-12 pb-8 text-center mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default TestimonialPage;
