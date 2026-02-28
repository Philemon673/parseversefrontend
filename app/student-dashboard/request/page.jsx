"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Send,
  List,
  CalendarDays,
} from "lucide-react";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const stats = [
  { icon: "🛋️", value: 3, label: "Upcoming Sessions" },
  { icon: "👥", value: 2, label: "Active Mentors" },
  { icon: "⏳", value: 1, label: "Pending Requests" },
  { icon: "⭐", value: "4.9", label: "Avg Mentor Rating" },
];

const steps = [
  { num: 1, label: "Field" },
  { num: 2, label: "Topic" },
  { num: 3, label: "Schedule" },
  { num: 4, label: "Confirm" },
];

const durations = ["1 Hour", "2 Hours", "3 Hours", "4 Hours"];
const fields = ["Computer Science", "Mathematics", "Physics", "Data Science", "Web Development"];
const levels = ["Beginner", "Intermediate", "Advanced"];
const sessionTypes = ["Online", "Physical", "Hybrid"];

const HOURLY_RATE = 25;

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, value, label }) {
  return (
    <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm px-5 py-4 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}

// ── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({ activeStep }) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center gap-1">
          <div className={"flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold transition " +
            (step.num === activeStep
              ? "bg-indigo-600 text-white"
              : step.num < activeStep
              ? "text-indigo-400"
              : "text-slate-400")
          }>
            <span className={"w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold " +
              (step.num === activeStep ? "bg-white text-indigo-600" : "bg-slate-100 text-slate-500")
            }>
              {step.num}
            </span>
            {step.label}
          </div>
          {i < steps.length - 1 && (
            <span className="text-slate-300 text-xs">—</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Calendar ──────────────────────────────────────────────────────────────────

function Calendar({ selectedDate, onSelect }) {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, current: false });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  // Next month leading days
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false });
  }

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  function isSelected(day, current) {
    if (!selectedDate || !current) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  }

  function isToday(day, current) {
    if (!current) return false;
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">

      {/* Month + Year Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition"
        >
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div className="text-sm font-bold text-slate-800">
          {monthNames[month]} {year}
        </div>
        <button
          onClick={nextMonth}
          className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition"
        >
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => (
          <button
            key={i}
            disabled={!cell.current}
            onClick={() => {
              if (cell.current) {
                onSelect(new Date(year, month, cell.day));
              }
            }}
            className={
              "h-8 w-full rounded-lg text-xs font-medium transition flex items-center justify-center " +
              (isSelected(cell.day, cell.current)
                ? "bg-indigo-600 text-white font-bold"
                : isToday(cell.day, cell.current)
                ? "bg-indigo-100 text-indigo-600 font-bold"
                : cell.current
                ? "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                : "text-slate-300 cursor-default")
            }
          >
            {cell.day}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RequestMentorshipPage() {
  const [activeStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDuration, setSelectedDuration] = useState("2 Hours");
  const [selectedField, setSelectedField] = useState("Computer Science");
  const [selectedLevel, setSelectedLevel] = useState("Intermediate");
  const [selectedSession, setSelectedSession] = useState("Online");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState("");

  const durationHours = parseInt(selectedDuration) || 1;
  const total = suggestedPrice
    ? parseFloat(suggestedPrice) * durationHours
    : durationHours * HOURLY_RATE;

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "No date selected";

  return (
    <div
      className="min-h-screen p-6 flex flex-col gap-5"
      style={{ background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 50%, #eef2ff 100%)" }}
    >

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Request Mentorship</h1>
          <p className="text-sm text-slate-400 mt-0.5">Find a mentor and schedule personalized tutoring sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <List className="w-4 h-4" />
            View My Requests
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm">
            <CalendarDays className="w-4 h-4" />
            My Schedule
          </button>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────── */}
      <div className="flex gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Main Form Card ────────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm overflow-hidden">

        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Request Mentorship</h2>
          <StepIndicator activeStep={activeStep} />
        </div>

        {/* Card Body */}
        <div className="flex gap-0">

          {/* ── Left Column ───────────────────────────────────────── */}
          <div className="flex-1 p-6 flex flex-col gap-5 border-r border-slate-100">
            <h3 className="font-semibold text-slate-700 text-sm">Request Details</h3>

            {/* Field of Study */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Field of Study</label>
              <div className="relative">
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  {fields.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Topic */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Topic</label>
              <input
                type="text"
                placeholder="e.g. React Hooks, Logistic Regression, Calculus integration"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-slate-300"
              />
            </div>

            {/* Level */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Level</label>
              <div className="flex items-center gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={"px-4 py-2 rounded-xl text-sm font-medium transition border " +
                      (selectedLevel === level
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300")
                    }
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Preferred Session Type</label>
              <div className="flex items-center gap-2">
                {sessionTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSession(type)}
                    className={"px-5 py-2 rounded-xl text-sm font-medium transition border " +
                      (selectedSession === type
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300")
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Additional Notes</label>
              <textarea
                rows={4}
                placeholder="Describe what you want help with..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-slate-300 resize-none"
              />
              <button className="flex items-center gap-1.5 text-xs text-indigo-500 font-medium w-fit px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition">
                <Paperclip className="w-3.5 h-3.5" />
                Attach materials
                <span className="text-slate-400">›</span>
              </button>
            </div>
          </div>

          {/* ── Right Column ──────────────────────────────────────── */}
          <div className="flex-1 p-6 flex flex-col gap-5">
            <h3 className="font-semibold text-slate-700 text-sm">Schedule Selection</h3>

            {/* ✅ Full Calendar */}
            <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />

            {/* Selected date display */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
              <CalendarDays className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-indigo-700">{formattedDate}</span>
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Duration</label>
              <div className="relative">
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  {durations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* ✅ Suggested Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Suggested Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                <input
                  type="number"
                  placeholder={`${HOURLY_RATE} (default rate)`}
                  value={suggestedPrice}
                  onChange={(e) => setSuggestedPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-slate-300"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Default rate is ${HOURLY_RATE}/hr. You can suggest a different rate for your mentor to review.
              </p>
            </div>

            {/* Estimated Cost Card */}
            <div className="mt-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
              <h4 className="font-bold text-slate-800 text-sm">Estimated Cost</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Hourly Rate</span>
                  <span className="font-semibold text-slate-700">
                    ${suggestedPrice || HOURLY_RATE}/hr
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Duration</span>
                  <span className="font-semibold text-slate-700">{selectedDuration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Session Date</span>
                  <span className="font-semibold text-slate-700">
                    {selectedDate?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Total</span>
                  <span className="text-2xl font-bold text-slate-800">${total}</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
                <Send className="w-4 h-4" />
                Send Mentorship Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}