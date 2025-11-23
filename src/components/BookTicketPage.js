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

// SVG for the swap icon
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

const logoUrl =
  "/mnt/data/A_logo_design_in_navy_blue_is_displayed_on_a_trans.png";

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
    classes: ["SL", "3A"],
  },
];

const BookTicketPage = () => {
  const navigate = useNavigate();

  // form state
  const [source, setSource] = useState("");
  const [dest, setDest] = useState("");
  const [date, setDate] = useState(todayISO());
  const [coachOptions, setCoachOptions] = useState(["SL", "3A", "2A", "1A"]);
  const [reservationOptions, setReservationOptions] = useState([
    "General",
    "Tatkal",
    "Ladies",
    "Premium",
  ]);
  const [selectedCoach, setSelectedCoach] = useState(coachOptions?.[0] ?? "");
  const [selectedReservation, setSelectedReservation] = useState(
    reservationOptions?.[0] ?? ""
  );
  const [trains, setTrains] = useState([]);
  const [loadingTrains, setLoadingTrains] = useState(false);

  // autosuggest state
  const [stationQuery, setStationQuery] = useState({ src: "", dst: "" });
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState("src");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const srcRef = useRef(null);
  const dstRef = useRef(null);
  const dispatch = useDispatch();
  const mockstations_master = useSelector((store) => store?.stationslist);
  const selected_source = useSelector(
    (store) => store?.stationslistslicsourcedestinationdoj.selected_source
  );
  const selected_destination = useSelector(
    (store) => store?.stationslistslicsourcedestinationdoj.selected_destination
  );
  const selected_doj = useSelector(
    (store) =>
      store?.stationslistslicsourcedestinationdoj?.selected_date_of_journey
  );
  console.log("selected doj:", selected_doj);
  // modal (schedules) state
  const [modalTrain, setModalTrain] = useState(null);

  // fetch station suggestions (placeholder — replace with your API)
  const fetchStations = async (q) => {
    if (!q || q?.code?.length < 2) return [];
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
        setSelectedIndex(0); // default first selected
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stationQuery.src, stationQuery.dst, activeInput]);

  useEffect(() => {
    if (
      Array.isArray(coachOptions) &&
      coachOptions.length &&
      !coachOptions.includes(selectedCoach)
    ) {
      setSelectedCoach(coachOptions[0]);
    }
    if (
      Array.isArray(reservationOptions) &&
      reservationOptions.length &&
      !reservationOptions.includes(selectedReservation)
    ) {
      setSelectedReservation(reservationOptions[0]);
    }
  }, [coachOptions, reservationOptions]);

  //on load
  useEffect(() => {
    const loadStations = async () => {
      const result = await axios.get("http://localhost:8888/stations", {
        withCredentials: true,
      });
      dispatch(addstations(result?.data?.data?.rows));
      dispatch(
        update_date_of_journey(
          new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
          })
        )
      );
    };
    loadStations();
    console.log("stations:", mockstations_master);
  }, []);

  // keyboard navigation for suggestions
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
    } else if (e.key === "Tab") {
      if (suggestions.length) {
        e.preventDefault();
        selectSuggestion(selectedIndex, true); // focus next
      }
    }
  };

  const selectSuggestion = (index, focusNext = true) => {
    const value = suggestions[index];
    console.log(suggestions[index]);
    if (!value) return;
    if (activeInput === "src") {
      setSource(value?.code + "-" + value?.station_name);
      dispatch(update_source(value));
      setStationQuery({ ...stationQuery, src: value });
      setSuggestions([]);
      if (focusNext) {
        setTimeout(() => dstRef.current?.focus(), 0);
        setActiveInput("dst");
      }
    } else {
      setDest(value?.code + "-" + value?.station_name);
      dispatch(update_destination(value));
      setStationQuery({ ...stationQuery, dst: value });
      setSuggestions([]);
      if (focusNext) {
        // focus date or next element
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
    if (new Date(date) < new Date(todayISO())) {
      console.error("Date of journey must be today or later.");
      return;
    }

    setLoadingTrains(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setTrains(sampleTrains);
    } catch (err) {
      console.error(err);
      setTrains([]);
    } finally {
      setLoadingTrains(false);
    }
  };

  const proceedToConfirm = (train) => {
    navigate("/confirm-ticket", {
      state: {
        train,
        search: { source, dest, date, selectedCoach, selectedReservation },
      },
    });
  };

  // handle click outside suggestions
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
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
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
                Enterprise edition — API-first booking flows for UI testing
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/user-home")}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Back to Dashboard
          </button>
        </header>

        {/* Hero + form card */}
        <section className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:gap-6 border-b border-gray-700 pb-6 mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white">
                Welcome — Try a Mock Booking
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Enter journey details to list trains. Mock SMS will be sent to
                the provided mobile during confirmation.
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                onClick={() =>
                  window.scrollTo({ top: 600, behavior: "smooth" })
                }
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl shadow-md transition-colors font-medium border border-gray-600"
              >
                Start Mock Booking
              </button>
            </div>
          </div>

          {/* form */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
            {/* Source */}
            <div className="relative md:col-span-2" ref={dropdownRef}>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">
                Source Station
              </label>
              <input
                ref={srcRef}
                value={source}
                onChange={(e) => onInputChange("src", e.target.value)}
                onFocus={() => setActiveInput("src")}
                onKeyDown={onKeyDownSuggestions}
                placeholder="Type station code or name"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
              {suggestions.length > 0 && activeInput === "src" && (
                <ul
                  className="absolute z-30 left-0 right-0 bg-gray-700 border border-gray-600 rounded-xl mt-1 max-h-48 overflow-auto shadow-2xl"
                  role="listbox"
                >
                  {suggestions.map((s, i) => (
                    <li
                      key={s?.code}
                      onMouseDown={() => selectSuggestion(i)}
                      className={`px-4 py-3 cursor-pointer text-gray-200 hover:bg-indigo-600 hover:text-white transition-colors ${
                        i === selectedIndex ? "bg-indigo-700 text-white" : ""
                      }`}
                      role="option"
                      aria-selected={i === selectedIndex}
                    >
                      🪧 {s?.code} - {s?.station_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* swap button */}
            <div className="hidden md:flex justify-center items-center h-full pb-1">
              <button
                title="Swap Source & Destination"
                onClick={swapSrcDest}
                className="p-3 bg-gray-700 text-gray-300 rounded-full hover:bg-indigo-600 hover:text-white transition-colors border border-gray-600 hover:border-indigo-500 shadow-lg"
              >
                <SwapIcon />
              </button>
            </div>

            {/* Destination */}
            <div className="relative md:col-span-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">
                Destination Station
              </label>
              <input
                ref={dstRef}
                value={dest}
                onChange={(e) => onInputChange("dst", e.target.value)}
                onFocus={() => setActiveInput("dst")}
                onKeyDown={onKeyDownSuggestions}
                placeholder="Type station code or name"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
              {suggestions.length > 0 && activeInput === "dst" && (
                <ul
                  className="absolute z-30 left-0 right-0 bg-gray-700 border border-gray-600 rounded-xl mt-1 max-h-48 overflow-auto shadow-2xl"
                  role="listbox"
                >
                  {suggestions.map((s, i) => (
                    <li
                      key={s?.code}
                      onMouseDown={() => selectSuggestion(i)}
                      className={`px-4 py-3 cursor-pointer text-gray-200 hover:bg-indigo-600 hover:text-white transition-colors ${
                        i === selectedIndex ? "bg-indigo-700 text-white" : ""
                      }`}
                      role="option"
                      aria-selected={i === selectedIndex}
                    >
                      🪧 {s?.code} - {s?.station_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Date and Selects block */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">
                Date of Journey
              </label>
              <input
                type="date"
                value={date}
                min={todayISO()}
                onChange={(e) => {
                  setDate(e.target.value);
                  dispatch(update_date_of_journey(e.target.value));
                }}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all [color-scheme:dark]"
              />
            </div>

            <div className="col-span-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">
                Coach Class
              </label>
              <select
                value={selectedCoach}
                onChange={(e) => setSelectedCoach(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none"
              >
                {Array.isArray(coachOptions)
                  ? coachOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            <div className="col-span-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">
                Reservation Type
              </label>
              <select
                value={selectedReservation}
                onChange={(e) => setSelectedReservation(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none"
              >
                {Array.isArray(reservationOptions)
                  ? reservationOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            {/* Search Button */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 flex justify-end">
              <button
                onClick={searchTrains}
                className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all font-semibold text-lg transform hover:-translate-y-0.5"
                disabled={loadingTrains}
              >
                {loadingTrains ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </section>

        {/* Trains list */}
        <section className="mt-10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            Available Trains
            {trains.length > 0 && (
              <span className="text-sm font-normal text-gray-500 bg-gray-800 px-2 py-1 rounded-md border border-gray-700">
                {trains.length} Found
              </span>
            )}
          </h3>

          {loadingTrains ? (
            <div className="text-center text-gray-400 py-20 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
              <div className="animate-spin inline-block w-10 h-10 border-4 border-t-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-lg font-medium text-gray-300">
                Searching best routes...
              </p>
            </div>
          ) : trains.length === 0 ? (
            <div className="text-center text-gray-400 py-20 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 flex flex-col items-center">
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
              <p className="text-sm mt-2">Try adjusting your search filters.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {trains.map((t) => (
                <div
                  key={t.train_number}
                  className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-700 hover:border-indigo-500/30 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {t.train_name}
                            </h4>
                            <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs font-mono rounded border border-gray-600">
                              #{t.train_number}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                            <span className="text-indigo-400 font-medium">
                              Runs Daily
                            </span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span>Superfast</span>
                          </div>
                        </div>

                        <div className="mt-3 sm:mt-0 text-right">
                          <div className="text-lg font-bold text-white">
                            {t.departure}{" "}
                            <span className="text-gray-500 text-sm font-normal mx-1">
                              →
                            </span>{" "}
                            {t.arrival}
                          </div>
                          <div className="text-sm text-gray-400 font-mono">
                            {t.from} to {t.to}{" "}
                            <span className="text-gray-600 mx-1">|</span>{" "}
                            {t.duration}
                          </div>
                        </div>
                      </div>

                      {/* classes + seat availability table */}
                      <div className="overflow-hidden rounded-xl border border-gray-700">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-900/50 text-xs uppercase font-semibold text-gray-400">
                            <tr>
                              <th className="px-4 py-3">Class</th>
                              <th className="px-4 py-3">Availability</th>
                              <th className="px-4 py-3">Fare</th>
                              <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {t.classes.map((c) => (
                              <tr
                                key={c}
                                className="hover:bg-gray-700/50 transition-colors"
                              >
                                <td className="px-4 py-3 font-bold text-white">
                                  {c}
                                </td>
                                <td className="px-4 py-3 text-emerald-400 font-medium flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                  AVL {Math.floor(Math.random() * 50) + 1}
                                </td>
                                <td className="px-4 py-3 text-gray-300 font-mono">
                                  ₹{Math.floor(Math.random() * 1500) + 200}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    className="text-xs font-semibold bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 px-4 py-2 rounded-lg transition-all"
                                    onClick={() =>
                                      proceedToConfirm({ ...t, chosenClass: c })
                                    }
                                  >
                                    Book Now
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="lg:w-48 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-700 pt-4 lg:pt-0 lg:pl-6">
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                          Route Info
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-300 mb-1">
                          <span>Distance</span>
                          <span className="font-mono">480km</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-300">
                          <span>Avg Delay</span>
                          <span className="text-green-400">None</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setModalTrain(t)}
                        className="w-full px-4 py-2.5 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 hover:text-white transition-colors text-sm font-medium border border-gray-600 flex items-center justify-center gap-2"
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        View Schedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Schedules modal */}
        {modalTrain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-all">
            <div className="bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-700 transform transition-all">
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
                      <th className="py-3 text-right pr-2">Day</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {[
                      "SBC - KSR Bengaluru",
                      "YNK - Yelahanka",
                      "HUP - Hindupur",
                      "DMM - Dharmavaram",
                      "GTL - Guntakal",
                      "RC - Raichur",
                      "SC - Secunderabad",
                      "BPQ - Balharshah",
                      "NGP - Nagpur",
                      "BPL - Bhopal",
                      "VGLJ - VGL Jhansi",
                      "GWL - Gwalior",
                      "AGC - Agra Cantt",
                      "NDLS - New Delhi",
                    ].map((s, i, arr) => (
                      <tr
                        key={s}
                        className="hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="py-3 pl-2 font-medium text-gray-300">
                          {s.split(" - ")[0]}{" "}
                          <span className="text-gray-500 font-normal hidden sm:inline">
                            - {s.split(" - ")[1]}
                          </span>
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
                        <td className="py-3 text-right pr-2 text-gray-500">
                          {Math.floor(i / 5) + 1}
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
                  Close Schedule
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
