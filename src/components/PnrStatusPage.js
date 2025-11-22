import React, { useState } from "react";
import { useNavigate } from "react-router";
import generateTicketPdf from "../utils/generateTicketPdf";

const PNRStatusPage = () => {
  const navigate = useNavigate();
  const [pnrInput, setPnrInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pnrData, setPnrData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");
    setPnrData(null);

    // Basic Validation
    if (!pnrInput || pnrInput.length !== 10 || isNaN(pnrInput)) {
      setError("Please enter a valid 10-digit PNR number.");
      return;
    }

    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      // Mock Response Generation
      setPnrData({
        pnr: pnrInput,
        train_number: "12627",
        train_name: "Karnataka Express",
        doj: "2025-11-15",
        from: "SBC",
        to: "NDLS",
        boarding: "SBC",
        reserved_upto: "NDLS",
        class: "3A",
        chart_prepared: true,
        total_fare: "₹ 2,450", // Added for PDF
        passengers: [
          {
            name: "Passenger 1",
            booking_status: "CNF/B1/23",
            current_status: "CNF",
            age: "24", // Added for PDF
            gender: "M", // Added for PDF
          },
          {
            name: "Passenger 2",
            booking_status: "CNF/B1/24",
            current_status: "CNF",
            age: "22", // Added for PDF
            gender: "F", // Added for PDF
          },
          {
            name: "Passenger 3",
            booking_status: "WL/12",
            current_status: "RAC/4",
            age: "45", // Added for PDF
            gender: "M", // Added for PDF
          },
        ],
      });
    }, 1500);
  };

  const handleDownloadPdf = () => {
    if (!pnrData) return;

    // Adapt PNR data to the structure expected by generateTicketPdf
    const ticketObj = {
      pnr: pnrData.pnr,
      train: {
        train_name: pnrData.train_name,
        train_number: pnrData.train_number,
        from: pnrData.from,
        to: pnrData.to,
        departure: "19:20", // Mock time as PNR status might not have it
        arrival: "08:30", // Mock time
        duration: "32h 10m",
      },
      journey_date: pnrData.doj,
      coach: pnrData.class,
      reservation_type: "General",
      passengers: pnrData.passengers.map((p) => ({
        name: p.name,
        age: p.age || "Adult",
        gender: p.gender || "M",
        type: "Adult",
      })),
      mobile: "XXXXXXXXXX", // Privacy masking
      total_fare: pnrData.total_fare || "₹ --",
    };

    generateTicketPdf(ticketObj);
  };

  const getStatusColor = (status) => {
    if (status === "CNF")
      return "text-emerald-400 bg-emerald-900/30 border-emerald-500/30";
    if (status.includes("RAC"))
      return "text-blue-400 bg-blue-900/30 border-blue-500/30";
    if (status.includes("WL"))
      return "text-yellow-400 bg-yellow-900/30 border-yellow-500/30";
    return "text-gray-400 bg-gray-800 border-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100 selection:bg-indigo-500 selection:text-white font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center border border-purple-500/20 shadow-lg">
              <svg
                className="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                PNR Status
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Check real-time mock reservation status
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/user-home")}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium text-gray-300 transition-colors border border-gray-700"
          >
            Back to Dashboard
          </button>
        </header>

        {/* Search Box */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 items-start md:items-center"
          >
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Enter PNR Number
              </label>
              <input
                type="text"
                maxLength={10}
                value={pnrInput}
                onChange={(e) => {
                  // Only allow numbers
                  if (
                    e.target.value === "" ||
                    /^[0-9\b]+$/.test(e.target.value)
                  ) {
                    setPnrInput(e.target.value);
                  }
                }}
                placeholder="e.g. 8203948245"
                className="w-full px-5 py-4 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-600 text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
              {error && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto mt-6 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Checking...</span>
                </>
              ) : (
                "Check Status"
              )}
            </button>
          </form>
        </div>

        {/* PNR Result Section */}
        {pnrData && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Train Details Card */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">
                    {pnrData.train_name}
                  </h2>
                  <span className="px-2 py-1 bg-gray-700 rounded text-xs font-mono text-gray-300">
                    {pnrData.train_number}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      pnrData.chart_prepared ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  ></span>
                  <span className="text-sm text-gray-300 font-medium">
                    {pnrData.chart_prepared
                      ? "Chart Prepared"
                      : "Chart Not Prepared"}
                  </span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Journey Date
                  </p>
                  <p className="text-lg font-medium text-white mt-1">
                    {pnrData.doj}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Boarding Stn
                  </p>
                  <p className="text-lg font-medium text-white mt-1">
                    {pnrData.boarding}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Reserved Upto
                  </p>
                  <p className="text-lg font-medium text-white mt-1">
                    {pnrData.reserved_upto}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Class</p>
                  <p className="text-lg font-medium text-white mt-1">
                    {pnrData.class}
                  </p>
                </div>
              </div>
            </div>

            {/* Passenger List */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-lg">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Passenger Status
              </h3>

              <div className="overflow-hidden rounded-xl border border-gray-700">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900/50 text-gray-500 font-semibold uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3">Passenger</th>
                      <th className="px-4 py-3">Booking Status</th>
                      <th className="px-4 py-3">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {pnrData.passengers.map((p, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-300">
                          Passenger {i + 1}
                        </td>
                        <td className="px-4 py-3 text-gray-400 font-mono">
                          {p.booking_status}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-bold border ${getStatusColor(
                              p.current_status
                            )}`}
                          >
                            {p.current_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <button
                onClick={handleDownloadPdf}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all font-semibold flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Ticket PDF
              </button>
              <button
                onClick={() => navigate("/user-home")}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl shadow-lg transition-all font-semibold flex items-center justify-center gap-2 border border-gray-600"
              >
                Back to Dashboard
              </button>
            </div>

            {/* Disclaimer */}
            <div className="text-center text-xs text-gray-500 mt-2">
              * Mock Data generated for testing purposes. Status shown is not
              real.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PNRStatusPage;
