// src/components/Footer.js
import React from "react";
import { useNavigate } from "react-router";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/terms-and-conditions")}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => navigate("/privacy-policy")}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Privacy Policy
          </button>
          <a className="cursor-default">© 2025 YourApp</a>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Built with care • Enterprise Professional
        </div>
      </div>
    </footer>
  );
}
