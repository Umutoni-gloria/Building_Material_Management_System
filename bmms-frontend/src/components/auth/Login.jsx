import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from "../../pages/Api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await API.auth.login({
        email,
        password,
        role: role.toUpperCase()
      });

      // Store token and user data
      const token = response.data.token;
      const userData = {
        id: response.data.id || Date.now(),
        name: response.data.name || '',
        email: email,
        role: role,
        avatar: null,
        lastLogin: new Date().toISOString()
      };

      if (rememberMe) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('userData', JSON.stringify(userData));
      }

      toast.success(`Login successful! Redirecting to 2FA verification...`);
      
      // Redirect to 2FA verification with email and role in state
      setTimeout(() => {
        navigate("/verify-2fa", { 
          state: { 
            email,
            role 
          }
        });
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
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
                  BUILD MATERIALS
                </span>
              </h1>
              <p className="text-white/80 font-light tracking-wider">MANAGEMENT SYSTEM LOGIN</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Role
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setRole("ADMIN")}
                    className={`flex-1 py-2 px-4 rounded-lg border ${role === "ADMIN" ? 'bg-blue-500/30 border-blue-400' : 'bg-white/5 border-white/20'} transition-colors`}
                  >
                    ADMIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("USER")}
                    className={`flex-1 py-2 px-4 rounded-lg border ${role === "USER" ? 'bg-blue-500/30 border-blue-400' : 'bg-white/5 border-white/20'} transition-colors`}
                  >
                    USER
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white/90">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@company.com"
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
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white/90">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 placeholder-white/50 text-white backdrop-blur-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-400 focus:ring-blue-400 border-white/30 rounded bg-white/10"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-white hover:text-blue-200">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400/50 transition-all"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    SIGNING IN...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    SIGN IN
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center text-sm">
              <p className="text-white/70">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-white hover:text-blue-200 underline">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;