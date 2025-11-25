import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios"; // Assuming axios is used for other calls

// --- ICONS ---
const ArrowLeftIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const TrainIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
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

const CalendarIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const UserGroupIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const ReceiptIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
    />
  </svg>
);

const SummariseDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Use a ref to track payment status synchronously for cleanup functions
  const isPaymentSuccessRef = useRef(false);

  const apiResponse = location.state || {};
  console.log(apiResponse);
  const { booked_details, passenger_details, fare_details } = apiResponse || {};

  // --- 1. Handle Browser Back / Component Unmount ---
  useEffect(() => {
    if (!booked_details) return;

    return () => {
      // This runs when component unmounts (navigating back OR forward)
      // We check if payment was NOT successful to distinguish "Abandon" from "Success"
      if (!isPaymentSuccessRef.current) {
        console.log(
          "🛑 User left without paying (Browser Back/Nav). Triggering Cancel Booking API..."
        );

        // PLACEHOLDER: API Call to Release Blocked Seats/Cancel Booking
        // axios.post("http://localhost:8888/cancel-booking", { booking_id: booked_details.id });
      }
    };
  }, [booked_details]);

  // --- 2. Handle Tab Close / Refresh ---
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isPaymentSuccessRef.current && booked_details?.id) {
        // navigator.sendBeacon is reliable for tab closing events as it doesn't wait for response
        const url = "http://localhost:8888/cancel-booking";
        const data = JSON.stringify({ booking_id: booked_details.id });

        // PLACEHOLDER: Beacon API for Tab Close
        // navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }));

        console.log("🛑 Tab closing. Beacon sent to cancel booking.");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [booked_details]);

  useEffect(() => {
    if (!booked_details) {
      // navigate("/book-ticket"); // Uncomment in prod
    }
    setTimeout(() => setMounted(true), 100);
  }, [booked_details, navigate]);

  // --- 3. Handle Manual Back Button Click ---
  const handleBackClick = async () => {
    if (!isPaymentSuccessRef.current) {
      console.log("🔙 Back button clicked. Triggering Cancel Booking API...");

      // PLACEHOLDER: API Call before navigating back
      try {
        // await axios.post("http://localhost:8888/cancel-booking", { booking_id: booked_details.id });
      } catch (err) {
        console.error("Error cancelling booking:", err);
      }
    }
    navigate(-1);
  };

  // --- 4. Handle Payment ---
  const handleConfirmPayment = async () => {
    setIsPaying(true); // Show fake payment animation

    try {
      console.log("💸 Calling Confirm Payment API...");

      // --- Your actual API call here ---
      const response = await axios.post(
        "http://localhost:8888/confirm-booking",
        {
          booking_id: booked_details.id,
        }
      );

      // EXPECTED RESPONSE (from you):
      // {
      //   "result_updated_bookingdetails": { ... },
      //   "result_udpated_passengerdetails": [ ... ],
      //   "success-status": true/false,
      //   "message": "something..."
      // }

      const apiData = response.data;
      console.log("api:", apiData);
      // --- CASE 1: Payment success ---
      if (apiData.success === true) {
        isPaymentSuccessRef.current = true; // prevents auto-cancel
        setIsPaying(false);

        // ⬇ Navigate to Confirmation Page with API data
        navigate("/ticket-confirmation", {
          state: {
            booking: apiData.data.result_updated_bookingdetails,
            passengers: apiData.data.result_udpated_passengerdetails,
            fare_details: apiData.data.fare_details,
          },
        });

        return;
      }

      // --- CASE 2: Payment failed ---
      setIsPaying(false);
      alert(apiData.message || "Payment failed. Try again.");
    } catch (error) {
      console.error("❌ Payment API error:", error);
      setIsPaying(false);
      alert("Server error. Try again after some time.");
    }
  };

  if (!booked_details) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        Loading booking details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-[-10%] left-[10%] w-[40vw] h-[40vw] bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[40vw] h-[40vw] bg-indigo-900/20 rounded-full blur-3xl"></div>
      </div>

      <div
        className={`max-w-6xl mx-auto relative z-10 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackClick}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors group"
              title="Go Back & Cancel"
            >
              <ArrowLeftIcon className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Booking Summary
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Review your itinerary and fare before payment
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Booking ID
            </div>
            <div className="text-xl font-mono text-indigo-400">
              #{booked_details.id}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: JOURNEY & PASSENGERS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Journey Card */}
            <div className="bg-[#1e293b] border border-slate-700/60 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-700 flex items-center gap-2">
                <TrainIcon className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                  Journey Details
                </h2>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Train Number
                  </label>
                  <div className="text-white font-mono text-lg">
                    {booked_details?.train_number}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Journey Date
                  </label>
                  <div className="text-white font-medium flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    {booked_details.date_of_journey}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Route
                  </label>
                  <div className="text-white font-medium">
                    {booked_details?.source_name}{" "}
                    <span className="text-slate-500 mx-1">➔</span>{" "}
                    {booked_details?.destination_name}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Class / Quota
                  </label>
                  <div className="text-white font-medium">
                    <span className="bg-slate-700 px-2 py-0.5 rounded text-xs mr-2">
                      {booked_details?.coach_code}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {booked_details?.type_code}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger List */}
            <div className="bg-[#1e293b] border border-slate-700/60 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-700 flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                  Passengers ({passenger_details?.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/50 text-xs uppercase text-slate-500 font-semibold">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Age</th>
                      <th className="px-6 py-3">Gender</th>
                      <th className="px-6 py-3">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {passenger_details?.map((p, idx) => (
                      <tr
                        key={p.id || idx}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-3 font-medium text-white">
                          {p.p_name}
                        </td>
                        <td className="px-6 py-3 text-slate-300">{p.p_age}</td>
                        <td className="px-6 py-3 text-slate-300">
                          {p.p_gender}
                        </td>
                        <td className="px-6 py-3">
                          {p.is_adult && (
                            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                              Adult
                            </span>
                          )}
                          {p.is_child && (
                            <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded ml-2">
                              Child
                            </span>
                          )}
                          {p.is_senior && (
                            <span className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded ml-2">
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

            <div className="text-xs text-slate-500 px-2">
              * An e-ticket will be sent to{" "}
              <span className="text-slate-300 font-mono">
                {booked_details.mobile_number}
              </span>{" "}
              upon successful payment.
            </div>
          </div>

          {/* RIGHT COLUMN: FARE & ACTION */}
          <div className="lg:col-span-1 space-y-6">
            {/* Fare Breakdown */}
            <div className="bg-[#1e293b] border border-slate-700/60 rounded-xl shadow-xl sticky top-6">
              <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-700 flex items-center gap-2">
                <ReceiptIcon className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                  Payment Details
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>
                    Total Fare X {passenger_details?.length} ₹(
                    {fare_details.base_fare / passenger_details?.length})
                  </span>
                  <span className="font-mono text-slate-200">
                    ₹{fare_details.base_fare}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>GST ({fare_details.GST}%)</span>
                  <span className="font-mono text-slate-200">
                    + ₹
                    {(
                      (fare_details.base_fare * fare_details.GST) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Convenience Fee ({fare_details.convience}%)</span>
                  <span className="font-mono text-slate-200">
                    + ₹
                    {(
                      (fare_details.base_fare * fare_details.convience) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-slate-700 my-2 pt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-white">
                      Gross Total
                    </span>
                    <span className="text-3xl font-bold text-emerald-400">
                      ₹{fare_details.gross_fare.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  disabled={isPaying}
                  className={`w-full py-4 mt-4 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isPaying
                      ? "bg-slate-700 cursor-wait"
                      : "bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 transform hover:-translate-y-0.5"
                  }`}
                >
                  {isPaying ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Pay</span>
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
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="h-1 w-8 bg-slate-700 rounded"></div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">
                    Secure 256-bit SSL
                  </span>
                  <div className="h-1 w-8 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummariseDetailsPage;
