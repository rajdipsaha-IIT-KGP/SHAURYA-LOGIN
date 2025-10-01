import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Reset = () => {
  const [resetPass, setResetPass] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Set email and OTP from localStorage once on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail") || "";
    const storedOtp = localStorage.getItem("resetOtp") || "";
    setEmail(storedEmail);
    setOtp(storedOtp);
  }, []);

  const resetPassword = async () => {
    if (!email || !otp || !resetPass) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/user/signin/forgot-password/reset",
        {
          ownEmail: email,
          otp: otp,
          newPassword: resetPass,
        }
      );
      toast.success(res.data.message || "Password reset successfully");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen relative flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700" />
      <div className="w-full max-w-md p-10 bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl z-10">
        <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Reset Password
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={email}
          readOnly
        />

        <input
          type="text"
          placeholder="OTP"
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={otp}
          readOnly
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={resetPass}
          onChange={(e) => setResetPass(e.target.value)}
        />

        <button
          onClick={resetPassword}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-semibold text-white disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Reset;
