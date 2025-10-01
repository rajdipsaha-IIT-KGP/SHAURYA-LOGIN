import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const signinUser = async () => {
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/user/signin", {
        ownEmail: email,
        password,
      });

      // store token & email for future use
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", email);

      toast.success(res.data.message || "Signed in successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

   
    localStorage.setItem("forgotemail", email);
    navigate("/forgot-password");
  };

  return (
    <div className="h-screen w-screen relative flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900 via-blue-800 " />

      <div className="w-full max-w-md p-10 bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl z-10">
        <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Sign In
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-blue-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div
            className="text-blue-400 hover:text-blue-600 cursor-pointer font-semibold text-right"
            onClick={forgotPassword}
          >
            Forgot Password?
          </div>

          <button
            onClick={signinUser}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-semibold text-white disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center mt-2">
            <span
              className="text-gray-300 cursor-pointer hover:text-white font-semibold"
              onClick={() => navigate("/signup")}
            >
              Don't have an account? Sign Up
            </span>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Signin;
