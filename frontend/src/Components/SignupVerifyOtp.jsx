import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const SignupVerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email stored in localStorage after signup send-otp
  const email = localStorage.getItem("signupEmail");

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/user/signup/verify-otp",
        {
          ownEmail: email,
          otp: otp
        }
      );

      toast.success(res.data.message || "User verified successfully");
      localStorage.setItem("token", res.data.token);
      localStorage.removeItem("signupEmail"); // cleanup
       // navigate to dashboard or home after signup
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen relative flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700" />

      <div className="w-full max-w-md p-10 bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl z-10">
        <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Verify OTP
        </h2>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={verifyOtp}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-semibold text-white disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Verifying OTP..." : "Verify OTP"}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SignupVerifyOtp;
