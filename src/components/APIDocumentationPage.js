import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

// ---------------- API DATA ----------------
const apiCategories = [
  {
    category: "Mock Train Reservation",
    description:
      "Simulate end-to-end train booking flows, PNR status, and live tracking.",
    endpoints: [
      {
        id: "train-stations",
        title: "Get Stations",
        method: "GET",
        endpoint: "/mockapis/serverpeuser/api/mocktrain/reserved/stations",
        description: "Retrieve a list of available train stations with codes.",
        response: {
          success: true,
          data: [
            { id: 41, code: "SBC", station_name: "KSR BENGALURU", zone: "SWR" },
          ],
        },
      },
      {
        id: "train-search",
        title: "Search Trains",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/mocktrain/reserved/search-trains",
        description:
          "Search for trains running between two stations on a specific date.",
        body: {
          source_code: "SBC",
          destination_code: "MYS",
          doj: "2025-12-10",
        },
        response: {
          success: true,
          data: {
            source: "KSR BENGALURU",
            trains_list: [
              { train_number: "12614", train_name: "WODEYAR EXPRESS" },
            ],
          },
        },
      },
      {
        id: "train-schedule",
        title: "Train Schedule",
        method: "POST",
        endpoint:
          "/mockapis/serverpeuser/api/mocktrain/reserved/train-schedule",
        description: "Get the full route and time table for a specific train.",
        body: { train_number: "12614" },
        response: { success: true, data: { train_schedule_details: [] } },
      },
      {
        id: "train-proceed",
        title: "Proceed Booking",
        method: "POST",
        endpoint:
          "/mockapis/serverpeuser/api/mocktrain/reserved/proceed-booking",
        description:
          "Initiate a booking request to generate a temporary Booking ID.",
        body: {
          train_number: "12614",
          class_code: "3A",
          quota: "GN",
          doj: "2025-12-10",
          passenger_list: [{ name: "John", age: 30, gender: "M" }],
        },
        response: {
          success: true,
          data: { booking_id: 101, fare_details: {} },
        },
      },
      {
        id: "train-confirm",
        title: "Confirm Ticket",
        method: "POST",
        endpoint:
          "/mockapis/serverpeuser/api/mocktrain/reserved/confirm-ticket",
        description:
          "Finalize booking using Booking ID. Triggers mock SMS if enabled.",
        body: { booking_id: 101, can_send_mock_ticket_sms: true },
        response: { success: true, data: { pnr: "8201293822", status: "CNF" } },
      },
      {
        id: "train-pnr",
        title: "PNR Status",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/mocktrain/reserved/pnr-status",
        description: "Check the current status of a generated PNR.",
        body: { pnr: "8201293822" },
        response: {
          success: true,
          data: { pnr_status: "CNF", passengers: [] },
        },
      },
      {
        id: "train-cancel",
        title: "Cancel Ticket",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/mocktrain/reserved/cancel-ticket",
        description: "Cancel a ticket or specific passengers.",
        body: { pnr: "8201293822", passenger_ids: [1, 2] },
        response: {
          success: true,
          data: { refund_amount: 500, status: "CAN" },
        },
      },
      {
        id: "train-live",
        title: "Live Running Status",
        method: "POST",
        endpoint:
          "/mockapis/serverpeuser/api/mocktrain/reserved/train-live-running-status",
        description: "Simulates live location of a train.",
        body: { train_number: "12614" },
        response: { success: true, data: { current_station: "KGI", delay: 5 } },
      },
      {
        id: "train-live-station",
        title: "Live Station",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/mocktrain/reserved/live-station",
        description: "Get trains arriving/departing a station in next N hours.",
        body: { station_code: "SBC", next_hours: 4 },
        response: { success: true, data: { trains: [] } },
      },
    ],
  },
  {
    category: "Car Specifications",
    description:
      "Automotive database for car makes, models, variants, and technical specs.",
    endpoints: [
      {
        id: "car-makes",
        title: "Get Car Makes",
        method: "GET",
        endpoint: "/mockapis/serverpeuser/api/carspecs/car-makes",
        description: "Get a list of all car manufacturers (Brands).",
        response: { success: true, data: ["Toyota", "Honda", "Hyundai"] },
      },
      {
        id: "car-models",
        title: "Get Car Models",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/carSpecs/car-models",
        description: "Get models for a specific brand.",
        body: { brand: "Toyota" },
        response: { success: true, data: ["Camry", "Corolla", "Fortuner"] },
      },
      {
        id: "car-series",
        title: "Get Car Series",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/carSpecs/car-series",
        description: "Get series/generations for a model.",
        body: { brand: "Toyota", model: "Fortuner" },
        response: { success: true, data: ["Sigma 4", "Legender"] },
      },
      {
        id: "car-grades",
        title: "Get Car Grades",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/carSpecs/car-grades",
        description: "Get trim levels or grades.",
        body: { brand: "Toyota", model: "Fortuner", series: "Legender" },
        response: { success: true, data: ["4x4 AT", "4x2 AT"] },
      },
      {
        id: "car-list",
        title: "Get Car List",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/carSpecs/car-list",
        description: "Get specific vehicle IDs based on selection.",
        body: {
          brand: "Toyota",
          model: "Fortuner",
          series: "Legender",
          grade: "4x4 AT",
        },
        response: {
          success: true,
          data: [{ id: 101, name: "Toyota Fortuner Legender 4x4 AT" }],
        },
      },
      {
        id: "car-specs",
        title: "Get Car Specs",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/carSpecs/car-specs",
        description: "Fetch full technical specifications by ID.",
        body: { id: 101 },
        response: {
          success: true,
          data: { engine: "2.8L Diesel", power: "201 BHP", torque: "500 Nm" },
        },
      },
      {
        id: "car-search",
        title: "Search Cars",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/carSpecs/search-cars",
        description: "Search cars by name/keyword.",
        body: { query: "Civic", limit: 10, skip: 0 },
        response: { success: true, data: [] },
      },
    ],
  },
  {
    category: "Bike Specifications",
    description:
      "Two-wheeler database for bikes, scooters, and their technical details.",
    endpoints: [
      {
        id: "bike-makes",
        title: "Get Bike Makes",
        method: "GET",
        endpoint: "/mockapis/serverpeuser/api/bikespecs/bike-makes",
        description: "Get a list of all bike manufacturers.",
        response: { success: true, data: ["Yamaha", "Royal Enfield", "Honda"] },
      },
      {
        id: "bike-models",
        title: "Get Bike Models",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/bikespecs/bike-models",
        description: "Get models for a specific brand.",
        body: { brand: "Yamaha" },
        response: { success: true, data: ["R15", "MT-15", "FZs"] },
      },
      {
        id: "bike-type",
        title: "Get Bike Types",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/bikespecs/bike-type",
        description: "Filter by type (e.g., Sports, Commuter).",
        body: { brand: "Yamaha", model: "R15" },
        response: { success: true, data: ["Sports"] },
      },
      {
        id: "bike-category",
        title: "Get Bike Category",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/bikespecs/bike-category",
        description: "Get category variants.",
        body: { brand: "Yamaha", model: "R15", bike_type: "Sports" },
        response: { success: true, data: ["V4", "M"] },
      },
      {
        id: "bike-list",
        title: "Get Bike List",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/bikespecs/bike-list",
        description: "Get specific bike IDs.",
        body: {
          brand: "Yamaha",
          model: "R15",
          bike_type: "Sports",
          category: "V4",
        },
        response: {
          success: true,
          data: [{ id: 501, name: "Yamaha R15 V4 Racing Blue" }],
        },
      },
      {
        id: "bike-specs",
        title: "Get Bike Specs",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/bikespecs/bike-specs",
        description: "Fetch full technical specifications by ID.",
        body: { id: 501 },
        response: {
          success: true,
          data: { engine: "155cc", power: "18.4 PS", mileage: "45 kmpl" },
        },
      },
    ],
  },
  {
    category: "Indian Pincodes",
    description:
      "Postal data for India including States, Districts, and Blocks.",
    endpoints: [
      {
        id: "pincode-details",
        title: "Pincode Lookup",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/pincode-details",
        description: "Get details for a specific 6-digit Pincode.",
        body: { pincode: "560001" },
        response: {
          success: true,
          data: { district: "Bangalore", state: "Karnataka", offices: [] },
        },
      },
      {
        id: "pincode-states",
        title: "Get States",
        method: "GET",
        endpoint: "/mockapis/serverpeuser/api/pincodes/states",
        description: "Get all States and Union Territories.",
        response: {
          success: true,
          data: ["Karnataka", "Maharashtra", "Delhi"],
        },
      },
      {
        id: "pincode-districts",
        title: "Get Districts",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/pincodes/districts",
        description: "Get districts within a state.",
        body: { selectedState: "Karnataka" },
        response: { success: true, data: ["Bangalore", "Mysore", "Hubli"] },
      },
      {
        id: "pincode-blocks",
        title: "Get Blocks",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/pincodes/blocks",
        description: "Get blocks within a district.",
        body: { selectedState: "Karnataka", selectedDistrict: "Bangalore" },
        response: {
          success: true,
          data: ["Bangalore North", "Bangalore South"],
        },
      },
      {
        id: "pincode-list",
        title: "Get Pincode List",
        method: "POST",
        endpoint: "/mockapis/serverpeuser/api/pincodes/pincode-list",
        description: "Drill down to specific branch/area details.",
        body: {
          selectedState: "Karnataka",
          selectedDistrict: "Bangalore",
          selectedBlock: "Bangalore North",
          selectedBranchType: "Sub Post Office",
        },
        response: { success: true, data: [] },
      },
    ],
  },
];

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

const APIDocumentationPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State for Navigation
  const [isSiteMenuOpen, setIsSiteMenuOpen] = useState(false);
  const [isDocsSidebarOpen, setIsDocsSidebarOpen] = useState(false);

  // State for Documentation Data
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeEndpointId, setActiveEndpointId] = useState(
    apiCategories[0].endpoints[0].id
  );
  const [openCategories, setOpenCategories] = useState({ 0: true });

  const allEndpoints = apiCategories.flatMap((cat) =>
    cat.endpoints.map((ep) => ({ ...ep, category: cat.category }))
  );
  const activeEndpoint =
    allEndpoints.find((ep) => ep.id === activeEndpointId) || allEndpoints[0];

  useEffect(() => {
    const catIndex = apiCategories.findIndex((c) =>
      c.endpoints.some((e) => e.id === activeEndpointId)
    );
    if (catIndex !== -1) setActiveCategoryIndex(catIndex);
  }, [activeEndpointId]);

  // State for Try It Panel
  const [searchQuery, setSearchQuery] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  //const [baseUrl, setBaseUrl] = useState("https://serverpe.in");
  const [baseUrl, setBaseUrl] = useState("http://localhost:8888");
  const [tryBody, setTryBody] = useState("");
  const [tryResponse, setTryResponse] = useState(null);
  const [tryLoading, setTryLoading] = useState(false);

  useEffect(() => {
    setTryBody(
      activeEndpoint.body ? JSON.stringify(activeEndpoint.body, null, 2) : ""
    );
    setTryResponse(null);
  }, [activeEndpointId]);

  const toggleCategory = (index) => {
    setOpenCategories((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const sendTryRequest = async () => {
    setTryLoading(true);
    setTryResponse(null);

    try {
      if (!apiKey || !secretKey)
        throw new Error("Please enter both API Key and Secret Key.");
      const url = `${baseUrl.replace(/\/$/, "")}${activeEndpoint.endpoint}`;

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
      console.log(res?.data?.data.text);
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
                <span className="text-lg">⚡</span>
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
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-800 border-b border-gray-700 animate-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-4 flex flex-col space-y-2">
              <Link
                to="/user-home"
                className="block px-4 py-3 bg-gray-700 text-white rounded-lg"
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
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
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
                to="/profile"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Profile
              </Link>
              <div className="border-t border-gray-700 my-2 pt-2">
                <Link
                  to="/logout"
                  className="block px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg"
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* --- DOCS LAYOUT --- */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full relative">
        {/* Mobile Sidebar Toggle (for Docs) */}
        <div className="md:hidden w-full bg-gray-800/50 p-4 border-b border-gray-800 flex justify-between items-center">
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
          className={`fixed inset-y-0 left-0 w-72 bg-gray-900 border-r border-gray-800 z-40 transform transition-transform duration-300 md:translate-x-0 md:static md:h-[calc(100vh-5rem)] md:overflow-y-auto ${
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
              {apiCategories.map((cat, idx) => {
                const filteredEndpoints = cat.endpoints.filter((ep) =>
                  ep.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
                if (searchQuery && filteredEndpoints.length === 0) return null;

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
                        {(searchQuery ? filteredEndpoints : cat.endpoints).map(
                          (ep) => (
                            <button
                              key={ep.id}
                              onClick={() => {
                                setActiveEndpointId(ep.id);
                                setIsDocsSidebarOpen(false);
                                window.scrollTo(0, 0);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                                activeEndpointId === ep.id
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
                              <span className="truncate">{ep.title}</span>
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full min-w-0 p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Disclaimer */}
            <div className="p-4 bg-orange-900/20 border border-orange-500/20 rounded-xl flex gap-3 items-start">
              <div className="p-1 bg-orange-500/20 rounded-full mt-0.5">
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
            <div className="space-y-6">
              <div className="border-b border-gray-800 pb-8">
                <div className="flex items-center gap-3 mb-4">
                  <MethodBadge method={activeEndpoint.method} />
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    {activeEndpoint.title}
                  </h1>
                </div>

                <p className="text-gray-400 text-lg leading-relaxed">
                  {activeEndpoint.description}
                </p>

                <div className="mt-6 flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg font-mono text-sm text-gray-300 break-all shadow-inner">
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
                  <span className="text-indigo-400">
                    {activeEndpoint.endpoint}
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

                {activeEndpoint.body ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Content-Type: application/json
                    </p>
                    {/* Replaced manual div with JsonViewer to enforce max-height */}
                    <JsonViewer
                      data={activeEndpoint.body}
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
                <JsonViewer data={activeEndpoint.response} title="200 OK" />
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
                  Send a live request to the mock server using your credentials.
                </p>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
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

                  <div className="flex items-center gap-3">
                    <button
                      onClick={sendTryRequest}
                      disabled={tryLoading}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-wait text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
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
                      <JsonViewer data={tryResponse} title="Status: Received" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default APIDocumentationPage;
