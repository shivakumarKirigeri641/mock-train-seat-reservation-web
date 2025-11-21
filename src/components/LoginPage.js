import React, { useState } from "react";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Validate mobile number
  const handleSendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");

    // Placeholder: Replace with actual API call
    console.log("Send OTP to:", mobile);

    setStep(2);
  };

  // Validate OTP
  const handleVerifyOtp = () => {
    if (!/^\d{4,6}$/.test(otp)) {
      setError("Enter a valid OTP (4-6 digits).");
      return;
    }
    setError("");
    // Placeholder: Replace with actual API call
    console.log("OTP Verified:", otp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login to Continue
        </h1>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Enter Mobile */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
                placeholder="Enter your 10-digit mobile number"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="Enter the OTP sent to your mobile"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none tracking-widest"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold transition"
            >
              Verify OTP & Login
            </button>

            <button
              onClick={() => {
                setStep(1);
                setOtp("");
              }}
              className="w-full text-blue-600 text-sm font-medium underline hover:text-blue-800"
            >
              Change Mobile Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
