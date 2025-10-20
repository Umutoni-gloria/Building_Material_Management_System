import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../pages/Api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast.error("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      await API.auth.requestPasswordReset(email);
      
      toast.success("Password reset link sent to your email. Please check your inbox.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Password reset error:", error);
      const errorMessage = error.response?.data?.message || "Failed to send reset email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
                  RESET PASSWORD
                </span>
              </h1>
              <p className="text-white/80 font-light tracking-wider">
                Enter your email to receive reset instructions
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white/90">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 placeholder-white/50 text-white backdrop-blur-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-6 rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400/50 transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    SENDING LINK...
                  </>
                ) : (
                  "SEND RESET LINK"
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

export default ForgotPassword;