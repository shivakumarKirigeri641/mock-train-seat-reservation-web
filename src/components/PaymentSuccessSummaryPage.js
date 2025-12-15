import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";

// --- NavItem Component Definition ---
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

const PaymentSuccessSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve user details from Redux
  const userdetails = useSelector((store) => store.loggedInUser);
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const paymentId = location.state.payment_id;

  useEffect(() => {
    if (!userdetails) {
      navigate("/");
      return;
    }

    const fetchPaymentDetails = async () => {
      setIsLoading(true);
      try {
        const result = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/mockapis/serverpeuser/loggedinuser/razorpay/status`,
          {},
          { withCredentials: true }
        );
        // --- API Call to fetch transaction details ---
        // Replace with actual endpoint: e.g., /api/payment/status/:id
        // const response = await axios.get(`${BASE_URL}/mockapis/payment/status/${paymentId}`, { withCredentials: true });

        // --- Mock Response ---
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockResponse = {
          success: true,
          data: {
            transaction_id: paymentId,
            amount: "1599.00",
            plan_name: "Wow Plan",
            credits_added: 10000,
            date: new Date().toISOString(),
            status: "Success",
          },
        };

        setOrderDetails(mockResponse.data);
      } catch (error) {
        console.error("Failed to fetch payment details", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();

    // Countdown Timer for Redirect
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect after 5 seconds
    const redirectTimeout = setTimeout(() => {
      navigate("/user-home");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [userdetails, navigate, BASE_URL, paymentId]);

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
              <NavItem to="/api-pricing" label="API Pricing" />
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
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-16 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-20 h-20 bg-gray-800 rounded-full"></div>
            <div className="h-6 w-48 bg-gray-800 rounded"></div>
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl w-full text-center animate-fade-in-up">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-400 mb-8">Thank you for your purchase.</p>

            {/* Order Details */}
            {orderDetails && (
              <div className="bg-gray-900/50 rounded-xl p-6 mb-8 text-left space-y-3 border border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Transaction ID</span>
                  <span className="text-white font-mono text-sm">
                    {orderDetails.transaction_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Plan Purchased</span>
                  <span className="text-indigo-400 font-medium">
                    {orderDetails.plan_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Credits Added</span>
                  <span className="text-green-400 font-bold">
                    +{orderDetails.credits_added}
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-gray-300 font-semibold">
                    Amount Paid
                  </span>
                  <span className="text-white font-bold text-lg">
                    ₹{orderDetails.amount}
                  </span>
                </div>
              </div>
            )}

            {/* Redirect Notice */}
            <p className="text-sm text-gray-500 mb-6">
              Redirecting you to home page in{" "}
              <span className="text-white font-bold">{countdown}</span>{" "}
              seconds...
            </p>

            <button
              onClick={() => navigate("/user-home")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Go to Dashboard Now
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PaymentSuccessSummaryPage;
