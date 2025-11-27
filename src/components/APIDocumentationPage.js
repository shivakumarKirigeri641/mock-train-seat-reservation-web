import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Copy,
  Check,
  Server,
  ChevronRight,
  Globe,
  Code,
  Box,
  Terminal,
  Sun,
  Moon,
} from "lucide-react";

// ---------------- API DATA DEFINITIONS (All endpoints included) ----------------
const apiData = [
  {
    id: "stations",
    title: "Get Stations",
    method: "GET",
    endpoint: "/stations",
    description:
      "Retrieve a comprehensive list of all available train stations.",
    response: {
      status: 200,
      success: true,
      message: "Stations fetch successful",
      data: [
        {
          id: 41,
          code: "ACND",
          station_name: "A N DEV NAGAR",
          zone: "NR",
          address: "Amanigunj, Faizabad, Uttar Pradesh, India",
        },
        {
          id: 338,
          code: "ASBS",
          station_name: "A S BHALE SULTN",
          zone: "NR",
          address: "Misharauli, Uttar Pradesh, India",
        },
      ],
    },
  },
  {
    id: "coach-type",
    title: "Get Coach Types",
    method: "GET",
    endpoint: "/coach-type",
    description:
      "Fetch all available coach class types (e.g., First AC, Second AC).",
    response: {
      status: 200,
      success: true,
      message: "Coach type fetch successful",
      data: [
        { coach_code: "1A", coach_name: "First AC" },
        { coach_code: "2A", coach_name: "Second AC" },
        { coach_code: "3A", coach_name: "Third AC" },
      ],
    },
  },
  {
    id: "reservation-type",
    title: "Get Reservation Types",
    method: "GET",
    endpoint: "/reservation-type",
    description: "Fetch all reservation categories (e.g., General, Tatkal).",
    response: {
      status: 200,
      success: true,
      message: "Reservation type fetch successful",
      data: [
        { type_code: "GEN", description: "General" },
        { type_code: "TTL", description: "Tatkal Lower" },
        { type_code: "PTL", description: "Premium Tatkal Lower" },
      ],
    },
  },
  {
    id: "search-trains",
    title: "Search Trains",
    method: "POST",
    endpoint: "/search-trains",
    description:
      "Search for available trains between source and destination stations.",
    body: {
      source_code: "ypr",
      destination_code: "hvr",
      doj: "2025-12-3",
      coach_type: null,
      reservation_type: null,
    },
    response: {
      status: 200,
      success: true,
      message: "Trains fetch successful",
      data: {
        source: "YESVANTPUR JN",
        source_code: "YPR",
        destination: "HAVERI",
        destination_code: "HVR",
        date_of_journey: "2025-12-3",
        trains_list: [
          {
            train_number: "17391",
            train_name: "SBC UBL EXP",
            train_type: "Mail Express",
            station_from: "KSR BANGALORE CY JN",
            station_to: "HUBBALLI JN",
            scheduled_departure: "00:27:00",
            estimated_arrival: "06:48:00",
            journey_duration: "6 hours 21 minutes",
            seat_count_gen_sl: "682",
          },
        ],
      },
    },
  },
  {
    id: "proceed-booking",
    title: "Proceed Booking",
    method: "POST",
    endpoint: "/proceed-booking",
    description:
      "Summarize booking details and generate a booking ID before confirmation.",
    note: "This API is called after summarizing passenger details.",
    response: {
      status: 200,
      success: true,
      message: "Proceed booking successful",
      data: {
        booked_details: {
          id: 47,
          fktrain_number: 1641,
          date_of_journey: "2025-12-03",
          proceed_status: false,
          pnr: null,
        },
        passenger_details: [
          {
            id: 1071672,
            p_name: "Amruta",
            p_age: 36,
            p_gender: "F",
          },
        ],
        fare_details: {
          base_fare: 388,
          GST: "18.00",
          gross_fare: 462.884,
        },
      },
    },
  },
  {
    id: "confirm-booking",
    title: "Confirm & Pay",
    method: "POST",
    endpoint: "/confirm-booking",
    description:
      "Confirm the booking and process payment using the Booking ID.",
    body: {
      booking_id: 47,
    },
    response: {
      status: 200,
      success: true,
      message: "Booking confirmed",
      data: {
        result_updated_bookingdetails: {
          id: 47,
          pnr: "PNR001528",
          pnr_status: "CNF",
          proceed_status: true,
        },
        result_udpated_passengerdetails: [
          {
            p_name: "Amruta",
            seat_status: "CNF",
            current_seat_status: "SL10/34/MB",
          },
        ],
      },
    },
  },
  {
    id: "pnr-status",
    title: "PNR Status",
    method: "POST",
    endpoint: "/pnr-status",
    description: "Check the current status of a PNR.",
    body: {
      pnr: "PNR001527",
    },
    response: {
      status: 200,
      success: true,
      message: "PNR status fetched",
      data: {
        id: 1071619,
        train_number: "17391",
        pnr_status: "CNF",
        current_seat_status: "SL10/56/SU",
      },
    },
  },
  {
    id: "cancel-ticket",
    title: "Cancel Ticket",
    method: "POST",
    endpoint: "/cancel-ticket",
    description: "Cancel specific passengers from a booked ticket.",
    body: {
      pnr: "PNR001527",
      passengerids: [1071673],
    },
    response: {
      status: 200,
      success: true,
      message: "Cancellation processed",
      data: {
        result_bookingdata: {
          pnr_status: "CAN",
          refund_amount: "940",
        },
      },
    },
  },
  {
    id: "live-station",
    title: "Live Station",
    method: "POST",
    endpoint: "/live-station",
    description:
      "Get live train arrivals and departures for a station within the next N hours.",
    body: {
      station_code: "MYS",
      next_hours: 2,
    },
    response: {
      status: 200,
      success: true,
      message: "Live station data fetched",
      data: {
        trains_list: [
          {
            train_number: "16226",
            train_name: "SMET MYS EXP",
            status: "Departed",
            eta_hhmm: "00:03",
          },
          {
            train_number: "16219",
            status: "Yet to arrive",
            eta_hhmm: "00:13",
          },
        ],
      },
    },
  },
  {
    id: "live-train-status",
    title: "Live Train Status",
    method: "POST",
    endpoint: "/live-train-running-status",
    description:
      "Get the current running status and location of a specific train.",
    body: {
      train_number: "12080",
    },
    response: {
      status: 200,
      success: true,
      message: "Live train running status fetched",
      data: {
        trains_list: [
          {
            station_name: "HUBBALLI JN",
            train_status_at_station: "Departed",
            departure_time: "2025-11-27 14:05:00",
          },
          {
            station_name: "HAVERI",
            train_status_at_station: "Departed",
          },
        ],
      },
    },
  },
  {
    id: "train-schedule",
    title: "Train Schedule",
    method: "POST",
    endpoint: "/train-schedule",
    description:
      "Get the full schedule and route details for a specific train number.",
    body: {
      train_number: "20661",
    },
    response: {
      status: 200,
      success: true,
      message: "Train schedule fetched successfully!",
      data: {
        train_details: {
          train_name: "DWR VANDE BHARAT",
          train_runs_on_mon: "Y",
          train_runs_on_sun: "Y",
        },
        train_schedule_details: [
          {
            station_name: "KSR BANGALORE CY JN",
            departure: "05:45:00",
            kilometer: 0,
          },
          {
            station_name: "YESVANTPUR JN",
            arrival: "05:55:00",
            departure: "05:57:00",
          },
        ],
      },
    },
  },
];

