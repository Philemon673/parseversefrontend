"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">Join thousands of learners today</p>
      </div>
      <div className="space-y-1">
        <div className="flex gap-3">
          <div className="space-y-1 flex-1">
            <label className="text-sm font-semibold text-gray-800">First Name</label>
            <input
              type="text"
              placeholder=""
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
            />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-sm font-semibold text-gray-800">Last Name</label>
            <input
              type="text"
              placeholder=""
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
            />
          </div>
        </div>


        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <button className="w-full py-3.5 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:opacity-90 transition shadow-lg shadow-purple-200">
        Create Account
      </button>
    </>
  );
}