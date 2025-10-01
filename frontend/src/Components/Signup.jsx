import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    ownEmail: "",
    clgEmail: "",
    clgName: "",
    gender: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    const { username, ownEmail, clgEmail, clgName, gender, password } = formData;

    if (!username || !ownEmail || !clgEmail || !clgName || !gender || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
 
    try {
      const res = await axios.post("http://localhost:3000/user/signup/send-otp", formData);
      toast.success(res.data.message || "OTP sent successfully");
      localStorage.setItem("signupEmail", ownEmail);
      navigate("/signup-verify-otp");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen relative flex items-center justify-center text-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-800 via-blue-700 " />

      {/* Form Box */}
      <div className="w-full max-w-md p-10 bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl z-10">
        <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
           Sign Up
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="username / Roll number"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="ownEmail"
            placeholder="Personal Email"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.ownEmail}
            onChange={handleChange}
          />

          <input
            type="email"
            name="clgEmail"
            placeholder="College Email"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.clgEmail}
            onChange={handleChange}
          />

          <input
            type="text"
            name="clgName"
            placeholder="College Name"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.clgName}
            onChange={handleChange}
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-blue-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-semibold text-white disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <p className="text-center text-gray-300 mt-6">
            Already have an account?{" "}
            <span
              className="text-blue-400 hover:text-blue-600 cursor-pointer font-semibold"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Signup;
