import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const logoUrl =
  "/mnt/data/A_logo_design_in_navy_blue_is_displayed_on_a_trans.png";

const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
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
  const [coachOptions, setCoachOptions] = useState(["SL", "3A", "2A", "1A"]); // sample; you said these are arrays of strings
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
  const [suggestions, setSuggestions] = useState([]); // current suggestions list
  const [activeInput, setActiveInput] = useState("src"); // "src" or "dst"
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const srcRef = useRef(null);
  const dstRef = useRef(null);

  // modal (schedules) state
  const [modalTrain, setModalTrain] = useState(null);

  // small UI polish: background not fully white
  const containerBg = "bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50";

  // fetch station suggestions (placeholder — replace with your API)
  const fetchStations = async (q) => {
    if (!q || q.length < 2) return [];
    try {
      // placeholder: replace with your station API
      // const res = await axios.get(`/api/stations?q=${encodeURIComponent(q)}`);
      // return res.data;
      // For demo return static sample matches
      const samples = [
        "SBC - Bangalore",
        "SBCN - Bengaluru Cantt",
        "NDLS - New Delhi",
        "HPT - Hospet",
        "MYS - Mysore",
      ];
      return samples
        .filter((s) => s.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 8);
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
    // ensure the default selected coach / reservation reflect arrays
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
      // allow normal tab navigation; if suggestions shown, accept selected and move focus
      if (suggestions.length) {
        e.preventDefault();
        selectSuggestion(selectedIndex, true); // focus next
      }
    }
  };

  const selectSuggestion = (index, focusNext = true) => {
    const value = suggestions[index];
    if (!value) return;
    if (activeInput === "src") {
      setSource(value);
      setStationQuery({ ...stationQuery, src: value });
      setSuggestions([]);
      if (focusNext) {
        setTimeout(() => dstRef.current?.focus(), 0);
        setActiveInput("dst");
      }
    } else {
      setDest(value);
      setStationQuery({ ...stationQuery, dst: value });
      setSuggestions([]);
      if (focusNext) {
        // focus date or next element
        // do nothing special
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
    // basic validation
    if (!source || !dest) {
      alert("Please enter Source and Destination (select from suggestions).");
      return;
    }
    if (new Date(date) < new Date(todayISO())) {
      alert("Date of journey must be today or later.");
      return;
    }

    setLoadingTrains(true);
    try {
      // Replace with your POST API. Example:
      // const res = await axios.post("/api/trains/search", { source, dest, date, coach:selectedCoach, reservation:selectedReservation });
      // setTrains(res.data);
      // For demo, use sampleTrains (you asked to use the given sample)
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
    // navigate to ConfirmTicketPage with state
    navigate("/confirm-ticket", {
      state: {
        train,
        search: { source, dest, date, selectedCoach, selectedReservation },
      },
    });
  };

  // handle click outside suggestions to close
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
    <div className={`min-h-screen ${containerBg} p-4 md:p-8`}>
      <div className="max-w-5xl mx-auto">
        {/* header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="ServerPe"
              className="w-12 h-12 object-contain rounded-md bg-white p-1"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Mock Train Seat Booking
              </h1>
              <p className="text-sm text-gray-600">
                Enterprise edition — API-first booking flows for UI testing
              </p>
            </div>
          </div>
        </header>

        {/* Hero + form card */}
        <section className="bg-white/90 rounded-2xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:gap-6">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Welcome — try a mock booking
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Enter journey details to list trains. Mock SMS will be sent to
                the provided mobile during confirmation.
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                onClick={() =>
                  window.scrollTo({ top: 600, behavior: "smooth" })
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
              >
                Start Mock Booking
              </button>
            </div>
          </div>

          {/* form */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Source */}
            <div className="relative" ref={dropdownRef}>
              <label className="text-sm text-gray-700">Source</label>
              <input
                ref={srcRef}
                value={source}
                onChange={(e) => onInputChange("src", e.target.value)}
                onFocus={() => setActiveInput("src")}
                onKeyDown={onKeyDownSuggestions}
                placeholder="Type station (min 2 chars)"
                className="w-full mt-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {suggestions.length > 0 && activeInput === "src" && (
                <ul
                  className="absolute z-30 left-0 right-0 bg-white border rounded-lg mt-1 max-h-48 overflow-auto shadow"
                  role="listbox"
                >
                  {suggestions.map((s, i) => (
                    <li
                      key={s}
                      onMouseDown={() => selectSuggestion(i)}
                      className={`px-3 py-2 cursor-pointer ${
                        i === selectedIndex ? "bg-blue-50" : ""
                      }`}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* swap + dest */}
            <div className="flex items-center gap-3 md:flex-col md:items-stretch">
              <div>
                <button
                  title="Swap Source & Destination"
                  onClick={swapSrcDest}
                  className="p-3 bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-200"
                >
                  ↔
                </button>
              </div>
              <div className="flex-1 relative">
                <label className="text-sm text-gray-700">Destination</label>
                <input
                  ref={dstRef}
                  value={dest}
                  onChange={(e) => onInputChange("dst", e.target.value)}
                  onFocus={() => setActiveInput("dst")}
                  onKeyDown={onKeyDownSuggestions}
                  placeholder="Type station (min 2 chars)"
                  className="w-full mt-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                {suggestions.length > 0 && activeInput === "dst" && (
                  <ul
                    className="absolute z-30 left-0 right-0 bg-white border rounded-lg mt-1 max-h-48 overflow-auto shadow"
                    role="listbox"
                  >
                    {suggestions.map((s, i) => (
                      <li
                        key={s}
                        onMouseDown={() => selectSuggestion(i)}
                        className={`px-3 py-2 cursor-pointer ${
                          i === selectedIndex ? "bg-blue-50" : ""
                        }`}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* date & selects stacked on md */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm text-gray-700">Date of Journey</label>
                <input
                  type="date"
                  value={date}
                  min={todayISO()}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full mt-1 p-3 rounded-lg border border-gray-200"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                  className="flex-1 p-3 rounded-lg border border-gray-200"
                >
                  {Array.isArray(coachOptions)
                    ? coachOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))
                    : null}
                </select>
                <select
                  value={selectedReservation}
                  onChange={(e) => setSelectedReservation(e.target.value)}
                  className="flex-1 p-3 rounded-lg border border-gray-200"
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
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={searchTrains}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow"
            >
              {loadingTrains ? "Searching..." : "Search"}
            </button>
            <p className="text-sm text-gray-500">
              Results appear below. Click{" "}
              <span className="font-medium">Proceed</span> to continue.
            </p>
          </div>
        </section>

        {/* Trains list */}
        <section className="mt-6">
          {trains.length === 0 ? (
            <div className="text-center text-gray-500 py-14">
              No trains found. Try another route or date.
            </div>
          ) : (
            <div className="space-y-4">
              {trains.map((t) => (
                <div
                  key={t.train_number}
                  className="bg-white/95 rounded-xl p-4 shadow flex flex-col md:flex-row md:items-start md:justify-between"
                >
                  <div className="md:flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold">
                          {t.train_number} — {t.train_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t.from} → {t.to} • {t.duration}
                        </div>
                      </div>

                      <div className="hidden md:block text-right">
                        <div className="text-sm text-gray-700">
                          Dep: {t.departure}
                        </div>
                        <div className="text-sm text-gray-700">
                          Arr: {t.arrival}
                        </div>
                      </div>
                    </div>

                    {/* classes + seat availability table */}
                    <div className="mt-3 overflow-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-600">
                            <th className="pr-4">Class</th>
                            <th className="pr-4">Availability</th>
                            <th className="pr-4">Fare (est.)</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {t.classes.map((c) => (
                            <tr key={c} className="border-t">
                              <td className="py-2">{c}</td>
                              <td className="py-2">
                                {"Available (" +
                                  (Math.floor(Math.random() * 50) + 1) +
                                  ")"}
                              </td>
                              <td className="py-2">
                                ₹{Math.floor(Math.random() * 1500) + 200}
                              </td>
                              <td className="py-2 text-right">
                                <button
                                  className="text-sm bg-green-600 text-white px-3 py-1 rounded"
                                  onClick={() =>
                                    proceedToConfirm({ ...t, chosenClass: c })
                                  }
                                >
                                  Proceed
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0 md:ml-4 flex-shrink-0">
                    <button
                      onClick={() => setModalTrain(t)}
                      className="px-3 py-2 border rounded"
                    >
                      Schedules
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Schedules modal */}
        {modalTrain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Schedules — {modalTrain.train_number} {modalTrain.train_name}
                </h3>
                <button
                  onClick={() => setModalTrain(null)}
                  className="px-3 py-1 rounded bg-gray-100"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 max-h-72 overflow-auto">
                {/* Placeholder stops list - replace with your API */}
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-600">
                    <tr>
                      <th>Station</th>
                      <th>Arr</th>
                      <th>Dep</th>
                      <th>Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["SBC", "YNK", "BPL", "JBP", "NDLS"].map((s, i) => (
                      <tr key={s} className="border-t">
                        <td className="py-2">{s}</td>
                        <td className="py-2">--:--</td>
                        <td className="py-2">--:--</td>
                        <td className="py-2">{i + 1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookTicketPage;
