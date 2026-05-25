"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [field, setField] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = require("@/lib/auth-context").useAuth();
  const router = require("next/navigation").useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      const userData = { name, firstName, lastName, email, password, role };
      if (role !== "STUDENT") {
        userData.field = field;
        userData.bio = bio;
      }
      const user = await signup(userData);
      
      if (user.role === "STUDENT") router.push("/student-dashboard/Home");
      else if (user.role === "MENTOR") router.push("/mentor-dashboard/Home");
      else if (user.role === "TUTOR") router.push("/tutor-dashboard/Home");
      else if (user.role === "INSTRUCTOR") router.push("/dashboard");
      else router.push("/");
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">Join thousands of learners today</p>
      </div>

      {error && <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-xl text-sm">{error}</div>}

      <div className="space-y-1 mt-4">
        <div className="flex gap-3">
          <div className="space-y-1 flex-1">
            <label className="text-sm font-semibold text-gray-800">First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
            />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-sm font-semibold text-gray-800">Last Name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
            />
          </div>
        </div>

        <div className="space-y-1 mt-3">
          <label className="text-sm font-semibold text-gray-800">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-white"
          >
            <option value="STUDENT">Student</option>
            <option value="MENTOR">Mentor</option>
            <option value="TUTOR">Tutor</option>
            <option value="INSTRUCTOR">Instructor</option>
          </select>
        </div>

        {role !== "STUDENT" && (
          <>
            <div className="space-y-1 mt-3">
              <label className="text-sm font-semibold text-gray-800">Field of Expertise</label>
              <input
                type="text"
                required
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="e.g. Data Science, Web Development"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
              />
            </div>
            <div className="space-y-1 mt-3">
              <label className="text-sm font-semibold text-gray-800">Bio</label>
              <textarea
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your experience (min 20 characters)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400 min-h-[80px]"
              />
            </div>
          </>
        )}

        <div className="space-y-1 mt-3">
          <label className="text-sm font-semibold text-gray-800">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
          />
        </div>

        <div className="space-y-1 mt-3">
          <label className="text-sm font-semibold text-gray-800">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div className="space-y-1 mt-3">
          <label className="text-sm font-semibold text-gray-800">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 py-3.5 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:opacity-90 transition shadow-lg shadow-purple-200 disabled:opacity-50"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}