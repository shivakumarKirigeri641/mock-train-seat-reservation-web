import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addloggedInUser } from "../store/slices/loggedInUserSlice";
import ServerPeLogo from "../images/ServerPe_Logo.svg";
import "../styles/loginpage.css"; // Custom CSS for animations

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State Management
  const [mobile, setMobile] = useState("9886122415");
  const [otp, setOtp] = useState("1234");
  const [step, setStep] = useState("mobile"); // mobile | otp
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [mobileForOtp, setMobileForOtp] = useState("");

  // OTP Timer countdown
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Clear specific error when user types
  useEffect(() => {
    if (mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
  }, [mobile]);

  useEffect(() => {
    if (otp) setErrors((prev) => ({ ...prev, otp: "" }));
  }, [otp]);

  useEffect(() => {
    if (agreedToTerms) setErrors((prev) => ({ ...prev, terms: "" }));
  }, [agreedToTerms]);

  // Validate mobile number format
  const validateMobile = (mobileNum) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobileNum);
  };

  // Validate OTP format
  const validateOTP = (otpValue) => {
    const otpRegex = /^\d{4,6}$/;
    return otpRegex.test(otpValue);
  };

  // Handle Send OTP
  const handleSendOtp = async () => {
    let err = {};

    // Validation
    if (!mobile.trim()) {
      err.mobile = "Mobile number is required.";
    } else if (!validateMobile(mobile)) {
      err.mobile =
        "Please enter a valid 10-digit mobile number starting with 6-9.";
    }

    if (!agreedToTerms) {
      err.terms = "You must agree to the Terms & Conditions to proceed.";
    }

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      // API Call: Send OTP
      const response = await axios.post(
        `${process.env.BACKEND_URL}/mockapis/serverpeuser/send-otp`,
        {
          mobile_number: mobile,
        },
        { withCredentials: true }
      );

      if (response.data.successstatus || response.status === 200) {
        setStep("otp");
        setMobileForOtp(mobile);
        setOtp("");
        setOtpTimer(180); // 2 minutes timer
        setSuccessMessage(`OTP sent to ${mobile}. Valid for 3 minutes.`);
      } else {
        setErrors({
          form: response.data.error || "Failed to send OTP. Please try again.",
        });
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      let errorMsg = "Network error. Please try again.";

      if (error.response?.status === 400) {
        errorMsg =
          error.response?.data?.error ||
          "Invalid mobile number. Please check and try again.";
      } else if (error.response?.status === 429) {
        errorMsg =
          "Too many attempts. Please wait a few minutes before trying again.";
      } else if (error.response?.status === 500) {
        errorMsg = "Server error. Please try again later.";
      }

      setErrors({ form: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async () => {
    let err = {};

    // Validation
    if (!otp.trim()) {
      err.otp = "OTP is required.";
    } else if (!validateOTP(otp)) {
      err.otp = "Please enter a valid OTP (4-6 digits).";
    }

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // API Call: Verify OTP
      const response = await axios.post(
        `${process.env.BACKEND_URL}/mockapis/serverpeuser/verify-otp`,
        {
          mobile_number: mobileForOtp,
          otp: otp,
        },
        { withCredentials: true }
      );

      if (response.data.successstatus || response.status === 200) {
        // Store user details in Redux
        dispatch(addloggedInUser(response?.data?.data));
        // Navigate to home with success animation
        setTimeout(() => {
          navigate("/user-home");
        }, 500);
      } else {
        setErrors({
          otp:
            response.data.error || "Invalid OTP. Please check and try again.",
        });
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      let errorMsg = "Verification failed. Please try again.";

      if (error.response?.status === 400) {
        errorMsg = "Invalid OTP. Please check and try again.";
      } else if (error.response?.status === 401) {
        errorMsg = "OTP expired. Please request a new one.";
      } else if (error.response?.status === 429) {
        errorMsg = "Too many attempts. Please wait before trying again.";
      }

      setErrors({ otp: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Edit Mobile Number
  const handleEditMobile = () => {
    setStep("mobile");
    setOtp("");
    setOtpTimer(0);
    setErrors({});
    setSuccessMessage("");
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" && !isLoading) {
      action();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header Section */}
      <div className="w-full max-w-2xl mb-4 relative z-10 animate-fadeInDown">
        <div className="text-center mb-2">
          <img
            src={ServerPeLogo}
            alt="ServerPe Logo"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 mb-2">
            ServerPe App Solutions
          </h1>
          <p className="text-gray-300 text-lg font-semibold mb-1">
            Desi API to challenge your UI
          </p>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700/50 z-10 animate-slideUp">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 rounded-3xl pointer-events-none group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-500"></div>

        {/* Header Icon */}
        <div className="flex justify-center mb-8 animate-bounceIn">
          <div className="p-4 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full border border-indigo-500/30 shadow-lg shadow-indigo-500/10 group hover:shadow-indigo-500/30 transition-all duration-300">
            <svg
              className="w-10 h-10 text-indigo-400 group-hover:text-indigo-300 group-hover:scale-110 transition-all duration-300"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Secure Login</h2>
          <p className="text-gray-400 text-sm">
            Enter your mobile number to get started with your account
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm text-center animate-slideDown">
            ✓ {successMessage}
          </div>
        )}

        {/* Global Form Error */}
        {errors.form && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm text-center animate-shake">
            ✕ {errors.form}
          </div>
        )}

        {/* Form Content */}
        <div className="relative overflow-hidden">
          {/* STEP 1: MOBILE NUMBER */}
          {step === "mobile" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Mobile Number Input */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-900/40 border ${
                      errors.mobile
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-600/50 focus:border-indigo-500 focus:ring-indigo-500/20"
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300`}
                    placeholder="9876543210"
                    value={mobile}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setMobile(value);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, handleSendOtp)}
                    disabled={isLoading}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-red-400 text-xs mt-2 ml-1 animate-slideDown flex items-center gap-1">
                    <span>✕</span> {errors.mobile}
                  </p>
                )}
                {mobile && validateMobile(mobile) && !errors.mobile && (
                  <p className="text-emerald-400 text-xs mt-2 ml-1 animate-fadeIn flex items-center gap-1">
                    <span>✓</span> Valid mobile number
                  </p>
                )}
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start gap-3 p-3 bg-gray-900/30 rounded-lg border border-gray-700/30 hover:border-gray-600/30 transition-all">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-5 h-5 mt-0.5 bg-gray-900 border border-gray-600 rounded cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:ring-offset-gray-800 text-indigo-600 accent-indigo-600 transition-all"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <div className="flex-1 text-sm">
                  <label
                    htmlFor="terms"
                    className="text-gray-300 cursor-pointer"
                  >
                    I agree to the{" "}
                    <a
                      href="/api-terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline font-semibold transition-colors"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline font-semibold transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
              {errors.terms && (
                <p className="text-red-400 text-xs animate-slideDown flex items-center gap-1 ml-1">
                  <span>✕</span> {errors.terms}
                </p>
              )}

              {/* Send OTP Button */}
              <button
                onClick={handleSendOtp}
                disabled={isLoading || !mobile}
                className="w-full relative group bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:from-indigo-800 disabled:to-indigo-800 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-center gap-2 relative z-10">
                  {isLoading ? (
                    <>
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
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Send OTP Code
                    </>
                  )}
                </div>
              </button>

              {/* Info Box */}
              <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg text-center">
                <p className="text-xs text-gray-400">
                  💡 OTP will be sent via SMS. Valid for 3 minutes.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === "otp" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Verification Info */}
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
                <p className="text-gray-300 text-sm mb-1">
                  Enter the code sent to
                </p>
                <p className="font-bold text-indigo-300 text-lg">
                  {mobileForOtp}
                </p>
              </div>

              {/* OTP Input */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 text-center">
                  Enter OTP Code
                </label>
                <input
                  autoFocus
                  type="text"
                  inputMode="numeric"
                  className={`w-full px-4 py-4 bg-gray-900/40 border ${
                    errors.otp
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600/50 focus:border-emerald-500 focus:ring-emerald-500/20"
                  } rounded-xl text-white placeholder-gray-500 text-center tracking-[0.3em] text-3xl font-mono focus:outline-none focus:ring-2 transition-all duration-300`}
                  placeholder="0000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setOtp(value);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, handleVerifyOtp)}
                  disabled={isLoading}
                />
                {errors.otp && (
                  <p className="text-red-400 text-xs mt-2 text-center animate-slideDown flex items-center justify-center gap-1">
                    <span>✕</span> {errors.otp}
                  </p>
                )}
              </div>

              {/* Timer */}
              <div className="text-center">
                {otpTimer > 0 ? (
                  <p className="text-sm text-gray-400">
                    Resend OTP in{" "}
                    <span className="font-bold text-indigo-400 text-lg">
                      {otpTimer}s
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || !otp}
                className="w-full relative group bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-emerald-800 disabled:to-emerald-800 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-center gap-2 relative z-10">
                  {isLoading ? (
                    <>
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Verify & Login
                    </>
                  )}
                </div>
              </button>

              {/* Edit Mobile Button */}
              <button
                onClick={handleEditMobile}
                className="w-full py-2.5 text-gray-400 hover:text-indigo-400 border border-gray-700/50 hover:border-indigo-500/30 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
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
                Edit Mobile Number
              </button>
            </div>
          )}
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8 pt-6 border-t border-gray-700/30">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center justify-center gap-2 mx-auto group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Back to Home
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-10 max-w-md text-center px-4 relative z-10 animate-fadeInUp">
        <div className="p-4 bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30 rounded-lg">
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            <span className="block font-bold text-indigo-300 mb-2">
              🔒 Secure & Private
            </span>
            Your data is encrypted and safe. This demo uses mock APIs for
            testing purposes only.
          </p>
          <div className="flex justify-center gap-3 pt-3 border-t border-gray-700/30">
            <a
              href="/api-terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-indigo-400 transition-colors"
            >
              Terms
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-indigo-400 transition-colors"
            >
              Privacy
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="/contact-me"
              className="text-xs text-gray-400 hover:text-indigo-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
