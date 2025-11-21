import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

/**
 * BookTicketPage
 *
 * - Replace mockFetchStations, mockFetchCoachOptions, mockFetchReservations, and mockSearchTrains
 *   with your real axios calls (they are included as comments where to place them).
 *
 * - Logo file (placeholder from your uploads): /mnt/data/A_logo_design_in_navy_blue_is_displayed_on_a_trans.png
 */

const logoUrl =
  "/mnt/data/A_logo_design_in_navy_blue_is_displayed_on_a_trans.png";

// --- MOCK / SAMPLE helpers (replace with real API calls) ---
const mockFetchStations = async (q) => {
  // Example: call your API with axios:
  // const res = await axios.get(`/api/stations?query=${q}`);
  // return res.data; // should be an array of { code: 'SBC', name: 'Bengaluru City' }

  const sample = [
    { code: "SBC", name: "Bengaluru City" },
    { code: "SBCM", name: "Bengaluru Cantt" },
    { code: "NDLS", name: "New Delhi" },
    { code: "HPT", name: "Hospet" },
    { code: "MAS", name: "Chennai Central" },
    { code: "KPI", name: "Krishnarajapuram" },
  ];
  const ql = q.toLowerCase();
  return sample.filter(
    (s) =>
      s.code.toLowerCase().includes(ql) || s.name.toLowerCase().includes(ql)
  );
};

const mockFetchCoachOptions = async () => {
  return ["SL", "3A", "2A", "1A"];
};

const mockFetchReservations = async () => {
  return ["General", "Tatkal", "Ladies", "Senior Citizen"];
};

const mockSearchTrains = async (payload) => {
  // payload contains source, destination, doj, coach, reservation
  // Replace with: const res = await axios.post('/api/search-trains', payload);
  // return res.data;

  // using the sample you provided:
  return [
    {
      train_number: "12627",
      train_name: "Karnataka Express",
      departure: "10:30",
      arrival: "18:45",
      from: "SBC",
      to: "NDLS",
      duration: "32h 15m",
      classes: ["SL", "3A", "2A", "1A"],
      stops: [
        { station: "SBC", time: "10:30" },
        { station: "KR Puram", time: "11:15" },
        { station: "Hassan", time: "16:00" },
        { station: "NDLS", time: "18:45" },
      ],
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
      stops: [
        { station: "SBC", time: "06:15" },
        { station: "Davangere", time: "09:00" },
        { station: "HPT", time: "14:20" },
      ],
    },
  ];
};

