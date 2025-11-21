import React, { useState } from "react";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [state, setState] = useState("");
  const [otp, setOtp] = useState("");
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

    alert("Logged in successfully!");
    navigate("/user-home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Optional Icon */}
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-blue-600 opacity-80"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2a5 5 0 015 5v2h1a3 3 0 013 3v6a3 3 0 01-3 3H6a3 3 0 01-3-3v-6a3 3 0 013-3h1V7a5 5 0 015-5z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          Login to Your Account
        </h2>

        {step === "form" && (
          <>
            {/* Username */}
            <div className="mb-4">
              <label className="text-sm font-medium">Username</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Mobile */}
            <div className="mb-4">
              <label className="text-sm font-medium">Mobile Number</label>
              <input
                type="tel"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Enter 10-digit mobile"
                value={mobile}
                maxLength={10}
                onChange={(e) => setMobile(e.target.value)}
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* State */}
            <div className="mb-6">
              <label className="text-sm font-medium">State</label>
              <select
                className="w-full mt-1 px-4 py-2 border rounded-lg bg-white focus:ring focus:ring-blue-300"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">Select state</option>
                {indianStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>

            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow transition"
            >
              Send OTP
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <p className="text-gray-700 text-sm text-center mb-3">
              OTP has been sent to{" "}
              <span className="font-semibold">{mobile}</span>
            </p>

            {/* OTP Field */}
            <div className="mb-4">
              <label className="text-sm font-medium">Enter OTP</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Enter 4-6 digit OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {errors.otp && (
                <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
              )}
            </div>

            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold shadow transition"
            >
              Verify OTP
            </button>

            <button
              onClick={() => setStep("form")}
              className="w-full mt-3 text-blue-600 text-sm underline"
            >
              Change mobile number?
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
