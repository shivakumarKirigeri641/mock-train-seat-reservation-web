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
} from "lucide-react";

// --- API Data Definitions ---
const apiData = [
  {
    id: "stations",
    title: "Get Stations",
    method: "GET",
    endpoint: "/<apikey>/stations",
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
          address: "Amanigunj, Faizabad, Uttar Pradesh, In..",
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
    endpoint: "/<apikey>/coach-type",
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
    endpoint: "/<apikey>/reservation-type",
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
    endpoint: "/<apikey>/search-trains",
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
    endpoint: "/<apikey>/proceed-booking",
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
    endpoint: "/<apikey>/confirm-booking",
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
    endpoint: "/<apikey>/pnr-status",
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
    endpoint: "/<apikey>/cancel-ticket",
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
    endpoint: "/apikey/live-train-running-status",
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

// --- Utility Components ---

const JsonViewer = ({ data, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = JSON.stringify(data, null, 2);
    // Use modern clipboard API if available, fallback handled gracefully by UI state
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-slate-700 bg-[#0f172a] shadow-sm">
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
          {JSON.stringify(data, null, 2)
            .split("\n")
            .map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell text-slate-500 select-none pr-4 text-right w-8">
                  {i + 1}
                </span>
                <span className="table-cell">
                  <SyntaxHighlight line={line} />
                </span>
              </div>
            ))}
        </pre>
      </div>
    </div>
  );
};

// Simple syntax highlighting component
const SyntaxHighlight = ({ line }) => {
  // Very basic regex to split keys and values for visual coloring
  const parts = line.split(/(".*?"|:|\d+|true|false|null)/g).filter(Boolean);

  return (
    <span>
      {parts.map((part, index) => {
        let color = "text-slate-300"; // default punctuation
        if (part.startsWith('"')) {
          if (line.trim().startsWith(part) && line.includes(":")) {
            color = "text-sky-400"; // keys
          } else {
            color = "text-emerald-400"; // string values
          }
        } else if (!isNaN(Number(part))) {
          color = "text-orange-400"; // numbers
        } else if (["true", "false", "null"].includes(part)) {
          color = "text-rose-400"; // booleans
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

// --- Main Layout Component ---

const APIDocumentationPage = () => {
  const [activeId, setActiveId] = useState(apiData[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeApi = apiData.find((api) => api.id === activeId) || apiData[0];

  const scrollToSection = (id) => {
    setActiveId(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100 selection:bg-indigo-500 selection:text-white font-sans">
      {/* Navbar */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-[#0b1120] border-r border-slate-800 
            overflow-y-auto transition-transform duration-300 z-40
            ${
              mobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          <div className="p-4 space-y-8">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">
                Endpoints
              </h3>
              <nav className="space-y-1">
                {apiData.map((api) => (
                  <button
                    key={api.id}
                    onClick={() => scrollToSection(api.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                      ${
                        activeId === api.id
                          ? "bg-slate-800 text-indigo-400 font-medium"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }
                    `}
                  >
                    <span
                      className={`
                      text-[10px] font-bold w-10 text-center py-0.5 rounded border
                      ${
                        api.method === "GET"
                          ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                          : "text-blue-400 border-blue-500/30 bg-blue-500/10"
                      }
                    `}
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
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 px-4 lg:px-12 py-8 lg:py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Header Section for Active API */}
            <div className="space-y-6 animate-in fade-in duration-500">
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
                  <span className="text-indigo-400 select-all">
                    {activeApi.endpoint}
                  </span>
                </div>
              </div>

              {/* Request Parameters Section */}
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
                    <JsonViewer data={activeApi.body} title="Payload Example" />
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800/50 text-sm text-slate-400 italic">
                    No request body required for this endpoint. Ensure the API
                    Key is included in the URL.
                  </div>
                )}
              </div>

              {/* Response Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-slate-100 font-semibold">
                  <Code size={18} className="text-emerald-500" />
                  <h3>Response</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      200 OK
                    </span>
                    <span className="text-slate-500">application/json</span>
                  </div>
                  <JsonViewer
                    data={activeApi.response}
                    title="Response Example"
                  />
                  {activeApi.note && (
                    <div className="mt-4 p-4 border-l-4 border-amber-500/50 bg-amber-500/5 rounded-r-lg text-sm text-amber-200/80">
                      <strong>Note:</strong> {activeApi.note}
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
