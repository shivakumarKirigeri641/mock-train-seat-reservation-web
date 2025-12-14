import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addloggedInUser } from "../store/slices/loggedInUserSlice";
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // State
  const [username, setUsername] = useState("Shiva");
  const [mobile, setMobile] = useState("9886122415");
  //const [state, setState] = useState(0); // Default ID 11
  const [state, setState] = useState(11); // Default ID 11
  const [otp, setOtp] = useState("1234");
  const [step, setStep] = useState("form"); // form | otp
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [indianStates, setIndianStates] = useState([]);

  // Base URL (Update as needed for prod)
  // const BASE_URL = "https://serverpe.in";

  // --- Fetch States from API ---
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/mockapis/serverpeuser/states`,
          {},
          { widthCredentials: true }
        );
        console.log(response?.data?.data);
        // Assuming response.data is: [{ id: 1, name: "Karnataka" }, ...]
        // If it's just an array of strings, the map below will need adjustment.
        setIndianStates(response?.data?.data);
      } catch (error) {
        console.error("Failed to fetch states", error);
        // Fallback or error handling can be added here
      }
    };
    fetchStates();
  }, []);

  // Clear specific error when user types
  useEffect(() => {
    if (username) setErrors((prev) => ({ ...prev, username: "" }));
  }, [username]);

  useEffect(() => {
    if (mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
  }, [mobile]);

  useEffect(() => {
    if (otp) setErrors((prev) => ({ ...prev, otp: "" }));
  }, [otp]);

  useEffect(() => {
    if (agreedToTerms) setErrors((prev) => ({ ...prev, terms: "" }));
  }, [agreedToTerms]);

  const validateForm = () => {
    let err = {};
    if (!username.trim()) err.username = "Username is required.";
    if (!mobile.match(/^[6-9]\d{9}$/))
      err.mobile = "Enter valid 10-digit mobile number.";
    if (!state) err.state = "Select your state.";
    if (!agreedToTerms) err.terms = "You must agree to the Terms & Conditions.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // API Call: Send OTP
      // Payload structure matched to user request
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/mockapis/serverpeuser/send-otp`,
        {
          user_name: username,
          mobile_number: mobile,
          stateid: parseInt(state), // Ensure ID is sent as integer
        },
        { withCredentials: true }
      );

      if (response.data.successstatus) {
        console.log("OTP Sent:", response.data.message);
        setStep("otp");
        setOtp("");
      } else {
        setErrors({ form: response.data.error || "Failed to send OTP." });
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      setErrors({
        form: error.response?.data?.error || "Network error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.match(/^\d{4,6}$/)) {
      setErrors({ otp: "Enter valid OTP (4-6 digits)." });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // API Call: Verify OTP
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/mockapis/serverpeuser/verify-otp`,
        {
          mobile_number: mobile,
          otp: otp,
        },
        { withCredentials: true }
      );

      if (response.data.successstatus) {
        // localStorage.setItem("token", response.data.token); // Store token if needed
        //call redux to store the user details
        dispatch(addloggedInUser(response?.data?.data));
        navigate("/user-home");
      } else {
        setErrors({ otp: response.data.error || "Invalid OTP." });
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      setErrors({
        otp:
          error.response?.data?.error ||
          "Verification failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") action();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 px-4 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse"></div>

      {/* Main Card */}
      <motion.div
        transition={{ duration: 0.5 }}
        className="relative bg-gray-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700/50 z-10"
      >
        {/* Header Icon */}
        <motion.div
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 bg-gray-900/80 rounded-full border border-gray-600/50 shadow-inner group">
            <svg
              className="w-10 h-10 text-indigo-500 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white leading-tight tracking-tight">
            Subscribe for mock APIs
          </h2>
          <p className="text-indigo-400 text-xs font-medium tracking-wide uppercase mt-1">
            - Your mock seat is pakka -
          </p>
        </div>

        {/* Global Form Error */}
        {errors.form && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-200 text-sm text-center animate-shake">
            {errors.form}
          </div>
        )}

        {/* Form Content Swapper */}
        <div className="relative overflow-hidden min-h-[320px]">
          <AnimatePresence mode="wait">
            {/* STEP 1: INITIAL FORM */}
            {step === "form" && (
              <motion.div
                key="form"
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Username Input */}
                <div className="group">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                    Username
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 bg-gray-900/50 border ${
                      errors.username
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-gray-600 focus:border-indigo-500"
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, handleSendOtp)}
                  />
                  {errors.username && (
                    <p className="text-red-400 text-xs mt-1 ml-1 animate-pulse">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Mobile Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className={`w-full px-4 py-3 bg-gray-900/50 border ${
                      errors.mobile
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-gray-600 focus:border-indigo-500"
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                    placeholder="98765 43210"
                    value={mobile}
                    maxLength={10}
                    onChange={(e) => setMobile(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, handleSendOtp)}
                  />
                  {errors.mobile && (
                    <p className="text-red-400 text-xs mt-1 ml-1 animate-pulse">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* State Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                    State
                  </label>
                  <div className="relative">
                    <select
                      className={`w-full px-4 py-3 bg-gray-900/50 border ${
                        errors.state ? "border-red-500/50" : "border-gray-600"
                      } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all cursor-pointer`}
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      <option value="" className="text-gray-500">
                        Select state
                      </option>
                      {indianStates?.length > 0 ? (
                        indianStates?.map((s) => (
                          <option key={s?.id || s} value={s?.id || s}>
                            {s?.state_name || s}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          Loading states...
                        </option>
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.state && (
                    <p className="text-red-400 text-xs mt-1 ml-1 animate-pulse">
                      {errors.state}
                    </p>
                  )}
                </div>

                {/* Terms & Conditions Checkbox */}
                <div className="flex items-start mt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 bg-gray-900 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:ring-offset-gray-800 text-indigo-600"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-400">
                      I agree to the{" "}
                      <span
                        className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                        onClick={() => window.open("/api-terms", "_blank")}
                      >
                        API Terms & Conditions
                      </span>
                    </label>
                  </div>
                </div>
                {errors.terms && (
                  <p className="text-red-400 text-xs mt-1 ml-1 animate-pulse">
                    {errors.terms}
                  </p>
                )}

                {/* Action Button */}
                <button
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all transform active:scale-[0.98] mt-4 flex items-center justify-center"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Send OTP Code"
                  )}
                </button>
              </motion.div>
            )}

            {/* STEP 2: OTP VERIFICATION */}
            {step === "otp" && (
              <motion.div
                key="otp"
                transition={{ duration: 0.3 }}
                className="space-y-6 pt-2"
              >
                {/* Info Banner */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 text-center">
                  <p className="text-gray-300 text-sm">
                    Enter the code sent to <br />
                    <span className="font-bold text-indigo-400 text-lg">
                      {mobile}
                    </span>
                  </p>
                </div>

                {/* OTP Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 text-center">
                    One Time Password
                  </label>
                  <input
                    autoFocus
                    type="text"
                    className={`w-full px-4 py-3 bg-gray-900/50 border ${
                      errors.otp
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-600 focus:border-emerald-500"
                    } rounded-xl text-white placeholder-gray-600 text-center tracking-[0.5em] text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                    placeholder="••••••"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, handleVerifyOtp)}
                  />
                  {errors.otp && (
                    <p className="text-red-400 text-xs mt-2 text-center animate-pulse">
                      {errors.otp}
                    </p>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Verify & Login"
                  )}
                </button>

                {/* Back Link */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      setStep("form");
                      setErrors({});
                    }}
                    className="text-gray-500 hover:text-indigo-400 text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Edit mobile number
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- Back to Home Link --- */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center justify-center gap-2 mx-auto group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              &larr;
            </span>
            Back to Home
          </button>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div className="mt-8 max-w-md text-center px-4">
        <p className="text-[10px] text-gray-500 leading-relaxed border border-gray-700/50 p-3 rounded-lg bg-gray-800/30 backdrop-blur-sm">
          <span className="font-bold text-red-400 block mb-1">
            ⚠️ DISCLAIMER
          </span>
          This is a sample demo UI developed with provided APIs for testing &
          learning purposes only. No real data is processed. Check the developer
          console for API logs.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
