import React, { useState, useEffect } from "react";
import { healthCheckService } from "../utils/healthCheckService";
import { Helmet } from "react-helmet";
/**
 * Connection Status Indicator
 * Shows backend connectivity status at the top of the page
 */
const ConnectionStatusIndicator = () => {
  const [status, setStatus] = useState({
    isHealthy: true,
    lastCheckTime: null,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Subscribe to health check updates
    const unsubscribe = healthCheckService.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    return () => unsubscribe();
  }, []);

  if (status.isHealthy) {
    // Don't show indicator when connection is healthy
    return null;
  }

  const lastCheckDisplay = status.lastCheckTime
    ? new Date(status.lastCheckTime).toLocaleTimeString()
    : "Never";

  return (
    <>
      <Helmet>
        <title>ServerPe™ – Desi Mock APIs for Frontend & UI Development</title>
        <meta
          name="description"
          content="ServerPe provides desi mock APIs for frontend developers to build and test UI without real backend dependencies."
        />
      </Helmet>
      <div className="fixed top-0 left-0 right-0 z-40">
        {/* Status Banner */}
        <div className="bg-yellow-900/80 backdrop-blur-sm border-b border-yellow-700 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Status Info */}
            <div className="flex items-center gap-3 flex-1">
              {/* Animated Pulse Indicator */}
              <div className="relative w-2.5 h-2.5">
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
              </div>

              {/* Message */}
              <div className="flex-1">
                <p className="text-yellow-100 text-sm font-medium">
                  Connection Status: Connecting...
                </p>
                <p className="text-yellow-200 text-xs mt-0.5">
                  Last check: {lastCheckDisplay}
                </p>
              </div>
            </div>

            {/* Expand Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-yellow-100 hover:text-yellow-50 transition-colors p-2"
              title="Show more details"
            >
              <svg
                className={`w-5 h-5 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="bg-yellow-950 border-b border-yellow-700 px-4 py-4">
            <div className="max-w-7xl mx-auto">
              <h4 className="text-yellow-100 text-sm font-semibold mb-3">
                Connection Status Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-yellow-200">
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                    Attempting to connect...
                  </span>
                </div>

                {/* Last Check Time */}
                <div className="flex items-center gap-2">
                  <span className="font-medium">Last Check:</span>
                  <span>{lastCheckDisplay}</span>
                </div>

                {/* Troubleshooting Tips */}
                <div className="md:col-span-2">
                  <p className="font-medium mb-2">Troubleshooting Tips:</p>
                  <ul className="list-disc list-inside space-y-1 text-yellow-100">
                    <li>Check your internet connection</li>
                    <li>Verify that the backend server is running</li>
                    <li>Try refreshing the page</li>
                    <li>If the issue persists, contact support</li>
                  </ul>
                </div>
              </div>

              {/* Retry Button */}
              <button
                onClick={() => healthCheckService.forceCheck()}
                className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Try Connecting Now
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConnectionStatusIndicator;