// --- COMPONENT ---
const BookTicketPage = () => {
  // form state
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [doj, setDoj] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  // options (ensure arrays default to [])
  const [coachOptions, setCoachOptions] = useState([]);
  const [reservationOptions, setReservationOptions] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedReservation, setSelectedReservation] = useState("");

  // suggestions
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // keyboard nav indexes
  const [srcIndex, setSrcIndex] = useState(-1);
  const [destIndex, setDestIndex] = useState(-1);

  // refs for focusing
  const destInputRef = useRef(null);
  const sourceInputRef = useRef(null);

  // search & trains
  const [trains, setTrains] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // schedule modal
  const [scheduleModal, setScheduleModal] = useState({
    open: false,
    stops: [],
    title: "",
  });

  // proceed booking modal
  const [bookingModal, setBookingModal] = useState({
    open: false,
    train: null,
    travelClass: "",
    reservationType: "",
    passengerName: "",
    mobile: "",
  });

  // alerts
  const [alert, setAlert] = useState(null);

  // ensure coachOptions is array to fix TypeError
  useEffect(() => {
    (async () => {
      try {
        const coaches = await mockFetchCoachOptions();
        const reservations = await mockFetchReservations();
        setCoachOptions(Array.isArray(coaches) ? coaches : []);
        setReservationOptions(Array.isArray(reservations) ? reservations : []);
        // set defaults
        if (Array.isArray(coaches) && coaches.length)
          setSelectedCoach(coaches[0]);
        if (Array.isArray(reservations) && reservations.length)
          setSelectedReservation(reservations[0]);
      } catch (err) {
        setCoachOptions([]);
        setReservationOptions([]);
      }
    })();
  }, []);

  // handlers for suggestions (source)
  useEffect(() => {
    // fetch only when >=2 chars
    let active = true;
    if ((source || "").length >= 2) {
      mockFetchStations(source).then((list) => {
        if (active) {
          setSourceSuggestions(list);
          setShowSourceSuggestions(true);
          setSrcIndex(0); // default select first one
        }
      });
    } else {
      setSourceSuggestions([]);
      setShowSourceSuggestions(false);
      setSrcIndex(-1);
    }
    return () => {
      active = false;
    };
  }, [source]);

  // destination suggestions
  useEffect(() => {
    let active = true;
    if ((destination || "").length >= 2) {
      mockFetchStations(destination).then((list) => {
        if (active) {
          setDestSuggestions(list);
          setShowDestSuggestions(true);
          setDestIndex(0);
        }
      });
    } else {
      setDestSuggestions([]);
      setShowDestSuggestions(false);
      setDestIndex(-1);
    }
    return () => {
      active = false;
    };
  }, [destination]);

  // keyboard handler for source suggestions
  const onSourceKeyDown = (e) => {
    if (!sourceSuggestions?.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSrcIndex((s) => Math.min(s + 1, sourceSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSrcIndex((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = sourceSuggestions[srcIndex] || sourceSuggestions[0];
      if (sel) {
        setSource(`${sel.code} - ${sel.name}`);
        setShowSourceSuggestions(false);
        // auto focus destination and open its suggestions
        setTimeout(() => {
          destInputRef.current?.focus();
          // optionally pre-load destination suggestions if dest input already has 2+ chars
          if ((destination || "").length >= 2) setShowDestSuggestions(true);
        }, 50);
      }
    } else if (e.key === "Escape") {
      setShowSourceSuggestions(false);
    }
  };

  // keyboard handler for dest suggestions
  const onDestKeyDown = (e) => {
    if (!destSuggestions?.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setDestIndex((s) => Math.min(s + 1, destSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setDestIndex((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = destSuggestions[destIndex] || destSuggestions[0];
      if (sel) {
        setDestination(`${sel.code} - ${sel.name}`);
        setShowDestSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowDestSuggestions(false);
    }
  };

  // swap source/destination
  const swapSrcDest = () => {
    setSource((s) => {
      setDestination((d) => s);
      return d || "";
    });
  };

  // search trains
  const onSearch = async () => {
    // basic validation
    if (!source || !destination) {
      setAlert({
        type: "error",
        msg: "Please select both source and destination.",
      });
      setTimeout(() => setAlert(null), 3500);
      return;
    }
    setLoadingSearch(true);
    try {
      const payload = {
        source,
        destination,
        doj,
        coach: selectedCoach,
        reservation: selectedReservation,
      };
      const results = await mockSearchTrains(payload);
      setTrains(Array.isArray(results) ? results : []);
      setSearched(true);
    } catch (err) {
      setAlert({ type: "error", msg: "Search failed. Try again." });
    } finally {
      setLoadingSearch(false);
    }
  };

  // open schedules modal
  const openSchedules = (train) => {
    setScheduleModal({
      open: true,
      stops: train.stops || [],
      title: `${train.train_number} — ${train.train_name}`,
    });
  };

  // open booking modal
  const openProceed = (train) => {
    setBookingModal({
      open: true,
      train,
      travelClass: train.classes?.[0] || selectedCoach || "",
      reservationType: selectedReservation || "",
      passengerName: "",
      mobile: "",
    });
  };

  // confirm booking (mock)
  const confirmBooking = () => {
    const { train, travelClass, reservationType, passengerName, mobile } =
      bookingModal;
    if (!passengerName || !mobile) {
      setAlert({
        type: "error",
        msg: "Please enter passenger name and mobile number.",
      });
      setTimeout(() => setAlert(null), 3000);
      return;
    }
    // simulate API booking and send mock SMS
    // Replace with real axios post: axios.post('/api/book', {...})
    console.log("Mock booking:", {
      train: train.train_number,
      travelClass,
      reservationType,
      passengerName,
      mobile,
    });

    // Mock SMS sending
    const mockSms = `Mock SMS to ${mobile}: Booking confirmed for ${passengerName} on ${train.train_name} (${train.train_number}) for ${doj}. This is a demo SMS.`;
    console.log(mockSms);

    setAlert({
      type: "success",
      msg: "Mock booking complete. SMS sent (simulated).",
    });
    setTimeout(() => setAlert(null), 5000);

    // close modal
    setBookingModal({
      open: false,
      train: null,
      travelClass: "",
      reservationType: "",
      passengerName: "",
      mobile: "",
    });
  };

  // helper to generate seat availability (mock)
  const getMockAvailability = (train, cls, reservation) => {
    // deterministic-ish mock for display
    const base =
      (train.train_number?.split("").reduce((a, c) => a + c.charCodeAt(0), 0) ||
        100) % 50;
    const clsFactor = cls.length * 3;
    const resFactor = reservation.length;
    const val = Math.max(0, (base + clsFactor + resFactor) % 120);
    return `${Math.min(120, val)} seats`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="ServerPe logo"
              className="w-12 h-12 object-contain rounded-md"
            />
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">
                ServerPe — Mock Train Booking (Enterprise)
              </h2>
              <p className="text-sm text-slate-500">
                Realistic booking flows for UI developers · Demo APIs · Mock SMS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Role: UI Developer</span>
            <button className="px-3 py-2 bg-white border rounded-lg text-sm shadow-sm hover:shadow-md">
              Icon
            </button>
          </div>
        </div>

        {/* Hero / Controls Card */}
        <div className="bg-gradient-to-r from-white/80 to-slate-50 p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            Welcome — Book a Mock Ticket
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Source */}
            <div className="relative">
              <label className="text-sm text-slate-600">Source</label>
              <input
                ref={sourceInputRef}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                onKeyDown={onSourceKeyDown}
                onFocus={() => {
                  if (sourceSuggestions?.length) setShowSourceSuggestions(true);
                }}
                onBlur={() =>
                  setTimeout(() => setShowSourceSuggestions(false), 120)
                }
                placeholder="Type station code or name (min 2 chars)"
                className="w-full mt-1 p-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-200"
              />
              {showSourceSuggestions && sourceSuggestions?.length ? (
                <ul className="absolute z-30 left-0 right-0 mt-1 max-h-48 overflow-auto bg-white border rounded-lg shadow-lg">
                  {sourceSuggestions.map((s, i) => (
                    <li
                      key={s.code + i}
                      onClick={() => {
                        setSource(`${s.code} - ${s.name}`);
                        setShowSourceSuggestions(false);
                        setTimeout(() => destInputRef.current?.focus(), 50);
                      }}
                      className={`px-3 py-2 cursor-pointer hover:bg-slate-50 ${
                        i === srcIndex ? "bg-slate-100" : ""
                      }`}
                    >
                      <strong>{s.code}</strong> —{" "}
                      <span className="text-sm text-slate-600">{s.name}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {/* Destination */}
            <div className="relative">
              <label className="text-sm text-slate-600">Destination</label>
              <input
                ref={destInputRef}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={onDestKeyDown}
                onFocus={() => {
                  if (destSuggestions?.length) setShowDestSuggestions(true);
                }}
                onBlur={() =>
                  setTimeout(() => setShowDestSuggestions(false), 120)
                }
                placeholder="Type station code or name (min 2 chars)"
                className="w-full mt-1 p-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-200"
              />
              {showDestSuggestions && destSuggestions?.length ? (
                <ul className="absolute z-30 left-0 right-0 mt-1 max-h-48 overflow-auto bg-white border rounded-lg shadow-lg">
                  {destSuggestions.map((s, i) => (
                    <li
                      key={s.code + i}
                      onClick={() => {
                        setDestination(`${s.code} - ${s.name}`);
                        setShowDestSuggestions(false);
                      }}
                      className={`px-3 py-2 cursor-pointer hover:bg-slate-50 ${
                        i === destIndex ? "bg-slate-100" : ""
                      }`}
                    >
                      <strong>{s.code}</strong> —{" "}
                      <span className="text-sm text-slate-600">{s.name}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {/* Swap & Date */}
            <div className="flex gap-2 items-end">
              <button
                onClick={swapSrcDest}
                title="Swap source & destination"
                className="px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md"
              >
                ⇄ Swap
              </button>

              <div className="flex-1">
                <label className="text-sm text-slate-600">
                  Date of Journey
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={doj}
                  onChange={(e) => setDoj(e.target.value)}
                  className="w-full mt-1 p-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          {/* Options row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="text-sm text-slate-600">Coach</label>
              <select
                value={selectedCoach}
                onChange={(e) => setSelectedCoach(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg border border-slate-200 bg-white"
              >
                {(Array.isArray(coachOptions) ? coachOptions : []).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-600">Reservation Type</label>
              <select
                value={selectedReservation}
                onChange={(e) => setSelectedReservation(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg border border-slate-200 bg-white"
              >
                {(Array.isArray(reservationOptions)
                  ? reservationOptions
                  : []
                ).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onSearch}
                className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                {loadingSearch
                  ? "Searching..."
                  : searched
                  ? "Modify"
                  : "Search"}
              </button>
              <button
                onClick={() => {
                  // optional: open developer APIs or guide
                  setAlert({
                    type: "info",
                    msg: "Use Developer APIs to integrate. Placeholder.",
                  });
                  setTimeout(() => setAlert(null), 2800);
                }}
                className="mt-6 px-4 py-3 bg-white border rounded-lg"
              >
                Dev APIs
              </button>
            </div>
          </div>
        </div>

        {/* ALERT */}
        {alert ? (
          <div
            className={`mt-4 px-4 py-2 rounded-md ${
              alert.type === "error"
                ? "bg-red-50 text-red-700"
                : alert.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-sky-50 text-sky-700"
            }`}
          >
            {alert.msg}
          </div>
        ) : null}

        {/* Trains list (below search) */}
        {trains?.length ? (
          <div className="mt-6 space-y-4">
            {trains.map((t) => (
              <div
                key={t.train_number}
                className="bg-white/90 rounded-xl shadow p-4"
              >
                {/* header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-slate-700">
                        {t.train_number}
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {t.train_name}
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      {t.from} ({t.departure}) → {t.to} ({t.arrival}) ·{" "}
                      {t.duration}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openSchedules(t)}
                      className="px-3 py-2 bg-white border rounded-md text-sm shadow-sm"
                    >
                      Schedules
                    </button>
                    <button
                      onClick={() => openProceed(t)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm shadow hover:bg-blue-700"
                    >
                      Proceed
                    </button>
                  </div>
                </div>

                {/* seat availability table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="px-3 py-2 text-slate-600">Class</th>
                        {(Array.isArray(reservationOptions)
                          ? reservationOptions
                          : []
                        ).map((r) => (
                          <th key={r} className="px-3 py-2 text-slate-600">
                            {r}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(t.classes) ? t.classes : []).map(
                        (cls) => (
                          <tr key={cls} className="border-t">
                            <td className="px-3 py-2 font-medium">{cls}</td>
                            {(Array.isArray(reservationOptions)
                              ? reservationOptions
                              : []
                            ).map((r) => (
                              <td key={r} className="px-3 py-2">
                                {getMockAvailability(t, cls, r)}
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          searched && (
            <div className="mt-6 text-center text-slate-600">
              No trains found for the selected route/date. Try modify search.
            </div>
          )
        )}

        {/* Schedule Modal */}
        {scheduleModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">{scheduleModal.title}</h4>
                <button
                  className="text-slate-500"
                  onClick={() =>
                    setScheduleModal({ open: false, stops: [], title: "" })
                  }
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2 max-h-72 overflow-auto">
                {scheduleModal.stops.map((s, i) => (
                  <div key={i} className="flex justify-between border-b py-2">
                    <div>
                      <div className="font-medium">{s.station}</div>
                      <div className="text-xs text-slate-500">{s.time}</div>
                    </div>
                    <div className="text-sm text-slate-400">{i + 1}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() =>
                    setScheduleModal({ open: false, stops: [], title: "" })
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {bookingModal.open && bookingModal.train && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold">
                  Proceed Booking — {bookingModal.train.train_name}
                </h4>
                <button
                  onClick={() => setBookingModal({ open: false, train: null })}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-600">
                    Passenger Name
                  </label>
                  <input
                    value={bookingModal.passengerName}
                    onChange={(e) =>
                      setBookingModal((b) => ({
                        ...b,
                        passengerName: e.target.value,
                      }))
                    }
                    placeholder="Full name"
                    className="w-full mt-1 p-3 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">
                    Mobile Number (for mock SMS)
                  </label>
                  <input
                    value={bookingModal.mobile}
                    onChange={(e) =>
                      setBookingModal((b) => ({ ...b, mobile: e.target.value }))
                    }
                    placeholder="10 digit mobile number"
                    className="w-full mt-1 p-3 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-600">Class</label>
                    <select
                      value={bookingModal.travelClass}
                      onChange={(e) =>
                        setBookingModal((b) => ({
                          ...b,
                          travelClass: e.target.value,
                        }))
                      }
                      className="w-full mt-1 p-3 border rounded-lg"
                    >
                      {(bookingModal.train.classes || []).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-slate-600">
                      Reservation
                    </label>
                    <select
                      value={bookingModal.reservationType}
                      onChange={(e) =>
                        setBookingModal((b) => ({
                          ...b,
                          reservationType: e.target.value,
                        }))
                      }
                      className="w-full mt-1 p-3 border rounded-lg"
                    >
                      {(Array.isArray(reservationOptions)
                        ? reservationOptions
                        : []
                      ).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-2">
                  <button
                    onClick={() =>
                      setBookingModal({ open: false, train: null })
                    }
                    className="px-4 py-2 rounded-md border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBooking}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Confirm & Send Mock SMS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookTicketPage;
