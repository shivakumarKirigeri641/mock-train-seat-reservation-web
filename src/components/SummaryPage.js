import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
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

const SummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Retrieve user details from Redux
  const userdetails = useSelector((store) => store.loggedInUser);

  // Retrieve selected plan from navigation state or fallback
  // In a real app, you might pass the selected plan ID via route params or state
  const selectedPlan = location.state?.plan || {
    id: "wow",
    name: "Wow Plan",
    price: 1599,
    calls: 10000,
    validity: "Unlimited",
  };

  // Mock billing address (fetch from profile or redux in a real scenario)
  const [billingAddress, setBillingAddress] = useState({
    name: userdetails?.name || "Shiva",
    email: userdetails?.email || "shiva@example.com",
    address: "123, Tech Park, Bengaluru, Karnataka - 560001",
    mobile: userdetails?.mobile || "9876543210",
  });

  // Use environment variable or default
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8888";

  useEffect(() => {
    if (!userdetails) {
      navigate("/");
    }
    // Optionally fetch latest address here if needed
  }, [userdetails, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create Order on Backend (Placeholder)
      // const orderResponse = await axios.post(`${BASE_URL}/api/payment/create-order`, {
      //   planId: selectedPlan.id,
      //   amount: selectedPlan.price
      // }, { withCredentials: true });

      // 2. Initialize Razorpay (Placeholder logic)
      // const options = {
      //   key: "YOUR_RAZORPAY_KEY",
      //   amount: orderResponse.data.amount,
      //   currency: "INR",
      //   name: "ServerPe.in",
      //   description: `Purchase ${selectedPlan.name}`,
      //   order_id: orderResponse.data.id,
      //   handler: async function (response) {
      //      // Verify payment on backend
      //      alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
      //      navigate("/wallet-recharge");
      //   },
      //   prefill: {
      //     name: billingAddress.name,
      //     email: billingAddress.email,
      //     contact: billingAddress.mobile,
      //   },
      // };
      // const rzp1 = new window.Razorpay(options);
      // rzp1.open();

      // --- Simulation for Demo ---
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(`Redirecting to Payment Gateway for ₹${selectedPlan.price}...`);
      // After payment success in simulation:
      navigate("/wallet-recharge"); // Redirect to wallet or success page
    } catch (error) {
      console.error("Payment initiation failed", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

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
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 text-lg font-medium">
                {selectedPlan.name}
              </span>
              <span className="text-white text-xl font-bold">
                ₹{selectedPlan.price}
              </span>
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <p>
                API Calls:{" "}
                <span className="text-indigo-400 font-medium">
                  {selectedPlan.calls}
                </span>
              </p>
              <p>Validity: {selectedPlan.validity}</p>
            </div>
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
                {billingAddress.name}
              </p>
              <p>
                <strong className="text-gray-500 block text-xs uppercase tracking-wide mb-1">
                  Email
                </strong>{" "}
                {billingAddress.email}
              </p>
              <p>
                <strong className="text-gray-500 block text-xs uppercase tracking-wide mb-1">
                  Address
                </strong>{" "}
                {billingAddress.address}
              </p>
              <p>
                <strong className="text-gray-500 block text-xs uppercase tracking-wide mb-1">
                  Mobile
                </strong>{" "}
                {billingAddress.mobile}
              </p>
            </div>
          </div>

          {/* Total & Action */}
          <div className="pt-6 border-t border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-white">Total Amount</span>
              <span className="text-2xl font-extrabold text-green-400">
                ₹{selectedPlan.price}
              </span>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
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
