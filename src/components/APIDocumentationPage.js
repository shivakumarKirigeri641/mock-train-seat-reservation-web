import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { removeloggedInUser } from "../store/slices/loggedInUserSlice";
import { useDispatch } from "react-redux";
import ServerPeLogo from "../images/ServerPe_Logo.jpg";
// ---------------- SUB-COMPONENTS ----------------

const NavItem = ({ to, label, active = false }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
        : "text-gray-300 hover:text-white hover:bg-gray-800"
    }`}
  >
    {label}
  </Link>
);

const JsonViewer = ({ data, title }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const text = JSON.stringify(data, null, 2);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-700 bg-gray-900 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
          {title}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? (
            <svg
              className="w-3.5 h-3.5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="p-4 overflow-x-auto max-h-80 overflow-y-auto custom-scrollbar">
        <pre className="text-sm font-mono leading-relaxed text-gray-300">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

const MethodBadge = ({ method }) => {
  const colors = {
    GET: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    POST: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
        colors[method] || colors.GET
      }`}
    >
      {method}
    </span>
  );
};

// ---------------- MAIN COMPONENT ----------------

const APIDocumentationGeneralPage = () => {
  const navigate = useNavigate();
  const api_key = "xxxx";
  const secret_key = "secret-****";
  const dispatch = useDispatch();
  const [isSiteMenuOpen, setIsSiteMenuOpen] = useState(false);
  const [isDocsSidebarOpen, setIsDocsSidebarOpen] = useState(false);

  // State for Documentation Data
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW: Error State ---
  const [error, setError] = useState(null);

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeEndpointId, setActiveEndpointId] = useState(null);
  const [openCategories, setOpenCategories] = useState({ 0: true });

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");

  // ---------------- FETCH LOGIC (Wrapped in useCallback) ----------------
  const fetchApiDocumentation = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Reset error state on retry
    try {
      const response = await axios.get(
        "/mockapis/serverpeuser/loggedinuser/all-endpoints",
        { withCredentials: true }
      );

      const data = response?.data?.data;
      setApiData(data);

      // Set default active endpoint if data exists
      if (data && data.length > 0 && data[0].endpoints?.length > 0) {
        // Only set default if we haven't selected one yet (preserves selection on re-renders)
        setActiveEndpointId((prev) => prev || data[0].endpoints[0].id);
      }
    } catch (error) {
      console.error("Documentation Fetch Error:", error);

      if (error.response && error.response.status === 401) {
        // Session Expired -> Logout
        dispatch(removeloggedInUser());
        navigate("/user-login");
      } else if (error.code === "ERR_NETWORK") {
        setError(
          "Network Error: Unable to connect to the server. Please check your internet connection."
        );
      } else {
        setError(
          "Failed to load API Documentation. The server might be down or experiencing issues."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, navigate]);

  // Initial Fetch
  useEffect(() => {
    fetchApiDocumentation();
  }, [fetchApiDocumentation]);

  // ---------------- DOWNLOAD HANDLER ----------------
  const handleDownload = async (category_details, ispostman = false) => {
    try {
      // 1. Call the API with the ID
      let response = null;
      if (ispostman) {
        response = await axios.get(
          `/mockapis/serverpeuser/download/postmancollection/${category_details.endpoints[0].id}`,
          {
            withCredentials: true,
            responseType: "blob", // Important for handling file downloads
          }
        );
      } else {
        response = await axios.get(
          `/mockapis/serverpeuser/download/apidoc/${category_details.endpoints[0].id}`,
          {
            withCredentials: true,
            responseType: "blob", // Important for handling file downloads
          }
        );
      }

      // 2. Create a blob link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      // Set the file name (you can adjust extension based on response type)
      if (ispostman) {
        link.setAttribute("download", `${category_details.category}.json`);
      } else {
        link.setAttribute("download", `${category_details.category}.zip`);
      }
      document.body.appendChild(link);
      link.click();

      // 3. Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download documentation.");
    }
  };

  const allEndpoints = apiData?.flatMap((cat) =>
    cat?.endpoints?.map((ep) => ({ ...ep, category: cat.category }))
  );
  const activeEndpoint =
    allEndpoints?.find((ep) => ep?.id === activeEndpointId) ||
    (allEndpoints?.length > 0 ? allEndpoints[0] : null);

  useEffect(() => {
    if (!activeEndpoint) return;
    const catIndex = apiData.findIndex((c) =>
      c?.endpoints?.some((e) => e.id === activeEndpointId)
    );
    if (catIndex !== -1) setActiveCategoryIndex(catIndex);
  }, [activeEndpointId, apiData]);

  const toggleCategory = (index) => {
    setOpenCategories((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // ---------------- LOADING SCREEN ----------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-full h-full bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center shadow-2xl animate-bounce">
              <span className="text-4xl">⚡</span>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-white">
              Loading Documentation
            </h3>
            <p className="text-sm text-gray-400 font-mono">
              Fetching endpoints...
            </p>
          </div>
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ERROR SCREEN ----------------
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-6">
        <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Unavailable</h3>
          <p className="text-gray-400 mb-8">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchApiDocumentation}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/user-home")}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 py-3 rounded-lg font-medium transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 transition-all">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div
              onClick={() => navigate("/user-home")}
              className="flex items-center gap-3 cursor-pointer group border-2 bg-transparent"
            >
              <img
                src={ServerPeLogo}
                alt="ServerPe Logo"
                className="w-35 h-16 group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Desktop Static Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              <NavItem to="/user-home" label="Home" />
              <NavItem to="/api-usage" label="API Usage" />
              <NavItem
                to="/api-documentation"
                label="API Documentation"
                active={true}
              />
              <NavItem to="/api-pricing" label="API Pricing" />
              <NavItem to="/wallet-recharge" label="Wallet & Recharge" />
              <NavItem to="/give-feedback" label="Give feedback" />
              <NavItem to="/profile" label="Profile" />
            </div>

            {/* Logout Button */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() => navigate("/logout")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
              >
                <span>Logout</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsSiteMenuOpen(!isSiteMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isSiteMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Site Menu */}
        {isSiteMenuOpen && (
          <div className="lg:hidden bg-gray-800 border-b border-gray-700 animate-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-4 flex flex-col space-y-2">
              <Link
                to="/user-home"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Home
              </Link>
              <Link
                to="/api-usage"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                API Usage
              </Link>
              <Link
                to="/api-documentation"
                className="block px-4 py-3 bg-gray-700 text-white rounded-lg"
              >
                API Documentation
              </Link>
              <Link
                to="/api-pricing"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                API Pricing
              </Link>
              <Link
                to="/wallet-recharge"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Wallet & Recharge
              </Link>
              <Link
                to="/give-feedback"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Give feedback
              </Link>
              <Link
                to="/profile"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Profile
              </Link>
              <Link
                to="/logout"
                className="block px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg"
              >
                Logout
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* --- DOCS LAYOUT --- */}
      <div className="flex flex-col md:flex-row flex-1 max-w-7xl mx-auto w-full relative">
        {/* Mobile Sidebar Toggle (for Docs) */}
        <div className="md:hidden w-full bg-gray-800/50 p-4 border-b border-gray-800 flex justify-between items-center sticky top-20 z-40">
          <span className="text-sm font-semibold text-gray-400">
            Select Endpoint
          </span>
          <button
            onClick={() => setIsDocsSidebarOpen(!isDocsSidebarOpen)}
            className="text-indigo-400 flex items-center gap-1 text-sm font-medium"
          >
            Menu {isDocsSidebarOpen ? "▲" : "▼"}
          </button>
        </div>

        {/* SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 w-72 bg-gray-900 border-r border-gray-800 z-40 transform transition-transform duration-300 md:translate-x-0 md:static md:h-auto md:min-h-[calc(100vh-5rem)] md:overflow-y-auto ${
            isDocsSidebarOpen ? "translate-x-0 pt-20" : "-translate-x-full"
          }`}
        >
          <div className="p-4 space-y-6">
            <input
              type="text"
              placeholder="Filter endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-gray-800 border border-gray-700 text-gray-300 focus:ring-1 focus:ring-indigo-500 outline-none"
            />

            <nav className="space-y-1 pb-20 md:pb-0">
              {apiData?.map((cat, idx) => {
                const filteredEndpoints = cat?.endpoints?.filter((ep) =>
                  ep?.title?.toLowerCase().includes(searchQuery?.toLowerCase())
                );
                if (searchQuery && filteredEndpoints?.length === 0) return null;

                return (
                  <div key={idx} className="mb-4">
                    <button
                      onClick={() => toggleCategory(idx)}
                      className="w-full flex items-center justify-between px-2 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
                        </svg>
                        {cat.category}
                      </div>
                      <span className="text-gray-600">
                        {openCategories[idx] || searchQuery ? "▼" : "▶"}
                      </span>
                    </button>

                    {(openCategories[idx] || searchQuery) && (
                      <div className="mt-1 space-y-0.5">
                        {/* --- ENHANCED: Download Buttons per Category --- */}
                        <div className="px-3 pb-3 space-y-2 border-b border-gray-800 mb-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDownload(cat)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-medium py-1.5 rounded border border-gray-700 transition-colors"
                              title="Download API Documentation"
                            >
                              Docs ⏬
                            </button>
                            <button
                              onClick={() => handleDownload(cat, true)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-orange-700 hover:bg-orange-600 text-white text-[10px] font-medium py-1.5 rounded border border-orange-600/20 transition-colors"
                              title="Download Postman Collection"
                            >
                              Postman ⏬
                            </button>
                          </div>

                          {/* Info Box for Docs Download */}
                          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded p-2">
                            <p className="text-[12px] italic text-gray-400 leading-tight">
                              <span className="text-indigo-400 font-bold block mb-1">
                                About Docs (.zip):
                              </span>
                              Includes offline documentation in{" "}
                              <span className="text-gray-300">.md</span>,{" "}
                              <span className="text-gray-300">.pdf</span>, and{" "}
                              <span className="text-gray-300">.html</span>{" "}
                              formats.
                            </p>
                            <a
                              href="https://www.win-rar.com/download.html"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] text-indigo-400 hover:underline mt-1 inline-block font-medium"
                            >
                              Download Zip Software (WinRAR) ↗
                            </a>
                          </div>
                        </div>
                        {/* ------------------------------------------- */}

                        {(searchQuery
                          ? filteredEndpoints
                          : cat?.endpoints
                        )?.map((ep) => (
                          <button
                            key={ep.id}
                            onClick={() => {
                              setActiveEndpointId(ep.id);
                              // Reset logic removed as try panel is gone
                              setIsDocsSidebarOpen(false);
                              window.scrollTo(0, 0);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                              activeEndpointId === ep?.id
                                ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500"
                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                            }`}
                          >
                            <span
                              className={`text-[10px] font-bold w-8 ${
                                ep.method === "GET"
                                  ? "text-emerald-400"
                                  : "text-blue-400"
                              }`}
                            >
                              {ep.method}
                            </span>
                            <span className="truncate">{ep?.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full min-w-0 p-4 md:p-8 lg:p-12 overflow-hidden">
          {/* API Keys Information Section */}
          <div className="p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-indigo-500/20 rounded-full">
                <svg
                  className="w-5 h-5 text-indigo-400"
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
              </div>
              <h3 className="text-lg font-bold text-indigo-300">
                API Authentication & Headers
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* X-API-Key */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-indigo-400 font-semibold text-sm">
                    x-api-key
                  </code>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded">
                    REQUIRED
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  Your unique API key for authentication. This key identifies
                  your account and is required for all API requests.
                </p>
                <p className="text-[11px] text-gray-500 italic">
                  📍 Get your API key from your Dashboard
                </p>
              </div>

              {/* X-Secret-Key */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-indigo-400 font-semibold text-sm">
                    x-secret-key
                  </code>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded">
                    REQUIRED
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  Your secret key for enhanced security. Keep this key
                  confidential and never share it publicly or in client-side
                  code.
                </p>
                <p className="text-[11px] text-gray-500 italic">
                  📍 Get your secret key from your Dashboard
                </p>
              </div>
            </div>

            {/* Postman Integration Info */}
            <div className="mt-4 p-3 bg-gray-900/50 border border-gray-700 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Using with Postman?
              </h4>
              <ol className="text-xs text-gray-400 space-y-2 ml-6 list-decimal">
                <li>
                  Download the Postman Collection from the sidebar (Category →
                  Download Postman Collection)
                </li>
                <li>Import the collection into your Postman workspace</li>
                <li>
                  Add environment variables:
                  <ul className="list-disc ml-4 mt-1 space-y-1 text-gray-500">
                    <li>
                      <code className="text-indigo-300 font-mono">
                        {api_key}
                      </code>{" "}
                      = Your x-api-key value
                    </li>
                    <li>
                      <code className="text-indigo-300 font-mono">
                        {secret_key}
                      </code>{" "}
                      = Your x-secret-key value
                    </li>
                  </ul>
                </li>
                <li>
                  All request headers will automatically use these variables
                </li>
              </ol>
            </div>

            {/* Security Note */}
            <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg flex gap-2">
              <svg
                className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-yellow-200/80">
                <strong>Never expose your x-api-key or x-secret-key</strong> in
                client-side code, repositories, or logs. Only use it
                server-to-server.
              </p>
            </div>
          </div>
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Disclaimer */}
            <div className="p-4 bg-orange-900/20 border border-orange-500/20 rounded-xl flex gap-3 items-start">
              <div className="p-1 bg-orange-500/20 rounded-full mt-0.5 shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-orange-400">
                  Development Mock Environment
                </h4>
                <p className="text-xs text-orange-200/70 mt-1 leading-relaxed">
                  These APIs are strictly for testing, training, and UI
                  development. No real bookings, transactions, or hardware
                  connections are made.
                </p>
              </div>
            </div>

            {/* Endpoint Info */}
            {activeEndpoint && (
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-8">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <MethodBadge method={activeEndpoint.method} />
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight break-all">
                      {activeEndpoint.title}
                    </h1>
                  </div>

                  <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                    {activeEndpoint.description}
                  </p>

                  <div className="mt-6 flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg font-mono text-xs md:text-sm text-gray-300 break-all shadow-inner overflow-x-auto">
                    <svg
                      className="w-4 h-4 text-gray-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    <span className="text-indigo-400 whitespace-normal break-all">
                      {activeEndpoint?.endpoint}
                    </span>
                  </div>
                </div>

                {/* Request Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    Request Payload
                  </h3>

                  {activeEndpoint.sample_request ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        Content-Type: application/json
                      </p>
                      <JsonViewer
                        data={activeEndpoint.sample_request}
                        title="Example Body"
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-800 text-sm text-gray-500 italic">
                      No request body required (GET request).
                    </div>
                  )}
                </div>

                {/* Response Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                      />
                    </svg>
                    Response Structure
                  </h3>
                  <JsonViewer
                    data={activeEndpoint.sample_response.data}
                    title="200 OK (Sample)"
                  />
                </div>

                {/* Try It Panel - MODIFIED: Removed form, kept Postman redirect */}
                <div className="mt-10 pt-8 border-t border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Test Endpoint
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Live testing is not available in the browser. Please call
                    the endpoint in Postman to see the actual & live responses.
                  </p>

                  {/* --- POSTMAN SUGGESTION BLOCK --- */}
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-3 bg-gray-800 rounded-full border border-gray-700 shrink-0">
                      <svg
                        className="w-6 h-6 text-orange-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-sm font-bold text-white">
                        Run in Postman
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        To see actual live responses and avoid exposing
                        credentials, please test this endpoint using the Postman
                        App.
                      </p>
                    </div>
                    <a
                      href="https://www.postman.com/downloads/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg border border-gray-700 transition-colors whitespace-nowrap"
                    >
                      Download Postman ↗
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default APIDocumentationGeneralPage;
