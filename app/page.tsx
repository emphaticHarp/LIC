"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        console.log("Login successful!", data.user.email);
        
        // Store user in localStorage for session management
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard with email as query parameter
        router.push(`/dashboard?email=${encodeURIComponent(data.user.email)}`);
      } else {
        alert(data.error || 'Failed to login. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      alert('Network error. Please check your connection and try again.');
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register Link */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">New to LIC?</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/register")}
            className="w-full py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Create New Account
          </button>

          {/* Contact Support */}
          <p className="text-center text-sm text-gray-600">
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
