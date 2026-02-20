"use client";

import { useState } from "react";
import Galaxy from "@/assets/galaxy.png";
import { Eye, EyeOff, BookOpen, Users, Award } from "lucide-react";

export default function ParseVersePage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${Galaxy.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-indigo-950/30" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        {/* Left Panel */}
        <div className="flex-1 text-white space-y-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              PV
            </div>
            <div>
              <div className="font-bold text-xl leading-tight">ParseVerse</div>
              <div className="text-purple-300 text-sm">Learn From Home</div>
            </div>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Transform Your Learning
              <br />
              Journey Today
            </h1>
            <p className="text-purple-200 text-lg max-w-sm leading-relaxed">
              Join thousands of students mastering new skills with our
              interactive platform.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-5 border border-white/20 shadow-xl">
            <FeatureItem
              icon={<BookOpen className="w-9 h-9 text-purple-300" />}
              title="1000+ Courses"
              desc="Access a vast library of courses across multiple disciplines"
            />
            <FeatureItem
              icon={<Users className="w-9 h-9 text-purple-300" />}
              title="Expert Instructors"
              desc="Learn from industry professionals and experienced educators"
            />
            <FeatureItem
              icon={<Award className="w-9 h-9 text-yellow-400" />}
              title="Certificates"
              desc="Earn recognized certificates upon course completion"
            />
          </div>

          <div className="flex gap-8 text-center">
            <Stat value="50K+" label="Active Students" />
            <Stat value="1000+" label="Courses" />
            <Stat value="98%" label="Satisfaction" />
          </div>
        </div>

        {/* Right Panel - Auth Card */}
        <div className="w-full md:w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                PV
              </div>
              <div>
                <div className="font-bold text-sm leading-tight text-gray-800">ParseVerse</div>
                <div className="text-purple-500 text-xs">Learn From Home</div>
              </div>
            </div>
            <div className="flex bg-gray-100 rounded-full p-1 gap-1">
              <TabButton active={activeTab === "login"} onClick={() => setActiveTab("login")}>
                Login
              </TabButton>
              <TabButton active={activeTab === "signup"} onClick={() => setActiveTab("signup")}>
                Sign Up
              </TabButton>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {activeTab === "login" ? <LoginForm /> : <SignUpForm />}

            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <div className="flex-1 h-px bg-gray-200" />
              Or continue with
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex gap-3">
              <SocialBtn>
                <GoogleIcon />
              </SocialBtn>
              <SocialBtn className="bg-blue-600 border-blue-600 hover:bg-blue-700">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialBtn>
              <SocialBtn>
                <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </SocialBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Login Form ────────────────────────────────────────────────────────────────

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter your credentials to access your account
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-800">Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-800">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
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

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-purple-600"
          />
          <span className="text-sm text-gray-700">Remember me</span>
        </label>
        <button className="text-sm text-gray-500 hover:text-purple-600 transition">
          Forgot Password?
        </button>
      </div>

      <button className="w-full py-3.5 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:opacity-90 transition shadow-lg shadow-purple-200">
        Login
      </button>
    </>
  );
}

// ── Sign Up Form ──────────────────────────────────────────────────────────────

function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">Join thousands of learners today</p>
      </div>

      <div className="flex gap-3">
        <div className="space-y-1.5 flex-1">
          <label className="text-sm font-semibold text-gray-800">First Name</label>
          <input
            type="text"
            placeholder=""
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
          />
        </div>
        <div className="space-y-1.5 flex-1">
          <label className="text-sm font-semibold text-gray-800">Last Name</label>
          <input
            type="text"
            placeholder=""
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-800">Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder-gray-400"
        />
      </div>

      <div className="space-y-1.5">
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

      <div className="space-y-1.5">
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

      <button className="w-full py-3.5 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:opacity-90 transition shadow-lg shadow-purple-200">
        Create Account
      </button>
    </>
  );
}

// ── Shared Sub-components ─────────────────────────────────────────────────────

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <div className="font-semibold text-white text-sm">{title}</div>
        <div className="text-purple-200 text-xs leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-2xl font-extrabold text-white">{value}</div>
      <div className="text-purple-300 text-xs">{label}</div>
    </div>
  );
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
        active
          ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function SocialBtn({ children, className = "" }) {
  return (
    <button
      className={`flex-1 flex items-center justify-center py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition ${className}`}
    >
      {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}