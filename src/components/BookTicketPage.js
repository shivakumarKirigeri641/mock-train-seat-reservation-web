import React, { useState, useEffect, useRef } from "react";
import { addstations } from "../store/slices/stationslistslice";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  update_date_of_journey,
  update_destination,
  update_source,
} from "../store/slices/sourcedestinationdojSlice";

// --- ICONS ---

const SwapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
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

const TicketIcon = ({ className }) => (
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
      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
    />
  </svg>
);

const ClockIcon = ({ className }) => (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ChevronIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// --- UTILS & DATA ---

const todayISO = () => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
};

const sampleTrains = [
  {
    train_number: "12627",
    train_name: "Karnataka Express",
    departure: "10:30",
    arrival: "18:45",
    from: "SBC",
    to: "NDLS",
    duration: "32h 15m",
    classes: ["SL", "3A", "2A", "1A"],
  },
  {
    train_number: "16592",
    train_name: "Hampi Express",
    departure: "06:15",
    arrival: "14:20",
    from: "SBC",
    to: "HPT",
    duration: "8h 05m",
    classes: ["SL", "3A", "2S", "CC"],
  },
];

// Configuration for Matrix Table
const QUOTA_COLUMNS = ["GEN", "TATKAL", "PREMIUM_TATKAL", "LADIES", "SENIOR"];
// Order of rows to display if the train supports them
const CLASS_ROWS_ORDER = [
  "SL",
  "1A",
  "2A",
  "3A",
  "2S",
  "CC",
  "EC",
  "EA",
  "E3",
  "FC",
];

