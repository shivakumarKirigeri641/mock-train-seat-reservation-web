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
  const [bookingId, setBookingId] = useState(null);
  const [bookingSummary, setBookingSummary] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const [searchForm, setSearchForm] = useState({
    source_code: "",
    destination_code: "",
    doj: today,
  });

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden">
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
