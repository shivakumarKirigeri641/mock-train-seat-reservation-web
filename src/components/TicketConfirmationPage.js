import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import generateTicketPdf from "../utils/generateTicketPdf";

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
  console.log(state);
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  const booking = state?.booking;
  const passengers = state?.passengers || [];
  const fare_details = state?.fare_details || {};

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

          {/**train section */}
          <div className="p-6">
            <p className="text-[11px] uppercase text-slate-500 font-bold mb-3 flex items-center gap-2 ">
              <TrainIcon className="w-4 h-4 text-slate-400" />
              Mock train details
            </p>

            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <div className="flex justify-around items-center p-2 bg-gradient-to-r from-violet-700 to-green-800">
                <p>
                  <span className="text-sm">PNR: </span>
                  {booking?.pnr}
                </p>
                <p>PNR status:{booking?.pnr_status}</p>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Train number</th>
                    <th className="px-4 py-3">Train name</th>
                    <th className="px-4 py-3">Date of Journey</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Destination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  <tr className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-white">
                      {booking?.train_number}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {booking?.train_name}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {booking?.date_of_journey}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {booking?.source_name}({booking?.source_code})
                    </td>
                    <td className="px-4 py-3 text-white">
                      {booking?.destination_name}({booking?.destination_code})
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/**schedule section */}
          <div className="p-6">
            <p className="text-[11px] uppercase text-slate-500 font-bold mb-3 flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-slate-400" />
              Schedules & coach
            </p>

            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-400 capitalize text-xs">
                  <tr>
                    <th className="px-4 py-3">Scheduled departure</th>
                    <th className="px-4 py-3">Plat form</th>
                    <th className="px-4 py-3">Boarding at</th>
                    <th className="px-4 py-3">Reservation type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  <tr className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-white">
                      {booking?.scheduled_departure}
                    </td>
                    <td className="px-4 py-3 text-white">-</td>
                    <td className="px-4 py-3 text-white">
                      {booking?.boarding_point}({booking?.boarding_point_name})
                    </td>
                    <td className="px-4 py-3 text-white">
                      {booking?.type_code}
                    </td>
                  </tr>
                </tbody>
              </table>
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
                    <th className="px-4 py-3">Coach/Seat/Berth</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Seat status</th>
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
                      <td
                        className={
                          p.seat_status === "CNF"
                            ? "px-4 py-3 text-green-500 font-bold"
                            : "px-4 py-3 text-red-500 font-bold"
                        }
                      >
                        {p.seat_status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Fare Section */}
          <div className="px-6 pb-6">
            <p className="text-[11px] uppercase text-slate-500 font-bold mb-3 flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-slate-400" />
              Fare details
            </p>

            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Base fare</th>
                    <th className="px-4 py-3">Total base fare</th>
                    <th className="px-4 py-3">GST</th>
                    <th className="px-4 py-3">Conveince fee</th>
                    <th className="px-4 py-3">Gross fare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  <tr className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-white">
                      ₹
                      {(fare_details?.base_fare / passengers?.length).toFixed(
                        2
                      )}{" "}
                      X {passengers?.length}
                    </td>
                    <td className="px-4 py-3 text-white">
                      ₹{(fare_details?.base_fare).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {fare_details?.GST}%
                    </td>
                    <td className="px-4 py-3 text-white">
                      {fare_details?.convience}%
                    </td>
                    <td className="px-4 py-3 text-white">
                      ₹{fare_details?.gross_fare}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] uppercase text-slate-300 font-bold m-2 flex items-center gap-3 text-center">
              <CheckIcon className="w-4 h-4 text-slate-400" />
              Mock ticket SMS sent to{" "}
              <span className="text-blue-300 text-[16px] underline">
                +91{booking.mobile_number}
              </span>
            </p>
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
              onClick={() =>
                generateTicketPdf(booking, passengers, fare_details)
              }
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
