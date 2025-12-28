import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { removeloggedInUser } from "../store/slices/loggedInUserSlice";
import ConfettiSparkles from "./ConfettiSparkles";
import ServerPeLogo from "../images/ServerPe_Logo.svg";
import "../styles/loginpage.css"; // Use same animations as LoginPage
const UserHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userdetails = useSelector((store) => store.loggedInUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for user data from API
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW: State for Welcome Snackbar ---
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  // State for Testimonials
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // State for Credentials Visibility
  const [copiedField, setCopiedField] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!userdetails) return;

    setIsLoading(true);
    setError(null);

    try {
      const dashboardResponse = await axios.get(
        `${process.env.BACKEND_URL}/mockapis/serverpeuser/loggedinuser/user-dashboard-data`,
        { withCredentials: true }
      );

      if (dashboardResponse.data.successstatus) {
        const data = dashboardResponse.data.data;
        console.log(data);
        setUserData(data);

        // --- NEW: Check for first-time subscription status ---
        if (data?.user_details?.firsttime_subscription_status === true) {
          setShowWelcomeMessage(true);
          // Auto-hide after 6 seconds
          setTimeout(() => setShowWelcomeMessage(false), 7000);
        }
      } else {
        throw new Error("Failed to retrieve dashboard data.");
      }

      try {
        const testimonialResponse = await axios.get(
          `${process.env.BACKEND_URL}/mockapis/serverpeuser/testimonials`,
          { withCredentials: true }
        );
        if (testimonialResponse?.data?.data) {
          setTestimonials(testimonialResponse.data.data);
        }
      } catch (err) {
        console.warn("Testimonials failed to load:", err);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      if (error.response && error.response.status === 401) {
        dispatch(removeloggedInUser());
        navigate("/user-login");
      } else if (error.code === "ERR_NETWORK") {
        setError(
          "Unable to connect to the server. Please check your internet connection."
        );
      } else {
        setError(
          "Something went wrong while loading your dashboard. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [userdetails, dispatch, navigate]);

  useEffect(() => {
    if (!userdetails) {
      navigate("/user-login");
    } else {
      fetchDashboardData();
    }
  }, [userdetails, navigate, fetchDashboardData]);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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

  const timeAgo = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

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
            <span className="text-3xl">⚡</span>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-white">
              Loading Dashboard
            </h3>
            <p className="text-sm text-gray-400 font-mono">
              Fetching account details...
            </p>
          </div>
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

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
          <h3 className="text-xl font-bold text-white mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-400 mb-8">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchDashboardData}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/contact-me")}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 py-3 rounded-lg font-medium transition-all"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>ServerPe™ – Desi Mock APIs for Frontend & UI Development</title>
        <meta
          name="description"
          content="ServerPe provides desi mock APIs for frontend developers to build and test UI without real backend dependencies."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        {/* --- WELCOME SNACKBAR --- */}
        {showWelcomeMessage && <ConfettiSparkles />}
        {showWelcomeMessage && (
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5">
            <div className="relative bg-indigo-600 border border-indigo-400 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
              {/* Glitter Sparkles */}
              <span className="absolute -top-1 -left-1 text-yellow-300 animate-glitter">
                ✨
              </span>
              <span className="absolute -bottom-2 -right-2 text-white animate-glitter delay-300">
                ⭐
              </span>
              <span className="absolute top-2 right-10 text-indigo-200 animate-glitter delay-700 text-xs">
                ✨
              </span>

              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                🎉
              </div>
              <div>
                <p className="font-bold text-sm">Welcome to ServerPe!</p>
                <p className="text-xs text-indigo-100">
                  50 Free API credits added!
                </p>
              </div>
            </div>
            <ConfettiSparkles />
          </div>
        )}

        {/* --- NAVIGATION BAR --- */}
        <nav className="sticky top-0 z-50 bg-gradient-to-b from-gray-900/95 to-gray-900/80 backdrop-blur-md border-b border-gray-700/50 transition-all shadow-lg">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Logo Section */}
              <div
                onClick={() => navigate("/user-home")}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={ServerPeLogo}
                  alt="ServerPe Logo"
                  className="h-14 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="hidden lg:flex items-center space-x-2">
                <NavItem to="/user-home" label="Home" active={true} />
                <NavItem to="/api-usage" label="API Usage" />
                <NavItem to="/api-documentation" label="API Documentation" />
                <NavItem to="/api-pricing" label="API Pricing" />
                <NavItem to="/wallet-recharge" label="Wallet & Recharge" />
                <NavItem to="/give-feedback" label="Give feedback" />
              </div>

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

          {isMobileMenuOpen && (
            <div className="lg:hidden bg-gray-800 border-b border-gray-700 animate-in slide-in-from-top-2 duration-300">
              <div className="px-4 py-4 flex flex-col space-y-2">
                <Link
                  to="/user-home"
                  className="block px-4 py-3 bg-gray-700 text-white rounded-lg"
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
                <div className="border-t border-gray-700 my-2 pt-2">
                  <Link
                    to="/logout"
                    className="block px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg"
                  >
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* --- MAIN CONTENT --- */}
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Developer Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your keys and monitor API activity.
              </p>
            </div>
            <div className="bg-indigo-900/20 border border-indigo-500/30 px-5 py-2 rounded-full flex items-center gap-3">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Plan
              </span>
              <span className="text-sm font-bold text-white">
                {userData?.user_plan?.price_name || "Free"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl hover:border-gray-600 transition-colors">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  API Credentials
                </h3>
                <div className="mb-5">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                    Client ID / API Key
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      readOnly
                      value={userData?.user_details?.apikey_text || ""}
                      className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg p-3 pr-10 focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                    <button
                      onClick={() =>
                        handleCopy(userData?.user_details?.apikey_text, "api")
                      }
                      className="absolute right-2 top-2 p-1 text-gray-500 hover:text-white transition-colors"
                      title="Copy Key"
                    >
                      {copiedField === "api" ? (
                        <svg
                          className="w-5 h-5 text-green-400"
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
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <p className="text-xs text-cyan-400 flex items-center gap-1">
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Keep your API Key confidential.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-800 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl flex items-center justify-between hover:border-gray-500 transition-all cursor-pointer transform hover:-translate-y-1">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Available API credits
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {userData?.user_details?.api_credits || "..."}
                  </h3>
                </div>
                <button
                  onClick={() => navigate("/api-pricing")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Recharge
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Recent API Access History
                  </h3>
                  <Link
                    to="/api-usage"
                    className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  >
                    View All Logs
                  </Link>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-900/50">
                      <tr>
                        <th className="px-6 py-4 font-medium">Endpoint</th>
                        <th className="px-6 py-4 font-medium">Method</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Latency</th>
                        <th className="px-6 py-4 font-medium text-right">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {userData?.latest_5_api_histories?.length > 0 ? (
                        userData.latest_5_api_histories.map((log, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-750 transition-colors"
                          >
                            <td
                              className="px-6 py-4 font-mono text-gray-300 truncate max-w-[200px]"
                              title={log.endpoint}
                            >
                              {log.endpoint.split("/mockapis")[1] ||
                                log.endpoint}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded text-[10px] font-bold tracking-wide border ${
                                  log.method === "GET"
                                    ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                                    : log.method === "POST"
                                    ? "border-green-500/30 text-green-400 bg-green-500/10"
                                    : "border-gray-500 text-gray-400"
                                }`}
                              >
                                {log.method}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    log.response_status >= 200 &&
                                    log.response_status < 300
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                ></span>
                                <span
                                  className={
                                    log.response_status >= 200 &&
                                    log.response_status < 300
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }
                                >
                                  {log.response_status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                              {log.latency === "NaN" ? "-" : `${log.latency}ms`}
                            </td>
                            <td className="px-6 py-4 text-right text-gray-500 text-xs">
                              {timeAgo(log.created_at)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            No history available yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-gray-700 bg-gray-900/30 text-center">
                  <p className="text-xs text-gray-500">
                    Showing last 5 requests. Logs are retained for 7 days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {testimonials.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-indigo-500">❤️</span> Community Feedback
              </h3>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 h-40 flex items-center justify-center">
                  {testimonials.map((test, index) => (
                    <div
                      key={test?.id || index}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col items-center justify-center text-center ${
                        index === currentTestimonialIndex
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-8"
                      }`}
                    >
                      <div className="text-indigo-400 text-4xl mb-2 opacity-50">
                        {test.user_name}
                      </div>
                      <p className="text-lg md:text-xl text-gray-200 italic font-medium max-w-3xl leading-relaxed">
                        {test.message}
                      </p>
                      <div className="mt-6 flex flex-col items-center">
                        <span className="text-white font-bold">
                          {test.name}
                        </span>
                        <span className="text-indigo-400 text-sm">
                          {test.category_name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-2 mt-4 relative z-10">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonialIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentTestimonialIndex
                          ? "bg-indigo-500 w-6"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default UserHomePage;
