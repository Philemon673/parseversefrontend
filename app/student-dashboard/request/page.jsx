"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Send,
  List,
  CalendarDays,
} from "lucide-react";

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

const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "FCFA";
const MINIMUM_HOURLY_RATE = Number(process.env.NEXT_PUBLIC_MINIMUM_HOURLY_RATE ?? 1000);

// ── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({ activeStep }) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center gap-1">
          <div
            className={
              "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold transition " +
              (step.num === activeStep
                ? "bg-indigo-600 text-white"
                : step.num < activeStep
                ? "text-indigo-400"
                : "text-slate-400")
            }
          >
            <span
              className={
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold " +
                (step.num === activeStep
                  ? "bg-white text-indigo-600"
                  : "bg-slate-100 text-slate-500")
              }
            >
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

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, current: false });

  function prevMonth() { setViewDate(new Date(year, month - 1, 1)); }
  function nextMonth() { setViewDate(new Date(year, month + 1, 1)); }

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
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition">
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div className="text-sm font-bold text-slate-800">{monthNames[month]} {year}</div>
        <button onClick={nextMonth} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition">
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => (
          <button
            key={i}
            disabled={!cell.current}
            onClick={() => cell.current && onSelect(new Date(year, month, cell.day))}
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
  const [activeStep, setActiveStep] = useState(1);
  const [selectedField, setSelectedField] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("Intermediate");
  const [selectedSession, setSelectedSession] = useState("Online");
  const [notes, setNotes] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("2 Hours");
  const [suggestedPrice, setSuggestedPrice] = useState("");
  const [selectedRole, setSelectedRole] = useState("mentor");

  useEffect(() => {
    if (!selectedField) setActiveStep(1);
    else if (!topic) setActiveStep(2);
    else if (!selectedDate) setActiveStep(3);
    else setActiveStep(4);
  }, [selectedField, topic, selectedDate]);

  const durationHours = parseInt(selectedDuration) || 1;
  const total = suggestedPrice
    ? parseFloat(suggestedPrice) * durationHours
    : durationHours * MINIMUM_HOURLY_RATE;

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date selected";

  return (
    <div className="min-h-screen p-2 flex flex-col gap-5">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Request Form</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Find a mentor and schedule personalized tutoring sessions
          </p>
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

      {/* ── Form Card ─────────────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-sm overflow-hidden">

        {/* ✅ Card Header — "Request" + inline dropdown beside it */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            Request
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
            >
              <option value="mentor">Mentor</option>
              <option value="tutor">Tutor</option>
            </select>
          </h2>
          <StepIndicator activeStep={activeStep} />
        </div>

        {/* Body */}
        <div className="flex gap-0">

          {/* ── Left Column ───────────────────────────────────────── */}
          <div className="flex-1 p-6 flex flex-col gap-5 border-r border-slate-100">

            {/* Field of Study */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Field of Study</label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-slate-300"
              />
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
                    className={
                      "px-4 py-2 rounded-xl text-sm font-medium transition border " +
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
                    className={
                      "px-5 py-2 rounded-xl text-sm font-medium transition border " +
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
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-xs text-indigo-500 font-medium w-fit px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition">
                  <Paperclip className="w-3.5 h-3.5" />
                  Attach materials
                  <span className="text-slate-400">›</span>
                </button>
                <p className="text-slate-400 text-xs">optional</p>
              </div>
            </div>
          </div>

          {/* ── Right Column ──────────────────────────────────────── */}
          <div className="flex-1 p-6 flex flex-col gap-5">
            <h3 className="font-semibold text-slate-700 text-sm">Schedule Selection</h3>

            {/* Calendar */}
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

            {/* Suggested Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Suggested Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                  {CURRENCY}:
                </span>
                <input
                  type="number"
                  value={suggestedPrice}
                  onChange={(e) => setSuggestedPrice(e.target.value)}
                  className="w-full pl-20 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-slate-300"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Default rate is {CURRENCY} {MINIMUM_HOURLY_RATE}/hr. You can suggest a different rate for your {selectedRole} to review.
              </p>
            </div>

            {/* Estimated Cost + Send */}
            <div className="mt-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
              <h4 className="font-bold text-slate-800 text-sm">Please review your request details before sending</h4>
             
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
                <Send className="w-4 h-4" />
                Send {selectedRole === "mentor" ? "Mentorship" : "Tutoring"} Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}