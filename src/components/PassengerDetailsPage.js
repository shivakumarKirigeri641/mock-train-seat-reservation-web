import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// --- ICONS ---
const UserIcon = ({ className }) => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = ({ className }) => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const PassengerDetailsPage = ({
  isOpen,
  onClose,
  bookingDetails,
  onProceedToPay,
}) => {
  const selected_date_of_journey = useSelector(
    (store) => store?.stationslistslicsourcedestinationdoj.date_of_journey
  );

  const { selectedTrain, coachtype, reservationtype } = bookingDetails || {};

  const [showPage, setShowPage] = useState(false);

  const [adults, setAdults] = useState([
    { name: "", age: "", gender: "", senior: false, pwd: false },
  ]);
  const [children, setChildren] = useState([]);
  const [mobile, setMobile] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) setShowPage(true);
    else setShowPage(false);
  }, [isOpen]);

  // Reset form when a new train is selected
  useEffect(() => {
    if (isOpen) {
      setAdults([{ name: "", age: "", gender: "", senior: false, pwd: false }]);
      setChildren([]);
      setMobile("");
      setIsProcessing(false);
    }
  }, [isOpen, selectedTrain]);

  // Adult handlers
  const handleAddAdult = () => {
    if (adults.length < 6)
      setAdults([
        ...adults,
        { name: "", age: "", gender: "", senior: false, pwd: false },
      ]);
  };

  const handleRemoveAdult = (index) => {
    if (adults.length > 1) {
      const updated = [...adults];
      updated.splice(index, 1);
      setAdults(updated);
    }
  };

  // Child handlers
  const handleAddChild = () => {
    if (children.length < 6)
      setChildren([...children, { name: "", age: "", gender: "" }]);
  };

  const handleRemoveChild = (index) => {
    const updated = [...children];
    updated.splice(index, 1);
    setChildren(updated);
  };

  // Form validation
  const validate = () => {
    if (adults.length < 1) {
      alert("At least 1 adult passenger is required.");
      return false;
    }
    for (let a of adults) {
      if (!a.name.trim()) {
        alert("Adult name is required.");
        return false;
      }
      if (!a.age || a.age < 6 || a.age > 120) {
        alert("Adult age must be between 6 - 120.");
        return false;
      }
      if (!a.gender) {
        alert("Adult gender is required.");
        return false;
      }
    }
    for (let c of children) {
      if (!c.name.trim()) {
        alert("Child name is required.");
        return false;
      }
      if (!c.age || c.age < 1 || c.age > 11) {
        alert("Child age must be between 1 - 11.");
        return false;
      }
      if (!c.gender) {
        alert("Child gender is required.");
        return false;
      }
    }
    if (children.length > 0 && adults.length < 1) {
      alert("A child passenger requires at least 1 adult.");
      return false;
    }
    if (!mobile || mobile.length !== 10) {
      alert("Valid 10-digit mobile number is required.");
      return false;
    }
    return true;
  };

  // ----------------------------------------------------------------------
  // FINAL UPDATED handlePaymentClick WITH MERGED passenger_details
  // ----------------------------------------------------------------------
  const handlePaymentClick = () => {
    if (!validate()) return;

    // Convert adults
    const adultPassengers = adults.map((a) => ({
      passenger_name: a.name,
      passenger_gender: a.gender,
      passenger_age: parseInt(a.age),
      passenger_ischild: false,
      passenger_issenior:
        (a.gender === "M" && a.age > 60) || (a.gender === "F" && a.age > 50),
    }));

    // Convert children
    const childPassengers = children.map((c) => ({
      passenger_name: c.name,
      passenger_gender: c.gender,
      passenger_age: parseInt(c.age),
      passenger_ischild: true,
      passenger_issenior: false,
    }));

    // Combine
    const passenger_details = [...adultPassengers, ...childPassengers];

    // Final object to send
    const finalData = {
      train: selectedTrain,
      coachtype,
      reservationtype,
      date: selected_date_of_journey,
      passenger_details,
      contact: mobile,
      fareSummary: {
        base: parseInt(bookingDetails?.basefare),
        convenience: 35,
        total: parseInt(bookingDetails?.basefare) + 35,
      },
    };

    onProceedToPay(finalData);
  };

  if (!isOpen || !selectedTrain) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          showPage ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`bg-[#0f172a] w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-700 flex flex-col relative z-10 transform transition-all duration-300 ${
          showPage
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-8"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-white">
              Complete Your Booking
            </h2>
            <p className="text-xs text-slate-400">
              Enter passenger details to proceed
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* MAIN BODY */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SIDE FORMS */}
            <div className="lg:col-span-2 space-y-6">
              {/* Train Summary */}
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <div className="text-white font-bold">
                    {selectedTrain.train_name}{" "}
                    <span className="text-slate-500 text-xs font-mono">
                      #{selectedTrain.train_number}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mt-1">
                    {selectedTrain.from} ➔ {selectedTrain.to} |{" "}
                    {selected_date_of_journey}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-indigo-400 font-bold text-sm">
                    {coachtype}
                  </div>
                  <div className="text-slate-500 text-[10px] uppercase">
                    {reservationtype}
                  </div>
                </div>
              </div>

              {/* Adult Passenger Forms */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-bold text-white">
                    Adult Passengers
                  </span>
                </div>

                {adults.map((adult, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 relative group"
                  >
                    <div className="absolute -left-2 top-4 w-5 h-5 bg-slate-700 text-white rounded-full flex items-center justify-center text-[10px] border border-slate-600">
                      {idx + 1}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 ml-2">
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={adult.name}
                          onChange={(e) => {
                            const u = [...adults];
                            u[idx].name = e.target.value;
                            setAdults(u);
                          }}
                          placeholder="Name"
                          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          value={adult.age}
                          onChange={(e) => {
                            const u = [...adults];
                            u[idx].age = e.target.value;
                            setAdults(u);
                          }}
                          placeholder="Age"
                          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <select
                          value={adult.gender}
                          onChange={(e) => {
                            const u = [...adults];
                            u[idx].gender = e.target.value;
                            setAdults(u);
                          }}
                          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                        >
                          <option value="">Gender</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="O">Other</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 flex justify-end">
                        {idx > 0 && (
                          <button
                            onClick={() => handleRemoveAdult(idx)}
                            className="text-red-400 hover:bg-red-500/10 p-2 rounded"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Checkboxes for Senior/PWD */}
                    <div className="flex gap-4 mt-3 ml-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={adult.senior}
                          onChange={(e) => {
                            const u = [...adults];
                            u[idx].senior = e.target.checked;
                            setAdults(u);
                          }}
                          className="w-3.5 h-3.5 bg-slate-900 border-slate-600 rounded accent-indigo-500"
                        />
                        <span className="text-[11px] text-slate-400">
                          Senior Citizen
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={adult.pwd}
                          onChange={(e) => {
                            const u = [...adults];
                            u[idx].pwd = e.target.checked;
                            setAdults(u);
                          }}
                          className="w-3.5 h-3.5 bg-slate-900 border-slate-600 rounded accent-indigo-500"
                        />
                        <span className="text-[11px] text-slate-400">PWD</span>
                      </label>
                    </div>
                  </div>
                ))}

                {adults.length < 6 && (
                  <button
                    onClick={handleAddAdult}
                    className="w-full py-2 border border-dashed border-slate-600 rounded text-xs font-medium text-slate-400 hover:text-indigo-400 hover:border-indigo-500 transition-colors flex items-center justify-center gap-1"
                  >
                    <PlusIcon className="w-3 h-3" /> Add Adult
                  </button>
                )}
              </div>

              {/* Child Passengers */}
              <div className="space-y-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-indigo-500/10 rounded text-indigo-400">
                      <UserIcon className="w-3 h-3" />
                    </span>

                    <span className="text-sm font-bold text-white">
                      Child Passengers{" "}
                      <span className="text-[10px] font-normal text-slate-500">
                        (Age 1-11)
                      </span>
                    </span>
                  </div>

                  {children.length < 6 && (
                    <button
                      onClick={handleAddChild}
                      className="text-[10px] text-indigo-400 hover:text-white hover:underline flex items-center gap-1"
                    >
                      <PlusIcon className="w-3 h-3" /> Add Child
                    </button>
                  )}
                </div>

                {children.map((child, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 relative group"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={child.name}
                          onChange={(e) => {
                            const u = [...children];
                            u[idx].name = e.target.value;
                            setChildren(u);
                          }}
                          placeholder="Child Name"
                          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          value={child.age}
                          onChange={(e) => {
                            const u = [...children];
                            u[idx].age = e.target.value;
                            setChildren(u);
                          }}
                          placeholder="Age"
                          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <select
                          value={child.gender}
                          onChange={(e) => {
                            const u = [...children];
                            u[idx].gender = e.target.value;
                            setChildren(u);
                          }}
                          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                        >
                          <option value="">Gender</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 flex justify-end">
                        <button
                          onClick={() => handleRemoveChild(idx)}
                          className="text-red-400 hover:bg-red-500/10 p-2 rounded"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {children.length === 0 && (
                  <div className="text-center py-4 border border-dashed border-slate-800 rounded bg-slate-900/30 text-xs text-slate-600">
                    No child passengers added
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE SUMMARY */}
            <div className="lg:col-span-1 space-y-6">
              {/* Mobile Number */}
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                  Mobile Number
                </label>

                <input
                  type="text"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:border-indigo-500 outline-none tracking-wide font-mono"
                  placeholder="10-digit number"
                />
              </div>

              {/* Fare & Pay */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
                  <span className="text-slate-400 text-sm">Base fare</span>
                  <span className="text-2xl font-bold text-white">
                    ₹{parseInt(bookingDetails?.basefare)}
                  </span>
                </div>

                <button
                  onClick={handlePaymentClick}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  Summarize & Pay{" "}
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetailsPage;
