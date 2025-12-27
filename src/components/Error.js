import React from "react";
import { useNavigate, useRouteError } from "react-router";
import ServerPeLogo from "../images/ServerPe_Logo.jpg";
import "../styles/loginpage.css"; // Use same animations as LoginPage

/**
 * Global Error Boundary Page
 * Displayed when routing errors occur
 */
const Error = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const errorStatus = error?.status || 404;
  const errorMessage =
    error?.statusText || error?.message || "An unexpected error occurred";
  const errorDetails =
    error?.data || "The page you're looking for doesn't exist.";

  const getErrorContent = () => {
    switch (errorStatus) {
      case 404:
        return {
          title: "Page Not Found",
          description: "The page you're looking for doesn't exist.",
          icon: "🔍",
        };
      case 500:
        return {
          title: "Server Error",
          description:
            "Something went wrong on our end. Please try again later.",
          icon: "⚠️",
        };
      case 401:
        return {
          title: "Unauthorized",
          description: "You don't have permission to access this page.",
          icon: "🔐",
        };
      default:
        return {
          title: "Oops! Something Went Wrong",
          description: errorMessage || "An unexpected error occurred.",
          icon: "❌",
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100 flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-b from-gray-900/95 to-gray-900/80 backdrop-blur-md border-b border-gray-700/50 p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={ServerPeLogo} alt="ServerPe" className="h-10" />
          </button>
          <nav className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/user-login")}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="text-8xl mb-6 animate-bounce animate-fadeInDown">
            {content.icon}
          </div>

          {/* Error Status Code */}
          <div
            className="mb-4 animate-slideUp"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-mono font-bold">
              Error {errorStatus}
            </span>
          </div>

          {/* Error Title */}
          <h1
            className="text-4xl font-bold mb-3 text-white animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
            {content.title}
          </h1>

          {/* Error Description */}
          <p
            className="text-gray-400 text-lg mb-8 leading-relaxed animate-slideUp"
            style={{ animationDelay: "0.3s" }}
          >
            {content.description}
          </p>

          {/* Technical Details (if available) */}
          {errorDetails && typeof errorDetails === "string" && (
            <div
              className="mb-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg animate-slideUp"
              style={{ animationDelay: "0.4s" }}
            >
              <p className="text-xs text-gray-400 font-mono break-words text-left">
                {errorDetails}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div
            className="flex gap-4 justify-center animate-slideUp"
            style={{ animationDelay: "0.5s" }}
          >
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-indigo-500/20"
            >
              Go Home
            </button>
          </div>

          {/* Help Text */}
          <div
            className="mt-12 pt-8 border-t border-gray-700 animate-slideUp"
            style={{ animationDelay: "0.6s" }}
          >
            <p className="text-gray-500 text-sm mb-4">
              Need help? Contact our support team.
            </p>
            <a
              href="mailto:support@serverpe.in"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors"
            >
              support@serverpe.in
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900/80 to-gray-900/95 border-t border-gray-700/50 p-4 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto text-center text-xs text-gray-500">
          <p>&copy; 2025 ServerPe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Error;
