// src/pages/Dashboard.js
import React from "react";

const Dashboard = () => {
  return (
    <div className="text-gray-900 dark:text-gray-100">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn">
        {/* Total Bookings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
            Total Bookings
          </p>
          <h3 className="text-3xl font-bold mt-2">0</h3>
        </div>

        {/* Recent Bookings Count */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
            Recent Bookings
          </p>
          <h3 className="text-3xl font-bold mt-2">0</h3>
        </div>

        {/* Today Count */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
            Booking Count (Today)
          </p>
          <h3 className="text-3xl font-bold mt-2">0</h3>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Recent Bookings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">0 records</p>
        </div>

        {/* Empty State */}
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 animate-pop">
            <svg
              className="w-10 h-10 text-gray-400 dark:text-gray-500"
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
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2">
            You haven't made any bookings yet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
