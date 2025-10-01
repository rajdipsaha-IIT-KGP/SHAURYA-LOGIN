import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import ForgotSendOtp from "./Components/ForgotSendotp";
import VerifyOtp from "./Components/VerifyOtp";
import SignupVerifyOtp from "./Components/SignUpVerifyOtp";

const App = () => {
  return (
    <Routes>
                
      <Route path="/signup" element={<Signup />} />  
      <Route path="/signin" element={<Signin />} />  
      <Route path="/forgot-password" element={<ForgotSendOtp />} /> 
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/signup-verify-otp" element={<SignupVerifyOtp />} />
    </Routes>
  );
};

export default App;
