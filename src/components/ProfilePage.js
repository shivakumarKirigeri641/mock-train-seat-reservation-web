import React, { useEffect, useState, useCallback } from "react";
import ServerPeLogo from "../images/ServerPe_Logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { removeloggedInUser } from "../store/slices/loggedInUserSlice";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // User State
  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    state: "",
    email: "",
    address: "",
    memberSince: "",
    lastLogin: "",
  });

  const [indianStates, setIndianStates] = useState([]);

  // Action States
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // --- NEW: Page Loading & Error States ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userdetails = useSelector((store) => store.loggedInUser);
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  // --- REFACTORED: Fetch Logic wrapped in useCallback ---
  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch Profile and States in parallel
      const [profileResponse, statesResponse] = await Promise.all([
        axios.get(
          `${BASE_URL}/mockapis/serverpeuser/loggedinuser/user-profile`,
          { withCredentials: true }
        ),
        axios.get(`${BASE_URL}/mockapis/serverpeuser/states`, {
          withCredentials: true,
        }),
      ]);

      setProfile(profileResponse?.data?.data);
      setIsEmailVerified(
        profileResponse?.data?.data?.myemail_veifystatus || false
      );
      setIndianStates(statesResponse?.data?.data || []);
    } catch (error) {
      console.error("Profile Fetch Error:", error);

      if (error.response && error.response.status === 401) {
        dispatch(removeloggedInUser());
        navigate("/user-login");
      } else if (error.code === "ERR_NETWORK") {
        setError(
          "Network Error: Unable to load profile data. Please check your internet connection."
        );
      } else {
        setError("Failed to load profile information. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL, dispatch, navigate]);

  // Initial Fetch
  useEffect(() => {
    if (!userdetails) {
      navigate("/user-login");
    } else {
      fetchProfileData();
    }
  }, [userdetails, navigate, fetchProfileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    // Reset verification if email changes
    if (name === "email") {
      setIsEmailVerified(false);
      setOtpSent(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!profile.myemail) return;
    setOtpSent(true);

    try {
      await axios.post(
        `${BASE_URL}/mockapis/serverpeuser/loggedinuser/verify-email-otp-request`,
        { email: profile?.myemail },
        { withCredentials: true }
      );
      alert("OTP sent to your email!");
    } catch (error) {
      console.error("Email verification failed", error);
      setOtpSent(false);
      alert("Failed to send OTP.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await axios.put(
        `${BASE_URL}/mockapis/serverpeuser/loggedinuser/update-profile`,
        {
          name: profile.user_name,
          state: profile.state,
          email: profile.myemail,
          address: profile.address,
        },
        { withCredentials: true }
      );
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const NavItem = ({ to, label, active = false }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
          : "text-gray-300 hover:text-white hover:bg-gray-800"
      }`}
    >
      {label}
    </Link>
  );

  // ---------------- LOADING STATE ----------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-24 h-24 bg-gray-800 rounded-full border border-gray-700"></div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-white">
              Loading Profile
            </h3>
            <p className="text-sm text-gray-400 font-mono">
              Fetching user details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ERROR STATE ----------------
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-6">
        <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Unavailable</h3>
          <p className="text-gray-400 mb-8">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchProfileData}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/user-home")}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 py-3 rounded-lg font-medium transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- MAIN CONTENT ----------------
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* --- NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 transition-all">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div
              onClick={() => navigate("/user-home")}
              className="flex items-center gap-3 cursor-pointer group border-2 bg-transparent"
            >
              <img
                src={ServerPeLogo}
                alt="ServerPe Logo"
                className="w-35 h-16 group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              <NavItem to="/user-home" label="Home" />
              <NavItem to="/api-usage" label="API Usage" />
              <NavItem to="/api-documentation" label="API Documentation" />
              <NavItem to="/api-pricing" label="API Pricing" />
              <NavItem to="/wallet-recharge" label="Wallet & Recharge" />
              <NavItem to="/give-feedback" label="Give feedback" />
              <NavItem to="/profile" label="Profile" active={true} />
            </div>

            {/* Logout */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() => navigate("/logout")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
              >
                <span>Logout</span>
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-800 border-b border-gray-700 animate-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-4 flex flex-col space-y-2">
              <Link
                to="/user-home"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Home
              </Link>
              <Link
                to="/api-usage"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                API Usage
              </Link>
              <Link
                to="/api-documentation"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                API Documentation
              </Link>
              <Link
                to="/api-pricing"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                API Pricing
              </Link>
              <Link
                to="/wallet-recharge"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Wallet & Recharge
              </Link>
              <Link
                to="/give-feedback"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Give feedback
              </Link>
              <Link
                to="/profile"
                className="block px-4 py-3 bg-gray-700 text-white rounded-lg"
              >
                Profile
              </Link>
              <Link
                to="/logout"
                className="block px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg"
              >
                Logout
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="text-gray-400 mt-2">
            Manage your personal information and billing details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Basic Info */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl mb-4">
                {profile.user_name
                  ? profile?.user_name.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <h2 className="text-xl font-bold text-white">
                {profile?.user_name}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {profile?.state_name}
              </p>

              <div className="mt-6 w-full pt-6 border-t border-gray-700 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Plan</span>
                  <span className="text-white font-medium">
                    {profile?.price_name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                {/* Added Last Login & Member Since */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Joined</span>
                  <span className="text-white font-medium text-xs">
                    {profile?.created_at?.split("T")[0]}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last Login</span>
                  <span className="text-white font-medium text-xs">
                    {profile?.updated_at?.split("T")[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="md:col-span-2">
            <form
              onSubmit={handleSave}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl"
            >
              <div className="space-y-6">
                {/* Name & Mobile Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.user_name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={profile?.mobile_number}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900/50 border border-gray-700 text-gray-400 rounded-xl px-4 py-3 focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    State / Territory
                  </label>
                  <select
                    name="state"
                    value={profile.state_name}
                    disabled
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    {indianStates?.map((state) => (
                      <option key={state?.id} value={state?.state_name}>
                        {state?.state_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email & Verification */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={profile.myemail}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="absolute right-2 top-2 bottom-2 flex items-center">
                      {isEmailVerified ? (
                        <span className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-900/30 px-3 py-1.5 rounded-lg border border-green-500/30">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleVerifyEmail}
                          disabled={!profile.myemail || otpSent}
                          className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {otpSent ? "Sending..." : "Verify"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Billing Address
                    </label>
                    <span className="text-[10px] text-indigo-400 bg-indigo-900/20 px-2 py-0.5 rounded border border-indigo-500/20">
                      For Invoice Generation Only
                    </span>
                  </div>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter your full billing address..."
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  ></textarea>
                </div>

                {/* Save Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
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
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
