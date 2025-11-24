import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";

const PassengerDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selected_date_of_journey = useSelector(
    (store) => store?.stationslistslicsourcedestinationdoj.date_of_journey
  );
  // Retrieve data passed from BookTicketPage
  const { selectedTrain, coachtype, reservationtype } = location.state || {};

  // Adult passengers
  const [adults, setAdults] = useState([
    { name: "", age: "", gender: "", senior: false, pwd: false },
  ]);

  // Child passengers
  const [children, setChildren] = useState([]);

  const [mobile, setMobile] = useState("");

  const handleAddAdult = () => {
    if (adults.length < 6) {
      setAdults([
        ...adults,
        { name: "", age: "", gender: "", senior: false, pwd: false },
      ]);
    }
  };

  const handleRemoveAdult = (index) => {
    if (adults.length > 1) {
      const updated = [...adults];
      updated.splice(index, 1);
      setAdults(updated);
    }
  };

  const handleAddChild = () => {
    if (children.length < 6) {
      setChildren([...children, { name: "", age: "", gender: "" }]);
    }
  };

  const handleRemoveChild = (index) => {
    const updated = [...children];
    updated.splice(index, 1);
    setChildren(updated);
  };

  const validate = () => {
    // Adult validation
    if (adults.length < 1) {
      alert("At least 1 adult passenger is required.");
      return false;
    }

    for (let a of adults) {
      if (!a.name.trim()) return alert("Adult name is required.");
      if (!a.age || a.age < 6 || a.age > 120)
        return alert("Adult age must be between 6 - 120.");
      if (!a.gender) return alert("Adult gender is required.");
    }

    // Child validation
    for (let c of children) {
      if (!c.name.trim()) return alert("Child name is required.");
      if (!c.age || c.age < 1 || c.age > 5)
        return alert("Child age must be between 1 - 5.");
      if (!c.gender) return alert("Child gender is required.");
    }

    // At least one adult if child exists
    if (children.length > 0 && adults.length < 1) {
      return alert("A child passenger requires at least 1 adult.");
    }

    if (!mobile || mobile.length !== 10) {
      return alert("Valid 10-digit mobile number is required.");
    }

    return true;
  };

  const handleFakePayment = () => {
    if (!validate()) return;

    // Fake delay to simulate payment
    setTimeout(() => {
      navigate("/ticket-confirmation", {
        state: {
          train: selectedTrain,
          adults,
          children,
          mobile,
          pnr: "PNR" + Math.floor(Math.random() * 9000000000 + 1000000000),
        },
      });
    }, 1200);
  };

  if (!selectedTrain) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-gray-400">
        <p className="mb-4">No train selected. Please start a search.</p>
        <button
          onClick={() => navigate("/book-ticket")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Go to Search
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 flex flex-col items-center text-gray-100 selection:bg-indigo-500 selection:text-white">
      {/* Header / Summary Card */}
      <div className="w-full max-w-4xl mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-4 transition-colors"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Search
        </button>

        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {selectedTrain.train_name}{" "}
              <span className="text-indigo-400 font-mono text-lg">
                ({selectedTrain.train_number})
              </span>
            </h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2 text-sm">
              <span>{selected_date_of_journey}</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span>{coachtype} Class</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span>{reservationtype} Quota</span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-lg font-bold text-white">
              {selectedTrain.from} → {selectedTrain.to}
            </div>
            <div className="text-sm text-gray-400">
              {selectedTrain.departure} - {selectedTrain.arrival}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 shadow-xl rounded-2xl p-6 md:p-8 w-full max-w-4xl border border-gray-700">
        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
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
          Passenger Details
        </h2>

        {/* Adult Section */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Adult Passengers
          </h3>

          <div className="space-y-3">
            {adults.map((adult, idx) => (
              <div
                key={idx}
                className="border border-gray-600 rounded-xl p-4 bg-gray-900/50 hover:border-gray-500 transition-colors grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-1 text-gray-500 font-mono text-sm text-center md:text-left">
                  #{idx + 1}
                </div>

                <div className="md:col-span-4">
                  <input
                    type="text"
                    placeholder="Passenger Name"
                    value={adult.name}
                    onChange={(e) => {
                      const updated = [...adults];
                      updated[idx].name = e.target.value;
                      setAdults(updated);
                    }}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-gray-500 transition-shadow"
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    type="number"
                    placeholder="Age"
                    value={adult.age}
                    onChange={(e) => {
                      const updated = [...adults];
                      updated[idx].age = e.target.value;
                      setAdults(updated);
                    }}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-gray-500 transition-shadow"
                  />
                </div>

                <div className="md:col-span-3">
                  <select
                    value={adult.gender}
                    onChange={(e) => {
                      const updated = [...adults];
                      updated[idx].gender = e.target.value;
                      setAdults(updated);
                    }}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow appearance-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Transgender</option>
                  </select>
                </div>

                {/* Action / Toggles Row */}
                <div className="md:col-span-2 flex items-center justify-end gap-3">
                  {idx > 0 && (
                    <button
                      className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors"
                      onClick={() => handleRemoveAdult(idx)}
                      title="Remove Passenger"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Checkboxes Row */}
                <div className="md:col-span-12 flex gap-6 mt-2 md:mt-0 md:pl-12">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-500 bg-gray-800 transition-all checked:border-indigo-500 checked:bg-indigo-500"
                        checked={adult.senior}
                        onChange={(e) => {
                          const updated = [...adults];
                          updated[idx].senior = e.target.checked;
                          setAdults(updated);
                        }}
                      />
                      <svg
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 w-3 h-3"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                      Senior Citizen
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-500 bg-gray-800 transition-all checked:border-indigo-500 checked:bg-indigo-500"
                        checked={adult.pwd}
                        onChange={(e) => {
                          const updated = [...adults];
                          updated[idx].pwd = e.target.checked;
                          setAdults(updated);
                        }}
                      />
                      <svg
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 w-3 h-3"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                      PWD
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {adults.length < 6 && (
            <button
              className="mt-3 w-full py-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:text-indigo-400 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 font-medium"
              onClick={handleAddAdult}
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Adult Passenger
            </button>
          )}
        </div>

        {/* Child Section */}
        <div className="mb-8 border-t border-gray-700 pt-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Child Passengers (Age 1-5)
          </h3>
          {children.length === 0 && (
            <p className="text-gray-500 text-sm italic mb-3">
              No child passengers added.
            </p>
          )}

          <div className="space-y-3">
            {children.map((child, idx) => (
              <div
                key={idx}
                className="border border-gray-600 rounded-xl p-4 bg-gray-900/50 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-1 text-gray-500 font-mono text-sm text-center md:text-left">
                  #{idx + 1}
                </div>

                <div className="md:col-span-4">
                  <input
                    type="text"
                    placeholder="Child Name"
                    value={child.name}
                    onChange={(e) => {
                      const updated = [...children];
                      updated[idx].name = e.target.value;
                      setChildren(updated);
                    }}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-gray-500 transition-shadow"
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    type="number"
                    placeholder="Age (1-5)"
                    value={child.age}
                    onChange={(e) => {
                      const updated = [...children];
                      updated[idx].age = e.target.value;
                      setChildren(updated);
                    }}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-gray-500 transition-shadow"
                  />
                </div>

                <div className="md:col-span-3">
                  <select
                    value={child.gender}
                    onChange={(e) => {
                      const updated = [...children];
                      updated[idx].gender = e.target.value;
                      setChildren(updated);
                    }}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow appearance-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>

                <div className="md:col-span-2 text-right">
                  <button
                    className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors"
                    onClick={() => handleRemoveChild(idx)}
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {children.length < 6 && (
            <button
              className="mt-3 w-full py-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:text-indigo-400 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 font-medium"
              onClick={handleAddChild}
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Child Passenger
            </button>
          )}
        </div>

        {/* Mobile Number */}
        <div className="mb-8 border-t border-gray-700 pt-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Contact Details
          </h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span className="text-gray-500 font-bold">+91</span>
            </div>
            <input
              type="text"
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-gray-500 transition-shadow font-mono text-lg tracking-wide"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your booking details will be sent to this number.
          </p>
        </div>

        {/* Fake Payment */}
        <div className="text-center pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between mb-6 bg-gray-900/50 p-4 rounded-xl border border-gray-600">
            <span className="text-gray-300 font-medium">Total Fare</span>
            <span className="text-2xl font-bold text-white">
              ₹{selectedTrain.fare || "850"}
            </span>
          </div>

          <button
            onClick={handleFakePayment}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform active:scale-[0.98] font-bold text-lg flex items-center justify-center gap-2"
          >
            <span>Proceed to Pay</span>
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetailsPage;