// ---------------- UTILITY COMPONENTS ----------------

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
    <div className="mt-4 rounded-lg overflow-hidden border border-slate-700 bg-[#0f172a] shadow-sm animate-in fade-in duration-700">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
          {title}
        </span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? (
            <Check size={14} className="text-emerald-400" />
          ) : (
            <Copy size={14} />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

const SyntaxHighlight = ({ line }) => {
  const parts = line.split(/(".*?"|:|\d+|true|false|null)/g).filter(Boolean);

  return (
    <span>
      {parts.map((part, index) => {
        let color = "text-slate-300";
        if (part.startsWith('"')) {
          if (line.trim().startsWith(part) && line.includes(":")) {
            color = "text-sky-400";
          } else {
            color = "text-emerald-400";
          }
        } else if (!isNaN(Number(part))) {
          color = "text-orange-400";
        } else if (["true", "false", "null"].includes(part)) {
          color = "text-rose-400";
        }
        return (
          <span key={index} className={color}>
            {part}
          </span>
        );
      })}
    </span>
  );
};

const MethodBadge = ({ method }) => {
  const colors = {
    GET: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    POST: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PUT: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    DELETE: "bg-red-500/10 text-red-500 border-red-500/20",
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
  const [activeId, setActiveId] = useState(apiData[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeApi = apiData.find((api) => api.id === activeId) || apiData[0];

  // Enhancements state
  const [searchQuery, setSearchQuery] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const [tryBody, setTryBody] = useState(
    activeApi.body ? JSON.stringify(activeApi.body, null, 2) : ""
  );
  const [tryResponse, setTryResponse] = useState(null);
  const [tryLoading, setTryLoading] = useState(false);

  const baseURL = "https://yourdomain.com";

  useEffect(() => {
    setTryBody(activeApi.body ? JSON.stringify(activeApi.body, null, 2) : "");
    setTryResponse(null);
  }, [activeId]); // reset try panel when switching endpoints

  const scrollToSection = (id) => {
    setActiveId(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sendTryRequest = async () => {
    setTryLoading(true);
    setTryResponse(null);

    try {
      if (!apiKey) {
        throw new Error("Please enter your API key in the top input.");
      }

      const url = `${baseURL}/${apiKey}/api${activeApi.endpoint}`;
      const options = {
        method: activeApi.method,
        headers: { "Content-Type": "application/json" },
        body: activeApi.body ? tryBody : null,
      };

      // If GET method, remove body
      if (activeApi.method === "GET") delete options.body;

      const res = await fetch(url, options);
      const text = await res.text();
      // try parsing JSON, fallback to raw text
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
    <div
      className={`${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      } min-h-screen p-4 md:p-8 transition-colors duration-500`}
    >
      {/* API Key Input */}
      <div className="max-w-xl mx-auto mb-10 p-4 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur animate-in fade-in duration-700">
        <label className="text-sm text-slate-300">Your API Key</label>
        <div className="flex mt-2 gap-2">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key…"
            className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(apiKey);
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 1500);
              }
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
          >
            {copiedKey ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="w-full mb-10 animate-in fade-in duration-700">
        <div className="max-w-5xl mx-auto text-center py-12 px-4 rounded-2xl bg-gradient-to-br from-indigo-700/30 via-purple-700/20 to-slate-900 border border-slate-700 shadow-xl backdrop-blur">
          <h1 className="text-4xl md:text-5xl font-extrabold flex justify-center items-center gap-3 text-white">
            <Server className="w-10 h-10 text-indigo-400 animate-pulse" />
            Train Reservation API
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300">
            Fast, secure and developer-friendly API to access stations, train
            schedules, bookings, PNR status, cancellations, and live train
            updates.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700 hover:bg-slate-800/60 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="text-indigo-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold">RESTful Design</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Clear endpoints, predictable structure, developer-first output.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700 hover:bg-slate-800/60 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <Terminal className="text-purple-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold">JSON Responses</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Every endpoint returns clean, well-structured JSON.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700 hover:bg-slate-800/60 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <Code className="text-emerald-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold">Easy Integration</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Perfect for apps, dashboards, chatbots, and automation flows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LAYOUT */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-[#0b1120] border-r border-slate-800 overflow-y-auto transition-transform duration-300 z-40 ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 space-y-8">
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-slate-300"
            />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">
              Endpoints
            </h3>
            <nav className="space-y-1">
              {apiData
                .filter((api) =>
                  api.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((api) => (
                  <button
                    key={api.id}
                    onClick={() => scrollToSection(api.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                      activeId === api.id
                        ? "bg-slate-800 text-indigo-400 font-medium"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold w-10 text-center py-0.5 rounded border ${
                        api.method === "GET"
                          ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                          : "text-blue-400 border-blue-500/30 bg-blue-500/10"
                      }`}
                    >
                      {api.method}
                    </span>
                    <span className="truncate">{api.title}</span>
                    {activeId === api.id && (
                      <ChevronRight
                        size={14}
                        className="ml-auto text-indigo-500"
                      />
                    )}
                  </button>
                ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 w-full min-w-0 px-4 lg:px-12 py-8">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6 animate-in fade-in duration-700">
              <div className="flex flex-col gap-4 border-b border-slate-800 pb-8">
                <div className="flex items-center gap-3">
                  <MethodBadge method={activeApi.method} />
                  <h2 className="text-3xl font-bold text-slate-100">
                    {activeApi.title}
                  </h2>
                </div>

                <p className="text-slate-400 text-lg leading-relaxed">
                  {activeApi.description}
                </p>

                <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-800 font-mono text-sm text-slate-300 break-all">
                  <Server size={16} className="text-slate-500 shrink-0" />
                  <span className="text-indigo-400 select-all">{`${baseURL}/${apiKey}/api${activeApi.endpoint}`}</span>
                </div>
              </div>

              {/* Request */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-100 font-semibold">
                  <Box size={18} className="text-indigo-500" />
                  <h3>Request</h3>
                </div>

                {activeApi.body ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-400">
                      The request body should be formatted as JSON.
                    </p>
                    <div className="mt-4 rounded-lg overflow-hidden border border-slate-700 bg-[#0f172a] shadow-sm">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                          Payload Example
                        </span>
                        <button
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(
                                JSON.stringify(activeApi.body, null, 2)
                              );
                            }
                          }}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                        >
                          <Copy size={14} /> Copy
                        </button>
                      </div>
                      <div className="p-4 overflow-x-auto">
                        <pre className="text-sm font-mono leading-relaxed">
                          {JSON.stringify(activeApi.body, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800/50 text-sm text-slate-400 italic">
                    No request body required for this endpoint. Ensure the API
                    Key is included in the URL.
                  </div>
                )}
              </div>

              {/* Response */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-slate-100 font-semibold">
                  <Code size={18} className="text-emerald-500" />
                  <h3>Response</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      200 OK
                    </span>
                    <span className="text-slate-500">application/json</span>
                  </div>

                  <div className="mt-4 rounded-lg overflow-hidden border border-slate-700 bg-[#0f172a] shadow-sm animate-in fade-in duration-700">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                        Response Example
                      </span>
                      <button
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(
                              JSON.stringify(activeApi.response, null, 2)
                            );
                          }
                        }}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        <Copy size={14} /> Copy
                      </button>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-sm font-mono leading-relaxed">
                        {JSON.stringify(activeApi.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Try It Panel */}
              <div className="mt-10 p-6 rounded-xl bg-slate-800/50 border border-slate-700 space-y-4 animate-in fade-in duration-700">
                <h3 className="text-xl font-bold text-indigo-400">
                  Try This API
                </h3>
                <p className="text-slate-400 text-sm">
                  Automatically tests the selected endpoint using your API key.
                  Responses are shown below.
                </p>

                {activeApi.body && (
                  <textarea
                    rows={6}
                    value={tryBody}
                    onChange={(e) => setTryBody(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg font-mono text-sm"
                  />
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={sendTryRequest}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold"
                  >
                    {tryLoading ? "Loading…" : "Send Request"}
                  </button>

                  <button
                    onClick={() => {
                      // quick-fill API key sample for demo
                      setApiKey("DEMO_API_KEY");
                      setCopiedKey(false);
                    }}
                    className="px-3 py-2 rounded-lg border border-slate-700 text-slate-300"
                  >
                    Fill Demo Key
                  </button>

                  <div className="text-sm text-slate-400 font-mono">
                    {baseURL}/{"<apikey>"}/api{activeApi.endpoint}
                  </div>
                </div>

                {tryResponse && (
                  <div className="mt-4">
                    <JsonViewer data={tryResponse} title="Live Response" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default APIDocumentationPage;
