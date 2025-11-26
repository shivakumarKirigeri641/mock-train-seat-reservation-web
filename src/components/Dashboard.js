// src/pages/Dashboard.js
import React from "react";

const Dashboard = () => {
  return (
    <div className="text-gray-200">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg">
          <p className="text-xs text-gray-400 uppercase">Total Bookings</p>
          <h3 className="text-2xl font-bold mt-1">0</h3>
        </div>

        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg">
          <p className="text-xs text-gray-400 uppercase">Wallet Balance</p>
          <h3 className="text-2xl font-bold mt-1">₹15,000</h3>
        </div>

        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg">
          <p className="text-xs text-gray-400 uppercase">System Status</p>
          <h3 className="text-green-400 font-bold mt-1">Operational</h3>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Recent Bookings</h3>
          <p className="text-sm text-gray-400">0 records</p>
        </div>

        {/* No bookings placeholder */}
        <div className="p-6 flex flex-col items-center justify-center py-12 text-center">
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
          <h4 className="text-lg font-medium">No bookings found</h4>
          <p className="text-gray-400 max-w-sm mt-2 mb-6">
            You haven't made any mock bookings yet.
          </p>
        </div>
      </div>

      {/* Right column info (same as your earlier page) */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-5">
            <h4 className="font-bold text-indigo-300 mb-3 flex items-center gap-2">
              Dev Note
            </h4>
            <p className="text-sm text-indigo-200/80">
              Mock PNRs expire automatically in 24 hours.
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
            <h4 className="font-bold text-white mb-4">Travel Advisory</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="text-sm text-gray-400">
                  Fog alert in North India, expect 2–3 hour delays.
                </div>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="text-sm text-gray-400">
                  Scheduled maintenance: 2AM–4AM tonight.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
