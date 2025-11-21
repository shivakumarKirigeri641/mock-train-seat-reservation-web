import React from "react";
import { Link } from "react-router";

const UserHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          {/* Optional Home Icon (user can hide) */}
          <svg
            className="w-8 h-8 text-blue-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-4H10v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" />
          </svg>

          <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
        </div>

        <Link
          to="/login"
          className="text-red-600 font-semibold hover:underline"
        >
          Logout
        </Link>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Book Ticket */}
        <Link
          to="/book"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 7h18v10H3z" />
              <path d="M7 7v10M17 7v10" />
            </svg>
            <h2 className="text-xl font-semibold">Book Ticket</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Start booking your mock train ticket.
          </p>
        </Link>

        {/* Booking History */}
        <Link
          to="/history"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <h2 className="text-xl font-semibold">Booking History</h2>
          </div>
          <p className="text-gray-600 text-sm">View all your mock bookings.</p>
        </Link>

        {/* PNR Status */}
        <Link
          to="/pnr-status"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M16 16l4 4" />
            </svg>
            <h2 className="text-xl font-semibold">PNR Status</h2>
          </div>
          <p className="text-gray-600 text-sm">Check your mock PNR status.</p>
        </Link>

        {/* Cancel Ticket */}
        <Link
          to="/cancel"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
            <h2 className="text-xl font-semibold">Cancel Ticket</h2>
          </div>
          <p className="text-gray-600 text-sm">Cancel mock tickets anytime.</p>
        </Link>

        {/* Profile */}
        <Link
          to="/profile"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>
          <p className="text-gray-600 text-sm">Update your user details.</p>
        </Link>

        {/* Logout Duplicate (Hidden on large) */}
        <Link
          to="/login"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 sm:hidden"
        >
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 3h4v18h-4" />
              <path d="M10 17l-5-5 5-5" />
              <path d="M5 12h14" />
            </svg>
            <h2 className="text-xl font-semibold">Logout</h2>
          </div>
          <p className="text-gray-600 text-sm">Exit your account.</p>
        </Link>
      </div>
    </div>
  );
};

export default UserHomePage;
