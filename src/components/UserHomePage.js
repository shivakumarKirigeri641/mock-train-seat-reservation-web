import React, { useState } from "react";
import { Link, useLocation } from "react-router";

const UserHomePage = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data state - currently empty to show the "No bookings" state as requested
  // Add items to this array to test the populated table view
  const [bookings, setBookings] = useState([]);
  // const [bookings, setBookings] = useState([
  //   { pnr: "82039482", train: "Karnataka Exp", date: "2025-03-10", status: "CNF", class: "3A" }
  // ]);

  const SidebarItem = ({ to, icon, label, active }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active
          ? "bg-indigo-600/10 text-indigo-400 shadow-sm border-l-2 border-indigo-500"
          : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
      }`}
    >
      <div
        className={`${
          active ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300"
        }`}
      >
        {icon}
      </div>
      <span className="font-medium text-sm tracking-wide">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex font-sans text-gray-100 selection:bg-indigo-500 selection:text-white">
      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-gray-800 z-50 flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="font-bold text-xl text-white tracking-tight">
          DevRail
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-gray-700">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
              <svg
                className="w-5 h-5 text-white"
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
            <span className="text-lg font-bold tracking-wide text-white">
              DevRail
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
              Menu
            </div>

            <SidebarItem
              to="/user-home"
              active={true} // This page is the Dashboard
              label="Dashboard"
              icon={
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              }
            />
            <SidebarItem
              to="/book-ticket"
              active={false}
              label="Book Ticket"
              icon={
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
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              }
            />
            <SidebarItem
              to="/history"
              active={false}
              label="Booking History"
              icon={
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <SidebarItem
              to="/pnr-status"
              active={false}
              label="PNR Status"
              icon={
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
            <SidebarItem
              to="/cancel"
              active={false}
              label="Cancellations"
              icon={
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
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />

            <div className="mt-8 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
              Settings
            </div>

            <SidebarItem
              to="/profile"
              active={false}
              label="Profile"
              icon={
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-gray-700">
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="font-medium text-sm">Sign Out</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-8">
          <h2 className="text-xl font-bold text-white">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-white">
                John Developer
              </div>
              <div className="text-xs text-gray-500">Enterprise Plan</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-700 border-2 border-gray-600"></div>
          </div>
        </header>

        {/* Dashboard Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Quick Stats Row (Useful Information) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">
                    Total Bookings
                  </p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {bookings.length}
                  </h3>
                </div>
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">
                    Wallet Balance
                  </p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    ₹15,000
                  </h3>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">
                    System Status
                  </p>
                  <h3 className="text-xl font-bold text-green-400 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Operational
                  </h3>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Area - Booked History */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: History / Empty State */}
            <div className="flex-1 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  Recent Bookings
                </h3>
                <Link
                  to="/history"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  View All
                </Link>
              </div>

              <div className="p-6">
                {bookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                      <thead className="text-xs text-gray-500 uppercase bg-gray-900/50">
                        <tr>
                          <th className="px-4 py-3 rounded-l-lg">PNR</th>
                          <th className="px-4 py-3">Train</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Class</th>
                          <th className="px-4 py-3 rounded-r-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-700 hover:bg-gray-750"
                          >
                            <td className="px-4 py-3 font-medium text-white">
                              {b.pnr}
                            </td>
                            <td className="px-4 py-3">{b.train}</td>
                            <td className="px-4 py-3">{b.date}</td>
                            <td className="px-4 py-3">{b.class}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold ${
                                  b.status === "CNF"
                                    ? "bg-green-900/30 text-green-400"
                                    : "bg-yellow-900/30 text-yellow-400"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* No Bookings Found State */
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-12 h-12 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-white">
                      No bookings found
                    </h4>
                    <p className="text-gray-400 max-w-sm mt-2 mb-6">
                      You haven't made any mock bookings yet. Start a new
                      session to test the booking flow.
                    </p>
                    <Link
                      to="/book-ticket"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
                    >
                      Book New Ticket
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Useful Information / Updates */}
            <div className="w-full lg:w-80 flex flex-col gap-6">
              <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-5">
                <h4 className="font-bold text-indigo-300 mb-3 flex items-center gap-2">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Dev Note
                </h4>
                <p className="text-sm text-indigo-200/80 leading-relaxed">
                  Mock PNRs generated today will automatically expire in 24
                  hours. Ensure all test cases are logged before expiry.
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 shadow-lg">
                <h4 className="font-bold text-white mb-4">Travel Advisory</h4>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"></div>
                    <div className="text-sm text-gray-400">
                      <span className="text-gray-200 font-medium block">
                        Fog Alert in North India
                      </span>
                      Expect delays of 2-3 hours for trains departing from NDLS.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <div className="text-sm text-gray-400">
                      <span className="text-gray-200 font-medium block">
                        System Maintenance
                      </span>
                      Scheduled downtime for Mock API: 02:00 AM - 04:00 AM.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserHomePage;
