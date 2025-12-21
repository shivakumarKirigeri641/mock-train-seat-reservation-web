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
  Calendar,
  TrainTrack,
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
  const [liveStationInput, setLiveStationInput] = useState("");
  const [liveStationTime, setLiveStationTime] = useState(2); // Default to 2 hours
  const [liveStationData, setLiveStationData] = useState([]);
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
  const [scheduleInput, setScheduleInput] = useState("");
  const [fullScheduleData, setFullScheduleData] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [searchForm, setSearchForm] = useState({
    source_code: "",
    destination_code: "",
    doj: today,
  });
  const [cancelPnr, setCancelPnr] = useState("");
  const [cancelBookingData, setCancelBookingData] = useState(null);
  const [selectedPassengers, setSelectedPassengers] = useState([]); // Array of passenger IDs
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
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSmsTicked, setIsSmsTicked] = useState(false);
  // --- Add these to your states within RailwayReservation component ---
  const [pnrInput, setPnrInput] = useState("");
  const [pnrStatusData, setPnrStatusData] = useState(null);
  const [liveTrainInput, setLiveTrainInput] = useState("");
  const [liveStatusData, setLiveStatusData] = useState(null);
  const fetchLiveStationStatus = async (stationCode) => {
    const code = stationCode || liveStationInput;
    if (!code) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/live-station`,
        {
          station_code: code,
          next_hours: liveStationTime,
        },
        API_CONFIG
      );
      setLiveStationData(res.data.data.trains_list);
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Live station details not found.");
      setLiveStationData([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchLiveTrainStatus = async () => {
    if (!liveTrainInput) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/train-live-running-status`,
        { train_number: liveTrainInput },
        API_CONFIG
      );
      console.log(res.data.data);
      setLiveStatusData(res.data.data);
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Live status not available for this train.");
      setLiveStatusData(null);
    } finally {
      setLoading(false);
    }
  };
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
  const fetchSchedule = async (trainNo, istab = true) => {
    setErrorMsg("");
    setFullScheduleData(null);
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/train-schedule`,
        { train_number: trainNo },
        API_CONFIG
      );
      if (false === istab) {
        setModalState({ type: "schedule", open: true, data: res.data.data });
      } else {
        setFullScheduleData(res.data.data);
      }
    } catch (err) {
      console.log(err.message);
      setErrorMsg("Train not found!");
    } finally {
      setLoading(false);
    }
  };

  const updatePassenger = (i, f, v) => {
    const n = [...passengers];
    n[i][f] = v;
    if (f === "passenger_age" || f === "passenger_gender") {
      const age = parseInt(n[i].passenger_age) || 0;
      n[i].passenger_issenior =
        (n[i].passenger_gender === "M" && age >= 60) ||
        (n[i].passenger_gender === "F" && age >= 50);
    }
    setPassengers(n);
  };

  const updateChild = (i, f, v) => {
    const n = [...children];
    n[i][f] = v;
    setChildren(n);
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
          passenger_details: [...passengers, ...children],
          coach_type: selectedClass,
          reservation_type: selectedQuota,
          mobile_number: isSmsTicked
            ? mobileNumber
            : process.env.REACT_APP_MY_MOBILE_NUMBER,
        },
        API_CONFIG
      );
      console.log(res.data.data);
      setBookingId(res.data.data.booked_details.id);
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
        `${API_BASE_URL}/confirm-ticket`,
        { booking_id: bookingId, can_send_mock_ticket_sms: isSmsTicked },
        API_CONFIG
      );
      console.log(res.data.data);
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
  // --- Add this function to handle the API call ---
  const fetchPnrStatus = async () => {
    if (!pnrInput) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/pnr-status`,
        { pnr: pnrInput },
        API_CONFIG
      );
      setPnrStatusData(res.data.data);
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Invalid PNR or Status not found.");
      setPnrStatusData(null);
    } finally {
      setLoading(false);
    }
  };
  const fetchBookingForCancel = async () => {
    if (!cancelPnr) return;
    setLoading(true);
    try {
      // Reusing PNR status or a specific booking fetch endpoint
      const res = await axios.post(
        `${API_BASE_URL}/pnr-status`,
        { pnr: cancelPnr },
        API_CONFIG
      );
      setCancelBookingData(res.data.data);
      setSelectedPassengers([]); // Reset selection
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Booking not found for this PNR.");
      setCancelBookingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async () => {
    if (selectedPassengers.length === 0) {
      setErrorMsg("Please select at least one passenger to cancel.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/cancel-ticket`,
        {
          pnr: cancelPnr,
          passengerids: selectedPassengers,
        },
        API_CONFIG
      );
      console.log(res.data);
      // Update view with new data returned from API
      setCancelBookingData(res.data.data);
      setSelectedPassengers([]);
      setErrorMsg("");
      alert("Cancellation Successful");
      activeTab = 0;
    } catch (err) {
      setErrorMsg("Cancellation failed.", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 md:grid-cols-6 bg-slate-950/50 p-2 gap-2 border-b border-slate-800">
          {[
            "Book Tickets",
            "PNR Status",
            "Cancel ticket",
            "Schedule",
            "Live Status",
            "Live Station",
          ].map((label, idx) => (
            <button
              key={idx}
              onClick={() => {
                setErrorMsg("");
                setPnrInput("");
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
                    <div className="space-y-4">
                      <QuotaSelector
                        current={selectedQuota}
                        onChange={setSelectedQuota}
                      />
                      {trainResults.map((t, i) => (
                        <div
                          key={i}
                          className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-800"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-black text-white uppercase italic mb-4">
                              {t.train_name} ({t.train_number})
                            </h4>
                            {/* Location Button */}
                            <button
                              onClick={() => fetchSchedule(t.train_number)}
                              className="top-6 right-6 p-2.5 bg-slate-900 text-orange-500 rounded-xl border border-slate-700 hover:bg-orange-500 hover:text-white transition-all shadow-xl group/loc"
                            >
                              <MapPin
                                size={20}
                                className="group-hover/loc:scale-110 transition-transform"
                              />
                            </button>
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
                    <h4 className="font-black text-white uppercase italic">
                      {selectedTrain.train_name}
                    </h4>
                    <button
                      onClick={() => setSelectedTrain(null)}
                      className="text-[10px] font-black uppercase text-slate-500 underline"
                    >
                      Change Train
                    </button>
                  </div>

                  {/* Adult Entry Section */}
                  <div className="space-y-4">
                    <p className="text-xs font-black text-orange-500 uppercase tracking-widest ml-1">
                      Adult Entry (Max 6)
                    </p>
                    {passengers.map((p, i) => (
                      <div
                        key={i}
                        className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
                      >
                        <input
                          placeholder="Name"
                          className="bg-slate-900 border-2 border-slate-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-orange-500"
                          value={p.passenger_name}
                          onChange={(e) =>
                            updatePassenger(i, "passenger_name", e.target.value)
                          }
                        />
                        <input
                          placeholder="Age"
                          type="number"
                          className="bg-slate-900 border-2 border-slate-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-orange-500"
                          value={p.passenger_age}
                          onChange={(e) =>
                            updatePassenger(i, "passenger_age", e.target.value)
                          }
                        />
                        <select
                          className="bg-slate-900 border-2 border-slate-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-orange-500"
                          value={p.passenger_gender}
                          onChange={(e) =>
                            updatePassenger(
                              i,
                              "passenger_gender",
                              e.target.value
                            )
                          }
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-500">
                          <input
                            type="checkbox"
                            checked={p.passenger_issenior}
                            disabled
                            className="w-4 h-4 accent-orange-500"
                          />{" "}
                          SENIOR
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
                    <button
                      onClick={() =>
                        passengers.length < 6 &&
                        setPassengers([
                          ...passengers,
                          {
                            passenger_name: "",
                            passenger_age: "",
                            passenger_gender: "M",
                            passenger_issenior: false,
                            passenger_ischild: false,
                          },
                        ])
                      }
                      className="p-3 bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-400 flex items-center justify-center gap-2"
                    >
                      <UserPlus size={14} /> Add Adult
                    </button>
                  </div>

                  {/* Child Entry Section */}
                  <div className="space-y-4">
                    <p className="text-xs font-black text-orange-500 uppercase tracking-widest ml-1">
                      Child Entry (Age 1-6)
                    </p>
                    {children.map((c, i) => (
                      <div
                        key={i}
                        className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
                      >
                        <input
                          placeholder="Child Name"
                          className="bg-slate-900 border-2 border-slate-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-orange-500"
                          value={c.passenger_name}
                          onChange={(e) =>
                            updateChild(i, "passenger_name", e.target.value)
                          }
                        />
                        <input
                          placeholder="Age"
                          type="number"
                          min="1"
                          max="6"
                          className="bg-slate-900 border-2 border-slate-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-orange-500"
                          value={c.passenger_age}
                          onChange={(e) =>
                            updateChild(i, "passenger_age", e.target.value)
                          }
                        />
                        <select
                          className="bg-slate-900 border-2 border-slate-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-orange-500"
                          value={c.passenger_gender}
                          onChange={(e) =>
                            updateChild(i, "passenger_gender", e.target.value)
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
                        children.length < 6 &&
                        setChildren([
                          ...children,
                          {
                            passenger_name: "",
                            passenger_age: "",
                            passenger_gender: "M",
                            passenger_issenior: false,
                            passenger_ischild: true,
                          },
                        ])
                      }
                      className="p-3 bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-400 flex items-center justify-center gap-2"
                    >
                      <UserPlus size={14} /> Add Child
                    </button>
                  </div>

                  {/* Contact/SMS Section */}
                  <div className="bg-slate-950/60 p-6 rounded-[2.5rem] border border-slate-800 space-y-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={isSmsTicked}
                        onChange={(e) => setIsSmsTicked(e.target.checked)}
                        className="mt-1 w-5 h-5 accent-orange-500"
                      />
                      <div>
                        <p className="text-xs font-black text-slate-200 uppercase tracking-widest">
                          Enable SMS Confirmation
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 italic">
                          Tick to receive mock ticket confirmation sms details.
                        </p>
                      </div>
                    </div>
                    {isSmsTicked && (
                      <div className="flex flex-col gap-2 pl-9">
                        <label className="text-[10px] font-black text-orange-500 uppercase">
                          Mobile Number:
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="Enter 10 digit number"
                          className="bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl text-sm font-black text-white outline-none focus:border-orange-500 max-w-xs"
                          value={mobileNumber}
                          onChange={(e) =>
                            setMobileNumber(e.target.value.replace(/\D/g, ""))
                          }
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleProceedBooking}
                    className="w-full py-6 bg-orange-500 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl shadow-orange-500/20 hover:bg-orange-600 transition-all"
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
          {activeTab === 1 && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-top-4 duration-500">
              {/* PNR Input Field */}
              <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl flex flex-col items-center gap-6">
                <div className="text-center">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
                    Check PNR Status
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Enter your 10-digit PNR number
                  </p>
                </div>
                <div className="flex w-full max-w-md gap-3">
                  <input
                    className="flex-1 p-5 bg-slate-950 border-2 border-slate-800 rounded-2xl font-black text-center text-xl tracking-[0.3em] uppercase text-orange-500 outline-none focus:border-orange-500 transition-all placeholder:text-slate-800"
                    placeholder="PNR NUMBER"
                    maxLength={10}
                    value={pnrInput}
                    onChange={(e) => setPnrInput(e.target.value)}
                  />
                  <button
                    onClick={fetchPnrStatus}
                    className="bg-orange-500 px-8 rounded-2xl font-black uppercase text-xs hover:bg-orange-600 transition-all flex items-center justify-center shadow-lg shadow-orange-500/20"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Check"}
                  </button>
                </div>
              </div>

              {/* PNR Results View */}
              {pnrStatusData && (
                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="bg-slate-800/40 p-6 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-500 rounded-xl text-white">
                        <Ticket size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Train Information
                        </p>
                        <h4 className="font-black text-white uppercase italic text-lg">
                          SOLAPUR EXP (#{pnrStatusData.train_number})
                        </h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full uppercase">
                        Active Ticket
                      </span>
                    </div>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1: Journey Details */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                        Journey
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xl font-black text-white">
                            {pnrStatusData.source_code}
                          </p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">
                            Source
                          </p>
                        </div>
                        <Navigation
                          className="text-slate-800 rotate-90"
                          size={16}
                        />
                        <div className="text-center">
                          <p className="text-xl font-black text-white">
                            {pnrStatusData.destination_code}
                          </p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">
                            Destination
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                        <Calendar size={14} className="text-slate-600" />
                        <p className="text-xs font-bold text-slate-300 uppercase">
                          {pnrStatusData.date_of_journey}
                        </p>
                      </div>
                    </div>

                    {/* Column 2: Passenger Details */}
                    <div className="space-y-4 border-x border-slate-800/50 px-8">
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                        Passenger
                      </p>
                      <div>
                        <p className="text-lg font-black text-white uppercase">
                          {pnrStatusData.p_name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">
                          {pnrStatusData.p_gender} | Age: {pnrStatusData.p_age}{" "}
                          | {pnrStatusData.is_senior ? "Senior" : "Adult"}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-slate-800 flex justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-slate-600 uppercase">
                            Class
                          </p>
                          <p className="text-xs font-black text-slate-300">
                            {pnrStatusData.coach_code}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-600 uppercase">
                            Quota
                          </p>
                          <p className="text-xs font-black text-slate-300">
                            {pnrStatusData.type_code}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Seat Allotment */}
                    <div className="bg-slate-950 p-6 rounded-3xl flex flex-col justify-center items-center text-center space-y-2 border border-slate-800">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Current Status
                      </p>
                      <p className="text-3xl font-black text-green-500 tracking-tighter">
                        {pnrStatusData.current_seat_status}
                      </p>
                      <div className="pt-2">
                        <p className="text-[9px] font-bold text-slate-600 uppercase">
                          Base Fare Paid
                        </p>
                        <p className="text-sm font-bold text-white italic">
                          ₹ {pnrStatusData.base_fare}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/20 p-4 border-t border-slate-800 flex justify-center gap-4">
                    <button
                      onClick={() => window.print()}
                      className="text-[10px] font-black text-slate-500 hover:text-white uppercase flex items-center gap-2 transition-all"
                    >
                      <Download size={14} /> Download E-Ticket
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 2 && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-top-4 duration-500">
              {/* PNR Search for Cancellation */}
              <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl flex flex-col items-center gap-6">
                <div className="text-center">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
                    Cancel Ticket
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Enter PNR to fetch passenger details
                  </p>
                </div>
                <div className="flex w-full max-w-md gap-3">
                  <input
                    className="flex-1 p-5 bg-slate-950 border-2 border-slate-800 rounded-2xl font-black text-center text-xl tracking-[0.3em] uppercase text-red-500 outline-none focus:border-red-500 transition-all placeholder:text-slate-800"
                    placeholder="PNR NUMBER"
                    maxLength={10}
                    value={cancelPnr}
                    onChange={(e) => setCancelPnr(e.target.value)}
                  />
                  <button
                    onClick={fetchBookingForCancel}
                    className="bg-red-600 px-8 rounded-2xl font-black uppercase text-xs hover:bg-red-700 transition-all flex items-center justify-center shadow-lg shadow-red-500/20"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Fetch"}
                  </button>
                </div>
              </div>

              {/* Booking Details & Passenger Selection */}
              {cancelBookingData && (
                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
                  <div className="bg-red-500/10 p-6 border-b border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-red-500 uppercase">
                        Manage Cancellation
                      </p>
                      <h4 className="font-black text-white uppercase italic text-lg">
                        {cancelBookingData.train_name || "Train Details"} (#
                        {cancelBookingData.train_number})
                      </h4>
                    </div>
                    <button
                      onClick={() => setActiveTab(0)}
                      className="p-3 bg-slate-800 text-slate-400 rounded-2xl hover:text-white transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-8 space-y-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Select Passengers to Cancel
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Citing fix: result_udpated_passengerdetails from provided JSON structure */}
                      {(
                        cancelBookingData.result_udpated_passengerdetails || [
                          cancelBookingData,
                        ]
                      ).map((p, idx) => (
                        <div
                          key={p.id || idx}
                          className={`flex justify-between items-center p-5 rounded-2xl border transition-all ${
                            p.cancellation_status
                              ? "bg-slate-950 border-slate-800 opacity-50"
                              : "bg-slate-900 border-slate-800 hover:border-red-500/50"
                          }`}
                        >
                          <div className="flex gap-4 items-center">
                            {!p.cancellation_status && (
                              <input
                                type="checkbox"
                                className="w-5 h-5 accent-red-500 rounded border-slate-700 bg-slate-800"
                                checked={selectedPassengers.includes(p.id)}
                                onChange={(e) => {
                                  if (e.target.checked)
                                    setSelectedPassengers([
                                      ...selectedPassengers,
                                      p.id,
                                    ]);
                                  else
                                    setSelectedPassengers(
                                      selectedPassengers.filter(
                                        (id) => id !== p.id
                                      )
                                    );
                                }}
                              />
                            )}
                            <div>
                              <p className="text-xs font-black text-slate-200 uppercase">
                                {p.p_name || p.passenger_name}
                              </p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase">
                                Seat: {p.current_seat_status} | Status:{" "}
                                {p.seat_status || "CNF"}
                              </p>
                            </div>
                          </div>
                          <div>
                            {p.cancellation_status ? (
                              <span className="text-[9px] font-black px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded uppercase">
                                Cancelled
                              </span>
                            ) : (
                              <span className="text-[9px] font-black px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded uppercase">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-800">
                      <button
                        onClick={() => setActiveTab(0)}
                        className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-700 transition-all"
                      >
                        Close
                      </button>
                      <button
                        onClick={handleCancelTicket}
                        disabled={selectedPassengers.length === 0}
                        className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin mx-auto" />
                        ) : (
                          "Cancel Selected Tickets"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 3 && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-top-4 duration-500">
              {/* Search Header */}
              <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl flex flex-col items-center gap-6">
                <div className="text-center">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3 justify-center">
                    <Clock className="text-orange-500" /> Live Train Schedule
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Enter train number to view full route
                  </p>
                </div>
                <div className="flex w-full max-w-md gap-3">
                  <input
                    className="flex-1 p-5 bg-slate-950 border-2 border-slate-800 rounded-2xl font-black text-center text-xl tracking-[0.3em] uppercase text-orange-500 outline-none focus:border-orange-500 transition-all placeholder:text-slate-800"
                    placeholder="TRAIN NO"
                    maxLength={5}
                    value={scheduleInput}
                    onChange={(e) =>
                      setScheduleInput(e.target.value.replace(/\D/g, ""))
                    }
                  />
                  <button
                    onClick={() => {
                      fetchSchedule(scheduleInput);
                    }}
                    className="bg-orange-500 px-8 rounded-2xl font-black uppercase text-xs hover:bg-orange-600 transition-all flex items-center justify-center shadow-lg shadow-orange-500/20"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Fetch"}
                  </button>
                </div>
              </div>

              {/* Schedule Results View */}
              {fullScheduleData && (
                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                  {/* Train Summary Header */}
                  <div className="bg-slate-800/40 p-6 border-b border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-white uppercase italic text-lg">
                        {fullScheduleData.train_details?.train_name} (#
                        {fullScheduleData.train_details?.train_number})
                      </h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        {fullScheduleData.train_details?.train_type} | Zone:{" "}
                        {fullScheduleData.train_details?.zone}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                        (day) => (
                          <span
                            key={day}
                            className={`text-[8px] font-black w-6 h-6 flex items-center justify-center rounded-lg border ${
                              fullScheduleData.train_details?.[
                                `train_runs_on_${day}`
                              ] === "Y"
                                ? "bg-orange-500/20 border-orange-500/50 text-orange-500"
                                : "bg-slate-950 border-slate-800 text-slate-700"
                            } uppercase`}
                          >
                            {day[0]}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Route Timeline */}
                  <div className="p-8">
                    <div className="space-y-4">
                      {fullScheduleData.train_schedule_details?.map(
                        (stop, idx) => (
                          <div
                            key={idx}
                            className="flex gap-6 items-center border-l-2 border-orange-500/30 ml-4 pl-8 relative group"
                          >
                            <div className="absolute -left-[9px] w-4 h-4 bg-slate-900 border-2 border-orange-500 rounded-full group-hover:bg-orange-500 transition-colors"></div>
                            <div className="flex-1 bg-slate-950/50 p-5 rounded-[1.5rem] border border-slate-800 flex justify-between items-center group-hover:border-orange-500/50 transition-all">
                              <div>
                                <p className="text-xs font-black text-white uppercase tracking-tighter">
                                  {stop.station_name} ({stop.station_code})
                                </p>
                                <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">
                                  Seq: {stop.station_sequence} | Day{" "}
                                  {stop.running_day} | {stop.kilometer} KM
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-black text-orange-500">
                                  {stop.arrival || "STARTS"}
                                </p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                  Dep: {stop.departure || "ENDS"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-800/20 p-4 border-t border-slate-800 flex justify-center">
                    <button
                      onClick={() => window.print()}
                      className="text-[10px] font-black text-slate-500 hover:text-white uppercase flex items-center gap-2 transition-all"
                    >
                      <Download size={14} /> Download Full Route
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 4 && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-top-4 duration-500">
              {/* Search Input */}
              <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl flex flex-col items-center gap-6">
                <div className="text-center">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3 justify-center">
                    <Activity className="text-orange-500" /> Live Train Status
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Track train location and delays in real-time
                  </p>
                </div>
                <div className="flex w-full max-w-md gap-3">
                  <input
                    className="flex-1 p-5 bg-slate-950 border-2 border-slate-800 rounded-2xl font-black text-center text-xl tracking-[0.3em] uppercase text-orange-500 outline-none focus:border-orange-500 transition-all placeholder:text-slate-800"
                    placeholder="TRAIN NO"
                    maxLength={5}
                    value={liveTrainInput}
                    onChange={(e) =>
                      setLiveTrainInput(e.target.value.replace(/\D/g, ""))
                    }
                  />
                  <button
                    onClick={() => fetchLiveTrainStatus()}
                    className="bg-orange-500 px-8 rounded-2xl font-black uppercase text-xs hover:bg-orange-600 transition-all flex items-center justify-center shadow-lg shadow-orange-500/20"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Track"}
                  </button>
                </div>
              </div>

              {/* Live Status Timeline */}
              {liveStatusData && (
                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
                  <div>
                    <div className="bg-slate-800/40 p-6 border-b border-slate-800 flex justify-between items-center">
                      <h4 className="font-black text-white uppercase italic text-lg flex items-center gap-3">
                        <TrainFront size={20} className="text-orange-500" />#
                        {liveStatusData?.train_details?.train_number}
                      </h4>
                      <h3 className="font-black text-white uppercase italic text-lg flex items-center gap-3">
                        <TrainFront size={20} className="text-orange-500" />
                        {liveStatusData?.train_details?.train_name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                          Live Updates Active
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-800/40 p-6 border-b border-slate-800 flex justify-between items-center">
                      <h4 className="font-black text-white uppercase italic text-sm flex items-center gap-3">
                        <TrainFront size={20} className="text-orange-500" />#
                        {liveStatusData?.train_details?.train_type} /{" "}
                        {liveStatusData?.train_details?.zone}
                      </h4>
                      <h3 className="font-black text-white uppercase italic text-sm flex items-center gap-3">
                        <TrainFront size={20} className="text-orange-500" />
                        Origin: {liveStatusData?.train_details?.station_from}
                      </h3>
                      <h3 className="font-black text-white uppercase italic text-sm flex items-center gap-3">
                        <TrainFront size={20} className="text-orange-500" />
                        Destination: {liveStatusData?.train_details?.station_to}
                      </h3>
                    </div>
                    <div className="bg-slate-800/40 p-6 border-b border-slate-800 flex items-center">
                      <h4 className="font-black text-white uppercase italic text-xs flex items-center gap-3">
                        <TrainFront size={20} className="text-orange-500" />
                        Runs on:
                        {liveStatusData?.train_details?.train_runs_on_sun}{" "}
                        {liveStatusData?.train_details?.train_runs_on_mon}{" "}
                        {liveStatusData?.train_details?.train_runs_on_tue}{" "}
                        {liveStatusData?.train_details?.train_runs_on_wed}{" "}
                        {liveStatusData?.train_details?.train_runs_on_thu}{" "}
                        {liveStatusData?.train_details?.train_runs_on_fri}{" "}
                        {liveStatusData?.train_details?.train_runs_on_sat}{" "}
                      </h4>
                    </div>
                  </div>
                  <div className="p-8 space-y-2">
                    {liveStatusData?.live_list.map((station, idx) => (
                      <div
                        key={idx}
                        className="flex gap-6 items-start relative group"
                      >
                        {/* Vertical Line Logic */}
                        {idx !== liveStatusData.length - 1 && (
                          <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-800 group-hover:bg-orange-500/30 transition-colors"></div>
                        )}

                        {/* Status Icon */}
                        <div className="relative z-10 pt-2">
                          <div
                            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                              station.train_status_at_station === "Departed"
                                ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20"
                                : station.train_status_at_station === "Arrived"
                                ? "bg-green-500 border-green-400 text-white"
                                : "bg-slate-950 border-slate-800 text-slate-700"
                            }`}
                          >
                            {station.train_status_at_station === "Departed" ? (
                              <Navigation size={18} />
                            ) : (
                              <MapPin size={18} />
                            )}
                          </div>
                        </div>

                        {/* Station Card */}
                        <div className="flex-1 bg-slate-950/50 p-5 rounded-[1.5rem] border border-slate-800 mb-6 flex justify-between items-center group-hover:border-slate-600 transition-all">
                          <div className="space-y-1">
                            <p className="text-sm font-black text-white uppercase tracking-tight">
                              {station.station_name} ({station.station_code})
                            </p>
                            <div className="flex gap-3 items-center">
                              <span
                                className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                                  station.train_status_at_station === "Departed"
                                    ? "bg-orange-500/10 text-orange-500"
                                    : "bg-slate-800 text-slate-500"
                                }`}
                              >
                                {station.train_status_at_station}
                              </span>
                              <p className="text-[9px] font-bold text-slate-600 uppercase">
                                Seq: {station.station_sequence} |{" "}
                                {station.kilometer} KM
                              </p>
                            </div>
                          </div>

                          <div className="text-right space-y-1">
                            <div className="flex flex-col">
                              <p className="text-[9px] font-bold text-slate-500 uppercase">
                                Arrival
                              </p>
                              <p className="text-xs font-black text-white">
                                {station.arrival_time
                                  ? station.arrival_time.split(" ")[1]
                                  : "---"}
                              </p>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-[9px] font-bold text-slate-500 uppercase">
                                Departure
                              </p>
                              <p className="text-xs font-black text-orange-500">
                                {station.departure_time
                                  ? station.departure_time.split(" ")[1]
                                  : "---"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 5 && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-top-4 duration-500">
              {/* Search & Config Header */}
              <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                  <div className="flex-1 w-full">
                    <AutocompleteInput
                      label="Station Name/Code"
                      list={stations}
                      onSelect={(v) => {
                        setLiveStationInput(v);
                        fetchLiveStationStatus(v);
                      }}
                    />
                  </div>

                  {/* Time Window Radio Buttons */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Time Window
                    </label>
                    <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-1">
                      {[2, 4, 8].map((hr) => (
                        <label
                          key={hr}
                          className={`flex-1 px-6 py-2.5 rounded-xl text-[10px] font-black cursor-pointer transition-all ${
                            liveStationTime === hr
                              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                              : "text-slate-500 hover:bg-slate-900"
                          }`}
                        >
                          <input
                            type="radio"
                            className="hidden"
                            name="timeWindow"
                            value={hr}
                            checked={liveStationTime === hr}
                            onChange={() => setLiveStationTime(hr)}
                          />
                          {hr} HRS
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => fetchLiveStationStatus()}
                    className="h-14 bg-orange-500 px-8 rounded-2xl font-black uppercase text-xs hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Activity size={18} />
                    )}{" "}
                    Fetch
                  </button>
                </div>
              </div>

              {/* Live Trains List */}
              {liveStationData.length > 0 && (
                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center px-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Upcoming Trains at {liveStationData[0]?.station_name}
                    </p>
                    <span className="text-[9px] font-black px-2 py-0.5 bg-green-500/10 text-green-500 rounded uppercase">
                      Live Feed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {liveStationData.map((t, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-slate-600 transition-all group flex flex-col md:flex-row justify-between gap-6"
                      >
                        <div className="flex gap-4">
                          <div className="p-4 bg-slate-950 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                            <TrainFront size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-white uppercase italic text-lg">
                              {t.train_name}
                            </h4>
                            <div className="flex gap-3 items-center mt-1">
                              <span className="text-[10px] font-black text-orange-500">
                                #{t.train_number}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                {t.station_from} → {t.station_to}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-1 justify-around items-center border-x border-slate-800/50 px-4">
                          <div className="text-center">
                            <p className="text-[9px] font-bold text-slate-600 uppercase">
                              Arrival
                            </p>
                            <p className="text-sm font-black text-white">
                              {t.arrival_time
                                ? t.arrival_time.split("T")[1].substring(0, 5)
                                : "Starts"}
                            </p>
                          </div>
                          <Clock className="text-slate-800" size={16} />
                          <div className="text-center">
                            <p className="text-[9px] font-bold text-slate-600 uppercase">
                              Departure
                            </p>
                            <p className="text-sm font-black text-orange-500">
                              {t.departure_time
                                ? t.departure_time.split("T")[1].substring(0, 5)
                                : "Ends"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center items-end min-w-[120px]">
                          <div
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              t.status === "Departed"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-green-500/10 text-green-500"
                            }`}
                          >
                            {t.status}
                          </div>
                          <p className="text-[10px] font-bold text-slate-500 mt-2">
                            ETA: {t.eta_hhmm}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Booking Summary Modal */}
      {modalState.open && modalState.type === "summary" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-4xl rounded-[3rem] border border-slate-800 p-10 space-y-8 animate-in zoom-in-95 shadow-2xl">
            <h2 className="text-2xl font-black text-white uppercase italic border-b border-slate-800 pb-4">
              Booking Dossier - Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 space-y-4">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                  Train Information
                </p>
                <h4 className="text-lg font-black text-white">
                  {selectedTrain.train_name} (#{selectedTrain.train_number})
                </h4>
                <p className="text-xs font-bold text-slate-500">
                  {selectedTrain.station_from} → {selectedTrain.station_to}
                </p>
                <p className="text-[11px] font-bold text-slate-400">
                  Class: {selectedClass.toUpperCase()} | DOJ: {searchForm.doj}
                </p>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 flex flex-col justify-center items-center">
                <p className="text-[10px] font-black text-orange-500 uppercase mb-4">
                  Total Fare
                </p>
                <p className="text-4xl font-black text-white tracking-tighter">
                  ₹ {calculateTotalFare()}
                </p>
                <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest">
                  Booking ID: {bookingId}
                </p>
              </div>
            </div>
            <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 space-y-4">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                Passenger Manifest
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...passengers, ...children].map((p, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between border-b border-slate-800 pb-2 text-[11px] font-bold uppercase"
                  >
                    <span className="text-slate-300">
                      {p.passenger_name} ({p.passenger_gender})
                    </span>
                    <span className="text-slate-500 italic">
                      {p.passenger_ischild
                        ? "Child"
                        : p.passenger_issenior
                        ? "Senior"
                        : "Adult"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setModalState({ open: false, type: null })}
                className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold uppercase text-[10px] text-slate-400"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 py-4 bg-orange-500 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-orange-500/20"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirmation/Success Modal */}
      {modalState.open && modalState.type === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-slate-800 p-10 space-y-8 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>

            {/* Header with PNR Details */}
            <div className="text-center shrink-0">
              <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                Reservation Confirmed
              </h2>
              <div className="mt-2 inline-flex items-center gap-3 px-4 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                  PNR Number:
                </span>
                <span className="text-lg font-black text-white tracking-[0.2em]">
                  {bookingSummary?.result_updated_bookingdetails?.pnr ||
                    "MOCK4210"}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Train & Journey Details */}
                <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                    <TrainFront className="text-orange-500" size={18} />
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                      Journey Details
                    </p>
                  </div>
                  <h4 className="text-lg font-black text-white uppercase italic">
                    {bookingSummary?.result_updated_bookingdetails?.train_name}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">
                        Train No.
                      </p>
                      <p className="text-xs font-bold text-slate-200">
                        #
                        {
                          bookingSummary?.result_updated_bookingdetails
                            ?.train_number
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">
                        Class | Quota
                      </p>
                      <p className="text-xs font-bold text-slate-200">
                        {
                          bookingSummary?.result_updated_bookingdetails
                            ?.coach_code
                        }{" "}
                        |{" "}
                        {
                          bookingSummary?.result_updated_bookingdetails
                            ?.type_code
                        }
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">
                        Route
                      </p>
                      <p className="text-xs font-bold text-slate-200">
                        {
                          bookingSummary?.result_updated_bookingdetails
                            ?.source_name
                        }{" "}
                        (
                        {
                          bookingSummary?.result_updated_bookingdetails
                            ?.scheduled_departure
                        }
                        ) →{" "}
                        {
                          bookingSummary?.result_updated_bookingdetails
                            ?.destination_name
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                    <CreditCard className="text-orange-500" size={18} />
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                      Payment Breakdown
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>Base Fare</span>
                      <span className="text-slate-200">
                        ₹ {bookingSummary?.fare_details?.base_fare}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>GST (18%)</span>
                      <span className="text-slate-200">
                        ₹ {bookingSummary?.fare_details?.GST}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>Convenience Fee</span>
                      <span className="text-slate-200">
                        ₹ {bookingSummary?.fare_details?.convience}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-slate-800 flex justify-between items-end">
                      <p className="text-[10px] font-black text-slate-500 uppercase">
                        Gross Fare Paid
                      </p>
                      <p className="text-2xl font-black text-green-500">
                        ₹ {bookingSummary?.fare_details?.gross_fare}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Passenger Status */}
              <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-slate-800">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                  <UserPlus className="text-orange-500" size={18} />
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                    Passenger Manifest & Seat Allotment
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {bookingSummary?.result_udpated_passengerdetails?.map(
                    (p, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b border-slate-800/50 pb-3"
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-black text-orange-500">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-200 uppercase">
                              {p.p_name}
                            </p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">
                              {p.p_gender} | Age: {p.p_age}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-black text-green-500 uppercase">
                            {p.current_seat_status}
                          </p>
                          <span className="text-[8px] font-black px-1.5 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded uppercase">
                            {p.seat_status}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 shrink-0 pt-4 border-t border-slate-800">
              <button
                onClick={() => window.print()}
                className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-slate-700 transition-all"
              >
                <Download size={16} /> Save E-Ticket
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-4 bg-orange-500 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
              >
                Book Another
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Schedule Modal */}
      {modalState.open && modalState.type === "schedule" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-3xl max-h-[85vh] rounded-[3rem] border border-slate-800 p-8 space-y-6 flex flex-col shadow-2xl overflow-hidden">
            <div className="flex justify-between items-start border-b border-slate-800 pb-6">
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic flex items-center gap-4">
                  <MapPin className="text-orange-500" />{" "}
                  {modalState.data?.train_details?.train_name}
                </h2>
                <div className="flex gap-4 mt-2">
                  <span className="text-[10px] font-black bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full uppercase">
                    #{modalState.data?.train_details?.train_number}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Zone: {modalState.data?.train_details?.zone}
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  setModalState({ open: false, type: null, data: null })
                }
                className="p-3 bg-slate-800 text-slate-400 rounded-2xl"
              >
                <X />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
              {modalState.data?.train_schedule_details?.map((stop, idx) => (
                <div
                  key={idx}
                  className="flex gap-6 items-center border-l-2 border-orange-500/30 ml-4 pl-8 relative group"
                >
                  <div className="absolute -left-[9px] w-4 h-4 bg-slate-900 border-2 border-orange-500 rounded-full group-hover:bg-orange-500 transition-colors"></div>
                  <div className="flex-1 bg-slate-950/50 p-5 rounded-[1.5rem] border border-slate-800 flex justify-between items-center group-hover:border-orange-500 transition-all">
                    <div>
                      <p className="text-xs font-black text-white uppercase">
                        {stop.station_name} ({stop.station_code})
                      </p>
                      <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">
                        Seq: {stop.station_sequence} | {stop.kilometer} KM
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-orange-500">
                        {stop.arrival || "STARTS"}
                      </p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">
                        Dep: {stop.departure || "ENDS"}
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

// Autocomplete and QuotaSelector components remain as before
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
        <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden z-20 shadow-2xl max-h-[500px] overflow-y-auto">
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
              {s.station_name} ({s.code})
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
            ? "bg-orange-500 border-orange-500 text-white"
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
          ? "PWD"
          : "Senior Citizen"}
      </button>
    ))}
  </div>
);

export default RailwayReservation;
