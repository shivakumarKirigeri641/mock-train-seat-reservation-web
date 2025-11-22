import React, { useState } from "react";
import { useNavigate } from "react-router";
import generateTicketPdf from "../utils/generateTicketPdf";

const CancelTicketPage = () => {
  const navigate = useNavigate();
  const [pnrInput, setPnrInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [cancellationStatus, setCancellationStatus] = useState(null); // null, 'success'
  const [error, setError] = useState("");

  // Mock API to fetch ticket
  const handleSearch = (e) => {
    e.preventDefault();
    setError("");
    setTicketData(null);
    setCancellationStatus(null);

    if (!pnrInput || pnrInput.length !== 10 || isNaN(pnrInput)) {
      setError("Please enter a valid 10-digit PNR number.");
      return;
    }

    setLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      setLoading(false);
      setTicketData({
        pnr: pnrInput,
        train: {
          name: "Rajdhani Express",
          number: "22691",
          from: "SBC",
          to: "NZM",
          dep: "20:00",
          arr: "05:30",
          duration: "33h 30m",
        },
        doj: "2025-12-10",
        class: "2A",
        quota: "General",
        totalFare: 3200,
        passengers: [
          { id: 1, name: "Rahul Sharma", age: 45, gender: "M", status: "CNF" },
          { id: 2, name: "Priya Sharma", age: 42, gender: "F", status: "CNF" },
        ],
      });
      setSelectedPassengers([]);
    }, 1200);
  };

  const togglePassenger = (id) => {
    if (selectedPassengers.includes(id)) {
      setSelectedPassengers(selectedPassengers.filter((pid) => pid !== id));
    } else {
      setSelectedPassengers([...selectedPassengers, id]);
    }
  };

  // Mock Cancellation Logic
  const handleCancelTicket = () => {
    if (selectedPassengers.length === 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCancellationStatus("success");

      // Update mock local state to reflect cancellation for the PDF
      const updatedPassengers = ticketData.passengers.map((p) =>
        selectedPassengers.includes(p.id) ? { ...p, status: "CANCELLED" } : p
      );

      setTicketData({
        ...ticketData,
        passengers: updatedPassengers,
        status: "CANCELLED",
      });
    }, 1500);
  };

  const calculateRefund = () => {
    const perPassengerFare =
      ticketData.totalFare / ticketData.passengers.length;
    const cancellationCharge = 240; // Mock charge for 2A
    const refundPerHead = Math.max(0, perPassengerFare - cancellationCharge);
    return refundPerHead * selectedPassengers.length;
  };

  const handleDownloadReceipt = () => {
    // Adapt data for the PDF generator
    const pdfData = {
      pnr: ticketData.pnr,
      train: {
        train_name: ticketData.train.name,
        train_number: ticketData.train.number,
        from: ticketData.train.from,
        to: ticketData.train.to,
        departure: ticketData.train.dep,
        arrival: ticketData.train.arr,
        duration: ticketData.train.duration,
      },
      journey_date: ticketData.doj,
      coach: ticketData.class,
      reservation_type: ticketData.quota,
      passengers: ticketData.passengers.map((p) => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        type: "Adult", // Mock
      })),
      mobile: "XXXXXXXXXX",
      total_fare: `Refund: ₹${calculateRefund()}`, // Show refund on receipt
    };
    generateTicketPdf(pdfData);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100 selection:bg-indigo-500 selection:text-white font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center border border-red-500/20 shadow-lg">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Cancel Ticket
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Select passengers to cancel and view refund details
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

        {/* Step 1: Search PNR (Only show if not cancelled successfully yet) */}
        {!cancellationStatus && (
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 mb-8">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-4 items-end"
            >
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  PNR Number for Cancellation
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={pnrInput}
                  onChange={(e) => {
                    if (
                      e.target.value === "" ||
                      /^[0-9\b]+$/.test(e.target.value)
                    ) {
                      setPnrInput(e.target.value);
                    }
                  }}
                  placeholder="e.g. 8203948245"
                  className="w-full px-5 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-600 text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center border border-gray-600"
              >
                {loading ? "Fetching..." : "Fetch Details"}
              </button>
            </form>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          </div>
        )}

        {/* Step 2: Select Passengers & Confirm */}
        {ticketData && !cancellationStatus && (
          <div className="animate-fade-in-up space-y-6">
            {/* Train Info Summary */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {ticketData.train.name} ({ticketData.train.number})
                </h3>
                <p className="text-sm text-gray-400">
                  {ticketData.doj} • {ticketData.class} • {ticketData.quota}
                </p>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <p className="text-sm text-gray-400">
                  {ticketData.train.from} → {ticketData.train.to}
                </p>
              </div>
            </div>

            {/* Passenger Selection List */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-lg">
              <div className="p-4 bg-gray-900/50 border-b border-gray-700">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Select Passengers to Cancel
                </h4>
              </div>
              <div className="divide-y divide-gray-700">
                {ticketData.passengers.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-700/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedPassengers.includes(p.id)}
                        onChange={() => togglePassenger(p.id)}
                        className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <p className="font-medium text-white">{p.name}</p>
                        <p className="text-xs text-gray-500">
                          {p.age}, {p.gender} • Current Status:{" "}
                          <span className="text-emerald-400">{p.status}</span>
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Refund Calculation Box */}
            {selectedPassengers.length > 0 && (
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Selected Passengers</span>
                  <span className="text-white font-bold">
                    {selectedPassengers.length}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Approx Refund Amount</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    ₹{calculateRefund()}
                  </span>
                </div>
                <p className="text-xs text-indigo-300 mb-4">
                  * Refund will be credited to original source within 3-5
                  working days.
                </p>

                <button
                  onClick={handleCancelTicket}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all transform active:scale-[0.98]"
                >
                  {loading
                    ? "Processing Cancellation..."
                    : "Confirm Cancellation"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Success Screen */}
        {cancellationStatus === "success" && (
          <div className="bg-gray-800 rounded-2xl p-8 text-center border border-gray-700 shadow-2xl animate-fade-in-up">
            <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <svg
                className="w-10 h-10 text-green-400"
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
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Cancellation Successful
            </h2>
            <p className="text-gray-400 mb-8">
              Your ticket has been cancelled. Refund ID:{" "}
              <span className="font-mono text-white">
                REF{Math.floor(Math.random() * 100000)}
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              <button
                onClick={handleDownloadReceipt}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Receipt
              </button>
              <button
                onClick={() => navigate("/user-home")}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 border border-gray-600"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelTicketPage;
