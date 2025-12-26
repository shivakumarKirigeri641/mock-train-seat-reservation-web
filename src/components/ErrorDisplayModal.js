import React, { useEffect, useState } from "react";

/**
 * Professional Error Display Modal/Popup
 * Shows error messages with appropriate styling and actions
 */
const ErrorDisplayModal = ({
  isOpen,
  message,
  errorType,
  statusCode,
  details,
  onClose,
  onRetry = null,
  showDetails = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!isOpen) return null;

  // Color mapping based on error type
  const getErrorStyling = () => {
    const baseStyles = {
      icon: "w-12 h-12",
      background: "bg-red-900/20",
      border: "border-red-500/50",
      headerColor: "text-red-400",
      buttonColor: "bg-red-600 hover:bg-red-500",
      badge: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    return baseStyles;
  };

  const styling = getErrorStyling();

  const getErrorIcon = () => {
    switch (errorType) {
      case "NETWORK_ERROR":
      case "TIMEOUT":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071l3.534-3.534a1 1 0 011.415 0l3.534 3.534m-9.172-2.121a6 6 0 018.486 0m12.53-12.53a9 9 0 010 12.73m0 0L21 21"
            />
          </svg>
        );
      case "UNAUTHORIZED":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        );
      case "RAZORPAY_ERROR":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M7 15h10m4 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        );
      case "SERVER_ERROR":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14M5 12a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v5a2 2 0 01-2 2M5 12a2 2 0 00-2 2v5a2 2 0 002 2h14a2 2 0 002-2v-5a2 2 0 00-2-2m-2-4h.01M17 16h.01"
            />
          </svg>
        );
      case "VALIDATION_ERROR":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4v2m0 4v2M7.457 20.748a9 9 0 1016.086-3.024"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6"
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
        );
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case "NETWORK_ERROR":
        return "Connection Error";
      case "TIMEOUT":
        return "Request Timeout";
      case "UNAUTHORIZED":
        return "Session Expired";
      case "RAZORPAY_ERROR":
        return "Payment Failed";
      case "SERVER_ERROR":
        return "Server Error";
      case "VALIDATION_ERROR":
        return "Invalid Input";
      default:
        return "Error Occurred";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div
        className={`${styling.background} border ${styling.border} rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all duration-300`}
      >
        {/* Error Icon */}
        <div
          className={`w-16 h-16 ${styling.background} ${styling.headerColor} rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20`}
        >
          {getErrorIcon()}
        </div>

        {/* Error Type Badge */}
        {errorType && (
          <div className="flex justify-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${styling.badge}`}
            >
              {errorType.replace(/_/g, " ")}
            </span>
          </div>
        )}

        {/* Error Title */}
        <h3
          className={`text-xl font-bold text-center mb-2 ${styling.headerColor}`}
        >
          {getErrorTitle()}
        </h3>

        {/* Status Code if available */}
        {statusCode && (
          <p className="text-center text-xs text-gray-500 mb-3">
            Status Code: {statusCode}
          </p>
        )}

        {/* Error Message */}
        <p className="text-gray-300 text-center mb-6 text-sm leading-relaxed">
          {message}
        </p>

        {/* Details Section */}
        {details && showDetails && (
          <div className="mb-6">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-2 mb-2"
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  expanded ? "rotate-180" : ""
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
              {expanded ? "Hide" : "Show"} Error Details
            </button>

            {expanded && (
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-xs text-gray-400 max-h-40 overflow-y-auto">
                <pre className="font-mono whitespace-pre-wrap break-words">
                  {typeof details === "string"
                    ? details
                    : JSON.stringify(details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-semibold transition-colors text-sm"
            >
              Retry
            </button>
          )}
          <button
            onClick={onClose}
            className={`${onRetry ? "flex-1" : "w-full"} ${
              styling.buttonColor
            } text-white py-2.5 rounded-xl font-semibold transition-colors text-sm`}
          >
            Close
          </button>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-gray-500 mt-4">
          If this problem persists, please contact support or try again later.
        </p>
      </div>
    </div>
  );
};

/**
 * Error Message Toast (for smaller, non-blocking errors)
 */
export const ErrorToast = ({ message, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-40">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-sm">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-80 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
};

export default ErrorDisplayModal;
