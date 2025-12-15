import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { removeloggedInUser } from "../store/slices/loggedInUserSlice";
import { useDispatch } from "react-redux";
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
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [rechargePage, setRechargePage] = useState(1);
  const [deductionPage, setDeductionPage] = useState(1);
  const itemsPerPage = 10;

  // const BASE_URL = "https://serverpe.in";
  const BASE_URL = "http://localhost:8888"; // Local dev

  useEffect(() => {
    const fetchWalletData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/mockapis/serverpeuser/loggedinuser/wallet-recharges`,
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
        const creditsData = data.credit_details
          .map((c) => ({
            id: `CRD_${c.credit_id}`,
            date: new Date(c.credited_on).toLocaleString(),
            description: `Plan: ${c.price_name}`,
            amount: `+${c.price_name === "Free" ? "Free Credits" : "Credits"}`,
            cost: `₹${c.price}`,
            status: c.transaction_status ? "Success" : "Failed",
            rawDate: new Date(c.credited_on),
          }))
          .sort((a, b) => b.rawDate - a.rawDate);

        setRecharges(creditsData);

        // 3. Process Debits (Deductions)
        const debitsData = data.debit_details
          .map((d) => ({
            id: `DBT_${d.debit_id}`,
            date: new Date(d.debited_on).toLocaleString(),
            description: "API Usage",
            amount: `-${d.api_call_deduction}`,
            responseStatus: d.response_status,
            ip: d.ip_address,
            status: d.response_status === 200 ? "Success" : "Failed", // Assuming 200 is success
            rawDate: new Date(d.debited_on),
          }))
          .sort((a, b) => b.rawDate - a.rawDate);

        setDeductions(debitsData);
      } catch (error) {
        if (error.status !== 401) {
          alert("session expired. Please re-login!");
        }
        dispatch(removeloggedInUser());
        navigate("/user-login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  // Pagination Logic
  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  // Mock Download Function
  const downloadInvoice = (txn) => {
    const invoiceContent = `
      INVOICE #INV-${txn.id}
      ----------------------
      Date: ${txn.date}
      Item: ${txn.description}
      Amount: ${txn.cost}
      Status: Paid
    `;
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${txn.id}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* --- NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 transition-all">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/user-home")}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-xl">⚡</span>
              </div>
              <div className="font-bold text-xl tracking-tighter text-white">
                ServerPe<span className="text-indigo-500">.in</span>
              </div>
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
                {isLoading ? "..." : walletBalance}
              </h1>
              <p className="text-indigo-300 text-sm mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Plan Active: {isLoading ? "..." : activePlan}
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
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : recharges.length > 0 ? (
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
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold bg-emerald-900/30 text-emerald-400 border border-emerald-500/20`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
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
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : deductions.length > 0 ? (
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
