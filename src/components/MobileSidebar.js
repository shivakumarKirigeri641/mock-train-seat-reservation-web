// src/components/MobileSidebar.js
import React from "react";
import {
  FiX,
  FiHome,
  FiBookOpen,
  FiClock,
  FiSearch,
  FiUser,
  FiMessageCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router";

const menuItems = [
  { label: "Home", path: "/user-home", icon: <FiHome /> },
  { label: "Book Ticket", path: "/book-ticket", icon: <FiBookOpen /> },
  { label: "Booking History", path: "/booking-history", icon: <FiClock /> },
  { label: "PNR Status", path: "/pnr-status", icon: <FiSearch /> },
  { label: "Cancel Ticket", path: "/cancel-ticket", icon: <FiMessageCircle /> },
  { label: "Profile", path: "/profile", icon: <FiUser /> },
];

export default function MobileSidebar({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ${
          open
            ? "opacity-60 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 transform transition-transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
          <div className="font-medium">Menu</div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiX />
          </button>
        </div>

        <nav className="px-2 py-4 space-y-1">
          {menuItems.map((m) => (
            <button
              key={m.path}
              onClick={() => {
                navigate(m.path);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="text-lg">{m.icon}</span>
              <span className="truncate">{m.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-700">
          <small className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 YourApp
          </small>
        </div>
      </aside>
    </>
  );
}
