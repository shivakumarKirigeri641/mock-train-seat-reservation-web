import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const UserHomePage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for Credentials
  const [showSecret, setShowSecret] = useState(false);
  const [copiedField, setCopiedField] = useState(null); // 'api' or 'secret'

  // Mock Credentials
  const apiKey = "srv_live_89234789234_xk9s";
  const secretKey = "sk_live_998877_secure_hash_x9s88d";

  // Mock API History Data
  const [apiHistory] = useState([
    {
      id: 1,
      endpoint: "/api/v1/trains/search",
      method: "GET",
      status: 200,
      latency: "120ms",
      time: "2 mins ago",
    },
    {
      id: 2,
      endpoint: "/api/v1/booking/create",
      method: "POST",
      status: 201,
      latency: "450ms",
      time: "15 mins ago",
    },
    {
      id: 3,
      endpoint: "/api/v1/pincode/560001",
      method: "GET",
      status: 200,
      latency: "90ms",
      time: "1 hour ago",
    },
    {
      id: 4,
      endpoint: "/api/v1/cars/specs",
      method: "GET",
      status: 401,
      latency: "45ms",
      time: "3 hours ago",
    },
    {
      id: 5,
      endpoint: "/api/v1/bikes/info",
      method: "GET",
      status: 200,
      latency: "110ms",
      time: "5 hours ago",
    },
  ]);

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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 transition-all">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/user-home")}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-lg">⚡</span>
              </div>
              <div className="font-bold text-xl tracking-tighter text-white">
                ServerPe<span className="text-indigo-500">.in</span>
              </div>
            </div>

            {/* Desktop Static Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              <NavItem to="/user-home" label="Home" active={true} />
              <NavItem to="/api-usage" label="API Usage" />
              <NavItem to="/api-documentation" label="API Documentation" />
              <NavItem to="/api-pricing" label="API Pricing" />
              <NavItem to="/wallet-recharge" label="Wallet & Recharge" />
              <NavItem to="/give-feedback" label="Give feedback" />
              <NavItem to="/profile" label="Profile" />
            </div>

            {/* Logout Button */}
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
              <Link
                to="/profile"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Profile
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
              Enterprise v2.0
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Credentials & Wallet Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* API Credentials Card */}
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

              {/* Public Key */}
              <div className="mb-5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Client ID / API Key
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg p-3 pr-10 focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                  <button
                    onClick={() => handleCopy(apiKey, "api")}
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

              {/* Secret Key */}
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Client Secret
                </label>
                <div className="relative group">
                  <input
                    type={showSecret ? "text" : "password"}
                    readOnly
                    value={secretKey}
                    className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg p-3 pr-20 focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="p-1 text-gray-500 hover:text-white transition-colors"
                      title={showSecret ? "Hide" : "Show"}
                    >
                      {showSecret ? (
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
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleCopy(secretKey, "secret")}
                      className="p-1 text-gray-500 hover:text-white transition-colors"
                      title="Copy Secret"
                    >
                      {copiedField === "secret" ? (
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
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-xs text-red-400 flex items-center gap-1">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Keep your Client Secret confidential.
                </p>
              </div>
            </div>

            {/* Mini Wallet Summary */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl flex items-center justify-between hover:border-gray-500 transition-all cursor-pointer transform hover:-translate-y-1">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Wallet Balance
                </p>
                <h3 className="text-2xl font-bold text-white mt-1">₹ 15,000</h3>
              </div>
              <button
                onClick={() => navigate("/wallet-recharge")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-lg shadow-indigo-500/20"
              >
                Recharge
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Recent API History */}
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
                      <th className="px-6 py-4 font-medium text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {apiHistory.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-750 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-gray-300">
                          {log.endpoint}
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
                                log.status >= 200 && log.status < 300
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                            <span
                              className={
                                log.status >= 200 && log.status < 300
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              {log.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                          {log.latency}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-500 text-xs">
                          {log.time}
                        </td>
                      </tr>
                    ))}
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
      </main>
    </div>
  );
};

export default UserHomePage;
