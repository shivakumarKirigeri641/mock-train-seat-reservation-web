import React, { useState, useEffect, useCallback } from "react";
import ServerPeLogo from "../images/ServerPe_Logo.jpg";
import { Link, useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import loadRazorpay from "../utils/loadRazorPay";
import { removeloggedInUser } from "../store/slices/loggedInUserSlice";

// --- NavItem Component ---
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

// --- Error Modal ---
const ErrorModal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-gray-800 border border-red-500/50 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
      <div className="w-16 h-16 bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white text-center mb-2">Error</h3>
      <p className="text-gray-400 text-center mb-6 text-sm">{message}</p>
      <button
        onClick={onClose}
        className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-semibold transition-colors"
      >
        Close
      </button>
    </div>
  </div>
);

const SummaryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const userdetails = useSelector((store) => store.loggedInUser);
  const selectedPlan = location.state?.plan;

  // Form State and Error State
  const [formData, setFormData] = useState({
    user_name: "",
    myemail: "",
    mobile_number: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8888";

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/mockapis/serverpeuser/loggedinuser/user-profile`,
        { withCredentials: true }
      );
      const data = response?.data?.data || {};
      setFormData({
        user_name: data.user_name || "",
        myemail: data.myemail || "",
        mobile_number: data.mobile_number || "",
        address: data.address || "",
      });
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(removeloggedInUser());
        navigate("/user-login");
      } else {
        setPageError("Failed to load details.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL, dispatch, navigate]);

  useEffect(() => {
    if (!userdetails) {
      navigate("/");
      return;
    }
    fetchProfileData();
  }, [userdetails, navigate, fetchProfileData]);

  const validateForm = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formData.user_name.trim()) errors.user_name = "Name is required";
    if (!formData.myemail.trim()) {
      errors.myemail = "Email is required";
    } else if (!emailRegex.test(formData.myemail)) {
      errors.myemail = "Invalid email format";
    }
    if (!formData.mobile_number.trim()) {
      errors.mobile_number = "Mobile number is required";
    } else if (!phoneRegex.test(formData.mobile_number)) {
      errors.mobile_number = "Enter a valid 10-digit Indian mobile number";
    }
    if (!formData.address.trim())
      errors.address = "Billing address is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop if validation fails

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      console.log("loading razorpay");
      const res = await loadRazorpay();
      console.log("loading razorpayj....");
      if (!res) {
        setErrorMsg("Razorpay SDK failed to load.");
        setIsProcessing(false);
        return;
      }

      const orderRes = await axios.post(
        `${BASE_URL}/mockapis/serverpeuser/loggedinuser/razorpay/order`,
        { amount: selectedPlan.price },
        { withCredentials: true }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "ServerPe",
        description: `Plan: ${selectedPlan.price_name}`,
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${BASE_URL}/mockapis/serverpeuser/loggedinuser/razorpay/verify`,
              { ...response, ...formData },
              { withCredentials: true }
            );
            if (verifyRes?.data?.statuscode) {
              navigate(
                `/payment-success?payment_id=${response.razorpay_payment_id}`,
                { state: formData }
              );
            } else {
              setErrorMsg(
                "Payment verification failed. Please contact support."
              );
            }
          } catch (err) {
            setErrorMsg("An error occurred during verification.");
          }
        },
        prefill: {
          name: formData.user_name,
          email: formData.myemail,
          contact: formData.mobile_number,
        },
        theme: { color: "#4f46e5" },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      console.log(options);
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setErrorMsg(
        `Failed to initiate payment. Possible error: Error code:${error?.response?.status}, message:${error?.response?.data?.message}`
      );
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {errorMsg && (
        <ErrorModal message={errorMsg} onClose={() => setErrorMsg(null)} />
      )}

      <nav className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img src={ServerPeLogo} alt="Logo" className="h-10" />
          <div className="hidden lg:flex space-x-4">
            <NavItem to="/user-home" label="Home" />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full p-6">
        <h1 className="text-2xl font-bold mb-6">Invoice & Payment</h1>

        <form
          onSubmit={handlePayment}
          noValidate
          className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl space-y-6"
        >
          {/* Plan Summary Card */}
          <div className="p-4 bg-indigo-900/20 rounded-xl border border-indigo-500/30">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-sm">Selected Plan</span>
              <span className="font-bold text-indigo-400">
                {selectedPlan?.price_name}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-lg font-bold">Payable Amount</span>
              <span className="text-3xl font-extrabold text-green-400">
                ₹{selectedPlan?.price}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase text-gray-500 tracking-widest border-b border-gray-700 pb-2">
              Billing Information
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-900 border ${
                    formErrors.user_name ? "border-red-500" : "border-gray-700"
                  } rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none`}
                  placeholder="Enter your full name"
                />
                {formErrors.user_name && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {formErrors.user_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="myemail"
                  value={formData.myemail}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-900 border ${
                    formErrors.myemail ? "border-red-500" : "border-gray-700"
                  } rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none`}
                  placeholder="email@example.com"
                />
                {formErrors.myemail && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {formErrors.myemail}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Mobile Number (+91)
                </label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-900 border ${
                    formErrors.mobile_number
                      ? "border-red-500"
                      : "border-gray-700"
                  } rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none`}
                  placeholder="9876543210"
                />
                {formErrors.mobile_number && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {formErrors.mobile_number}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Billing Address
                </label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-900 border ${
                    formErrors.address ? "border-red-500" : "border-gray-700"
                  } rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none`}
                  placeholder="Street, City, State, ZIP"
                />
                {formErrors.address && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-700">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Proceed to Payment"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-gray-700/50 hover:bg-gray-700 text-gray-300 py-3 rounded-xl font-medium transition-colors"
            >
              Cancel & Go Back
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SummaryPage;
