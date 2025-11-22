import React, { useState } from "react";
import { useNavigate } from "react-router";

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL"); // ALL, UPCOMING, COMPLETED, CANCELLED

  // Mock Data
  const allBookings = [
    {
      id: 1,
      pnr: "8203948245",
      train_name: "Karnataka Express",
      train_number: "12627",
      from: "SBC",
      to: "NDLS",
      date: "2025-11-15", // Upcoming
      status: "CNF",
      class: "3A",
      fare: "₹2,450",
      passengers: 2,
    },
    {
      id: 2,
      pnr: "4592837102",
      train_name: "Vande Bharat Exp",
      train_number: "20607",
      from: "MAS",
      to: "MYS",
      date: "2025-11-20", // Upcoming
      status: "WL 14",
      class: "CC",
      fare: "₹1,100",
      passengers: 1,
    },
    {
      id: 3,
      pnr: "1928374655",
      train_name: "Shatabdi Express",
      train_number: "12007",
      from: "MAS",
      to: "SBC",
      date: "2025-10-05", // Past
      status: "COMPLETED",
      class: "EC",
      fare: "₹1,850",
      passengers: 1,
    },
    {
      id: 4,
      pnr: "7738291023",
      train_name: "Hampi Express",
      train_number: "16592",
      from: "SBC",
      to: "HPT",
      date: "2025-09-12", // Past
      status: "CANCELLED",
      class: "SL",
      fare: "₹345",
      passengers: 4,
    },
    {
      id: 5,
      pnr: "3344556677",
      train_name: "Rajdhani Express",
      train_number: "22691",
      from: "SBC",
      to: "NZM",
      date: "2025-08-20", // Past
      status: "COMPLETED",
      class: "2A",
      fare: "₹3,200",
      passengers: 2,
    },
  ];

  // Logic to filter bookings based on selected tab
  const filteredBookings = allBookings.filter((b) => {
    const today = new Date().toISOString().split("T")[0];
    if (filter === "ALL") return true;
    if (filter === "CANCELLED") return b.status === "CANCELLED";
    if (filter === "COMPLETED")
      return (
        b.status === "COMPLETED" || (b.date < today && b.status !== "CANCELLED")
      );
    if (filter === "UPCOMING")
      return (
        b.date >= today && b.status !== "CANCELLED" && b.status !== "COMPLETED"
      );
    return true;
  });

  const getStatusColor = (status) => {
    if (status.includes("CNF"))
      return "bg-emerald-900/30 text-emerald-400 border-emerald-500/30";
    if (status.includes("WL"))
      return "bg-yellow-900/30 text-yellow-400 border-yellow-500/30";
    if (status === "CANCELLED")
      return "bg-red-900/30 text-red-400 border-red-500/30";
    return "bg-gray-700 text-gray-400 border-gray-600"; // Completed/Others
  };

  const handleViewTicket = (booking) => {
    // Navigate to confirmation page to simulate viewing ticket
    navigate("/ticket-confirmation", {
      state: {
        pnr: booking.pnr,
        train: {
          train_name: booking.train_name,
          train_number: booking.train_number,
          from: booking.from,
          to: booking.to,
          departure: "10:00", // Mock data
          arrival: "18:00", // Mock data
        },
        adults: [{ name: "Passenger 1", age: 25, gender: "M" }], // Mock
        mobile: "9999999999",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center border border-emerald-500/20 shadow-lg">
              <svg
                className="w-6 h-6 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                My Bookings
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Manage your upcoming journeys and view past history
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

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
          {["ALL", "UPCOMING", "COMPLETED", "CANCELLED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                filter === tab
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700">
              <div className="inline-block p-4 rounded-full bg-gray-900 mb-4">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white">
                No bookings found
              </h3>
              <p className="text-gray-500 mt-1">
                There are no {filter.toLowerCase()} bookings to display.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-800 rounded-xl p-5 md:p-6 border border-gray-700 hover:border-indigo-500/30 transition-all shadow-md group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left: Trip Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {booking.train_name}
                        </h3>
                        <span className="text-xs font-mono text-gray-500 bg-gray-900 px-2 py-0.5 rounded border border-gray-700">
                          #{booking.train_number}
                        </span>
                      </div>
                      {/* Status Badge (Mobile) */}
                      <span
                        className={`md:hidden px-2.5 py-1 rounded text-xs font-bold border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{booking.date}</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="flex items-center gap-1.5">
                        <span>{booking.from}</span>
                        <svg
                          className="w-3 h-3 text-gray-600"
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
                        <span>{booking.to}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-wide">
                      <span>
                        PNR:{" "}
                        <span className="text-gray-300 font-mono ml-1">
                          {booking.pnr}
                        </span>
                      </span>
                      <span>
                        Class:{" "}
                        <span className="text-gray-300 ml-1">
                          {booking.class}
                        </span>
                      </span>
                      <span>
                        Fare:{" "}
                        <span className="text-gray-300 ml-1">
                          {booking.fare}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions & Status (Desktop) */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:border-l md:border-gray-700 md:pl-6 md:min-w-[180px]">
                    <span
                      className={`hidden md:inline-block px-3 py-1 rounded-md text-xs font-bold border tracking-wide ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                    <div className="flex gap-3 w-full md:w-auto">
                      {booking.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleViewTicket(booking)}
                          className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                        >
                          View Ticket
                        </button>
                      )}
                      {(booking.status === "CNF" ||
                        booking.status.includes("WL")) &&
                        booking.date >=
                          new Date().toISOString().split("T")[0] && (
                          <button className="flex-1 md:flex-none px-4 py-2 bg-gray-700 hover:bg-red-900/50 hover:text-red-200 text-gray-300 text-sm font-medium rounded-lg transition-colors border border-gray-600 hover:border-red-800">
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryPage;