const BookTicketPage = () => {
  const navigate = useNavigate();

  // form state
  const [source, setSource] = useState("");
  const [dest, setDest] = useState("");
  const [date, setDate] = useState(todayISO());

  const [trains, setTrains] = useState([]);
  const [loadingTrains, setLoadingTrains] = useState(false);
  const [expandedTrainId, setExpandedTrainId] = useState(null);

  // autosuggest state
  const [stationQuery, setStationQuery] = useState({ src: "", dst: "" });
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState("src");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Refs
  const dropdownRef = useRef(null);
  const srcRef = useRef(null);
  const dstRef = useRef(null);
  const dateRef = useRef(null);
  const searchRef = useRef(null);

  const dispatch = useDispatch();
  const mockstations_master = useSelector((store) => store?.stationslist);

  // modal (schedules) state
  const [modalTrain, setModalTrain] = useState(null);

  // fetch station suggestions
  const fetchStations = async (q) => {
    if (!q || q?.length < 2) return [];
    try {
      return mockstations_master?.filter(
        (s) =>
          s?.code.toLowerCase().includes(q?.toLowerCase()) ||
          s?.station_name.toLowerCase().includes(q?.toLowerCase())
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // when input changes, fetch suggestions
  useEffect(() => {
    let cancelled = false;
    const q = activeInput === "src" ? stationQuery.src : stationQuery.dst;
    (async () => {
      if (q.length < 2) {
        setSuggestions([]);
        return;
      }
      const s = await fetchStations(q);
      if (!cancelled) {
        setSuggestions(s);
        setSelectedIndex(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stationQuery.src, stationQuery.dst, activeInput]);

  //on load
  useEffect(() => {
    const loadStations = async () => {
      try {
        const result = await axios.get("http://localhost:8888/stations", {
          withCredentials: true,
        });
        if (result?.data?.data?.rows) {
          dispatch(addstations(result.data.data.rows));
        }
      } catch (e) {
        console.log("Mock mode or API error");
      }

      dispatch(
        update_date_of_journey(
          new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
          })
        )
      );
    };
    loadStations();
  }, []);

  // keyboard navigation
  const onKeyDownSuggestions = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((si) => Math.min(si + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((si) => Math.max(si - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectSuggestion(selectedIndex);
    }
  };

  const selectSuggestion = (index, focusNext = true) => {
    const value = suggestions[index];
    if (!value) return;

    if (activeInput === "src") {
      setSource(value?.code + "-" + value?.station_name);
      dispatch(update_source(value));
      setStationQuery({ ...stationQuery, src: value?.code });
      setSuggestions([]);
      if (focusNext) {
        setTimeout(() => dstRef.current?.focus(), 10);
        setActiveInput("dst");
      }
    } else {
      setDest(value?.code + "-" + value?.station_name);
      dispatch(update_destination(value));
      setStationQuery({ ...stationQuery, dst: value?.code });
      setSuggestions([]);

      // Focus Date Picker if source is already selected
      if (focusNext && source) {
        setTimeout(() => {
          if (dateRef.current) {
            dateRef.current.focus();
            try {
              dateRef.current.showPicker();
            } catch (err) {
              console.log("Date picker API not supported", err);
            }
          }
        }, 100);
      }
    }
  };

  const onInputChange = (field, val) => {
    setActiveInput(field);
    setSelectedIndex(0);
    if (field === "src") {
      setSource(val);
      setStationQuery((s) => ({ ...s, src: val }));
    } else {
      setDest(val);
      setStationQuery((s) => ({ ...s, dst: val }));
    }
  };

  const handleInputFocus = (e, field) => {
    setActiveInput(field);
    e.target.select();
  };

  const swapSrcDest = () => {
    setSource((prevSrc) => {
      setDest(prevSrc);
      return dest;
    });
    setStationQuery({ src: dest, dst: source });
  };

  const searchTrains = async () => {
    if (!source || !dest) {
      console.error("Please enter Source and Destination.");
      return;
    }
    setLoadingTrains(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setTrains(sampleTrains);
      // Default expand the first train
      setExpandedTrainId(sampleTrains[0]?.train_number);
    } catch (err) {
      console.error(err);
      setTrains([]);
    } finally {
      setLoadingTrains(false);
    }
  };

  const proceedToConfirm = (train, cls, quota) => {
    navigate("/confirm-ticket", {
      state: {
        train,
        search: {
          source,
          dest,
          date,
          selectedCoach: cls,
          selectedReservation: quota,
        },
      },
    });
  };

  const toggleAccordion = (id) => {
    setExpandedTrainId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const onDoc = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float-slow { animation: float-slow 8s infinite ease-in-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 100ms; }
        .transition-max-height { transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out; }
      `}</style>

      {/* FLOATING BACKGROUND ICONS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-10 left-10 opacity-[0.03] animate-float-slow text-white">
          <TrainIcon className="w-32 h-32" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-[0.03] animate-float-slow text-white delay-100">
          <TrainIcon className="w-40 h-40" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* header */}
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Mock Train Seat Booking
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Enterprise edition — API-first booking flows
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/user-home")}
            className="text-sm text-gray-400 hover:text-white transition-colors hover:underline underline-offset-4"
          >
            Back to Dashboard
          </button>
        </header>

        {/* SEARCH FORM */}
        <section className="relative z-20 bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700 mb-10 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            {/* 1. Source */}
            <div
              className={`relative lg:col-span-3 ${
                activeInput === "src" ? "z-50" : "z-20"
              }`}
              ref={dropdownRef}
            >
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1 pl-1">
                From
              </label>
              <input
                ref={srcRef}
                value={source}
                onChange={(e) => onInputChange("src", e.target.value)}
                onFocus={(e) => handleInputFocus(e, "src")}
                onKeyDown={onKeyDownSuggestions}
                placeholder="Source Station"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all truncate hover:border-indigo-500/30"
              />
              {suggestions.length > 0 && activeInput === "src" && (
                <ul
                  className="absolute z-30 left-0 right-0 bg-gray-700 border border-gray-600 rounded-xl mt-1 max-h-60 overflow-auto shadow-2xl animate-fade-in"
                  role="listbox"
                >
                  {suggestions.map((s, i) => (
                    <li
                      key={s?.code}
                      onMouseDown={() => selectSuggestion(i)}
                      className={`px-4 py-3 cursor-pointer text-gray-200 hover:bg-indigo-600 hover:text-white transition-colors border-b border-gray-600/50 last:border-0 ${
                        i === selectedIndex ? "bg-indigo-700 text-white" : ""
                      }`}
                    >
                      <div className="font-bold">{s?.code}</div>
                      <div className="text-xs opacity-80">
                        {s?.station_name}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 2. Swap */}
            <div className="lg:col-span-1 flex justify-center pb-2 relative z-10">
              <button
                onClick={swapSrcDest}
                className="p-2.5 bg-gray-700 text-gray-300 rounded-full hover:bg-indigo-600 hover:text-white transition-all border border-gray-600 hover:border-indigo-500 shadow-lg transform active:scale-90 hover:rotate-180 duration-500"
              >
                <SwapIcon />
              </button>
            </div>

            {/* 3. Destination */}
            <div
              className={`relative lg:col-span-3 ${
                activeInput === "dst" ? "z-50" : "z-20"
              }`}
            >
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1 pl-1">
                To
              </label>
              <input
                ref={dstRef}
                value={dest}
                onChange={(e) => onInputChange("dst", e.target.value)}
                onFocus={(e) => handleInputFocus(e, "dst")}
                onKeyDown={onKeyDownSuggestions}
                placeholder="Destination Station"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all truncate hover:border-indigo-500/30"
              />
              {suggestions.length > 0 && activeInput === "dst" && (
                <ul
                  className="absolute z-30 left-0 right-0 bg-gray-700 border border-gray-600 rounded-xl mt-1 max-h-60 overflow-auto shadow-2xl animate-fade-in"
                  role="listbox"
                >
                  {suggestions.map((s, i) => (
                    <li
                      key={s?.code}
                      onMouseDown={() => selectSuggestion(i)}
                      className={`px-4 py-3 cursor-pointer text-gray-200 hover:bg-indigo-600 hover:text-white transition-colors border-b border-gray-600/50 last:border-0 ${
                        i === selectedIndex ? "bg-indigo-700 text-white" : ""
                      }`}
                    >
                      <div className="font-bold">{s?.code}</div>
                      <div className="text-xs opacity-80">
                        {s?.station_name}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 4. Date */}
            <div className="lg:col-span-3 relative z-10">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1 pl-1">
                Date
              </label>
              <input
                ref={dateRef}
                type="date"
                value={date}
                min={todayISO()}
                onChange={(e) => {
                  setDate(e.target.value);
                  dispatch(update_date_of_journey(e.target.value));
                  setTimeout(() => searchRef.current?.focus(), 100);
                }}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all [color-scheme:dark] hover:border-indigo-500/30"
              />
            </div>

            {/* 5. Search Button */}
            <div className="lg:col-span-2 relative z-10">
              <button
                ref={searchRef}
                onClick={searchTrains}
                className={`w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all font-semibold transform hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden ${
                  loadingTrains ? "cursor-not-allowed opacity-90" : ""
                }`}
                disabled={loadingTrains}
              >
                {loadingTrains ? "..." : "Search"}
              </button>
            </div>
          </div>
        </section>

        {/* TRAINS ACCORDION LIST */}
        <section className="mt-6 relative z-10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 animate-fade-in delay-100">
            Available Trains
            {trains.length > 0 && (
              <span className="text-sm font-normal text-gray-500 bg-gray-800 px-2 py-1 rounded-md border border-gray-700 animate-pulse">
                {trains.length} Found
              </span>
            )}
          </h3>

          {loadingTrains ? (
            <div className="text-center text-gray-400 py-20 bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700 animate-pulse">
              <div className="animate-spin inline-block w-10 h-10 border-4 border-t-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-lg font-medium text-gray-300">
                Searching best routes...
              </p>
            </div>
          ) : trains.length === 0 ? (
            <div className="text-center text-gray-400 py-20 bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700 flex flex-col items-center animate-fade-in">
              <svg
                className="w-16 h-16 text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-lg text-gray-300">
                No trains found for this route.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {trains.map((t, index) => {
                const isExpanded = expandedTrainId === t.train_number;
                return (
                  <div
                    key={t.train_number}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className={`bg-gray-800/90 backdrop-blur rounded-2xl shadow-lg transition-all border border-gray-700 hover:border-indigo-500/30 animate-slide-up overflow-hidden ${
                      isExpanded ? "ring-1 ring-indigo-500/50" : ""
                    }`}
                  >
                    {/* ACCORDION HEADER */}
                    <div
                      onClick={() => toggleAccordion(t.train_number)}
                      className="p-4 md:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group bg-gradient-to-r from-gray-800 to-gray-800 hover:from-gray-800 hover:to-gray-750 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {/* Arrow Icon with Rotation */}
                          <div
                            className={`text-indigo-400 transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          >
                            <ChevronIcon className="w-6 h-6" />
                          </div>

                          <div className="flex justify-between items-center w-full">
                            <div className="gap-3">
                              <div>
                                <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                  {t.train_name}
                                </h4>
                                <span className="px-2 py-0.5 bg-gray-700 text-gray-300 font-mono rounded border border-gray-600">
                                  #{t.train_number}
                                </span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div>🚄 runs on:</div>
                              <div>
                                <span className="font-mono text-sm">
                                  Journey duration: {t.duration}
                                </span>
                              </div>
                            </div>
                            <div className="text-start">
                              <div className="font-bold text-white">
                                📍Departure: {t.departure}
                              </div>
                              <div className="font-bold text-white">
                                🪧Arrival: {t.arrival}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-4 pl-9 md:pl-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalTrain(t);
                          }}
                          className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors border border-gray-600 hover:text-white flex items-center gap-1 z-10 relative"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          Route Schedule
                        </button>
                      </div>
                    </div>

                    {/* ACCORDION BODY (SEAT MATRIX) */}
                    {isExpanded && (
                      <div className="border-t border-gray-700 bg-gray-900/30 p-4 md:p-6 animate-fade-in">
                        <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-900/40">
                          <table className="w-full text-center text-sm">
                            <thead className="bg-gray-800 text-xs uppercase font-semibold text-gray-400">
                              <tr>
                                <th className="px-3 py-3 text-left sticky left-0 bg-gray-800 border-r border-gray-700 z-10">
                                  Class
                                </th>
                                {QUOTA_COLUMNS.map((q) => (
                                  <th
                                    key={q}
                                    className="px-3 py-3 min-w-[80px] border-r border-gray-700/50 last:border-0"
                                  >
                                    {q.replace("PREMIUM_", "PREM ")}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                              {CLASS_ROWS_ORDER.filter((c) =>
                                t.classes.includes(c)
                              ).map((cls) => (
                                <tr
                                  key={cls}
                                  className="hover:bg-gray-800/50 transition-colors"
                                >
                                  <td className="px-3 py-3 text-left font-bold text-white sticky left-0 bg-gray-900/90 border-r border-gray-700 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                                    {cls}
                                  </td>
                                  {QUOTA_COLUMNS.map((quota) => {
                                    // Simulate random availability logic
                                    // 15% chance to be "Not Applicable"
                                    const isNA = Math.random() < 0.15;

                                    if (isNA) {
                                      return (
                                        <td
                                          key={quota}
                                          className="px-1 py-1 border-r border-gray-700/30 last:border-0 text-center align-middle"
                                        >
                                          <span className="text-gray-600 font-bold select-none">
                                            -
                                          </span>
                                        </td>
                                      );
                                    }

                                    const isAvail = Math.random() > 0.3;
                                    const count =
                                      Math.floor(Math.random() * 50) + 1;
                                    const status = isAvail ? "AVL" : "WL";
                                    const colorClass = isAvail
                                      ? "text-emerald-400"
                                      : "text-orange-400";

                                    return (
                                      <td
                                        key={quota}
                                        className="px-1 py-1 border-r border-gray-700/30 last:border-0"
                                      >
                                        <button
                                          onClick={() =>
                                            proceedToConfirm(t, cls, quota)
                                          }
                                          className={`w-full h-full py-2 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                        >
                                          <span
                                            className={`font-bold text-xs ${colorClass} group-hover/cell:text-indigo-300`}
                                          >
                                            {status} {count}
                                          </span>
                                          <span className="text-[10px] text-gray-500 font-mono group-hover/cell:text-indigo-200">
                                            ₹
                                            {Math.floor(Math.random() * 2000) +
                                              150}
                                          </span>
                                        </button>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SCHEDULE MODAL */}
        {modalTrain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-all animate-fade-in">
            <div className="bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-700 transform transition-all animate-slide-up">
              <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {modalTrain.train_name}
                  </h3>
                  <p className="text-sm text-gray-400 font-mono mt-0.5">
                    {modalTrain.train_number} • Daily Service
                  </p>
                </div>
                <button
                  onClick={() => setModalTrain(null)}
                  className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
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
              <div className="max-h-[60vh] overflow-y-auto pr-2">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-800 z-10 shadow-sm">
                    <tr className="text-left text-xs uppercase font-semibold text-gray-500 border-b border-gray-700">
                      <th className="py-3 pl-2">Station</th>
                      <th className="py-3 text-center">Arrives</th>
                      <th className="py-3 text-center">Departs</th>
                      <th className="py-3 text-center">Halt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {[
                      "SBC - KSR Bengaluru",
                      "YNK - Yelahanka",
                      "HUP - Hindupur",
                      "DMM - Dharmavaram",
                      "GTL - Guntakal",
                      "NDLS - New Delhi",
                    ].map((s, i, arr) => (
                      <tr
                        key={s}
                        className="hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="py-3 pl-2 font-medium text-gray-300">
                          {s.split(" - ")[0]}
                        </td>
                        <td className="py-3 text-center text-gray-400 font-mono">
                          {i === 0 ? "Source" : `1${i}:30`}
                        </td>
                        <td className="py-3 text-center text-gray-400 font-mono">
                          {i === arr.length - 1 ? "Dest" : `1${i}:35`}
                        </td>
                        <td className="py-3 text-center text-gray-500 text-xs">
                          {i === 0 || i === arr.length - 1 ? "-" : "5m"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                <button
                  onClick={() => setModalTrain(null)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookTicketPage;
