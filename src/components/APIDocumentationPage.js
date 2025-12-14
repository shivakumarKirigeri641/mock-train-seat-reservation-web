import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

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
  // State for Navigation
  const [isSiteMenuOpen, setIsSiteMenuOpen] = useState(false);
  const [isDocsSidebarOpen, setIsDocsSidebarOpen] = useState(false);

  // State for Documentation Data
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeEndpointId, setActiveEndpointId] = useState(null);
  const [openCategories, setOpenCategories] = useState({ 0: true });

  // ---------------- FETCH LOGIC (Simulated) ----------------
  useEffect(() => {
    const fetchApiDocumentation = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL +
            "/mockapis/serverpeuser/loggedinuser/all-endpoints",
          { withCredentials: true }
        );
        console.log(response?.data?.data);
        setApiData(response?.data?.data);
        // Set default active endpoint
        if (
          response?.data?.data?.length > 0 &&
          response?.data?.data[0].endpoints?.length > 0
        ) {
          setActiveEndpointId(apiData[0].endpoints[0].id);
        }
      } catch (error) {
        console.error("Error fetching API documentation:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApiDocumentation();
  }, []);

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

  // State for Try It Panel
  const [searchQuery, setSearchQuery] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("http://localhost:8888");
  const [tryBody, setTryBody] = useState("");
  const [tryResponse, setTryResponse] = useState(null);
  const [tryLoading, setTryLoading] = useState(false);

  useEffect(() => {
    if (activeEndpoint) {
      setTryBody(
        activeEndpoint?.body
          ? JSON.stringify(activeEndpoint?.body, null, 2)
          : ""
      );
      setTryResponse(null);
    }
  }, [activeEndpointId, activeEndpoint]);

  const toggleCategory = (index) => {
    setOpenCategories((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const sendTryRequest = async () => {
    setTryLoading(true);
    setTryResponse(null);

    try {
      if (!apiKey || !secretKey)
        throw new Error("Please enter both API Key and Secret Key.");
      const url = `${baseUrl.replace(/\/$/, "")}${activeEndpoint?.endpoint}`;

      const options = {
        method: activeEndpoint.method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "x-secret-key": secretKey,
        },
        body: activeEndpoint.body ? tryBody : null,
      };

      if (activeEndpoint.method === "GET") delete options.body;

      const res = await axios.get(url, options);
      const text = await res?.data?.data;
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { raw: text, status: res.status };
      }
      setTryResponse(parsed);
    } catch (err) {
      setTryResponse({ error: err.message });
    } finally {
      setTryLoading(false);
    }
  };

  // ---------------- LOADING SCREEN ----------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-6">
          {/* Animated Spinner/Logo */}
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

          {/* Progress Bar */}
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-loading-bar"></div>
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
              <NavItem to="/feedback-form" label="Give feedback" />
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
                        {(searchQuery
                          ? filteredEndpoints
                          : cat?.endpoints
                        )?.map((ep) => (
                          <button
                            key={ep.id}
                            onClick={() => {
                              setActiveEndpointId(ep.id);
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
                    {activeEndpoint.category_description}
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
                      {/* Replaced manual div with JsonViewer to enforce max-height */}
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
                  {/* Replaced manual div with JsonViewer to enforce max-height */}
                  <JsonViewer
                    data={activeEndpoint.sample_response.data}
                    title="200 OK"
                  />
                </div>

                {/* Try It Panel */}
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
                    Send a live request to the mock server using your
                    credentials.
                  </p>

                  {/* --- NEW POSTMAN SUGGESTION BLOCK --- */}
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
                        Recommended: Test in Postman
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        To avoid exposing your <strong>Secret Key</strong> in
                        the browser, we recommend testing secure endpoints using
                        Postman.
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
                  {/* ------------------------------------ */}

                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 md:p-6 space-y-4">
                    {/* Header Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="x-api-key"
                        className="w-full bg-gray-900 border border-gray-700 text-sm rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        placeholder="x-secret-key"
                        className="w-full bg-gray-900 border border-gray-700 text-sm rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <input
                      type="text"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      placeholder="Base URL"
                      className="w-full bg-gray-900 border border-gray-700 text-sm rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    {activeEndpoint.body && (
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">
                          Request Body
                        </label>
                        <textarea
                          rows={6}
                          value={tryBody}
                          onChange={(e) => setTryBody(e.target.value)}
                          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm text-gray-200 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={sendTryRequest}
                        disabled={tryLoading}
                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-wait text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
                      >
                        {tryLoading ? "Sending..." : "Send Request"}
                      </button>
                      <div className="text-xs text-gray-500 font-mono hidden sm:block">
                        {activeEndpoint.method} {activeEndpoint.endpoint}
                      </div>
                    </div>

                    {tryResponse && (
                      <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">
                          Live Response
                        </label>
                        <JsonViewer
                          data={tryResponse}
                          title="Status: Received"
                        />
                      </div>
                    )}
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
