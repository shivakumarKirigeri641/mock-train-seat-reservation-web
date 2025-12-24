import React, { useState, useEffect, useCallback } from "react";
import ServerPeLogo from "../images/ServerPe_Logo.jpg";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { removeloggedInUser } from "../store/slices/loggedInUserSlice";
import { useDispatch, useSelector } from "react-redux";

// --- NavItem Component Definition ---
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

const WalletAndRechargesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for data
  const [recharges, setRecharges] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [activePlan, setActivePlan] = useState("Free");

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [rechargePage, setRechargePage] = useState(1);
  const [deductionPage, setDeductionPage] = useState(1);
  const itemsPerPage = 10;

  const userdetails = useSelector((store) => store.loggedInUser);

  // --- REFACTORED: Fetch Logic wrapped in useCallback ---
  const fetchWalletData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/mockapis/serverpeuser/loggedinuser/wallet-recharges`,
        { withCredentials: true }
      );
      const data = response.data.data;

      // 1. Set Wallet Balance & Plan
      const totalCredits =
        (data.user_details.outstanding_apikey_count || 0) +
        (data.user_details.outstanding_apikey_count_free || 0);
      setWalletBalance(totalCredits);
      setActivePlan(data.user_details.price_name || "Free");

      // 2. Process Credits (Recharges)
      const creditsData = (data.credit_details || [])
        .map((c) => ({
          id: `CRD_${c.credit_id}`,
          date: new Date(c.credited_on).toLocaleString(),
          description: `Plan: ${c.price_name}`,
          amount: `+${c.price_name === "Free" ? "Free Credits" : "Credits"}`,
          cost: `₹${c.price}`,
          api_calls: `${c.api_calls_count}`,
          status: c.transaction_status ? "Success" : "Failed",
          rawDate: new Date(c.credited_on),
        }))
        .sort((a, b) => b.rawDate - a.rawDate);

      setRecharges(creditsData);

      // 3. Process Debits (Deductions)
      const debitsData = (data.debit_details || [])
        .map((d) => ({
          id: `DBT_${d.debit_id}`,
          date: new Date(d.debited_on).toLocaleString(),
          description: "API Usage",
          amount: `-${d.api_call_deduction}`,
          responseStatus: d.response_status,
          ip: d.ip_address,
          status: d.response_status === 200 ? "Success" : "Failed",
          rawDate: new Date(d.debited_on),
        }))
        .sort((a, b) => b.rawDate - a.rawDate);

      setDeductions(debitsData);
    } catch (error) {
      console.error("Wallet Fetch Error:", error);

      if (error.response && error.response.status === 401) {
        // Session Expired
        dispatch(removeloggedInUser());
        navigate("/user-login");
      } else if (error.code === "ERR_NETWORK") {
        // Network Error
        setError(
          "Network Error: Unable to retrieve wallet details. Please check your connection."
        );
      } else {
        // Generic Error
        setError("Failed to load wallet transactions. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, navigate]);

  // Initial Fetch
  useEffect(() => {
    if (!userdetails) {
      navigate("/user-login");
    } else {
      fetchWalletData();
    }
  }, [userdetails, navigate, fetchWalletData]);

  // Pagination Logic
  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  // Mock Download Function
  const downloadInvoice = async (txn) => {
    response = await axios.get(
      `/mockapis/serverpeuser/loggedinuser/invoices/download/${txn?.id}`,
      { responseType: "blob", withCredentials: true }
    );

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `ServerPe_Invoice_${txn?.id}.pdf`;
    document.body.appendChild(a);
    a.click();

    a.remove();
  };

  // ---------------- LOADING STATE ----------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center shadow-lg border border-gray-700">
            <span className="text-3xl">⚡</span>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-white">
              Loading Wallet
            </h3>
            <p className="text-sm text-gray-400 font-mono">
              Fetching transactions...
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
              onClick={fetchWalletData}
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
              <NavItem
                to="/wallet-recharge"
                label="Wallet & Recharge"
                active={true}
              />
              <NavItem to="/give-feedback" label="Give feedback" />
              <NavItem to="/profile" label="Profile" />
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
                className="block px-4 py-3 bg-gray-700 text-white rounded-lg"
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
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg"
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
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Wallet Overview Card */}
        <div className="bg-gradient-to-r from-gray-800 to-indigo-900/40 border border-gray-700 rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg
              className="w-40 h-40 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">
                Available Credits
              </p>
              <h1 className="text-5xl font-extrabold text-white mt-2">
                {walletBalance}
              </h1>
              <p className="text-indigo-300 text-sm mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Plan Active: {activePlan}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/api-pricing")}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Credits
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 1: RECHARGES (CREDITS) --- */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Recharge History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Cost</th>
                  <th className="px-6 py-4">Api calls credited</th>
                  <th className="px-6 py-4 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {recharges.length > 0 ? (
                  getPaginatedData(recharges, rechargePage).map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {txn.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {txn.date}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-300">
                        {txn.description}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400">
                        {txn.amount}
                      </td>
                      <td className="px-6 py-4">{txn.cost}</td>
                      <td className="px-6 py-4">{txn.api_calls}</td>
                      <td className="px-6 py-4 text-center">
                        {txn?.description.toLowerCase().includes("free") ? (
                          <div></div>
                        ) : (
                          <button
                            onClick={() => downloadInvoice(txn)}
                            className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-lg transition-all"
                            title="Download Invoice"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No recharges found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {recharges.length > itemsPerPage && (
            <div className="bg-gray-900/30 px-6 py-4 border-t border-gray-700 flex justify-between items-center">
              <span className="text-xs text-gray-500">Page {rechargePage}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setRechargePage((p) => Math.max(1, p - 1))}
                  disabled={rechargePage === 1}
                  className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setRechargePage((p) => p + 1)}
                  disabled={recharges.length <= rechargePage * itemsPerPage}
                  className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- SECTION 2: DEDUCTIONS (USAGE) --- */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Usage Deductions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Credits</th>
                  <th className="px-6 py-4">Status Code</th>
                  <th className="px-6 py-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {deductions.length > 0 ? (
                  getPaginatedData(deductions, deductionPage).map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {txn.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {txn.date}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-300">
                        {txn.description}
                      </td>
                      <td className="px-6 py-4 font-bold text-orange-400">
                        {txn.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            txn.responseStatus === 200
                              ? "bg-green-900/30 text-green-400"
                              : "bg-red-900/30 text-red-400"
                          } border border-gray-600`}
                        >
                          {txn.responseStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{txn.ip}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No usage deductions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {deductions.length > itemsPerPage && (
            <div className="bg-gray-900/30 px-6 py-4 border-t border-gray-700 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Page {deductionPage}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeductionPage((p) => Math.max(1, p - 1))}
                  disabled={deductionPage === 1}
                  className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setDeductionPage((p) => p + 1)}
                  disabled={deductions.length <= deductionPage * itemsPerPage}
                  className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WalletAndRechargesPage;
