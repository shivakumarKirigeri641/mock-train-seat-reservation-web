import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import loadRazorpay from "../utils/loadRazorPay";
import { removeloggedInUser } from "../store/slices/loggedInUserSlice";

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

// --- Error Modal Component (For Payment Errors) ---
const ErrorModal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-gray-800 border border-red-500/50 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all scale-100">
      <div className="w-16 h-16 bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white text-center mb-2">
        Payment Failed
      </h3>
      <p className="text-gray-400 text-center mb-6 text-sm">{message}</p>
      <button
        onClick={onClose}
        className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-semibold transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const SummaryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Payment Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null); // For Payment Error Popup

  // Page Data Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState(null); // For Full Page Load Error

  const userdetails = useSelector((store) => store.loggedInUser);
  const selectedPlan = location.state?.plan;
  const [indianStates, setIndianStates] = useState([]);
  const [billingAddress, setProfile] = useState({});

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8888";

  // --- REFACTORED: Fetch Logic wrapped in useCallback ---
  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    setPageError(null);

    try {
      // Fetch Profile and States in parallel
      const [profileResponse, statesResponse] = await Promise.all([
        axios.get(
          `${BASE_URL}/mockapis/serverpeuser/loggedinuser/user-profile`,
          { withCredentials: true }
        ),
        axios.get(`${BASE_URL}/mockapis/serverpeuser/states`, {
          withCredentials: true,
        }),
      ]);

      setProfile(profileResponse?.data?.data || {});
      setIndianStates(statesResponse?.data?.data || []);
    } catch (error) {
      console.error("Summary Page Fetch Error:", error);

      if (error.response && error.response.status === 401) {
        dispatch(removeloggedInUser());
        navigate("/user-login");
      } else if (error.code === "ERR_NETWORK") {
        setPageError(
          "Network Error: Unable to load billing details. Please check your connection."
        );
      } else {
        setPageError("Failed to load user profile. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL, dispatch, navigate]);

  useEffect(() => {
    if (!userdetails) {
      navigate("/");
      return;
    }
    fetchProfileData();
  }, [userdetails, navigate, fetchProfileData]);

  const handlePayment = async () => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = await loadRazorpay();
      if (!res) {
        setErrorMsg(
          "Razorpay SDK failed to load. Check your internet connection."
        );
        setIsProcessing(false);
        return;
      }

      // 1️⃣ Create order
      const orderRes = await axios.post(
        `${BASE_URL}/mockapis/serverpeuser/loggedinuser/razorpay/order`,
        { amount: selectedPlan.price },
        { withCredentials: true }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "ServerPe",
        description: "Mock API Subscription",
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            // 2️⃣ Verify payment
            const verifyRes = await axios.post(
              `${BASE_URL}/mockapis/serverpeuser/loggedinuser/razorpay/verify`,
              response,
              { withCredentials: true }
            );

            if (verifyRes?.data?.statuscode) {
              navigate(
                `/payment-success?payment_id=${response.razorpay_payment_id}`
              );
            } else {
              setErrorMsg(
                "Payment verification failed. Any amount deducted will be credited to you!"
              );
            }
          } catch (err) {
            console.error("Verification Error", err);
            setErrorMsg("An error occurred while verifying the payment.");
          }
        },
        prefill: {
          name: billingAddress.user_name || "User",
          email: billingAddress.myemail || "user@email.com",
          contact: billingAddress.mobile_number || "9999999999",
        },
        theme: { color: "#0f172a" },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation failed", error);
      setErrorMsg("Failed to initiate payment. Please try again later.");
      setIsProcessing(false);
    }
  };

  // ---------------- LOADING STATE (Full Page) ----------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center shadow-lg border border-gray-700">
            <span className="text-3xl">⚡</span>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-white">
              Preparing Summary
            </h3>
            <p className="text-sm text-gray-400 font-mono">
              Loading billing details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ERROR STATE (Full Page) ----------------
  if (pageError) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-6">
        <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl text-center">
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
          <p className="text-gray-400 mb-8">{pageError}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchProfileData}
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
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Payment Error Modal (Popup) */}
      {errorMsg && (
        <ErrorModal message={errorMsg} onClose={() => setErrorMsg(null)} />
      )}

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
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Order Summary</h1>
          <p className="text-gray-400 mt-2">
            Review your plan details before proceeding to payment.
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
          {/* Plan Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
              Selected Plan
            </h2>
            {selectedPlan ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-lg font-medium">
                    {selectedPlan.price_name}
                  </span>
                  <span className="text-white text-xl font-bold">
                    ₹{selectedPlan.price}
                  </span>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>
                    API Calls:{" "}
                    <span className="text-indigo-400 font-medium">
                      {selectedPlan.api_calls_count}
                    </span>
                  </p>
                  <p>
                    Validity:{" "}
                    {selectedPlan.validity
                      ? selectedPlan.validity
                      : "Unlimited"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-red-400">No plan selected. Please go back.</p>
            )}
          </div>

          {/* Billing Address */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
              <h2 className="text-lg font-semibold text-white">
                Billing Details
              </h2>
              <Link
                to="/profile"
                className="text-indigo-400 text-xs hover:underline"
              >
                Edit
              </Link>
            </div>

            <div className="text-sm text-gray-300 space-y-2">
              <p>
                <strong className="text-gray-500 block text-xs uppercase tracking-wide mb-1">
                  Name
                </strong>{" "}
                {billingAddress.user_name}
              </p>
              <p>
                <strong className="text-gray-500 block text-xs uppercase tracking-wide mb-1">
                  Email
                </strong>{" "}
                {billingAddress.myemail
                  ? billingAddress.myemail
                  : "Not provided"}
              </p>
              <p>
                <strong className="text-gray-500 block text-xs uppercase tracking-wide mb-1">
                  Address
                </strong>{" "}
                {billingAddress.address || "Not provided"}
              </p>
              <p>
                <strong className="text-gray-500 block text-xs uppercase tracking-wide mb-1">
                  Mobile
                </strong>{" "}
                {billingAddress.mobile_number
                  ? `+91 ${billingAddress.mobile_number}`
                  : "Not provided"}
              </p>
            </div>
          </div>

          {/* Total & Action */}
          <div className="pt-6 border-t border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-white">Total Amount</span>
              <span className="text-2xl font-extrabold text-green-400">
                ₹{selectedPlan ? selectedPlan.price : "0"}
              </span>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing || !selectedPlan}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
            >
              {isProcessing ? (
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
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              By clicking "Pay Now", you agree to our Terms & Conditions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SummaryPage;
