import React, { useState } from "react";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const [username, setUsername] = useState("Shiva");
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("9876543210");
  const [state, setState] = useState("Karnataka");
  const [otp, setOtp] = useState("1234");
  const [step, setStep] = useState("form"); // form → otp
  const [errors, setErrors] = useState({});

  const indianStates = [
    "Karnataka",
    "Tamil Nadu",
    "Maharashtra",
    "Kerala",
    "Telangana",
    "Andhra Pradesh",
    "Delhi",
    "Gujarat",
    "Rajasthan",
    "Uttar Pradesh",
  ];

  const validateForm = () => {
    let err = {};

    if (!username.trim()) err.username = "Username is required.";
    if (!mobile.match(/^[6-9]\d{9}$/))
      err.mobile = "Enter valid 10-digit mobile number.";
    if (!state) err.state = "Select your state.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const sendOtp = () => {
    if (!validateForm()) return;

    // Placeholder (you will replace with actual API call)
    console.log("Send OTP to:", mobile);

    setStep("otp");
  };

  const verifyOtp = () => {
    if (!otp.match(/^\d{4,6}$/)) {
      setErrors({ otp: "Enter valid OTP." });
      return;
    }

    console.log("OTP Verified:", otp);
    // placeholder — you will replace

    // Using simple alert/log, usually you'd use a toast here
    console.log("Logged in successfully!");
    navigate("/user-home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 selection:bg-indigo-500 selection:text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 transition-all">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-gray-900 rounded-full border border-gray-700 shadow-inner">
            <svg
              className="w-10 h-10 text-indigo-500"
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
        </div>

        {/* TITLE & TAGLINE */}
        <h2 className="text-xl md:text-2xl font-bold text-center mb-1 text-white leading-tight">
          Welcome to Chedkudla mock train reservation system
        </h2>
        <p className="text-center text-indigo-400 text-xs font-medium mb-6">
          - your mock seat is pakka
        </p>

        <p className="text-center text-gray-400 text-sm mb-8">
          {step === "form"
            ? "Please sign in to access your dashboard"
            : "Verify your identity to continue"}
        </p>

        {step === "form" && (
          <div className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1 ml-1">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="Enter 10-digit mobile"
                value={mobile}
                maxLength={10}
                onChange={(e) => setMobile(e.target.value)}
              />
              {errors.mobile && (
                <p className="text-red-400 text-xs mt-1 ml-1">
                  {errors.mobile}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                State
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 appearance-none transition-all cursor-pointer"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="" className="text-gray-500">
                    Select state
                  </option>
                  {indianStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
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
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.state}</p>
              )}
            </div>

            <button
              onClick={sendOtp}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all transform active:scale-[0.98] mt-2"
            >
              Send OTP
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-6">
            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-3 text-center">
              <p className="text-indigo-300 text-sm">
                OTP sent to <span className="font-bold">{mobile}</span>
              </p>
            </div>

            {/* OTP Field */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                One Time Password
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 text-center tracking-[0.5em] text-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="••••••"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {errors.otp && (
                <p className="text-red-400 text-xs mt-1 text-center">
                  {errors.otp}
                </p>
              )}
            </div>

            <button
              onClick={verifyOtp}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all transform active:scale-[0.98]"
            >
              Verify & Login
            </button>

            <div className="text-center pt-2">
              <button
                onClick={() => setStep("form")}
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
                Use different number
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DISCLAIMER FOOTER */}
      <div className="mt-8 max-w-md text-center px-4 opacity-80">
        <p className="text-xs text-gray-500 leading-relaxed border border-gray-700 p-3 rounded-lg bg-gray-800/50">
          <span className="font-bold text-red-400 block mb-1">DISCLAIMER:</span>
          This is the sample demo UI developed with provided APIs, this is
          completely for testing & learning purposes only. The API request &
          response can be viewed in devloper console (Ctrl+Shift+i).
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
