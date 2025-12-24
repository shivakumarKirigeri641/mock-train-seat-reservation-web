import axios from "axios";
import ServerPeLogo from "../images/ServerPe_Logo.jpg";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDocsSidebarOpen, setIsDocsSidebarOpen] = useState(false);
  // State for Documentation Data
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEndpointId, setActiveEndpointId] = useState(null);
  const [openCategories, setOpenCategories] = useState({ 0: true });

  // State for Sidebar Filter
  const [searchQuery, setSearchQuery] = useState("");

  // ---------------- FETCH LOGIC ----------------
  useEffect(() => {
    const fetchApiDocumentation = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "/mockapis/serverpeuser/all-endpoints",
          { withCredentials: true }
        );
        setApiData(response?.data?.data);

        if (
          response?.data?.data?.length > 0 &&
          response?.data?.data[0].endpoints?.length > 0
        ) {
          setActiveEndpointId(response?.data?.data[0].endpoints[0].id);
        }
      } catch (error) {
        console.error("Error fetching API documentation:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApiDocumentation();
  }, []);

  // ---------------- DOWNLOAD HANDLER ----------------
  const handleDownload = async (category_details, ispostman = false) => {
    try {
      let response = null;
      if (ispostman) {
        response = await axios.get(
          `/mockapis/serverpeuser/download/postmancollection/${category_details.endpoints[0].id}`,
          {
            withCredentials: true,
            responseType: "blob",
          }
        );
      } else {
        response = await axios.get(
          `/mockapis/serverpeuser/download/apidoc/${category_details.endpoints[0].id}`,
          {
            withCredentials: true,
            responseType: "blob",
          }
        );
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      if (ispostman) {
        link.setAttribute("download", `${category_details.category}.json`);
      } else {
        link.setAttribute("download", `${category_details.category}.zip`);
      }
      document.body.appendChild(link);
      link.click();
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

  const toggleCategory = (index) => {
    setOpenCategories((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-6">
          <div onClick={() => navigate("/")} className="cursor-pointer group">
            <img
              src={ServerPeLogo}
              alt="Logo"
              className="w-35 h-16 group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold">Loading Documentation</h3>
            <p className="text-sm text-gray-400 font-mono">
              Fetching endpoints...
            </p>
          </div>
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            onClick={() => navigate("/user-home")}
            className="cursor-pointer"
          >
            <img src={ServerPeLogo} alt="Logo" className="w-35 h-16" />
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <Link to="/" className="hover:text-indigo-400">
              Home
            </Link>
            <Link to="/general-api-pricing" className="hover:text-indigo-400">
              API Pricing
            </Link>
            <Link to="/general-api-documentation" className="text-indigo-400">
              API Documentation
            </Link>
            <Link to="/about-me" className="hover:text-indigo-400">
              About Me
            </Link>
            <Link to="/contact-me" className="hover:text-indigo-400">
              Contact Me
            </Link>
          </div>
          <button
            onClick={() => navigate("/user-login")}
            className="hidden md:block bg-indigo-600 px-5 py-2.5 rounded-lg text-sm font-semibold"
          >
            Start using mock APIs
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row flex-1 max-w-7xl mx-auto w-full relative">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-72 bg-gray-900 border-r border-gray-800 z-40 transform transition-transform md:static md:translate-x-0 ${
            isDocsSidebarOpen ? "translate-x-0 pt-20" : "-translate-x-full"
          }`}
        >
          <div className="p-4 space-y-6">
            <input
              type="text"
              placeholder="Filter endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-gray-800 border border-gray-700 outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <nav className="space-y-4">
              {apiData?.map((cat, idx) => (
                <div key={idx}>
                  <button
                    onClick={() => toggleCategory(idx)}
                    className="w-full flex justify-between text-xs font-bold text-gray-500 uppercase py-2"
                  >
                    <span>{cat.category}</span>
                    <span>{openCategories[idx] ? "▼" : "▶"}</span>
                  </button>
                  {openCategories[idx] && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => handleDownload(cat)}
                          className="flex-1 bg-gray-800 py-1 rounded text-[10px] border border-gray-700"
                        >
                          Docs ⏬
                        </button>
                        <button
                          onClick={() => handleDownload(cat, true)}
                          className="flex-1 bg-orange-700/20 py-1 rounded text-[10px] border border-orange-500/30 text-orange-400"
                        >
                          Postman ⏬
                        </button>
                      </div>
                      {cat.endpoints.map((ep) => (
                        <button
                          key={ep.id}
                          onClick={() => setActiveEndpointId(ep.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate ${
                            activeEndpointId === ep.id
                              ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500"
                              : "text-gray-400 hover:bg-gray-800"
                          }`}
                        >
                          <span
                            className={`mr-2 font-bold text-[10px] ${
                              ep.method === "GET"
                                ? "text-emerald-500"
                                : "text-blue-500"
                            }`}
                          >
                            {ep.method}
                          </span>
                          {ep.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto space-y-10">
            {activeEndpoint && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <MethodBadge method={activeEndpoint.method} />
                    <h1 className="text-3xl font-bold">
                      {activeEndpoint.title}
                    </h1>
                  </div>
                  <p className="text-gray-400 text-lg">
                    {activeEndpoint.description}
                  </p>
                  <div className="mt-6 p-4 bg-gray-950 border border-gray-800 rounded-lg font-mono text-indigo-400 break-all">
                    {activeEndpoint.endpoint}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Request Payload</h3>
                  {activeEndpoint.sample_request ? (
                    <JsonViewer
                      data={activeEndpoint.sample_request}
                      title="Body"
                    />
                  ) : (
                    <div className="p-4 bg-gray-800/30 border border-gray-800 text-gray-500 italic rounded-lg">
                      No request body required.
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Response Structure</h3>
                  <JsonViewer
                    data={activeEndpoint.sample_response.data}
                    title="200 OK"
                  />
                </div>

                {/* Postman & Header Instruction */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                  <h3 className="text-xl font-bold mb-4">Test Endpoint</h3>
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-6 flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="p-3 bg-gray-800 rounded-full border border-gray-700 shrink-0 text-orange-500 text-xl">
                        🚀
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-bold">Run in Postman</h4>
                        <p className="text-xs text-gray-400">
                          Live testing requires the Postman App to avoid browser
                          security restrictions.
                        </p>
                      </div>
                      <a
                        href="https://www.postman.com/downloads/"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-semibold border border-gray-700"
                      >
                        Download Postman ↗
                      </a>
                    </div>

                    <div className="w-full p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                      <h5 className="text-xs font-bold text-indigo-400 uppercase mb-2">
                        Authentication Headers Required
                      </h5>
                      <p className="text-xs text-gray-300">
                        Include these in your request headers. They are provided
                        after subscribing
                        <Link to="/user-login">
                          {" "}
                          <span className="text-blue-300 font-bold italic underline-offset-4">
                            here
                          </span>
                        </Link>
                        :
                      </p>
                      <div className="mt-3 flex gap-4">
                        <span className="text-[10px] bg-gray-900 px-2 py-1 rounded border border-gray-700 font-mono text-gray-400">
                          x-api-key
                        </span>
                        <span className="text-[10px] bg-gray-900 px-2 py-1 rounded border border-gray-700 font-mono text-gray-400">
                          x-secret-key
                        </span>
                      </div>
                    </div>
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
