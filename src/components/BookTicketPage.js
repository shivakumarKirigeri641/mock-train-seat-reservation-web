import React, { useState, useEffect, useRef } from "react";
import calculateHalt from "../utils/calculateHalt";
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
import PassengerDetailsPage from "./PassengerDetailsPage"; // Import the new modal

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
  "PREMIUM TATKAL",
  "LADIES",
  "SENIOR",
];
const QUOTA_KEYS = ["GEN", "TTL", "PTL", "LADIES", "SENIOR"];
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

  // Modal States
  const [modalTrain, setModalTrain] = useState(null); // For Route Schedule
  const [bookingModalData, setBookingModalData] = useState(null); // For Passenger Details
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // ... (Keep existing fetchStations, useEffects for suggestions/loading stations) ...
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

  useEffect(() => {
    const loadStations = async () => {
      try {
        const result = await axios.get("http://localhost:8888/stations", {
          withCredentials: true,
        });
        if (result?.data?.data) {
          dispatch(addstations(result?.data?.data));
        }
      } catch (e) {
        console.log("Mock mode or API error");
      }
      dispatch(
        update_date_of_journey(
          new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
        )
      );
    };
    loadStations();
  }, []);

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
      if (focusNext && source) {
        setTimeout(() => {
          if (dateRef.current) {
            dateRef.current.focus();
            try {
              dateRef.current.showPicker();
            } catch (err) {
              console.log(err);
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
        { train_number: t?.train_number },
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
        const fetchedTrains = result?.data?.data?.trains_list || [];
        dispatch(update_trainslist(fetchedTrains));
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

  const proceedToConfirm = (
    selectedTrain,
    coachtype,
    reservationtype,
    basefare
  ) => {
    setBookingModalData({
      selectedTrain,
      coachtype,
      reservationtype,
      basefare,
    });
  };

  const handleProceedToPay = async (finalBookingData) => {
    setBookingModalData(null);
    console.log(finalBookingData);
    // Navigate to Confirmation Page here if needed
    const result = await axios.post(
      "http://localhost:8888/proceed-booking",
      {
        train_number: finalBookingData?.train?.train_number,
        doj: finalBookingData?.date,
        coach_type: finalBookingData?.coachtype,
        source_code: finalBookingData?.train?.source_code,
        destination_code: finalBookingData?.train?.destination_code,
        mobile_number: finalBookingData?.contact,
        reservation_type: finalBookingData?.reservationtype,
        passenger_details: finalBookingData?.passenger_details,
      },
      { withCredentials: true }
    );
    //call api, whatever reponse you get, you pass that as in summarize details
    navigate("/summarise-passenger-details", {
      state: result?.data?.data,
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
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>

      <div
        className={`max-w-7xl mx-auto px-4 py-6 relative z-10 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <header className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <TrainIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                RailConnect
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wide">
                Enterprise Booking
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/user-home")}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors border border-slate-700 px-3 py-1.5 rounded hover:bg-slate-800"
          >
            Dashboard
          </button>
        </header>

        <section className="bg-[#1e293b] rounded-lg shadow-xl border border-slate-700 p-1 mb-8 relative z-20">
          <div className="flex flex-col md:flex-row gap-0.5">
            <div className="flex-1 relative group" ref={dropdownRef}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <span className="text-[10px] uppercase font-bold block leading-none mb-0.5">
                  From
                </span>
                <div className="w-1 h-1 rounded-full bg-current"></div>
              </div>
              <input
                ref={srcRef}
                value={source}
                onChange={(e) => onInputChange("src", e.target.value)}
                onFocus={(e) => handleInputFocus(e, "src")}
                onKeyDown={onKeyDownSuggestions}
                className="w-full h-14 pl-16 pr-4 bg-slate-900/50 hover:bg-slate-900 focus:bg-slate-950 text-white font-medium rounded-l-md border-0 focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none placeholder:text-slate-600 truncate"
                placeholder="Origin Station"
              />
              {suggestions.length > 0 && activeInput === "src" && (
                <ul className="absolute z-50 left-0 right-0 bg-slate-800 border border-slate-700 rounded-b-md mt-1 max-h-64 overflow-auto shadow-2xl py-1">
                  {suggestions.map((s, i) => (
                    <li
                      key={s?.code}
                      onMouseDown={() => selectSuggestion(i)}
                      className={`px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-indigo-600/20 ${
                        i === selectedIndex
                          ? "bg-indigo-600 text-white"
                          : "text-slate-300"
                      }`}
                    >
                      <span className="font-medium">{s?.station_name}</span>
                      <span className="font-mono text-xs opacity-70">
                        {s?.code}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative md:w-0">
              <button
                onClick={swapSrcDest}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-1.5 bg-slate-700 rounded-full text-slate-300 hover:text-white hover:bg-indigo-600 border-2 border-[#1e293b] transition-all shadow-md"
              >
                <SwapIcon />
              </button>
            </div>

            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <span className="text-[10px] uppercase font-bold block leading-none mb-0.5">
                  To
                </span>
                <div className="w-1 h-1 rounded-full bg-current border border-slate-500"></div>
              </div>
              <input
                ref={dstRef}
                value={dest}
                onChange={(e) => onInputChange("dst", e.target.value)}
                onFocus={(e) => handleInputFocus(e, "dst")}
                onKeyDown={onKeyDownSuggestions}
                className="w-full h-14 pl-16 pr-4 bg-slate-900/50 hover:bg-slate-900 focus:bg-slate-950 text-white font-medium md:rounded-none border-0 focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none placeholder:text-slate-600 truncate"
                placeholder="Destination"
              />
              {suggestions.length > 0 && activeInput === "dst" && (
                <ul className="absolute z-50 left-0 right-0 bg-slate-800 border border-slate-700 rounded-b-md mt-1 max-h-64 overflow-auto shadow-2xl py-1">
                  {suggestions.map((s, i) => (
                    <li
                      key={s?.code}
                      onMouseDown={() => selectSuggestion(i)}
                      className={`px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-indigo-600/20 ${
                        i === selectedIndex
                          ? "bg-indigo-600 text-white"
                          : "text-slate-300"
                      }`}
                    >
                      <span className="font-medium">{s?.station_name}</span>
                      <span className="font-mono text-xs opacity-70">
                        {s?.code}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="md:w-48 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                <span className="text-[10px] uppercase font-bold block leading-none mb-0.5">
                  Date
                </span>
              </div>
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
                className="w-full h-14 pl-14 pr-2 bg-slate-900/50 hover:bg-slate-900 focus:bg-slate-950 text-white font-medium md:rounded-none border-0 focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none [color-scheme:dark]"
              />
            </div>

            <div className="md:w-40">
              <button
                ref={searchRef}
                onClick={searchTrains}
                disabled={loadingTrains}
                className={`w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wide text-sm rounded-r-md shadow-lg transition-all flex items-center justify-center gap-2 ${
                  loadingTrains ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {loadingTrains ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="relative z-10 min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              Available Trains
              {trains.length > 0 && (
                <span className="bg-slate-700 text-xs py-0.5 px-2 rounded-full text-slate-300">
                  {trains.length}
                </span>
              )}
            </h3>
          </div>

          {loadingTrains ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium tracking-wider animate-pulse">
                FETCHING LIVE AVAILABILITY
              </p>
            </div>
          ) : trains.length === 0 ? (
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                <TrainIcon className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-white font-medium mb-1">No Trains Found</h3>
              <p className="text-slate-400 text-sm">
                Try modifying your search criteria or date.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {trains.map((t) => {
                const isExpanded = expandedTrainId === t?.train_number;
                return (
                  <div
                    key={t?.train_number}
                    className={`bg-[#1e293b] border ${
                      isExpanded
                        ? "border-indigo-500/50 ring-1 ring-indigo-500/20"
                        : "border-slate-700"
                    } rounded-lg overflow-hidden transition-all duration-200`}
                  >
                    <div
                      onClick={() => toggleAccordion(t?.train_number)}
                      className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4 cursor-pointer hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-2x font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {t?.train_name}
                          </h4>
                          <span className="bg-slate-800 text-slate-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700">
                            #{t?.train_number}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-medium text-slate-500">
                            RUNS ON
                          </span>
                          <div className="flex gap-0.5">
                            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => {
                              const active = t?.running_days?.includes(d);
                              return (
                                <span
                                  key={i}
                                  className={
                                    active
                                      ? "text-green-500 font-bold"
                                      : "text-slate-700"
                                  }
                                >
                                  {d}
                                </span>
                              );
                            })}
                            <span className="ml-2 text-slate-500">
                              {t?.running_days}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 md:px-8 flex-1 justify-start md:justify-center border-l border-r border-slate-700/50 h-full">
                        <div className="text-center">
                          <div className="text-2x font-bold text-white">
                            {t?.scheduled_departure}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium uppercase">
                            {selected_source?.code || "SRC"}
                          </div>
                        </div>
                        <div className="flex flex-col items-center w-24">
                          <span className="text-[10px] text-slate-300 mb-0.5 font-semibold">
                            {t?.journey_duration}
                          </span>
                          <div className="w-full h-0.5 bg-slate-700 relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-slate-500 rounded-full"></div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-slate-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2x font-bold text-white">
                            {t?.estimated_arrival}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium uppercase">
                            {selected_destination?.code || "DST"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-end min-w-[140px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchTrainSchedule(t);
                            setModalTrain(t);
                          }}
                          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-2 px-2"
                        >
                          View Route
                        </button>
                        <div
                          className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 transition-transform duration-300 ${
                            isExpanded
                              ? "rotate-180 bg-indigo-900/30 text-indigo-400"
                              : ""
                          }`}
                        >
                          <ChevronIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-slate-700 bg-[#162032] p-4 animate-fade-in">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                <th className="p-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-700 w-20 bg-[#1e293b] sticky left-0 z-10">
                                  Class
                                </th>
                                {QUOTA_COLUMNS.map((q) => (
                                  <th
                                    key={q}
                                    className="p-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-700 border-l border-slate-800 min-w-[100px]"
                                  >
                                    {q}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {CLASS_ROWS_ORDER.filter((c) => {
                                const suffix = c.toLowerCase();
                                return QUOTA_KEYS.some((quotaKey) => {
                                  const prefix = quotaKey.toLowerCase();
                                  const val =
                                    t[`seat_count_${prefix}_${suffix}`] ||
                                    t[`seat_count_${prefix}_${suffix}`];
                                  return val && val !== "-";
                                });
                              }).map((cls) => (
                                <tr
                                  key={cls}
                                  className="hover:bg-slate-800/30 transition-colors"
                                >
                                  <td className="p-3 text-left font-bold text-indigo-400 border-b border-slate-800 bg-[#1e293b] sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                                    {cls}
                                  </td>
                                  {QUOTA_KEYS.map((quotaKey, idx) => {
                                    const prefix = quotaKey.toLowerCase();
                                    const suffix = cls.toLowerCase();

                                    const seatKey = `seat_count_${prefix}_${suffix}`;
                                    const fareKey =
                                      prefix === `ladies`
                                        ? `fare_gen_${suffix}`
                                        : `fare_${prefix}_${suffix}`;

                                    const seatData =
                                      t[seatKey] ||
                                      t[`seat_count_${prefix}_${suffix}`];
                                    const fareData = t[fareKey];

                                    const isAvail =
                                      seatData && seatData !== "-";
                                    const isWaitlist =
                                      seatData &&
                                      seatData.toString().includes("WLT");

                                    return (
                                      <td
                                        key={quotaKey}
                                        className="p-1 border-b border-slate-800 border-l border-slate-800/50 text-center align-middle"
                                      >
                                        {isAvail ? (
                                          <button
                                            onClick={() =>
                                              proceedToConfirm(
                                                t,
                                                cls,
                                                quotaKey,
                                                t[`fare_${prefix}_${suffix}`]
                                              )
                                            }
                                            className="w-full py-1.5 rounded border border-transparent hover:border-indigo-500/50 hover:bg-indigo-500/10 group transition-all flex flex-col items-center justify-center gap-0.5"
                                          >
                                            <span
                                              className={`text-xs font-bold ${
                                                isWaitlist
                                                  ? "text-orange-400"
                                                  : "text-emerald-400"
                                              }`}
                                            >
                                              {seatData}
                                            </span>
                                            <span className="text-[14px] text-blue-300 font-bold font-mono group-hover:text-indigo-300">
                                              ₹{fareData}
                                            </span>
                                          </button>
                                        ) : (
                                          <span className="text-slate-700 font-bold text-xs">
                                            -
                                          </span>
                                        )}
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
      </div>

      {/* SCHEDULE MODAL */}
      {modalTrain && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setModalTrain(null)}
        >
          <div
            className="bg-[#1e293b] w-full max-w-2xl rounded-lg shadow-2xl border border-slate-700 flex flex-col max-h-[80vh] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-start bg-slate-800/50 rounded-t-lg">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {train_schedules?.train_details?.train_name ||
                    modalTrain.train_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono bg-slate-700 text-slate-300 px-1.5 rounded">
                    {train_schedules?.train_details?.train_number ||
                      modalTrain.train_number}
                  </span>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">
                    Daily Service
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalTrain(null)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-700 rounded transition-colors"
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
            <div className="flex-1 overflow-y-auto p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Seq
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-full">
                      Station Name
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Arr
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Dep
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Halt
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      KM
                    </th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Day
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-300 divide-y divide-slate-800">
                  {train_schedules?.train_schedule_details?.map((s, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-800/30 transition-colors odd:bg-slate-800/10"
                    >
                      <td className="py-2.5 px-4 text-slate-500 font-mono text-xs">
                        {s?.station_sequence}
                      </td>
                      <td
                        className={
                          selected_source?.code === s?.station_code ||
                          selected_destination?.code === s?.station_code
                            ? "py-2.5 px-4 text-sm italic font-bold text-yellow-400"
                            : "py-2.5 px-4 font-mono text-indigo-400"
                        }
                      >
                        {s?.station_code}
                      </td>
                      <td
                        className={
                          selected_source?.code === s?.station_code ||
                          selected_destination?.code === s?.station_code
                            ? "py-2.5 px-4 font-medium text-yellow-400 italic"
                            : "py-2.5 px-4 font-medium text-white"
                        }
                      >
                        {s?.station_name}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-emerald-400">
                        {s?.arrival}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-amber-400">
                        {s?.departure}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-200 text-xs">
                        {calculateHalt(s?.arrival, s?.departure)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-amber-400">
                        {s?.kilometer}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-amber-400">
                        {s?.running_day}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/30 rounded-b-lg">
              <button
                onClick={() => setModalTrain(null)}
                className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded transition-colors text-sm"
              >
                Close Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSENGER DETAILS MODAL */}
      <PassengerDetailsPage
        isOpen={!!bookingModalData}
        onClose={() => setBookingModalData(null)}
        bookingDetails={bookingModalData}
        onProceedToPay={handleProceedToPay}
      />
    </div>
  );
};

export default BookTicketPage;
