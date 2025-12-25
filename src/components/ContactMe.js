import React, { useState, useEffect } from "react";
import ServerPeLogo from "../images/ServerPe_Logo.jpg";
import { useNavigate } from "react-router";
import axios from "axios";

const ContactMe = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for Categories (Subjects)
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    rating: 5,
    category_name: "", // Default value
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch Categories from API on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Replace with your actual endpoint
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/mockapis/serverpeuser/feedback-categories`,
          { withCredentials: true }
        );
        if (response.data && response.data.data.length > 0) {
          setCategories(response.data.data);
          // Optional: Set default subject to the first item from API
          setFormData((prev) => ({
            ...prev,
            category_name: response.data.data[0].category_name,
          }));
        } else {
          throw new Error("No data");
        }
      } catch (error) {
        console.error("Failed to fetch subjects, using fallback:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Send formData directly (not wrapped in an object unless your backend specifically requires { formData: ... })
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/mockapis/serverpeuser/contact-me`,
        formData,
        {
          withCredentials: true,
        }
      );
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        category_name: categories[0]?.category_name,
        message: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                className="text-indigo-400 font-semibold"
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

        {/* --- ADDED: Mobile Menu Dropdown --- */}
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
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            How is ServerPe?
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a suggestion, found a bug, or just want to say hi? Use the form
            below or email directly at{" "}
            <a
              href="mailto:support@serverpe.in"
              className="text-indigo-400 hover:underline"
            >
              support@serverpe.in
            </a>
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
          {submitted ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Message Sent!
              </h3>
              <p className="text-gray-400">
                Thank you for your feedback. We'll get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.user_name}
                    onChange={(e) =>
                      setFormData({ ...formData, user_name: e.target.value })
                    }
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Category
                </label>
                <select
                  value={formData.category_name}
                  onChange={(e) =>
                    setFormData({ ...formData, category_name: e.target.value })
                  }
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.category_name} value={cat.category_name}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Rate your experience
                </label>
                <div className="flex gap-4 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-2xl focus:outline-none transition-transform hover:scale-110 ${
                        star <= formData.rating
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows="5"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="How can we improve ServerPe for you?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-wait text-white py-3.5 rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
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

export default ContactMe;
