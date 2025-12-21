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
  const loadingRef = useRef(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sourceRef = useRef(null);
  const destinationRef = useRef(null);
  const dateRef = useRef(null);

  const [stations, setStations] = useState([]);
  const [resTypes, setResTypes] = useState([]);
  const [coachTypes, setCoachTypes] = useState([]);

  const [trainResults, setTrainResults] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedQuota, setSelectedQuota] = useState("gen"); // gen, ttl, ptl, pwd, senior

  const [modalState, setModalState] = useState({ type: null, open: false });
  const [bookingSummary, setBookingSummary] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const [searchForm, setSearchForm] = useState({
    source_code: "",
    destination_code: "",
    doj: today,
  });
  const [passengers, setPassengers] = useState([
    { name: "", age: "", gender: "M", senior: false, pwd: false },
  ]);
  const [children, setChildren] = useState([]);
  const [pnrInput, setPnrInput] = useState("");

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [stRes, resRes, coachRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/stations`, API_CONFIG),
          axios.get(`${API_BASE_URL}/reservation-type`, API_CONFIG),
          axios.get(`${API_BASE_URL}/coach-type`, API_CONFIG),
        ]);
        setStations(stRes.data.data || []);
        setResTypes(resRes.data.data || []);
        setCoachTypes(coachRes.data.data || []);
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

      setTrainResults(res.data.data?.trains_list);
      console.log(res.data.data.trains_list);
      setErrorMsg("");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalFare = () => {
    if (!selectedTrain || !selectedClass) return 0;
    const baseFare =
      parseFloat(selectedTrain[`fare_${selectedQuota}_${selectedClass}`]) || 0;
    return (passengers.length * baseFare).toFixed(2);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/confirm-booking`,
        {
          train_no: selectedTrain.train_number,
          class: selectedClass,
          quota: selectedQuota,
          passengers,
          children,
        },
        API_CONFIG
      );
      setBookingSummary(res.data.data);
      setModalState({ type: "success", open: true });
    } finally {
      setLoading(false);
    }
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
              className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
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
              {/* Search Section */}
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
                  className="bg-orange-500 h-14 rounded-2xl font-black uppercase text-xs hover:bg-orange-600 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Search size={18} />
                  )}{" "}
                  Search
                </button>
              </div>

              {/* Train Selection with Quota/Class Grid */}
              {trainResults.length > 0 && !selectedTrain && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                  <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
                    {["gen", "ttl", "ptl", "pwd", "senior"].map((q) => (
                      <button
                        key={q}
                        onClick={() => setSelectedQuota(q)}
                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase border-2 transition-all ${
                          selectedQuota === q
                            ? "bg-orange-500 border-orange-500 text-white"
                            : "border-slate-800 text-slate-500"
                        }`}
                      >
                        {q === "gen"
                          ? "General"
                          : q === "ttl"
                          ? "Tatkal"
                          : q === "ptl"
                          ? "Premium Tatkal"
                          : q === "pwd"
                          ? "PWD"
                          : "Senior"}
                      </button>
                    ))}
                  </div>
                  {trainResults.map((t, i) => (
                    <div
                      key={i}
                      className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-800"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                          <div className="p-4 bg-slate-900 rounded-2xl text-orange-500">
                            <TrainFront size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-white uppercase italic">
                              {t.train_name} ({t.train_number})
                            </h4>
                            <p className="text-[10px] font-bold text-slate-500">
                              {t.scheduled_departure} → {t.estimated_arrival} |{" "}
                              {t.journey_duration}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">
                            {t.running_days}
                          </p>
                          <p className="text-[10px] font-bold text-orange-500">
                            {t.train_type}
                          </p>
                        </div>
                      </div>

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

              {/* Passenger Entry Section */}
              {selectedTrain && (
                <div className="space-y-6 animate-in zoom-in-95">
                  <div className="flex justify-between items-center bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-orange-500">
                        Selected
                      </p>
                      <h4 className="font-black text-white">
                        {selectedTrain.train_name} |{" "}
                        {selectedClass.toUpperCase()} |{" "}
                        {selectedQuota.toUpperCase()}
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTrain(null);
                        setSelectedClass(null);
                      }}
                      className="text-[10px] font-black uppercase text-slate-500 underline"
                    >
                      Change
                    </button>
                  </div>

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
                        <option value="O">Other</option>
                      </select>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={p.senior}
                          disabled
                          className="accent-orange-500"
                        />
                        <span className="text-[9px] font-bold text-slate-500 uppercase">
                          Senior
                        </span>
                      </label>
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
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() =>
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
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">
                        Total Fare
                      </p>
                      <h3 className="text-2xl font-black text-white">
                        ₹ {calculateTotalFare()}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setModalState({ type: "booking", open: true })
                    }
                    className="w-full py-5 bg-orange-500 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-orange-500/20"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <Disclaimer />
      </div>

      {/* Payment Modal */}
      {modalState.open && modalState.type === "booking" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-xl rounded-[2.5rem] border border-slate-800 p-8 space-y-6">
            <h2 className="text-xl font-black text-white uppercase italic border-b border-slate-800 pb-4 flex items-center gap-3">
              <CreditCard className="text-orange-500" /> Payment Verification
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Payable Amount
                  </p>
                  <p className="text-2xl font-black text-white">
                    ₹ {calculateTotalFare()}
                  </p>
                </div>
                <Ticket className="text-orange-500" size={32} />
              </div>
              <div className="grid grid-cols-2 gap-4 italic text-[10px] text-slate-500">
                <p>Train: {selectedTrain.train_number}</p>
                <p>Journey Date: {searchForm.doj}</p>
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
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {modalState.open && modalState.type === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] border border-slate-800 p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
            <div className="flex justify-center">
              <CheckCircle2 size={64} className="text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Ticket Confirmed
              </h2>
              <p className="text-slate-500 text-xs mt-2 italic">
                PNR Generated:{" "}
                <span className="text-orange-500 font-bold tracking-[0.2em]">
                  {bookingSummary?.pnr ||
                    "MOCK" +
                      Math.random().toString(36).substr(2, 6).toUpperCase()}
                </span>
              </p>
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
    </div>
  );
};

const AutocompleteInput = ({ label, list, onSelect, inputRef }) => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = list
    .filter(
      (s) =>
        s.station_name.toLowerCase().includes(query.toLowerCase()) ||
        s.code.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);

  const handleKeyDown = (e) => {
    if (!showResults || filtered.length === 0) return;
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
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
          setSelectedIndex(0);
        }}
        className="bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl text-sm font-bold text-white outline-none focus:border-orange-500 w-full"
        placeholder={`Search ${label}...`}
      />
      {showResults && query && filtered.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden z-20 shadow-xl">
          {filtered.map((s, i) => (
            <div
              key={i}
              className={`p-4 cursor-pointer text-xs font-bold border-b border-slate-700 last:border-0 transition-colors ${
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

const Disclaimer = () => (
  <div className="bg-orange-500/5 p-6 border-t border-slate-800 flex gap-4 text-[11px] text-orange-200/60 font-medium leading-relaxed">
    <AlertTriangle className="text-orange-500 shrink-0" size={18} />
    <div>
      <p className="font-bold uppercase mb-1 tracking-wider">
        Usage Disclaimer
      </p>
      Strictly for referring purpose only. Multiple API calls at a time lead to
      'Too Many Requests' error. Serverpe.in is not responsible for errors.
    </div>
  </div>
);

export default RailwayReservation;
