import React, { useState, useEffect, useRef } from "react";
import { addstations } from "../store/slices/stationslistslice";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { update_trainslist } from "../store/slices/trainsListSlice";
import {
  update_date_of_journey,
  update_destination,
  update_source,
} from "../store/slices/sourcedestinationdojSlice";
import { update_trainSchedule } from "../store/slices/trainScheduleSlice";

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

// Configuration for Matrix Table
const QUOTA_COLUMNS = [
  "GENERAL",
  "TATKAL",
  "PREMIUM_TATKAL",
  "LADIES",
  "SENIOR",
];
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
  const selected_source = useSelector(
    (store) => store?.stationslistslicsourcedestinationdoj.selected_source
  );
  const selected_destination = useSelector(
    (store) => store?.stationslistslicsourcedestinationdoj.selected_destination
  );
  const selected_date_of_journey = useSelector(
    (store) => store?.stationslistslicsourcedestinationdoj.date_of_journey
  );
  const train_schedules = useSelector((store) => store?.trainSchedule);
  const sampleTrains = useSelector((store) => store?.trainsList);

  // modal (schedules) state
  const [modalTrain, setModalTrain] = useState(null);
  // mount animation
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

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
        console.log(result?.data?.data);
        if (result?.data?.data) {
          dispatch(addstations(result.data.data));
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

  const fetchTrainSchedule = async (t) => {
    try {
      const result = await axios.post(
        "http://localhost:8888/train-schedule",
        {
          train_number: t?.train_number,
        },
        { withCredentials: true }
      );
      dispatch(update_trainSchedule(result?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };
  const searchTrains = async () => {
    if (!source || !dest) {
      console.error("Please enter Source and Destination.");
      return;
    }
    dispatch(update_trainslist([]));
    setLoadingTrains(true);
    try {
      const result = await axios.post(
        "http://localhost:8888/search-trains",
        {
          source_code: selected_source?.code.toUpperCase(),
          destination_code: selected_destination?.code.toUpperCase(),
          doj: selected_date_of_journey,
        },
        { withCredentials: true }
      );
      if (!result?.data?.data) {
        setTrains([]);
      } else {
        // FIX: Capture the data directly from response
        const fetchedTrains = result?.data?.data?.trains_list || [];

        // Update Redux
        dispatch(update_trainslist(fetchedTrains));

        // Update Local State immediately (don't wait for Redux selector)
        setTrains(fetchedTrains);
        setExpandedTrainId(fetchedTrains[0]?.train_number);
      }
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
    // FIX 1: Removed transform/transition from here
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

      {/* FIX 2: Moved transform/transition/animation classes to this inner wrapper */}
      <div
        className={`max-w-7xl mx-auto relative z-10 transform transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
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
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-white to-indigo-300 bg-clip-text text-transparent">
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
                onClick={async () => {
                  await searchTrains();
                }}
                className={`w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all font-semibold transform hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden ${
                  loadingTrains ? "cursor-not-allowed opacity-90" : ""
                }`}
                disabled={loadingTrains}
              >
                {loadingTrains ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 animate-spin text-white"
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
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span>Searching</span>
                  </span>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </div>
        </section>

        {/* TRAINS ACCORDION LIST */}
        <section className="mt-6 relative z-10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 animate-fade-in delay-100">
            Available Trains
            {trains.length > 0 && (
              <span className="text-sm font-normal text-gray-100 bg-gray-800 px-2 py-1 rounded-md border border-gray-700 animate-pulse">
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
          ) : trains?.length === 0 ? (
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
              {trains?.map((t, index) => {
                const isExpanded = expandedTrainId === t?.train_number;
                // slightly longer stagger so entrance feels smooth
                const delayMs = index * 120;
                return (
                  <div
                    key={t?.train_number}
                    style={{
                      animationDelay: `${delayMs}ms`,
                      WebkitAnimationDelay: `${delayMs}ms`,
                      willChange: "transform, opacity",
                    }}
                    className={`bg-gray-800/90 backdrop-blur rounded-2xl shadow-lg transition-all border border-gray-700 hover:border-indigo-500/30 animate-slide-up overflow-hidden ${
                      isExpanded ? "ring-1 ring-indigo-500/50" : ""
                    }`}
                  >
                    {/* ACCORDION HEADER */}
                    <div
                      onClick={() => toggleAccordion(t?.train_number)}
                      className="p-4 md:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group bg-gradient-to-r from-gray-800 to-gray-800 hover:from-gray-800 hover:to-gray-750 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {/* Arrow Icon with Rotation */}
                          <div
                            className={`text-indigo-400 transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            style={{
                              animationDelay: `${delayMs + 60}ms`,
                              WebkitAnimationDelay: `${delayMs + 60}ms`,
                            }}
                          >
                            <ChevronIcon className="w-6 h-6" />
                          </div>

                          <div className="flex justify-between items-center w-full">
                            <div className="gap-3">
                              <div>
                                <h4
                                  className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors"
                                  style={{
                                    animationDelay: `${delayMs + 90}ms`,
                                    WebkitAnimationDelay: `${delayMs + 90}ms`,
                                  }}
                                >
                                  {t?.train_name}
                                </h4>
                                <span className="px-2 py-0.5 bg-gray-700 text-gray-300 font-mono rounded border border-gray-600">
                                  #{t?.train_number}
                                </span>
                              </div>
                            </div>
                            <div className="text-start">
                              <div>Runs on: {t?.running_days}</div>
                              <div>
                                <span className="font-mono text-sm">
                                  {t.journey_duration}
                                </span>
                              </div>
                            </div>
                            <div className="text-start">
                              <div className="font-bold text-white">
                                📍Departure: {t?.scheduled_departure}
                              </div>
                              <div className="font-bold text-white">
                                🪧Arrival: {t?.estimated_arrival}
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
                            fetchTrainSchedule(t);
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
                                    className="px-3 py-3 min-w-[80px] border-r border-gray-500 last:border-1"
                                  >
                                    {q}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                              {/**SLEEPER COACH RESERVATIONS */}
                              <tr>
                                {/** SLEEPER CLASS general*/}
                                <td>SL</td>
                                <td>
                                  {!t?.seat_count_gen_sl ||
                                  t?.seat_count_gen_sl === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_gen_sl}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_sl}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** SLEEPER CLASS general*/}

                                {/** SLEEPER CLASS TATKAL*/}
                                <td>
                                  {!t?.seat_count_ttl_sl ||
                                  t?.seat_count_ttl_sl === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ttl_sl}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ttl_sl}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** SLEEPER CLASS TATKAL*/}

                                {/** SLEEPER CLASS PREMIUMTATKAL*/}
                                <td>
                                  {!t?.seat_count_ptl_sl ||
                                  t?.seat_count_ptl_sl === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ptl_sl}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ptl_sl}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** SLEEPER CLASS PREMIUMTATKAL*/}

                                {/** SLEEPER CLASS ladies*/}
                                <td>
                                  {!t?.seat_count_ladies_sl ||
                                  t?.seat_count_ladies_sl === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ladies_sl}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_sl}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** SLEEPER CLASS ladies*/}

                                {/** SLEEPER CLASS senior*/}
                                <td>
                                  {!t?.seat_count_senior_sl ||
                                  t?.seat_count_senior_sl === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_senior_sl}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_senior_sl}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** SLEEPER CLASS senior*/}
                              </tr>
                              {/**SLEEPER COACH RESERVATIONS */}
                              {/**1A COACH RESERVATIONS */}
                              <tr>
                                {/** 1A CLASS general*/}
                                <td>1A</td>
                                <td>
                                  {!t?.seat_count_gen_1a ||
                                  t?.seat_count_gen_1a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_gen_1a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_1a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 1A CLASS general*/}

                                {/** 1A CLASS TATKAL*/}
                                <td>
                                  {!t?.seat_count_ttl_1a ||
                                  t?.seat_count_ttl_1a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ttl_1a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ttl_1a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 1A CLASS TATKAL*/}

                                {/** 1A CLASS PREMIUMTATKAL*/}
                                <td>
                                  {!t?.seat_count_ptl_1a ||
                                  t?.seat_count_ptl_1a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ptl_1a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ptl_1a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 1A CLASS PREMIUMTATKAL*/}

                                {/** 1A CLASS ladies*/}
                                <td>
                                  {!t?.seat_count_ladies_1a ||
                                  t?.seat_count_ladies_1a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ladies_1a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_1a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 1A CLASS ladies*/}

                                {/** 1A CLASS senior*/}
                                <td>
                                  {!t?.seat_count_senior_1a ||
                                  t?.seat_count_senior_1a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_senior_1a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_senior_1a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 1A CLASS senior*/}
                              </tr>
                              {/**1A COACH RESERVATIONS */}
                              {/**2A COACH RESERVATIONS */}
                              <tr>
                                {/** 2A CLASS general*/}
                                <td>2A</td>
                                <td>
                                  {!t?.seat_count_gen_2a ||
                                  t?.seat_count_gen_2a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_gen_2a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_2a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 2A CLASS general*/}

                                {/** 2A CLASS TATKAL*/}
                                <td>
                                  {!t?.seat_count_ttl_2a ||
                                  t?.seat_count_ttl_2a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ttl_2a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ttl_2a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 2A CLASS TATKAL*/}

                                {/** 2A CLASS PREMIUMTATKAL*/}
                                <td>
                                  {!t?.seat_count_ptl_2a ||
                                  t?.seat_count_ptl_2a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ptl_2a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ptl_2a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 2A CLASS PREMIUMTATKAL*/}

                                {/** 2A CLASS ladies*/}
                                <td>
                                  {!t?.seat_count_ladies_2a ||
                                  t?.seat_count_ladies_2a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ladies_2a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_2a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 2A CLASS ladies*/}

                                {/** 2A CLASS senior*/}
                                <td>
                                  {!t?.seat_count_senior_2a ||
                                  t?.seat_count_senior_2a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_senior_2a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_senior_2a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 2A CLASS senior*/}
                              </tr>
                              {/**2A COACH RESERVATIONS */}
                              {/**3A COACH RESERVATIONS */}
                              <tr>
                                {/** 3A CLASS general*/}
                                <td>3A</td>
                                <td>
                                  {!t?.seat_count_gen_3a ||
                                  t?.seat_count_gen_3a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_gen_3a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_3a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 3A CLASS general*/}

                                {/** 3A CLASS TATKAL*/}
                                <td>
                                  {!t?.seat_count_ttl_3a ||
                                  t?.seat_count_ttl_3a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ttl_3a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ttl_3a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 3A CLASS TATKAL*/}

                                {/** 3A CLASS PREMIUMTATKAL*/}
                                <td>
                                  {!t?.seat_count_ptl_3a ||
                                  t?.seat_count_ptl_3a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ptl_3a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ptl_3a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 3A CLASS PREMIUMTATKAL*/}

                                {/** 3A CLASS ladies*/}
                                <td>
                                  {!t?.seat_count_ladies_3a ||
                                  t?.seat_count_ladies_3a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ladies_3a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_3a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 3A CLASS ladies*/}

                                {/** 3A CLASS senior*/}
                                <td>
                                  {!t?.seat_count_senior_3a ||
                                  t?.seat_count_senior_3a === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_senior_3a}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_senior_3a}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 3A CLASS senior*/}
                              </tr>
                              {/**3A COACH RESERVATIONS */}
                              {/**2S COACH RESERVATIONS */}
                              <tr>
                                {/** 2S CLASS general*/}
                                <td>2S</td>
                                <td>
                                  {!t?.seat_count_gen_2s ||
                                  t?.seat_count_gen_2s === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_gen_2s}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_2s}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 2S CLASS general*/}

                                {/** 2S CLASS TATKAL*/}
                                <td>
                                  {!t?.seat_count_ttl_2s ||
                                  t?.seat_count_ttl_2s === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ttl_2s}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ttl_2s}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 2S CLASS TATKAL*/}

                                {/** 2S CLASS PREMIUMTATKAL*/}
                                <td>
                                  {!t?.seat_count_ptl_2s ||
                                  t?.seat_count_ptl_2s === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ptl_2s}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ptl_2s}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 2S CLASS PREMIUMTATKAL*/}

                                {/** 2S CLASS ladies*/}
                                <td>
                                  {!t?.seat_count_ladies_2s ||
                                  t?.seat_count_ladies_2s === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ladies_2s}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_2s}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 2S CLASS ladies*/}

                                {/** 2S CLASS senior*/}
                                <td>
                                  {!t?.seat_count_senior_2s ||
                                  t?.seat_count_senior_2s === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_senior_2s}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_senior_2s}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** 2S CLASS senior*/}
                              </tr>
                              {/**2S COACH RESERVATIONS */}
                              {/**CC COACH RESERVATIONS */}
                              <tr>
                                {/** CC CLASS general*/}
                                <td>CC</td>
                                <td>
                                  {!t?.seat_count_gen_cc ||
                                  t?.seat_count_gen_cc === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_gen_cc}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_cc}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** CC CLASS general*/}

                                {/** CC CLASS TATKAL*/}
                                <td>
                                  {!t?.seat_count_ttl_cc ||
                                  t?.seat_count_ttl_cc === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ttl_cc}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ttl_cc}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** CC CLASS TATKAL*/}

                                {/** CC CLASS PREMIUMTATKAL*/}
                                <td>
                                  {!t?.seat_count_ptl_cc ||
                                  t?.seat_count_ptl_cc === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ptl_cc}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ptl_cc}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** CC CLASS PREMIUMTATKAL*/}

                                {/** CC CLASS ladies*/}
                                <td>
                                  {!t?.seat_count_ladies_cc ||
                                  t?.seat_count_ladies_cc === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ladies_cc}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_cc}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** CC CLASS ladies*/}

                                {/** CC CLASS senior*/}
                                <td>
                                  {!t?.seat_count_senior_cc ||
                                  t?.seat_count_senior_cc === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_senior_cc}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_senior_cc}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** CC CLASS senior*/}
                              </tr>
                              {/**CC COACH RESERVATIONS */}
                              {/**EC COACH RESERVATIONS */}
                              <tr>
                                {/** EC CLASS general*/}
                                <td>EC</td>
                                <td>
                                  {!t?.seat_count_gen_ec ||
                                  t?.seat_count_gen_ec === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_gen_ec}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_ec}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** EC CLASS general*/}

                                {/** EC CLASS TATKAL*/}
                                <td>
                                  {!t?.seat_count_ttl_ec ||
                                  t?.seat_count_ttl_ec === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ttl_ec}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ttl_ec}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** EC CLASS TATKAL*/}

                                {/** EC CLASS PREMIUMTATKAL*/}
                                <td>
                                  {!t?.seat_count_ptl_ec ||
                                  t?.seat_count_ptl_ec === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ptl_ec}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ptl_ec}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** EC CLASS PREMIUMTATKAL*/}

                                {/** EC CLASS ladies*/}
                                <td>
                                  {!t?.seat_count_ladies_ec ||
                                  t?.seat_count_ladies_ec === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ladies_ec}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_ec}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** EC CLASS ladies*/}

                                {/** EC CLASS senior*/}
                                <td>
                                  {!t?.seat_count_senior_ec ||
                                  t?.seat_count_senior_ec === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_senior_ec}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_senior_ec}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** EC CLASS senior*/}
                              </tr>
                              {/**EC COACH RESERVATIONS */}
                              {/**EA COACH RESERVATIONS */}
                              <tr>
                                {/** EA CLASS general*/}
                                <td>EA</td>
                                <td>
                                  {!t?.seat_count_gen_ea ||
                                  t?.seat_count_gen_ea === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_gen_ea}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_ea}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** EA CLASS general*/}

                                {/** EA CLASS TATKAL*/}
                                <td>
                                  {!t?.seat_count_ttl_ea ||
                                  t?.seat_count_ttl_ea === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ttl_ea}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ttl_ea}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** EA CLASS TATKAL*/}

                                {/** EA CLASS PREMIUMTATKAL*/}
                                <td>
                                  {!t?.seat_count_ptl_ea ||
                                  t?.seat_count_ptl_ea === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ptl_ea}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ptl_ea}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** EA CLASS PREMIUMTATKAL*/}

                                {/** EA CLASS ladies*/}
                                <td>
                                  {!t?.seat_count_ladies_ea ||
                                  t?.seat_count_ladies_ea === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ladies_ea}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_ea}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** EA CLASS ladies*/}

                                {/** EA CLASS senior*/}
                                <td>
                                  {!t?.seat_count_senior_ea ||
                                  t?.seat_count_senior_ea === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_senior_ea}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_senior_ea}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** EA CLASS senior*/}
                              </tr>
                              {/**EA COACH RESERVATIONS */}
                              {/**E3 COACH RESERVATIONS */}
                              <tr>
                                {/** E3 CLASS general*/}
                                <td>E3</td>
                                <td>
                                  {!t?.seat_count_gen_e3 ||
                                  t?.seat_count_gen_e3 === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_gen_e3}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_e3}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** E3 CLASS general*/}

                                {/** E3 CLASS TATKAL*/}
                                <td>
                                  {!t?.seat_count_ttl_e3 ||
                                  t?.seat_count_ttl_e3 === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ttl_e3}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ttl_e3}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** E3 CLASS TATKAL*/}

                                {/** E3 CLASS PREMIUMTATKAL*/}
                                <td>
                                  {!t?.seat_count_ptl_e3 ||
                                  t?.seat_count_ptl_e3 === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ptl_e3}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ptl_e3}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** E3 CLASS PREMIUMTATKAL*/}

                                {/** E3 CLASS ladies*/}
                                <td>
                                  {!t?.seat_count_ladies_e3 ||
                                  t?.seat_count_ladies_e3 === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_ladies_e3}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_e3}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** E3 CLASS ladies*/}

                                {/** E3 CLASS senior*/}
                                <td>
                                  {!t?.seat_count_senior_e3 ||
                                  t?.seat_count_senior_e3 === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.seat_count_senior_e3}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_senior_e3}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** E3 CLASS senior*/}
                              </tr>
                              {/**E3 COACH RESERVATIONS */}
                              {/**FC COACH RESERVATIONS */}
                              <tr>
                                {/** FC CLASS general*/}
                                <td>FC</td>
                                <td>
                                  {!t?.sfct_count_gen_fc ||
                                  t?.sfct_count_gen_fc === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.sfct_count_gen_fc}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_fc}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** FC CLASS general*/}

                                {/** FC CLASS TATKAL*/}
                                <td>
                                  {!t?.sfct_count_ttl_fc ||
                                  t?.sfct_count_ttl_fc === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.sfct_count_ttl_fc}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ttl_fc}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** FC CLASS TATKAL*/}

                                {/** FC CLASS PREMIUMTATKAL*/}
                                <td>
                                  {!t?.sfct_count_ptl_fc ||
                                  t?.sfct_count_ptl_fc === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.sfct_count_ptl_fc}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_ptl_fc}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** FC CLASS PREMIUMTATKAL*/}

                                {/** FC CLASS ladies*/}
                                <td>
                                  {!t?.sfct_count_ladies_fc ||
                                  t?.sfct_count_ladies_fc === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.sfct_count_ladies_fc}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_gen_fc}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** FC CLASS ladies*/}

                                {/** FC CLASS senior*/}
                                <td>
                                  {!t?.sfct_count_senior_fc ||
                                  t?.sfct_count_senior_fc === "-" ? (
                                    "-"
                                  ) : (
                                    <button
                                      onClick={() =>
                                        proceedToConfirm(t, cls, quota)
                                      }
                                      className={`w-full h-full py-1 rounded hover:bg-indigo-600/20 hover:scale-105 active:scale-95 transition-all group/cell flex flex-col items-center justify-center`}
                                    >
                                      <div className="p-1 text-green-400 font-bold">
                                        {t?.sfct_count_senior_fc}
                                        <p className="underline">AVAILABLE</p>
                                        <p className="text-blue-500">
                                          ₹ {t?.fare_senior_fc}
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                                {/** FC CLASS senior*/}
                              </tr>
                              {/**FC COACH RESERVATIONS */}
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
      </div>

      {/* FIX 3: Modal is now here, outside the transformed wrapper */}
      {modalTrain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-all animate-fade-in">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-700 transform transition-all animate-slide-up">
            <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {train_schedules?.train_details?.train_name}
                </h3>
                <p className="text-sm text-gray-400 font-mono mt-0.5">
                  {train_schedules?.train_details?.train_number}
                </p>
                <div className="text-sm text-gray-400 font-mono mt-0.5 flex">
                  Runs on:{" "}
                  <div className="text-center text-yellow-300 mx-1 border-gray-600 border flex justify-between p-1">
                    <div>
                      <p>Sun</p>
                      {train_schedules?.train_details?.train_runs_on_sun === "Y"
                        ? train_schedules?.train_details?.train_runs_on_sun +
                          " "
                        : "- "}
                    </div>
                    <div className="mx-2">
                      <p>Mon</p>
                      {train_schedules?.train_details?.train_runs_on_mon === "Y"
                        ? train_schedules?.train_details?.train_runs_on_mon +
                          " "
                        : "- "}
                    </div>
                    <div className="mx-2">
                      <p>Tue</p>
                      {train_schedules?.train_details?.train_runs_on_tue === "Y"
                        ? train_schedules?.train_details?.train_runs_on_tue +
                          " "
                        : "- "}
                    </div>
                    <div className="mx-2">
                      <p>Wed</p>
                      {train_schedules?.train_details?.train_runs_on_wed === "Y"
                        ? train_schedules?.train_details?.train_runs_on_wed +
                          " "
                        : "- "}
                    </div>
                    <div className="mx-2">
                      <p>Thu</p>
                      {train_schedules?.train_details?.train_runs_on_thu === "Y"
                        ? train_schedules?.train_details?.train_runs_on_thu +
                          " "
                        : "- "}
                    </div>
                    <div className="mx-2">
                      <p>Fri</p>
                      {train_schedules?.train_details?.train_runs_on_fri === "Y"
                        ? train_schedules?.train_details?.train_runs_on_fri +
                          " "
                        : "- "}
                    </div>
                    <div className="mx-2">
                      <p>Sat</p>
                      {train_schedules?.train_details?.train_runs_on_sat === "Y"
                        ? train_schedules?.train_details?.train_runs_on_sat +
                          " "
                        : "- "}
                    </div>
                  </div>
                </div>
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
                    <th className="py-3 pl-2">Sequence</th>
                    <th className="py-3 text-center">code</th>
                    <th className="py-3 text-center">Station name</th>
                    <th className="py-3 text-center">Arrival</th>
                    <th className="py-3 text-center">Departure</th>
                    <th className="py-3 text-center">Halt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {train_schedules?.train_schedule_details?.map((s, i) => (
                    <tr
                      key={s?.station_sequence}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="py-3 pl-2 font-medium text-gray-300">
                        {s?.station_sequence}
                      </td>
                      <td className="py-3 text-start text-gray-400 font-mono">
                        {s?.station_code}
                      </td>
                      <td className="py-3 text-gray-400 font-mono text-start w-60">
                        {s?.station_name}
                      </td>
                      <td className="py-3 text-center text-gray-500 text-xs">
                        {s?.arrival_time}
                      </td>
                      <td className="py-3 text-center text-gray-500 text-xs">
                        {s?.departure_time}
                      </td>
                      <td className="py-3 text-center text-gray-500 text-xs">
                        5m
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
  );
};

export default BookTicketPage;
