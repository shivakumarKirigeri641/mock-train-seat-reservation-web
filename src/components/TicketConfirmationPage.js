import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import generateTicketPdf from "../utils/generateTicketPdf";

const TicketConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve state passed from PassengerDetailsPage
  const { train, adults, children, mobile, pnr } = location.state || {};

  // Merge logic: If state exists, use it; otherwise fallback to placeholder
  const ticketData = useMemo(() => {
    if (train && pnr) {
      const passengers = [
        ...(adults || []).map((a) => ({ ...a, type: "Adult" })),
        ...(children || []).map((c) => ({ ...c, type: "Child" })),
      ];

      return {
        pnr,
        train,
        journey_date: new Date().toISOString().split("T")[0], // Mock date if missing
        coach: "3A", // Mock default if missing
        reservation_type: "General",
        passengers,
        mobile,
        total_fare: "₹" + (train.fare || "850"),
      };
    }

    // Fallback Mock Data
    return {
      pnr: "87X92K",
      train: {
        train_number: "12627",
        train_name: "Karnataka Express",
        departure: "10:30",
        arrival: "18:45",
        from: "SBC",
        to: "NDLS",
        duration: "32h 15m",
      },
      journey_date: "2025-01-12",
      coach: "3A",
      reservation_type: "General",
      passengers: [
        { name: "Rakesh", age: 32, gender: "M", type: "Adult" },
        { name: "Diya", age: 4, gender: "F", type: "Child" },
      ],
      mobile: "9876543210",
      total_fare: "₹1420",
    };
  }, [train, adults, children, mobile, pnr]);

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-10 flex justify-center text-gray-100 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 relative overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <svg
              className="w-10 h-10 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-400">
            Your ticket has been successfully booked and sent to{" "}
            <span className="text-gray-300 font-mono">{ticketData.mobile}</span>
          </p>
        </div>

        {/* PNR Badge */}
        <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl p-6 mb-8 text-center relative">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
            PNR Number
          </p>
          <span className="text-3xl font-mono font-bold text-emerald-400 tracking-wider">
            {ticketData.pnr}
          </span>
          {/* Cutout circles for ticket effect */}
          <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-900 rounded-full transform -translate-y-1/2 border-r border-gray-700"></div>
          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-900 rounded-full transform -translate-y-1/2 border-l border-gray-700"></div>
        </div>

        {/* Train Details */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Journey Details
          </h2>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Train
              </p>
              <p className="font-semibold text-white text-lg">
                {ticketData.train.train_name}
              </p>
              <p className="text-indigo-400 font-mono text-sm">
                {ticketData.train.train_number}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Date
              </p>
              <p className="font-semibold text-white text-lg">
                {ticketData.journey_date}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Route
              </p>
              <div className="flex items-center gap-2 text-gray-200">
                <span className="font-medium">{ticketData.train.from}</span>
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
                <span className="font-medium">{ticketData.train.to}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {ticketData.train.departure} - {ticketData.train.arrival}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Class & Quota
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300">
                  {ticketData.coach}
                </span>
                <span className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300">
                  {ticketData.reservation_type}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Passengers
          </h2>

          <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
            {ticketData.passengers.map((p, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 border-b border-gray-800 last:border-none hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{p.name}</p>
                    <p className="text-xs text-gray-400">
                      {p.age} Yrs •{" "}
                      {p.gender === "M"
                        ? "Male"
                        : p.gender === "F"
                        ? "Female"
                        : "Other"}{" "}
                      • {p.type}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded font-medium border border-green-900/50">
                  CNF / S{idx + 1}-2{idx + 3}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Fare Section */}
        <div className="flex justify-between items-center p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl mb-8">
          <span className="text-gray-300 font-medium">Total Paid</span>
          <span className="text-2xl font-bold text-white">
            {ticketData.total_fare}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => generateTicketPdf(ticketData)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all font-semibold flex items-center justify-center gap-2"
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

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/book-ticket", { replace: true })}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl transition-colors font-medium border border-gray-600"
            >
              Book Another
            </button>
            <button
              onClick={() => navigate("/user-home", { replace: true })}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl transition-colors font-medium border border-gray-600"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketConfirmationPage;
