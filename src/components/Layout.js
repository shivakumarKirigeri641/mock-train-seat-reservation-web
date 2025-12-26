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
import { useState } from "react";

const menuItems = [
  { label: "Home", path: "/user-home", icon: <FiHome /> },
  { label: "Book Ticket", path: "/book-ticket", icon: <FiBookOpen /> },
  { label: "Booking History", path: "/booking-history", icon: <FiClock /> },
  { label: "PNR Status", path: "/pnr-status", icon: <FiSearch /> },
  { label: "Cancel Ticket", path: "/cancel-ticket", icon: <FiMessageCircle /> },
  {
    label: "Train schedule",
    path: "/train-schedule",
    icon: <FiMessageCircle />,
  },
  {
    label: "train between stations",
    path: "/cancel-ticket",
    icon: <FiMessageCircle />,
  },
  { label: "Live station", path: "/cancel-ticket", icon: <FiMessageCircle /> },
  /*{
    label: "API documentation",
    path: "/api-documentation",
    icon: <FiBookOpen />,
  },*/
  { label: "Logout", path: "/logout", icon: <FiClock /> },
];

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"></header>

      {/* Main content area (push down for header & footer) */}
      <main className="flex-1 mt-14 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40"></div>
    </div>
  );
};
export default Layout;
