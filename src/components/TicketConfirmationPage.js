import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

// --- Icons ---
const CheckIcon = ({ className }) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const TrainIcon = ({ className }) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 10h16v10a1 1 0 01-1 1H5a1 1 0 01-1-1V10zM4 10l2-6h12l2 6M9 21v-3m6 3v-3M9 10V6m6 4V6"
    />
    <circle cx="15" cy="15" r="2" />
    <circle cx="9" cy="15" r="2" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const TicketConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  const booking = state?.booking;
  const passengers = state?.passengers || [];

  // Page fade-in animation
  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Invalid ticket data. Please return home.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10">
      <div
        className={`max-w-4xl mx-auto transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-600/20 mx-auto rounded-full flex items-center justify-center mb-4">
            <CheckIcon className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-400">
            Ticket Confirmed!
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Your MOCK booking was successful. Below are your ticket details.
          </p>
        </div>

        {/* Ticket Card */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700 flex items-center gap-2">
            <TrainIcon className="w-6 h-6 text-indigo-400" />
            <span className="font-semibold text-white text-lg">
              Chekudla mock train reservation system
            </span>
          </div>

          {/* Main Details */}
          <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300">
            <div>
              <p className="text-[11px] uppercase text-slate-500 font-bold">
                PNR Number
              </p>
              <p className="text-xl font-mono text-emerald-400">
                {booking.pnr}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Status:{" "}
                <span className="text-emerald-300 font-medium">
                  {booking.pnr_status}
                </span>
              </p>
            </div>

            <div>
              <p className="text-[11px] uppercase text-slate-500 font-bold">
                Train No.
              </p>
              <p className="text-xl font-semibold">{booking.fktrain_number}</p>
            </div>

            <div>
              <p className="text-[11px] uppercase text-slate-500 font-bold">
                Journey Date
              </p>
              <p className="text-xl font-semibold">{booking.date_of_journey}</p>
            </div>
          </div>

          {/* Route */}
          <div className="px-6 pb-6">
            <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">
                Route
              </p>
              <p className="text-lg">
                <span className="text-indigo-300 font-semibold">
                  {booking.source_name}
                </span>{" "}
                ➜{" "}
                <span className="text-indigo-300 font-semibold">
                  {booking.destination_name}
                </span>
              </p>
            </div>
          </div>

          {/* Passenger Section */}
          <div className="px-6 pb-6">
            <p className="text-[11px] uppercase text-slate-500 font-bold mb-3 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-slate-400" />
              Passengers ({passengers.length})
            </p>

            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">Gender</th>
                    <th className="px-4 py-3">Berth/Seat</th>
                    <th className="px-4 py-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {passengers.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 text-white">{p.p_name}</td>
                      <td className="px-4 py-3">{p.p_age}</td>
                      <td className="px-4 py-3">{p.p_gender}</td>
                      <td className="px-4 py-3 font-mono text-indigo-300">
                        {p.updated_seat_status}
                      </td>
                      <td className="px-4 py-3">
                        {p.is_adult && (
                          <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                            Adult
                          </span>
                        )}
                        {p.is_child && (
                          <span className="text-xs bg-blue-800/40 text-blue-300 px-2 py-1 rounded ml-2">
                            Child
                          </span>
                        )}
                        {p.is_senior && (
                          <span className="text-xs bg-yellow-800/40 text-yellow-300 px-2 py-1 rounded ml-2">
                            Senior
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 bg-slate-800 border-t border-slate-700 flex justify-between items-center">
            <button
              onClick={() => navigate("/user-home")}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/book-ticket")}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold shadow-lg"
            >
              Book another ticket
            </button>
            <button
              onClick={() => alert("PDF generation will be implemented")}
              className="px-5 py-2 bg-green-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold shadow-lg"
            >
              Download Ticket (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketConfirmationPage;
