import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";

// --- Confetti Component ---
const ConfettiSparkles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const colors = [
      "#FFD700",
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEEAD",
    ];

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 1,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 5 - 2.5,
    });

    // Initialize particles
    for (let i = 0; i < 150; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height) {
          particles[index] = createParticle();
          particles[index].y = -10; // Reset to top
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  );
};

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

const PaymentSuccessSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userState, setUserState] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  // Retrieve user details from Redux
  const userdetails = useSelector((store) => store.loggedInUser);
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  // Get payment ID from navigation state (preferred) or URL params
  const paymentId =
    location.state?.payment_id || searchParams.get("payment_id");

  useEffect(() => {
    if (!userdetails) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch User Profile for State Info
        const profileResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/mockapis/serverpeuser/loggedinuser/user-profile`,
          { withCredentials: true }
        );

        let currentState = "";
        if (profileResponse?.data?.successstatus) {
          const profileData = profileResponse.data.data;
          setUserProfile(profileData);
          currentState = profileData.state_name;
          setUserState(currentState);
        }

        // 2. Fetch Payment Details
        if (paymentId) {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/mockapis/serverpeuser/loggedinuser/razorpay/status`,
            { razorpay_payment_id: paymentId },
            { withCredentials: true }
          );
          if (response.data?.data?.successstatus) {
            const data = response.data.data;
            //some details not fetching...contineu
            setOrderDetails({
              transaction_id: data.result_transaction.razorpay_order_id,
              amount: (data.result_transaction.amount / 100).toFixed(2),
              plan_name:
                data.result_transaction.description || "API Subscription",
              credits_added: "Applied to Account",
              date: new Date(
                data.result_transaction.created_at * 1000
              ).toLocaleString(),
              status:
                data.result_transaction.status === "captured"
                  ? "Success"
                  : data.result_transaction.status,
              email: !data.result_user_details.myemail
                ? "Not provided"
                : data.result_user_details.myemail,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch details", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userdetails, navigate, BASE_URL, paymentId]);

  // Tax Calculation Logic
  const calculateTax = () => {
    if (!orderDetails) return null;
    const totalAmount = parseFloat(orderDetails.amount);
    const baseAmount = totalAmount / 1.18;
    const totalTax = totalAmount - baseAmount;

    const isKarnataka = userState?.toLowerCase() === "karnataka";

    return {
      baseAmount: baseAmount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      isKarnataka,
      cgst: (totalTax / 2).toFixed(2),
      sgst: (totalTax / 2).toFixed(2),
      igst: totalTax.toFixed(2),
    };
  };

  const taxDetails = calculateTax();

  const handleDownloadInvoice = () => {
    if (!orderDetails || !taxDetails || !userProfile) return;

    const invoiceText = `
      INVOICE - ServerPe.in
      ------------------------------------------------
      Transaction ID: ${orderDetails.transaction_id}
      Date: ${orderDetails.date}
      Status: ${orderDetails.status}
      
      Billed To:
      Name: ${userProfile.user_name}
      Email: ${!userProfile.myemail ? "Not provided" : userProfile.myemail}
      State: ${userProfile.state_name}
      ------------------------------------------------
      Plan Item:                  ${orderDetails.plan_name}
      Base Amount:                ₹${taxDetails.baseAmount}
      
      Tax Details (18% GST):
      ${
        taxDetails.isKarnataka
          ? `CGST (9%):                  ₹${taxDetails.cgst}\n      SGST (9%):                  ₹${taxDetails.sgst}`
          : `IGST (18%):                 ₹${taxDetails.igst}`
      }
      
      ------------------------------------------------
      TOTAL PAID:                 ₹${orderDetails.amount}
      ------------------------------------------------
      `;

    const blob = new Blob([invoiceText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Invoice_${orderDetails.transaction_id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col relative overflow-hidden">
      {/* --- ADDED: Confetti Animation --- */}
      <ConfettiSparkles />

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
              <NavItem to="/wallet-recharge" label="Wallet & Recharge" />
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
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-16 flex flex-col items-center justify-center relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-20 h-20 bg-gray-800 rounded-full"></div>
            <div className="h-6 w-48 bg-gray-800 rounded"></div>
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl w-full text-center animate-fade-in-up">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-500"
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
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-400 mb-8">Thank you for your purchase.</p>

            {/* Order Details */}
            {orderDetails && taxDetails && (
              <div className="bg-gray-900/50 rounded-xl p-6 mb-8 text-left space-y-3 border border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Transaction ID</span>
                  <span className="text-white font-mono text-sm">
                    {orderDetails.transaction_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Plan Purchased</span>
                  <span className="text-indigo-400 font-medium">
                    {orderDetails.plan_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Date</span>
                  <span className="text-gray-300 text-sm">
                    {orderDetails.date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Email</span>
                  <span className="text-gray-300 text-sm">
                    {orderDetails.myemail}
                  </span>
                </div>

                <div className="border-t border-gray-700 my-2"></div>

                {/* Tax Breakup */}
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Base Amount</span>
                  <span className="text-gray-300 text-sm">
                    ₹{taxDetails.baseAmount}
                  </span>
                </div>

                {taxDetails.isKarnataka ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">CGST (9%)</span>
                      <span className="text-gray-300 text-sm">
                        ₹{taxDetails.cgst}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">SGST (9%)</span>
                      <span className="text-gray-300 text-sm">
                        ₹{taxDetails.sgst}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">IGST (18%)</span>
                    <span className="text-gray-300 text-sm">
                      ₹{taxDetails.igst}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-gray-300 font-semibold">
                    Total Paid
                  </span>
                  <span className="text-white font-bold text-lg">
                    ₹{orderDetails.amount}
                  </span>
                </div>
              </div>
            )}

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={handleDownloadInvoice}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Invoice
              </button>
            </div>

            <button
              onClick={() => navigate("/user-home")}
              className="text-indigo-400 hover:text-indigo-300 text-sm hover:underline"
            >
              Go to Dashboard Now
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PaymentSuccessSummaryPage;
