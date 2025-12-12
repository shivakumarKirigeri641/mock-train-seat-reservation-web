import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const WalletAndRechargesPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Mock Data: Transactions
  const [transactions] = useState([
    {
      id: "TXN_1001",
      date: "2025-11-01 10:30 AM",
      type: "Recharge",
      description: "Purchased 'Wow' Plan",
      amount: "+1200 Credits",
      cost: "₹179",
      status: "Success",
    },
    {
      id: "USG_8821",
      date: "2025-11-01 11:15 AM",
      type: "Deduction",
      description: "API Call: /trains/search",
      amount: "-1 Credit",
      cost: "N/A",
      status: "Success",
    },
    {
      id: "USG_8822",
      date: "2025-11-01 11:20 AM",
      type: "Deduction",
      description: "API Call: /pincode/details",
      amount: "-1 Credit",
      cost: "N/A",
      status: "Success",
    },
    {
      id: "TXN_1002",
      date: "2025-10-25 09:00 AM",
      type: "Recharge",
      description: "Purchased 'Tiny' Plan",
      amount: "+100 Credits",
      cost: "₹19",
      status: "Success",
    },
    {
      id: "USG_8823",
      date: "2025-10-25 09:10 AM",
      type: "Deduction",
      description: "API Call: /cars/specs",
      amount: "-1 Credit",
      cost: "N/A",
      status: "Failed",
    },
    {
      id: "TXN_1003",
      date: "2025-10-20 02:00 PM",
      type: "Recharge",
      description: "Purchased 'Chotu' Plan",
      amount: "+500 Credits",
      cost: "₹79",
      status: "Failed", // Failed recharge shouldn't have invoice
    },
  ]);

  // Filtering Logic
  const filteredTransactions = transactions.filter((txn) => {
    const matchesType =
      filterType === "All" ||
      (filterType === "Recharge" && txn.type === "Recharge") ||
      (filterType === "Usage" && txn.type === "Deduction");

    const matchesStatus = filterStatus === "All" || txn.status === filterStatus;

    return matchesType && matchesStatus;
  });

  // Mock Download Function
  const downloadInvoice = (txn) => {
    // In a real app, this would trigger a PDF download from an API endpoint
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
              <NavItem to="/usage" label="API Usage" />
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
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        {/* Wallet Overview Card */}
        <div className="bg-gradient-to-r from-gray-800 to-indigo-900/40 border border-gray-700 rounded-2xl p-8 mb-10 shadow-xl relative overflow-hidden">
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
              <h1 className="text-5xl font-extrabold text-white mt-2">1,597</h1>
              <p className="text-indigo-300 text-sm mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Plan Active: Wow (Unlimited Validity)
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

        {/* Transaction History Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
          {/* Filters Header */}
          <div className="p-6 border-b border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Transaction History
            </h2>

            <div className="flex flex-wrap gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-900 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
              >
                <option value="All">All Types</option>
                <option value="Recharge">Recharges</option>
                <option value="Usage">Deductions</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-900 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
              >
                <option value="All">All Status</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Credits</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn) => (
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
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            txn.type === "Recharge"
                              ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/20"
                              : "bg-orange-900/30 text-orange-400 border border-orange-500/20"
                          }`}
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 font-bold ${
                          txn.type === "Recharge"
                            ? "text-emerald-400"
                            : "text-gray-400"
                        }`}
                      >
                        {txn.amount}
                      </td>
                      <td className="px-6 py-4">{txn.cost}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`flex items-center gap-1.5 ${
                            txn.status === "Success"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              txn.status === "Success"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {txn.status}
                        </span>
                      </td>
                      {/* Invoice Column */}
                      <td className="px-6 py-4 text-center">
                        {txn.type === "Recharge" && txn.status === "Success" ? (
                          <button
                            onClick={() => downloadInvoice(txn)}
                            className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-lg transition-all group"
                            title="Download Invoice"
                          >
                            <svg
                              className="w-5 h-5 group-hover:scale-110 transition-transform"
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
                        ) : (
                          <span className="text-gray-700">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No transactions found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-900/30 px-6 py-4 border-t border-gray-700 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {filteredTransactions.length} entries
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300 disabled:opacity-50"
                disabled
              >
                Prev
              </button>
              <button className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300 hover:bg-gray-700">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WalletAndRechargesPage;
