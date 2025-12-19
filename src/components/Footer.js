import React from "react";
import ServerPeLogo from "../images/ServerPe_Logo.jpg";
import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Helper to open policies in a new tab (consistent with the 'Close Tab' button in those pages)
  const openPolicy = (path) => {
    window.open(path, "_blank");
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            {/* Logo Section */}
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/user-home")}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-xl">⚡</span>
              </div>
              <div className="font-bold text-xl tracking-tighter text-white">
                ServerPe<span className="text-indigo-500">.in</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              Comprehensive mock APIs for developers. Simulate real-world
              scenarios, test edge cases, and build robust UIs with confidence.
            </p>
            <div className="flex gap-4">
              {/* Social Placeholders */}
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-lg">𝕏</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-lg">in</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-lg">🐙</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/api-pricing"
                  className="hover:text-indigo-400 transition-colors"
                >
                  API Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/general-api-documentation"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/user-login"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Login / Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links (New Pages) */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => openPolicy("/terms-and-conditions")}
                  className="hover:text-indigo-400 transition-colors text-left focus:outline-none"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy("/privacy-policy")}
                  className="hover:text-indigo-400 transition-colors text-left focus:outline-none"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy("/refund-policy")}
                  className="hover:text-indigo-400 transition-colors text-left focus:outline-none"
                >
                  Refund Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📧</span>
                <a
                  href="mailto:support@serverpe.in"
                  className="hover:text-indigo-400 transition-colors"
                >
                  support@serverpe.in
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <span>
                  Bengaluru, Karnataka,
                  <br />
                  India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© {currentYear} ServerPe.in. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed for Developers, by a Developer.</span>
            <span className="text-red-500 animate-pulse">❤</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
