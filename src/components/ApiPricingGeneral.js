import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const ApiPricingGeneral = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ---------------- PLANS DATA ----------------
  const plans = [
    {
      id: "tiny",
      name: "Tiny",
      price: 19,
      calls: 100,
      rateLimit: 3,
      validity: "Unlimited",
      color: "border-gray-600",
      bg: "bg-gray-800",
      badge: null,
    },
    {
      id: "chotu",
      name: "Chotu",
      price: 79,
      calls: 500,
      rateLimit: 3,
      validity: "Unlimited",
      color: "border-blue-500/50",
      bg: "bg-gray-800",
      badge: "Popular",
    },
    {
      id: "okok",
      name: "Okok",
      price: 179,
      calls: 1200,
      rateLimit: 3,
      validity: "Unlimited",
      color: "border-indigo-500/50",
      bg: "bg-gray-800",
      badge: "Best Value",
    },
    {
      id: "wow",
      name: "Wow",
      price: 1599,
      calls: 10000,
      rateLimit: 3,
      validity: "Unlimited",
      color: "border-purple-500/50",
      bg: "bg-gradient-to-br from-gray-800 to-purple-900/20",
      badge: "Premium",
    },
  ];

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
              <a
                href="/"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                Home
              </a>
              <a
                href="/general-api-pricing"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                API Pricing
              </a>
              <button
                onClick={() => {
                  navigate("/general-api-documentation");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                API Documentation
              </button>
              <a
                href="/about-me"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                About Me
              </a>
              <a
                href="/contact-me"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                Contact Me
              </a>
              <div className="pt-2 border-t border-gray-700">
                <button
                  onClick={() => {
                    navigate("/user-login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-4 py-2 text-indigo-400 font-semibold hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Start using mock APIs
                </button>
              </div>
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
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border ${plan.color} ${plan.bg} p-6 flex flex-col shadow-xl hover:scale-105 transition-transform duration-300`}
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
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-sm text-gray-400">₹</span>
                  <span className="text-4xl font-extrabold text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs text-gray-500">/pack</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Inclusive of GST</p>
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
                    <strong className="text-white">{plan.calls}</strong> API
                    Calls
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
                    {plan.validity} Validity
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
                    Rate Limit: {plan.rateLimit}/sec
                  </span>
                </li>
              </ul>

              {/* Button */}
              <button
                onClick={() => navigate("/user-login")}
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

export default ApiPricingGeneral;
