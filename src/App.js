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
  const [bookingSummary, setBookingSummary] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const [searchForm, setSearchForm] = useState({
    source_code: "",
    destination_code: "",
    doj: today,
  });

  // --- Passenger States ---
  const [passengers, setPassengers] = useState([
    { name: "", age: "", gender: "M", senior: false, pwd: false },
  ]);
  const [children, setChildren] = useState([]);

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

  const fetchSchedule = async (trainNo) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/train-schedule`,
        { train_number: trainNo },
        API_CONFIG
      );
      setModalState({ type: "schedule", open: true, data: res.data.data });
    } finally {
      setLoading(false);
    }
  };

  // --- Booking Logic ---
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

  const updateChild = (index, field, value) => {
    const newChildren = [...children];
    newChildren[index][field] = value;
    setChildren(newChildren);
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

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/confirm-booking`,
        {
          train_number: selectedTrain.train_number,
          passengers,
          children,
          class: selectedClass,
          quota: selectedQuota,
        },
        API_CONFIG
      );
      setBookingSummary(res.data.data);
      setModalState({ type: "success", open: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <div className="max-w-6xl mx-auto bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden">
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
                  ? "bg-orange-500 text-white"
                  : "text-slate-500 hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 0 && (
            <div className="space-y-8">
              {/* 1. Search Bar */}
              {!selectedTrain && (
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
                    className="bg-orange-500 h-14 rounded-2xl font-black text-xs uppercase hover:bg-orange-600 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Search size={18} />
                    )}{" "}
                    Search
                  </button>
                </div>
              )}

              {/* 2. Train List */}
              {trainResults.length > 0 && !selectedTrain && (
                <div className="space-y-4">
                  <QuotaSelector
                    current={selectedQuota}
                    onChange={setSelectedQuota}
                  />
                  {trainResults.map((t, i) => (
                    <div
                      key={i}
                      className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-800 relative group"
                    >
                      <button
                        onClick={() => fetchSchedule(t.train_number)}
                        className="absolute top-4 right-4 p-2 bg-slate-900 rounded-xl text-orange-500 hover:bg-orange-500 hover:text-white transition-all shadow-lg"
                      >
                        <MapPin size={18} />
                      </button>
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
                          const seats = t[`seat_count_${selectedQuota}_${cls}`];
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

              {/* 3. Passenger Details Entry */}
              {selectedTrain && (
                <div className="space-y-6 animate-in zoom-in-95">
                  <div className="flex justify-between items-center bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20">
                    <h4 className="font-black text-white uppercase">
                      {selectedTrain.train_name} | {selectedClass.toUpperCase()}{" "}
                      Class
                    </h4>
                    <button
                      onClick={() => setSelectedTrain(null)}
                      className="text-[10px] font-black uppercase text-slate-500 underline"
                    >
                      Change Train
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-black text-orange-500 uppercase tracking-widest">
                      Adult Passengers (Max 6)
                    </p>
                    {passengers.map((p, i) => (
                      <div
                        key={i}
                        className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
                      >
                        <input
                          placeholder="Name"
                          className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-white"
                          value={p.name}
                          onChange={(e) =>
                            updatePassenger(i, "name", e.target.value)
                          }
                        />
                        <input
                          placeholder="Age"
                          type="number"
                          className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-white"
                          value={p.age}
                          onChange={(e) =>
                            updatePassenger(i, "age", e.target.value)
                          }
                        />
                        <select
                          className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-white"
                          value={p.gender}
                          onChange={(e) =>
                            updatePassenger(i, "gender", e.target.value)
                          }
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
                            <input
                              type="checkbox"
                              checked={p.senior}
                              disabled
                              className="accent-orange-500"
                            />{" "}
                            SENIOR
                          </label>
                          <label className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
                            <input
                              type="checkbox"
                              checked={p.pwd}
                              onChange={(e) =>
                                updatePassenger(i, "pwd", e.target.checked)
                              }
                              className="accent-orange-500"
                            />{" "}
                            PWD
                          </label>
                        </div>
                        {i > 0 && (
                          <button
                            onClick={() =>
                              setPassengers(
                                passengers.filter((_, idx) => idx !== i)
                              )
                            }
                            className="text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
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
                      className="text-orange-500 text-[10px] font-black uppercase flex items-center gap-2"
                    >
                      <UserPlus size={16} /> Add Adult
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-black text-orange-500 uppercase tracking-widest">
                      Child Passengers (Age 1-6)
                    </p>
                    {children.map((c, i) => (
                      <div
                        key={i}
                        className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
                      >
                        <input
                          placeholder="Child Name"
                          className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-white"
                          value={c.name}
                          onChange={(e) =>
                            updateChild(i, "name", e.target.value)
                          }
                        />
                        <input
                          placeholder="Age"
                          type="number"
                          min="1"
                          max="6"
                          className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-white"
                          value={c.age}
                          onChange={(e) =>
                            updateChild(i, "age", e.target.value)
                          }
                        />
                        <select
                          className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-white"
                          value={c.gender}
                          onChange={(e) =>
                            updateChild(i, "gender", e.target.value)
                          }
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                        <button
                          onClick={() =>
                            setChildren(children.filter((_, idx) => idx !== i))
                          }
                          className="text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setChildren([
                          ...children,
                          { name: "", age: "", gender: "M" },
                        ])
                      }
                      className="text-orange-500 text-[10px] font-black uppercase flex items-center gap-2"
                    >
                      <UserPlus size={16} /> Add Child
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      setModalState({ type: "summary", open: true })
                    }
                    className="w-full py-5 bg-orange-500 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-orange-500/20"
                  >
                    Proceed to Summary
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Booking Summary & Fake Payment Dialog */}
      {modalState.open && modalState.type === "summary" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-xl rounded-[2.5rem] border border-slate-800 p-8 space-y-6 animate-in zoom-in-95">
            <h2 className="text-xl font-black text-white uppercase italic border-b border-slate-800 pb-4 flex items-center gap-3">
              <Layers className="text-orange-500" /> Booking Summary
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Total Payable
                  </p>
                  <p className="text-2xl font-black text-white">
                    ₹ {calculateTotalFare()}
                  </p>
                </div>
                <CreditCard className="text-orange-500" size={32} />
              </div>
              <div className="text-[10px] space-y-2 text-slate-400 font-bold uppercase">
                <p>
                  Train: {selectedTrain.train_name} (
                  {selectedTrain.train_number})
                </p>
                <p>
                  Date: {searchForm.doj} | Class: {selectedClass.toUpperCase()}
                </p>
                <p>
                  Passengers: {passengers.length} Adult, {children.length} Child
                </p>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setModalState({ open: false, type: null })}
                className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold uppercase text-[10px]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 py-4 bg-orange-500 rounded-2xl font-black uppercase text-[10px]"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Confirm & Pay"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Confirmation Ticket View */}
      {modalState.open && modalState.type === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] border border-slate-800 p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
            <CheckCircle2 size={64} className="text-green-500 mx-auto" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              Booking Successful!
            </h2>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left space-y-3">
              <p className="text-xs font-bold text-slate-500">
                PNR:{" "}
                <span className="text-orange-500 ml-2 tracking-widest">
                  {bookingSummary?.pnr || "4210983241"}
                </span>
              </p>
              <p className="text-xs font-bold text-slate-200 uppercase">
                {selectedTrain.train_name}
              </p>
              <div className="border-t border-slate-800 pt-2">
                {passengers.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-[10px] text-slate-400 uppercase font-bold"
                  >
                    {p.name} - Confirmed
                  </p>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold uppercase text-[10px] flex items-center justify-center gap-2"
              >
                <Download size={14} /> Download
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-4 bg-orange-500 rounded-2xl font-black uppercase text-[10px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal ... same as before */}
    </div>
  );
};

// Autocomplete, QuotaSelector, etc. remain the same as provided in previous context
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
        className="bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl text-sm font-bold text-white outline-none focus:border-orange-500 w-full transition-all"
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

const Disclaimer = () => (
  <div className="bg-orange-500/5 p-6 border-t border-slate-800 flex gap-4 text-[10px] text-orange-200/60 font-medium italic">
    <AlertTriangle className="text-orange-500 shrink-0" size={16} />
    <p>
      Usage Disclaimer: This is a mock portal. Avoid parallel API requests to
      prevent server throttling.
    </p>
  </div>
);

export default RailwayReservation;
