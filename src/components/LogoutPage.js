import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { removeloggedInUser } from "../store/slices/loggedInUserSlice";
const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cancelled, setCancelled] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (cancelled) return;

    // auto navigate after 1s
    const timer = setTimeout(() => {
      dispatch(removeloggedInUser());
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [cancelled, navigate]);

  // progress bar animation
  useEffect(() => {
    if (cancelled) return;

    const interval = setInterval(() => {
      setProgress((p) => (p > 0 ? p - 10 : 0));
    }, 100);

    return () => clearInterval(interval);
  }, [cancelled]);

  const handleHomeClick = () => {
    setCancelled(true);
    dispatch(removeloggedInUser());
    navigate("/");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-6">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl text-center animate-fadeIn max-w-md w-full">
        {/* Success icon animation */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl animate-scaleIn shadow-lg">
            ✔
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Logged Out</h1>

        <p className="text-gray-300 mb-6">Redirecting to login…</p>

        {/* Progress bar */}
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-green-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Button */}
        <button
          onClick={handleHomeClick}
          className="mt-2 px-6 py-2 rounded-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all font-medium shadow-md"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default LogoutPage;
