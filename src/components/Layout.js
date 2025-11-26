// src/components/Layout.js
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBookOpen,
  FiClock,
  FiSearch,
  FiUser,
  FiMessageCircle,
} from "react-icons/fi";
import MobileSidebar from "./MobileSidebar";

import Footer from "./Footer";

const menuItems = [
  { label: "Home", path: "/user-home", icon: <FiHome /> },
  { label: "Book Ticket", path: "/book-ticket", icon: <FiBookOpen /> },
  { label: "Booking History", path: "/booking-history", icon: <FiClock /> },
  { label: "PNR Status", path: "/pnr-status", icon: <FiSearch /> },
  { label: "Cancel Ticket", path: "/cancel-ticket", icon: <FiMessageCircle /> },
  { label: "Profile", path: "/profile", icon: <FiUser /> },
];

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <FiMenu size={20} />
              </button>

              {/* Logo / Title */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate("/user-home")}
              >
                <div className="w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                  <span className="font-semibold text-sm text-gray-700 dark:text-gray-100">
                    YA
                  </span>
                </div>
                <span className="ml-3 font-medium text-gray-800 dark:text-gray-100">
                  YourApp
                </span>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-2">
              {menuItems.map((m) => {
                const active = location.pathname === m.path;
                return (
                  <button
                    key={m.path}
                    onClick={() => navigate(m.path)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                      active
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="text-lg">{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content area (push down for header & footer) */}
      <main className="flex-1 mt-14 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Footer />
      </div>
    </div>
  );
};
export default Layout;
