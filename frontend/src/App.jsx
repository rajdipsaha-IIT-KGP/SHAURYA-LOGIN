import React from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import ForgotSendOtp from "./Components/ForgotSendOtp";
import VerifyOtp from "./Components/VerifyOtp";
import SignupVerifyOtp from "./Components/SignUpVerifyOtp";
import Reset from "./Components/Reset";

const App = () => {
  const location = useLocation();

  // Show buttons only on the home page
  const showButtons = location.pathname === "/";

  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900 via-blue-800 flex flex-col items-center justify-center min-h-screen">
      
      {showButtons && (
        <div className="flex gap-6">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-pink-500 hover:via-red-500 hover:to-yellow-500"
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-green-500 hover:via-green-600 hover:to-teal-500"
          >
            Sign In
          </Link>
        </div>
      )}

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotSendOtp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/signup-verify-otp" element={<SignupVerifyOtp />} />
        <Route path="/reset-password" element={<Reset />} />
      </Routes>
    </div>
  );
};

export default App;
