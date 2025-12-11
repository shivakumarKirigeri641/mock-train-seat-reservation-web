import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const ApiUsage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterEndpoint, setFilterEndpoint] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Mock Data: Daily Stats for the Chart
  const dailyStats = [
    { day: "Mon", calls: 450, error: 2 },
    { day: "Tue", calls: 520, error: 5 },
    { day: "Wed", calls: 380, error: 0 },
    { day: "Thu", calls: 600, error: 8 },
    { day: "Fri", calls: 850, error: 12 },
    { day: "Sat", calls: 200, error: 0 },
    { day: "Sun", calls: 150, error: 0 },
  ];

  // Mock Data: Detailed Logs
  const allLogs = [
    {
      id: 1,
      method: "POST",
      endpoint: "/api/v1/booking/create",
      status: 201,
      latency: "420ms",
      time: "2025-10-25 10:30:01",
      ip: "192.168.1.45",
    },
    {
      id: 2,
      method: "GET",
      endpoint: "/api/v1/trains/search",
      status: 200,
      latency: "120ms",
      time: "2025-10-25 10:28:15",
      ip: "192.168.1.45",
    },
    {
      id: 3,
      method: "GET",
      endpoint: "/api/v1/cars/specs",
      status: 401,
      latency: "45ms",
      time: "2025-10-25 09:15:00",
      ip: "10.0.0.12",
    },
    {
      id: 4,
      method: "GET",
      endpoint: "/api/v1/pincode/560001",
      status: 200,
      latency: "85ms",
      time: "2025-10-25 09:10:22",
      ip: "192.168.1.45",
    },
    {
      id: 5,
      method: "POST",
      endpoint: "/api/v1/booking/cancel",
      status: 500,
      latency: "800ms",
      time: "2025-10-24 23:45:11",
      ip: "172.16.0.5",
    },
    {
      id: 6,
      method: "GET",
      endpoint: "/api/v1/bikes/info",
      status: 200,
      latency: "110ms",
      time: "2025-10-24 18:30:00",
      ip: "192.168.1.45",
    },
    {
      id: 7,
      method: "GET",
      endpoint: "/api/v1/trains/pnr",
      status: 200,
      latency: "150ms",
      time: "2025-10-24 15:20:10",
      ip: "10.0.0.12",
    },
    {
      id: 8,
      method: "GET",
      endpoint: "/api/v1/cars/specs",
      status: 429,
      latency: "10ms",
      time: "2025-10-24 12:00:00",
      ip: "192.168.1.45",
    },
  ];

  // Filter Logic
  const filteredLogs = allLogs.filter((log) => {
    const matchesEndpoint =
      filterEndpoint === "All" || log.endpoint.includes(filterEndpoint);
    const matchesStatus =
      filterStatus === "All"
        ? true
        : filterStatus === "Success"
        ? log.status < 400
        : log.status >= 400;
    return matchesEndpoint && matchesStatus;
  });

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
      {/* --- TOP NAVIGATION BAR (Matching UserHomePage) --- */}
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
              <NavItem to="/user-home" label="Home" />
              <NavItem to="/api-usage" label="API Usage" active={true} />
              <NavItem to="/api-documentation" label="API Documentation" />
              <NavItem to="/pricing" label="API Pricing" />
              <NavItem to="/wallet" label="Wallet & Recharge" />
              <NavItem to="/profile" label="Profile" />
            </div>

            {/* Logout */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() => navigate("/login")}
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
                to="/usage"
                className="block px-4 py-3 bg-gray-700 text-white rounded-lg"
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
                to="/pricing"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                API Pricing
              </Link>
              <Link
                to="/wallet"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Wallet & Recharge
              </Link>
              <Link
                to="/profile"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Profile
              </Link>
              <Link
                to="/login"
                className="block px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg"
              >
                Logout
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Usage Analytics</h1>

        {/* 1. Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-lg">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Requests (7 Days)
            </p>
            <h3 className="text-3xl font-bold text-white mt-2">3,150</h3>
            <span className="text-xs text-green-400 flex items-center gap-1 mt-1">
              ↑ 12% vs last week
            </span>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-lg">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Avg. Latency
            </p>
            <h3 className="text-3xl font-bold text-indigo-400 mt-2">185ms</h3>
            <span className="text-xs text-gray-500 mt-1">Global average</span>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-lg">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Success Rate
            </p>
            <h3 className="text-3xl font-bold text-emerald-400 mt-2">99.2%</h3>
            <span className="text-xs text-gray-500 mt-1">Status 2xx</span>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-lg">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Errors
            </p>
            <h3 className="text-3xl font-bold text-red-400 mt-2">27</h3>
            <span className="text-xs text-gray-500 mt-1">Status 4xx & 5xx</span>
          </div>
        </div>

        {/* 2. Usage Graph (CSS Bar Chart) */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-10 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">
            Traffic Overview
          </h3>
          <div className="flex items-end justify-between h-48 gap-2 sm:gap-4">
            {dailyStats.map((item, index) => {
              // Calculate height percentage relative to max value (e.g. 850)
              const height = (item.calls / 1000) * 100;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center w-full group relative"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-10 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700 z-10">
                    {item.calls} reqs
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full max-w-[40px] bg-gray-700 rounded-t-lg relative overflow-hidden transition-all hover:bg-gray-600"
                    style={{ height: `${height}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 w-full bg-indigo-600/80 transition-all hover:bg-indigo-500"
                      style={{ height: "100%" }}
                    ></div>
                  </div>

                  {/* Label */}
                  <span className="text-xs text-gray-400 mt-3 font-medium">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Detailed Logs & Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
          {/* Header & Filters */}
          <div className="p-6 border-b border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white">Request Logs</h3>
            <div className="flex flex-wrap gap-3">
              <select
                className="bg-gray-900 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                value={filterEndpoint}
                onChange={(e) => setFilterEndpoint(e.target.value)}
              >
                <option value="All">All Endpoints</option>
                <option value="trains">Trains</option>
                <option value="cars">Cars</option>
                <option value="bikes">Bikes</option>
                <option value="booking">Booking</option>
              </select>

              <select
                className="bg-gray-900 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Success">Success (2xx)</option>
                <option value="Error">Errors (4xx/5xx)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Endpoint</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Latency</th>
                  <th className="px-6 py-4">Client IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                        {log.time}
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
                      <td className="px-6 py-4 font-medium text-white">
                        {log.endpoint}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.status >= 200 && log.status < 300
                              ? "bg-green-900/30 text-green-400"
                              : log.status >= 400 && log.status < 500
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-red-900/30 text-red-400"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {log.latency}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{log.ip}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No logs found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="bg-gray-900/30 px-6 py-4 border-t border-gray-700 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing {filteredLogs.length} results
            </span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-xs text-gray-300 transition-colors disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-xs text-gray-300 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApiUsage;
