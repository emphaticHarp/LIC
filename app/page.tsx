"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const RATE_LIMIT_KEY = "login_attempts";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitTime, setRateLimitTime] = useState(0);

  // Load remembered email on mount
  useEffect(() => {
    const remembered = localStorage.getItem("remembered_email");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  // Rate limit timer
  useEffect(() => {
    if (!isRateLimited) return;
    
    const timer = setInterval(() => {
      setRateLimitTime((prev) => {
        if (prev <= 1) {
          setIsRateLimited(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRateLimited]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkRateLimit = (): boolean => {
    const attempts = localStorage.getItem(RATE_LIMIT_KEY);
    
    if (!attempts) {
      return false;
    }

    const { count, timestamp } = JSON.parse(attempts);
    const now = Date.now();

    // Reset if window has passed
    if (now - timestamp > RATE_LIMIT_WINDOW) {
      localStorage.removeItem(RATE_LIMIT_KEY);
      return false;
    }

    // Check if limit exceeded
    if (count >= RATE_LIMIT_MAX) {
      const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - (now - timestamp)) / 1000);
      setRateLimitTime(remainingTime);
      setIsRateLimited(true);
      setApiError(`Too many login attempts. Please try again in ${remainingTime} seconds.`);
      return true;
    }

    return false;
  };

  const recordLoginAttempt = () => {
    const attempts = localStorage.getItem(RATE_LIMIT_KEY);
    
    if (!attempts) {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, timestamp: Date.now() }));
    } else {
      const { count, timestamp } = JSON.parse(attempts);
      const now = Date.now();

      if (now - timestamp > RATE_LIMIT_WINDOW) {
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, timestamp: now }));
      } else {
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: count + 1, timestamp }));
      }
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");
    setApiSuccess("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check rate limit
    if (checkRateLimit()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear rate limit on successful login
        localStorage.removeItem(RATE_LIMIT_KEY);

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem("remembered_email", email);
        } else {
          localStorage.removeItem("remembered_email");
        }

        // Store user in localStorage for session management
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setApiSuccess("Login successful! Redirecting...");
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        recordLoginAttempt();
        setApiError(data.error || 'Failed to login. Please try again.');
      }
    } catch (err: any) {
      recordLoginAttempt();
      console.error('Login error:', err);
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* LIC Logo Section */}
        <div className="text-center mb-8">
          <Image
            src="https://1000logos.net/wp-content/uploads/2021/08/LIC-Logo.jpg"
            alt="LIC Logo"
            width={150}
            height={150}
            className="mx-auto mb-4 rounded-lg"
            style={{ width: "auto", height: "auto" }}
            priority
          />
          <p className="text-gray-600">Life Insurance Corporation of India</p>
        </div>

        {/* Login Card */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-xl p-6">
          <div className="space-y-1 pb-6">
            <h2 className="text-2xl font-semibold text-center text-gray-900">Welcome Back</h2>
            <p className="text-center text-gray-600 text-sm">
              Sign in to your LIC account to continue
            </p>
          </div>

          {/* Error Alert */}
          {apiError && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 ml-2">
                {apiError}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {apiSuccess && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                {apiSuccess}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-gray-700 font-medium text-sm">
                Email Address
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-3 h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  disabled={isRateLimited || isLoading}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.email
                      ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-gray-700 font-medium text-sm">
                Password
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-3 h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  disabled={isRateLimited || isLoading}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password
                      ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isRateLimited || isLoading}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs font-medium">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isRateLimited || isLoading}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 disabled:opacity-50"
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                disabled={isRateLimited || isLoading}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || isRateLimited}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : isRateLimited ? (
                `Try again in ${rateLimitTime}s`
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Contact Support */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Need help?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2024 Life Insurance Corporation of India. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
