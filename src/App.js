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
    data: null, // This will now hold { train_details, train_schedule_details }
  });

  const today = new Date().toISOString().split("T")[0];
  const [searchForm, setSearchForm] = useState({
    source_code: "",
    destination_code: "",
    doj: today,
  });

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

  // Modified to handle the new object-based response
  const fetchSchedule = async (trainNo) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/train-schedule`,
        { train_number: trainNo },
        API_CONFIG
      );
      // Store the entire data object containing train_details and train_schedule_details
      setModalState({ type: "schedule", open: true, data: res.data.data });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <div className="max-w-6xl mx-auto bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden">
        {/* Navigation Tabs */}
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
              {/* Search Bar */}
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

              {/* Train List View */}
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
                        title="View Schedule"
                      >
                        <MapPin size={18} />
                      </button>
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
                              {t.scheduled_departure} → {t.estimated_arrival}
                            </p>
                          </div>
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
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal - Modified to show train_details and train_schedule_details */}
      {modalState.open && modalState.type === "schedule" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] border border-slate-800 flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-950/50">
              <div>
                <h2 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                  <MapPin className="text-orange-500" />{" "}
                  {modalState.data?.train_details?.train_name}
                </h2>
                <div className="flex gap-3 mt-1">
                  <span className="text-[10px] font-black px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded uppercase">
                    #{modalState.data?.train_details?.train_number}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {modalState.data?.train_details?.train_type} | Zone:{" "}
                    {modalState.data?.train_details?.zone}
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  setModalState({ open: false, type: null, data: null })
                }
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400"
              >
                <X />
              </button>
            </div>

            {/* Train Info Banner */}
            <div className="px-6 py-4 bg-slate-800/30 flex justify-between items-center border-b border-slate-800">
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase">
                  From
                </p>
                <p className="text-xs font-bold text-white uppercase">
                  {modalState.data?.train_details?.station_from}
                </p>
              </div>
              <ArrowRightIcon className="text-slate-600" />
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase">
                  To
                </p>
                <p className="text-xs font-bold text-white uppercase">
                  {modalState.data?.train_details?.station_to}
                </p>
              </div>
            </div>

            {/* Schedule List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {modalState.data?.train_schedule_details?.map((stop, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 items-center border-l-2 border-orange-500 ml-4 pl-6 relative"
                >
                  <div className="absolute -left-[9px] w-4 h-4 bg-orange-500 rounded-full border-4 border-slate-900"></div>
                  <div className="flex-1 bg-slate-950/50 p-4 rounded-2xl border border-slate-800 flex justify-between hover:border-slate-700 transition-colors">
                    <div>
                      <p className="text-xs font-black text-white uppercase">
                        {stop.station_name} ({stop.station_code})
                      </p>
                      <p className="text-[9px] text-slate-500 uppercase font-bold">
                        Seq: {stop.station_sequence} | Day {stop.running_day} |{" "}
                        {stop.kilometer} KM
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-orange-500">
                        {stop.arrival ? stop.arrival : "Starts"}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">
                        Arr | Dep: {stop.departure}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon for Modal
const ArrowRightIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className={className}
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
    />
  </svg>
);

// Autocomplete and QuotaSelector components remain the same...
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
