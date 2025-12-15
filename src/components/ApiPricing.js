import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { removeloggedInUser } from "../store/slices/loggedInUserSlice";
const ApiPricing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for plans data and loading
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // const BASE_URL = "https://serverpe.in";
  const BASE_URL = "http://localhost:8888"; // Local dev

  const userdetails = useSelector((store) => store.loggedInUser);

  useEffect(() => {
    if (!userdetails) {
      navigate("/user-login");
      return;
    }

    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        // Fetch plans from API
        // Ensure your backend has this endpoint or adjust accordingly
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/mockapis/serverpeuser/loggedinuser/api-plans-premium`,
          { withCredentials: true }
        );
        setPlans(response?.data?.data);
      } catch (error) {
        if (error.status !== 401) {
          alert("session expired. Please re-login!");
        }
        dispatch(removeloggedInUser());
        navigate("/user-login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [userdetails, navigate]);

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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* --- NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 transition-all">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/user-home")}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-xl">⚡</span>
              </div>
              <div className="font-bold text-xl tracking-tighter text-white">
                ServerPe<span className="text-indigo-500">.in</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              <NavItem to="/user-home" label="Home" />
              <NavItem to="/api-usage" label="API Usage" />
              <NavItem to="/api-documentation" label="API Documentation" />
              <NavItem to="/api-pricing" label="API Pricing" active="true" />
              <NavItem to="/wallet-recharge" label="Wallet & Recharge" />
              <NavItem to="/give-feedback" label="Give feedback" />
              <NavItem to="/profile" label="Profile" />
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
                className="block px-4 py-3 bg-gray-700 text-white rounded-lg"
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
                to="/profile"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Profile
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

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-indigo-400 font-semibold tracking-wider uppercase text-sm mb-3">
            Simple & Transparent
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose the right plan for <br /> your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Mock Data Needs
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Purchase API credits instantly. All plans come with unlimited
            validity—use your credits whenever you need them.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? // --- Loading Placeholders ---
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-2xl p-6 h-96 flex flex-col animate-pulse"
                >
                  <div className="h-6 w-1/2 bg-gray-700 rounded mb-4 mx-auto"></div>
                  <div className="h-10 w-2/3 bg-gray-700 rounded mb-6 mx-auto"></div>
                  <div className="h-px bg-gray-700 mb-6"></div>
                  <div className="space-y-4 flex-1">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                  </div>
                  <div className="h-12 bg-gray-700 rounded-xl mt-6"></div>
                </div>
              ))
            : // --- Actual Plans ---
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border ${
                    plan.color || "border-gray-600"
                  } ${
                    plan.bg || "bg-gray-800"
                  } p-6 flex flex-col shadow-xl hover:scale-105 transition-transform duration-300`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {plan.badge}
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {plan.price_name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-sm text-gray-400">₹</span>
                      <span className="text-4xl font-extrabold text-white">
                        {plan.price}
                      </span>
                      <span className="text-xs text-gray-500">/pack</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Inclusive of GST
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gray-700 mb-6"></div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-900/50 flex items-center justify-center border border-indigo-500/30">
                        <svg
                          className="w-3.5 h-3.5 text-indigo-400"
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
                      <span className="text-gray-300 text-sm">
                        <strong className="text-white">
                          {plan.api_calls_count}
                        </strong>{" "}
                        API Calls
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-900/50 flex items-center justify-center border border-indigo-500/30">
                        <svg
                          className="w-3.5 h-3.5 text-indigo-400"
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
                      </div>
                      <span className="text-gray-300 text-sm">
                        {!plan?.validity ? "Unlimited" : plan?.validity}
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-900/50 flex items-center justify-center border border-indigo-500/30">
                        <svg
                          className="w-3.5 h-3.5 text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-sm">
                        Rate Limit: {plan.rate_limit}/sec
                      </span>
                    </li>
                  </ul>

                  {/* Button */}
                  <button
                    onClick={() =>
                      navigate("/plan-summary", { state: { plan } })
                    }
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-lg shadow-indigo-500/25"
                  >
                    Buy Now
                  </button>
                </div>
              ))}
        </div>

        {/* Trust/Footer Note */}
        <div className="mt-16 text-center border-t border-gray-800 pt-8">
          <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-gray-300">
              Secure Payment via Razorpay / UPI
            </span>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            * Rate limits are applied per API key. Credits are deducted only on
            successful (2xx) responses.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ApiPricing;
