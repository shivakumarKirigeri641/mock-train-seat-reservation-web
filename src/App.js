import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  TrainFront,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Layers,
  X,
  UserPlus,
  Trash2,
  CheckCircle2,
  Download,
  Activity,
  Navigation,
  Ticket,
  Clock,
  MapPin,
  CreditCard,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL =
  "http://localhost:8888/mockapis/serverpeuser/api/mocktrain/reserved";
const API_CONFIG = {
  withCredentials: true,
  headers: {
    "x-api-key": process.env.REACT_APP_DEMO_API_KEY,
    "x-secret-key": process.env.REACT_APP_DEMO_SECRET_KEY,
  },
};

const RailwayReservation = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sourceRef = useRef(null);
  const destinationRef = useRef(null);
  const dateRef = useRef(null);

  const [stations, setStations] = useState([]);
  const [trainResults, setTrainResults] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedQuota, setSelectedQuota] = useState("gen");

  const [modalState, setModalState] = useState({
    type: null,
    open: false,
    data: null,
  });
  const [bookingId, setBookingId] = useState(null);
  const [bookingSummary, setBookingSummary] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const [searchForm, setSearchForm] = useState({
    source_code: "",
    destination_code: "",
    doj: today,
  });

  // --- Passenger & Contact States ---
  const [passengers, setPassengers] = useState([
    {
      passenger_name: "",
      passenger_age: "",
      passenger_gender: "M",
      passenger_issenior: false,
      passenger_ischild: false,
    },
  ]);
  const [children, setChildren] = useState([]);
  const [mobileNumber, setMobileNumber] = useState(""); //
  const [isSmsTicked, setIsSmsTicked] = useState(false); //

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const stRes = await axios.get(`${API_BASE_URL}/stations`, API_CONFIG);
        setStations(stRes.data.data || []);
      } catch (err) {
        console.error("Metadata load failed");
      }
    };
    fetchMetadata();
  }, []);

  const fetchTrains = async () => {
    if (!searchForm.source_code || !searchForm.destination_code) {
      setErrorMsg("Please select source and destination.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/search-trains`,
        searchForm,
        API_CONFIG
      );
      setTrainResults(res.data.data?.trains_list || []);
      setErrorMsg("");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedBooking = async () => {
    if (children.length > 0 && passengers.length === 0) {
      setErrorMsg("At least one adult passenger must be present.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/proceed-booking`,
        {
          train_number: selectedTrain.train_number,
          source_code: searchForm.source_code,
          destination_code: searchForm.destination_code,
          doj: searchForm.doj,
          passenger_details:
            children?.length > 0 ? passengers.concat(children) : passengers,
          coach_type: selectedClass,
          reservation_type: selectedQuota,
          mobile_number: isSmsTicked
            ? mobileNumber
            : process.env.REACT_APP_MY_MOBILE_NUMBER,
        },
        API_CONFIG
      );
      setBookingId(res.data.data.booking_id);
      setModalState({ type: "summary", open: true });
    } catch (err) {
      setErrorMsg("Booking initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/confirm-booking`,
        { booking_id: bookingId },
        API_CONFIG
      );
      setBookingSummary(res.data.data);
      setModalState({ type: "success", open: true });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalFare = () => {
    if (!selectedTrain || !selectedClass) return 0;
    const baseFare =
      parseFloat(selectedTrain[`fare_${selectedQuota}_${selectedClass}`]) || 0;
    return (
      passengers.length * baseFare +
      children.length * (baseFare / 2)
    ).toFixed(2);
  };

  const updatePassenger = (index, field, value) => {
    const newPass = [...passengers];
    newPass[index][field] = value;
    if (field === "age" || field === "gender") {
      const age = parseInt(newPass[index].age) || 0;
      const gen = newPass[index].gender;
      newPass[index].senior =
        (gen === "M" && age >= 60) || (gen === "F" && age >= 50);
    }
    setPassengers(newPass);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden">
        {/* Tabs */}
        <div className="grid grid-cols-3 md:grid-cols-6 bg-slate-950/50 p-2 gap-2 border-b border-slate-800">
          {[
            "Book Tickets",
            "PNR Status",
            "Cancel",
            "Schedule",
            "Live Status",
            "Live Station",
          ].map((label, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
                setTrainResults([]);
                setSelectedTrain(null);
              }}
              className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                activeTab === idx
                  ? "bg-orange-500 text-white shadow-lg"
                  : "text-slate-500 hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold">
              <AlertTriangle size={18} /> {errorMsg}
            </div>
          )}

          {activeTab === 0 && (
            <div className="space-y-8">
              {!selectedTrain ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-950/30 p-6 rounded-3xl border border-slate-800">
                    <AutocompleteInput
                      label="From"
                      list={stations}
                      inputRef={sourceRef}
                      onSelect={(v) => {
                        setSearchForm({ ...searchForm, source_code: v });
                        destinationRef.current?.focus();
                      }}
                    />
                    <AutocompleteInput
                      label="To"
                      list={stations}
                      inputRef={destinationRef}
                      onSelect={(v) => {
                        setSearchForm({ ...searchForm, destination_code: v });
                        dateRef.current?.focus();
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                        Journey Date
                      </label>
                      <input
                        ref={dateRef}
                        type="date"
                        defaultValue={today}
                        className="bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl text-sm font-bold text-white outline-none focus:border-orange-500"
                        onChange={(e) =>
                          setSearchForm({ ...searchForm, doj: e.target.value })
                        }
                      />
                    </div>
                    <button
                      onClick={fetchTrains}
                      className="bg-orange-500 h-14 rounded-2xl font-black text-xs uppercase hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Search size={18} />
                      )}{" "}
                      Search
                    </button>
                  </div>

                  {trainResults.length > 0 && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4">
                      <QuotaSelector
                        current={selectedQuota}
                        onChange={setSelectedQuota}
                      />
                      {trainResults.map((t, i) => (
                        <div
                          key={i}
                          className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-800 relative group"
                        >
                          <h4 className="font-black text-white uppercase italic mb-4">
                            {t.train_name} ({t.train_number})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                              "sl",
                              "3a",
                              "2a",
                              "1a",
                              "cc",
                              "ec",
                              "ea",
                              "e3",
                              "fc",
                              "2s",
                            ].map((cls) => {
                              const seats =
                                t[`seat_count_${selectedQuota}_${cls}`];
                              if (!seats || seats === "-") return null;
                              return (
                                <button
                                  key={cls}
                                  onClick={() => {
                                    setSelectedTrain(t);
                                    setSelectedClass(cls);
                                  }}
                                  className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 hover:border-orange-500 transition-all text-left"
                                >
                                  <p className="text-[10px] font-black uppercase text-orange-500">
                                    {cls.toUpperCase()}
                                  </p>
                                  <p className="text-sm font-bold text-white">
                                    AVL {seats}
                                  </p>
                                  <p className="text-[10px] font-bold text-slate-500">
                                    ₹ {t[`fare_${selectedQuota}_${cls}`]}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-8 animate-in zoom-in-95">
                  <div className="flex justify-between items-center bg-orange-500/10 p-5 rounded-3xl border border-orange-500/20">
                    <div>
                      <h4 className="font-black text-white uppercase italic">
                        {selectedTrain.train_name}
                      </h4>
                      <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                        {selectedClass.toUpperCase()} Class |{" "}
                        {selectedQuota.toUpperCase()} Quota
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedTrain(null)}
                      className="text-[10px] font-black uppercase text-slate-500 underline hover:text-white transition-colors"
                    >
                      Change Train
                    </button>
                  </div>

                  {/* Adult Entry */}
                  <div className="space-y-4">
                    <p className="text-xs font-black text-orange-500 uppercase tracking-widest ml-1">
                      Adult Entry (Max 6)
                    </p>
                    {passengers.map((p, i) => (
                      <div
                        key={i}
                        className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
                      >
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-black text-slate-600 uppercase ml-1">
                            Name
                          </label>
                          <input
                            placeholder="Enter Name"
                            className="bg-slate-900 border-2 border-slate-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-orange-500 transition-all"
                            value={p.name}
                            onChange={(e) =>
                              updatePassenger(i, "name", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-black text-slate-600 uppercase ml-1">
                            Age
                          </label>
                          <input
                            placeholder="Age"
                            type="number"
                            className="bg-slate-900 border-2 border-slate-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-orange-500 transition-all"
                            value={p.age}
                            onChange={(e) =>
                              updatePassenger(i, "age", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-black text-slate-600 uppercase ml-1">
                            Gender
                          </label>
                          <select
                            className="bg-slate-900 border-2 border-slate-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                            value={p.gender}
                            onChange={(e) =>
                              updatePassenger(i, "gender", e.target.value)
                            }
                          >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                          </select>
                        </div>
                        <div className="flex gap-4 items-center pt-4">
                          <label className="flex items-center gap-2 text-[10px] font-black text-slate-500">
                            <input
                              type="checkbox"
                              checked={p.senior}
                              disabled
                              className="w-4 h-4 accent-orange-500 rounded-lg"
                            />{" "}
                            SENIOR
                          </label>
                          <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={p.pwd}
                              onChange={(e) =>
                                updatePassenger(i, "pwd", e.target.checked)
                              }
                              className="w-4 h-4 accent-orange-500 rounded-lg"
                            />{" "}
                            PWD
                          </label>
                        </div>
                        <div className="pt-4 flex justify-end">
                          {i > 0 && (
                            <button
                              onClick={() =>
                                setPassengers(
                                  passengers.filter((_, idx) => idx !== i)
                                )
                              }
                              className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        passengers.length < 6 &&
                        setPassengers([
                          ...passengers,
                          {
                            name: "",
                            age: "",
                            gender: "M",
                            senior: false,
                            pwd: false,
                          },
                        ])
                      }
                      className="p-4 w-full border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:border-orange-500 hover:text-orange-500 transition-all"
                    >
                      <UserPlus size={16} /> Add Adult Passenger
                    </button>
                  </div>

                  {/* Mobile Number Entry Section */}
                  <div className="bg-slate-950/60 p-6 rounded-[2.5rem] border border-slate-800 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={isSmsTicked}
                          onChange={(e) => setIsSmsTicked(e.target.checked)}
                          className="w-5 h-5 accent-orange-500 cursor-pointer"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-200 uppercase tracking-widest">
                          Enable SMS Confirmation
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 italic leading-relaxed">
                          Required only to send mock ticket confirmation sms,
                          tick if you want mock sms details.
                        </p>
                      </div>
                    </div>
                    {isSmsTicked && (
                      <div className="flex flex-col gap-2 pl-9 animate-in slide-in-from-top-2 duration-300">
                        <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                          Mobile Number:
                        </label>
                        <div className="relative max-w-sm">
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="10-digit number"
                            className="w-full bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl text-sm font-black text-white outline-none focus:border-orange-500 transition-all"
                            value={mobileNumber}
                            onChange={(e) =>
                              setMobileNumber(e.target.value.replace(/\D/g, ""))
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleProceedBooking}
                    className="w-full py-6 bg-orange-500 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      "Proceed to Summary"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Summary Modal */}
      {modalState.open && modalState.type === "summary" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-4xl rounded-[3rem] border border-slate-800 p-10 space-y-8 animate-in zoom-in-95 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-6">
              <h2 className="text-2xl font-black text-white uppercase italic flex items-center gap-4">
                <Layers className="text-orange-500" /> Booking Dossier
              </h2>
              <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/50 rounded-xl text-[10px] font-black text-orange-500 uppercase tracking-widest">
                ID: {bookingId}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-slate-800 space-y-4">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                  Train Information
                </p>
                <h4 className="text-lg font-black text-white uppercase italic">
                  {selectedTrain.train_name}
                </h4>
                <p className="text-[11px] font-bold text-slate-400">
                  Class: {selectedClass.toUpperCase()} | Quota:{" "}
                  {selectedQuota.toUpperCase()}
                </p>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Route
                  </p>
                  <p className="text-xs font-black text-white uppercase">
                    {selectedTrain.station_from} → {selectedTrain.station_to}
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-slate-800 flex flex-col justify-center items-center text-center space-y-4">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                  Fare Summary
                </p>
                <div>
                  <p className="text-4xl font-black text-white">
                    ₹ {calculateTotalFare()}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">
                    Total Payable Amount
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-slate-800">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6">
                Passenger Entry Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {passengers.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center border-b border-slate-800 pb-3"
                  >
                    <span className="text-xs font-black text-slate-200 uppercase">
                      {p.name || "Unnamed"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Age {p.age} | {p.senior ? "Senior" : "Adult"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-6 pt-6">
              <button
                onClick={() => setModalState({ open: false, type: null })}
                className="flex-1 py-5 bg-slate-800 text-slate-400 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-slate-700 transition-all"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 py-5 bg-orange-500 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CreditCard size={18} />
                )}{" "}
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation/Success modal logic remains same as per confirmation ticket view logic */}
    </div>
  );
};

// ... Sub-components same as provided context ...
const AutocompleteInput = ({ label, list, onSelect, inputRef }) => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const filtered = query
    ? list
        .filter(
          (s) =>
            s.station_name.toLowerCase().includes(query.toLowerCase()) ||
            s.code.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 50)
    : list;
  const handleKeyDown = (e) => {
    if (!showResults) return;
    if (e.key === "Enter" || e.key === "Tab") {
      const selected = filtered[selectedIndex];
      if (selected) {
        setQuery(`${selected.station_name} (${selected.code})`);
        onSelect(selected.code);
        setShowResults(false);
        if (e.key === "Enter") e.preventDefault();
      }
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(
        (prev) => (prev - 1 + filtered.length) % filtered.length
      );
    }
  };
  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
        {label}
      </label>
      <input
        ref={inputRef}
        value={query}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setShowResults(true);
          setSelectedIndex(0);
        }}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
          setSelectedIndex(0);
        }}
        className="bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl text-sm font-black text-white outline-none focus:border-orange-500 w-full transition-all"
        placeholder={`Search ${label}...`}
      />
      {showResults && filtered.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden z-20 shadow-2xl max-h-[300px] overflow-y-auto custom-scrollbar">
          {filtered.map((s, i) => (
            <div
              key={i}
              className={`p-4 cursor-pointer text-[10px] font-bold border-b border-slate-700 last:border-0 transition-colors ${
                i === selectedIndex
                  ? "bg-orange-500 text-white"
                  : "hover:bg-slate-700 text-slate-300"
              }`}
              onMouseDown={() => {
                setQuery(`${s.station_name} (${s.code})`);
                onSelect(s.code);
              }}
            >
              {s.station_name}{" "}
              <span
                className={
                  i === selectedIndex ? "text-white/80" : "text-orange-500"
                }
              >
                ({s.code})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const QuotaSelector = ({ current, onChange }) => (
  <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
    {["gen", "ttl", "ptl", "pwd", "senior"].map((q) => (
      <button
        key={q}
        onClick={() => onChange(q)}
        className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase border-2 transition-all whitespace-nowrap ${
          current === q
            ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
            : "border-slate-800 text-slate-500 hover:border-slate-700"
        }`}
      >
        {q === "gen"
          ? "General"
          : q === "ttl"
          ? "Tatkal"
          : q === "ptl"
          ? "Premium Tatkal"
          : q === "pwd"
          ? "Physically Challenged"
          : "Senior Citizen"}
      </button>
    ))}
  </div>
);

export default RailwayReservation;
