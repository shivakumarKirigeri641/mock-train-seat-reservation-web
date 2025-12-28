import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import ServerPeLogo from "../images/ServerPe_Logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { removeloggedInUser } from "../store/slices/loggedInUserSlice";
import axios from "axios";
import "../styles/loginpage.css"; // Use same animations as LoginPage

const FeedbackForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for categories
  const [categories, setCategories] = useState([]);

  // --- NEW: Loading & Error States ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [feedbackData, setFeedbackData] = useState({
    category: "Feedback",
    rating: 5,
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null); // Separate error for form submission

  const userdetails = useSelector((store) => store.loggedInUser);

  // --- REFACTORED: Fetch Logic wrapped in useCallback ---
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Reset page-level error

    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL}/mockapis/serverpeuser/feedback-categories`,
        { withCredentials: true }
      );

      const fetchedCategories = response.data?.data || [];
      setCategories(fetchedCategories);

      // Optional: Set the first category as default if available
      if (fetchedCategories.length > 0) {
        setFeedbackData((prev) => ({
          ...prev,
          category:
            fetchedCategories[0].value || fetchedCategories[0].category_name,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);

      if (error.response && error.response.status === 401) {
        dispatch(removeloggedInUser());
        navigate("/user-login");
      } else if (error.code === "ERR_NETWORK") {
        setError(
          "Network Error: Unable to connect to the server. Please check your internet connection."
        );
      } else {
        setError("Failed to load feedback categories. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, navigate]);

  // Initial Fetch
  useEffect(() => {
    if (!userdetails) {
      navigate("/user-login");
    } else {
      fetchCategories();
    }
  }, [userdetails, navigate, fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await axios.post(
        `${process.env.BACKEND_URL}/mockapis/serverpeuser/loggedinuser/feedback`,
        {
          category: feedbackData.category,
          rating: feedbackData.rating,
          message: feedbackData.message,
        },
        { withCredentials: true }
      );
      setSubmitted(true);
      // Reset form
      setFeedbackData({
        category:
          categories.length > 0
            ? categories[0].value || categories[0].category_name
            : "Feedback",
        rating: 5,
        message: "",
      });
    } catch (error) {
      console.error("Submission error", error);
      if (error.response && error.response.status === 401) {
        dispatch(removeloggedInUser());
        navigate("/user-login");
      } else {
        setSubmitError("Failed to submit feedback. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const NavItem = ({ to, label, active = false }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
          : "text-gray-300 hover:text-white hover:bg-gray-800"
      }`}
    >
      {label}
    </Link>
  );

  // ---------------- LOADING STATE ----------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        <div className="flex flex-col items-center gap-6 animate-pulse relative z-10">
          <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center shadow-lg border border-gray-700">
            <svg
              className="w-8 h-8 text-indigo-500 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-white">
              Loading Feedback Form
            </h3>
            <p className="text-sm text-gray-400 font-mono">
              Fetching categories...
            </p>
          </div>
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ERROR STATE ----------------
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center text-white px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl text-center relative z-10">
          <div className="w-16 h-16 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Unavailable</h3>
          <p className="text-gray-400 mb-8">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchCategories}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/user-home")}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 py-3 rounded-lg font-medium transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- MAIN CONTENT ----------------
  return (
    <>
      <Helmet>
        <title>ServerPe™ – Desi Mock APIs for Frontend & UI Development</title>
        <meta
          name="description"
          content="ServerPe provides desi mock APIs for frontend developers to build and test UI without real backend dependencies."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* --- NAVIGATION BAR --- */}
        <nav className="sticky top-0 z-50 bg-gradient-to-b from-gray-900/95 to-gray-900/80 backdrop-blur-md border-b border-gray-700/50 transition-all shadow-lg relative z-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Logo Section */}
              <div
                onClick={() => navigate("/user-home")}
                className="flex items-center gap-3 cursor-pointer group border-2 bg-transparent"
              >
                <img
                  src={ServerPeLogo}
                  alt="ServerPe Logo"
                  className="w-35 h-16 group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-2">
                <NavItem to="/user-home" label="Home" />
                <NavItem to="/api-usage" label="API Usage" />
                <NavItem to="/api-documentation" label="API Documentation" />
                <NavItem to="/api-pricing" label="API Pricing" />
                <NavItem to="/wallet-recharge" label="Wallet & Recharge" />
                <NavItem
                  to="/give-feedback"
                  label="Give feedback"
                  active={true}
                />
              </div>

              {/* Logout */}
              <div className="hidden lg:flex items-center">
                <button
                  onClick={() => navigate("/logout")}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                >
                  <span>Logout</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Toggle */}
              <div className="lg:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-300 hover:text-white focus:outline-none"
                >
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
                      d={
                        isMobileMenuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-gray-800 border-b border-gray-700 animate-in slide-in-from-top-2 duration-300">
              <div className="px-4 py-4 flex flex-col space-y-2">
                <Link
                  to="/user-home"
                  className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
                >
                  Home
                </Link>
                <Link
                  to="/api-usage"
                  className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
                >
                  API Usage
                </Link>
                <Link
                  to="/api-documentation"
                  className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
                >
                  API Documentation
                </Link>
                <Link
                  to="/api-pricing"
                  className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
                >
                  API Pricing
                </Link>
                <Link
                  to="/wallet-recharge"
                  className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
                >
                  Wallet & Recharge
                </Link>
                <Link
                  to="/give-feedback"
                  className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
                >
                  Give feedback
                </Link>
                <Link
                  to="/logout"
                  className="block px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg"
                >
                  Logout
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* --- Main Content --- */}
        <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-16">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl mt-4">
            {submitted ? (
              <div className="text-center py-8 animate-fade-in">
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
                  Thanks for your Feedback!
                </h3>
                <p className="text-gray-400">
                  We value your input and will use it to improve ServerPe.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Share Your Feedback
                </h2>

                {/* Submission Error Message */}
                {submitError && (
                  <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-sm text-red-300 text-center mb-4">
                    {submitError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    What is this about?
                  </label>
                  {/* 3. Map the fetched categories here */}
                  <select
                    value={feedbackData.category}
                    onChange={(e) =>
                      setFeedbackData({
                        ...feedbackData,
                        category: e.target.value,
                      })
                    }
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    {categories.map((cat, index) => (
                      <option
                        key={index}
                        value={cat.value || cat.category_name}
                      >
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
                        onClick={() =>
                          setFeedbackData({ ...feedbackData, rating: star })
                        }
                        className={`text-2xl focus:outline-none transition-transform hover:scale-110 ${
                          star <= feedbackData.rating
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
                    Your Message
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={feedbackData.message}
                    onChange={(e) =>
                      setFeedbackData({
                        ...feedbackData,
                        message: e.target.value,
                      })
                    }
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us what you think..."
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
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
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
    </>
  );
};

export default FeedbackForm;
