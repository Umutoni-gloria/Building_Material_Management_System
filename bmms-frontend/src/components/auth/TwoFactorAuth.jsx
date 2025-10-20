import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from "../../pages/Api";

const TwoFactorAuth = () => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state (passed from login)
  const email = location.state?.email;
  const role = location.state?.role;

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast.error("Please enter the verification code.");
      return;
    }

    if (code.length !== 6) {
      toast.error("Verification code must be 6 digits.");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please try logging in again.");
      return;
    }

    setIsVerifying(true);
    try {
      // Call the API to verify 2FA code
      const response = await API.auth.verify2FA(email, code);
      
      // Store the token (assuming it's returned in the response)
      const token = response.data.token;
      if (token) {
        // Store token in both localStorage and sessionStorage to ensure it's available
      localStorage.setItem('authToken', token);
        sessionStorage.setItem('authToken', token);
      }
      
      toast.success("Verification successful! Redirecting...");
      
      // Redirect to dashboard index (which renders DashboardHome) after successful verification
      setTimeout(() => {
        // The index route of /dashboard and /admin/dashboard automatically renders DashboardHome
        const dashboardPath = role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
        // Force a full navigation to ensure proper loading
        window.location.replace(dashboardPath);
      }, 1500);
    } catch (error) {
      console.error("2FA verification error:", error);
      const errorMessage = error.response?.data?.message || "Invalid code. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat p-4">
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="relative w-full max-w-md overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-transparent to-orange-500/20 opacity-70 rounded-3xl blur-xl animate-gradient-shift"></div>
        
        <div className="relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/30 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-400/30 rounded-full filter blur-3xl"></div>
          
          <div className="p-10">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-orange-300">
                  TWO-FACTOR AUTH
                </span>
              </h1>
              <p className="text-white/80 font-light tracking-wider">
                Enter the 6-digit code sent to your email
              </p>
              {email && (
                <p className="text-white/60 text-sm mt-2">
                  Code sent to: {email}
                </p>
              )}
            </div>

            <form className="space-y-6" onSubmit={handleVerify}>
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-medium text-white/90">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    // Only allow numeric input
                    const value = e.target.value.replace(/\D/g, '');
                    setCode(value);
                  }}
                  placeholder="123456"
                  required
                  className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 placeholder-white/50 text-white backdrop-blur-sm tracking-widest text-lg text-center"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400/50 transition-all disabled:opacity-70"
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    VERIFYING...
                  </>
                ) : (
                  "VERIFY CODE"
                )}
              </button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-medium text-white hover:text-blue-200 underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;