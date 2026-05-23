"use client";

import { useState } from "react";
import { Edit3, Check, X, Plus, Trash2, ChevronDown } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type SessionStatus = "Confirmed" | "Pending" | "Cancelled";

interface Session {
  id: number;
  dateTime: string;
  student: string;
  subject: string;
  type: string;
  duration: string;
  status: SessionStatus;
}

interface TimeSlot {
  id: number;
  from: string;
  to: string;
}

type DayAvailability = { available: boolean; slots: TimeSlot[] };

const statusStyles: Record<SessionStatus, string> = {
  Confirmed: "bg-green-50 text-green-600",
  Pending:   "bg-yellow-50 text-yellow-600",
  Cancelled: "bg-red-50   text-red-500",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Day = (typeof DAYS)[number];

const SUBJECTS = ["Mathematics", "Physics", "Computer Science", "Biology", "Chemistry"];
const SESSION_TYPES = ["One to One", "Group", "Home Tutoring"];
const DURATIONS = ["30 Min", "1 Hour", "1.5 Hour", "2 Hours"];
const FILTER_OPTIONS: Array<SessionStatus | "All"> = ["All", "Confirmed", "Pending", "Cancelled"];

/* ─── Initial data ───────────────────────────────────────────────────────── */
const initAvailability: Record<Day, DayAvailability> = {
  Mon: { available: true,  slots: [{ id: 1, from: "09:00", to: "13:00" }, { id: 2, from: "16:00", to: "20:00" }] },
  Tue: { available: true,  slots: [{ id: 3, from: "09:00", to: "13:00" }] },
  Wed: { available: true,  slots: [{ id: 4, from: "09:00", to: "13:00" }] },
  Thu: { available: true,  slots: [{ id: 5, from: "09:00", to: "13:00" }] },
  Fri: { available: true,  slots: [{ id: 6, from: "09:00", to: "13:00" }] },
  Sat: { available: false, slots: [{ id: 7, from: "10:00", to: "14:00" }] },
  Sun: { available: false, slots: [] },
};

const initSessions: Session[] = [
  { id: 1, dateTime: "20 May 2024, 10:00 AM", student: "Sarah Ahmed",   subject: "Mathematics",      type: "One to One", duration: "1 Hour",   status: "Confirmed" },
  { id: 2, dateTime: "20 May 2024, 04:00 PM", student: "Rafiq Islam",   subject: "Physics",          type: "Group",      duration: "1.5 Hour", status: "Confirmed" },
  { id: 3, dateTime: "21 May 2024, 10:00 AM", student: "Nusrat Jahan",  subject: "Computer Science", type: "One to One", duration: "1 Hour",   status: "Pending"   },
  { id: 4, dateTime: "22 May 2024, 05:00 PM", student: "Imtiaz Hasan",  subject: "Mathematics",      type: "One to One", duration: "1 Hour",   status: "Confirmed" },
];

/* ─── Add Session Modal ──────────────────────────────────────────────────── */
function SessionModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Session;
  onSave: (s: Omit<Session, "id">) => void;
  onClose: () => void;
}) {
  const [dateTime, setDateTime] = useState(initial?.dateTime ?? "");
  const [student, setStudent]   = useState(initial?.student ?? "");
  const [subject, setSubject]   = useState(initial?.subject ?? SUBJECTS[0]);
  const [type, setType]         = useState(initial?.type ?? SESSION_TYPES[0]);
  const [duration, setDuration] = useState(initial?.duration ?? DURATIONS[1]);
  const [status, setStatus]     = useState<SessionStatus>(initial?.status ?? "Confirmed");
  const [error, setError]       = useState("");

  const handleSave = () => {
    if (!student.trim() || !dateTime.trim()) { setError("Date & Student are required."); return; }
    onSave({ dateTime, student: student.trim(), subject, type, duration, status });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[440px] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">{initial ? "Edit Session" : "Add Session"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Date &amp; Time</label>
              <input value={dateTime} onChange={(e) => { setDateTime(e.target.value); setError(""); }} placeholder="e.g. 20 May 2024, 10:00 AM" className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Student Name</label>
              <input value={student} onChange={(e) => { setStudent(e.target.value); setError(""); }} placeholder="e.g. Sarah Ahmed" className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Session Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                {SESSION_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Duration</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                {DURATIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as SessionStatus)} className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                {(["Confirmed", "Pending", "Cancelled"] as SessionStatus[]).map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition">
            <Check className="w-3.5 h-3.5" />{initial ? "Update" : "Add Session"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
let slotIdCounter = 20;

export default function SchedulesTab() {
  const [availability, setAvailability] = useState<Record<Day, DayAvailability>>(initAvailability);
  const [editingAvail, setEditingAvail] = useState(false);
  const [availDraft, setAvailDraft]     = useState<Record<Day, DayAvailability>>(initAvailability);

  const [sessions, setSessions]         = useState<Session[]>(initSessions);
  const [filter, setFilter]             = useState<SessionStatus | "All">("All");
  const [addModal, setAddModal]         = useState(false);
  const [editSession, setEditSession]   = useState<Session | null>(null);
  const [showAll, setShowAll]           = useState(false);

  let sessionIdCounter = sessions.length + 1;

  /* availability helpers */
  const toggleDay = (day: Day) =>
    setAvailDraft((d) => ({ ...d, [day]: { ...d[day], available: !d[day].available } }));

  const updateSlot = (day: Day, id: number, field: "from" | "to", val: string) =>
    setAvailDraft((d) => ({
      ...d,
      [day]: { ...d[day], slots: d[day].slots.map((s) => (s.id === id ? { ...s, [field]: val } : s)) },
    }));

  const addSlot = (day: Day) =>
    setAvailDraft((d) => ({
      ...d,
      [day]: { ...d[day], slots: [...d[day].slots, { id: slotIdCounter++, from: "09:00", to: "17:00" }] },
    }));

  const removeSlot = (day: Day, id: number) =>
    setAvailDraft((d) => ({
      ...d,
      [day]: { ...d[day], slots: d[day].slots.filter((s) => s.id !== id) },
    }));

  const saveAvail  = () => { setAvailability(availDraft); setEditingAvail(false); };
  const cancelAvail = () => { setAvailDraft(availability); setEditingAvail(false); };

  /* sessions helpers */
  const addSession = (s: Omit<Session, "id">) => {
    setSessions((prev) => [...prev, { id: sessionIdCounter++, ...s }]);
    setAddModal(false);
  };
  const updateSession = (s: Omit<Session, "id">) => {
    setSessions((prev) => prev.map((x) => (x.id === editSession!.id ? { id: editSession!.id, ...s } : x)));
    setEditSession(null);
  };
  const deleteSession = (id: number) => setSessions((prev) => prev.filter((s) => s.id !== id));
  const updateStatus  = (id: number, status: SessionStatus) =>
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));

  const filtered = filter === "All" ? sessions : sessions.filter((s) => s.status === filter);
  const visible  = showAll ? filtered : filtered.slice(0, 4);

  const fmt = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
  };

  return (
    <>
      {addModal    && <SessionModal onSave={addSession}    onClose={() => setAddModal(false)} />}
      {editSession && <SessionModal initial={editSession}  onSave={updateSession} onClose={() => setEditSession(null)} />}

      <div className="flex flex-col gap-4">
        {/* ── Weekly Availability ────────────────────────────────────────── */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Weekly Availability</h3>
              <p className="text-xs text-gray-400 mt-0.5">Set your weekly available time slots</p>
            </div>
            {editingAvail ? (
              <div className="flex gap-1.5">
                <button onClick={saveAvail} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition">
                  <Check className="w-3 h-3" /> Save
                </button>
                <button onClick={cancelAvail} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition">
                  <X className="w-3 h-3" /> Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => { setAvailDraft(availability); setEditingAvail(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                <Edit3 className="w-3 h-3" /> Edit Availability
              </button>
            )}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {DAYS.map((day) => {
              const data = (editingAvail ? availDraft : availability)[day];
              return (
                <div key={day} className={`rounded-xl p-2 flex flex-col gap-1.5 ${data.available ? "bg-gray-50" : "bg-red-50"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">{day}</span>
                    {editingAvail && (
                      <button
                        onClick={() => toggleDay(day)}
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition ${data.available ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
                        title={data.available ? "Mark unavailable" : "Mark available"}
                      >
                        {data.available ? "✓" : "✗"}
                      </button>
                    )}
                  </div>

                  {!data.available && !editingAvail && (
                    <span className="text-[10px] text-red-400 font-medium">Unavailable</span>
                  )}

                  {(data.available || editingAvail) && data.slots.map((slot) => (
                    <div key={slot.id} className="flex flex-col gap-0.5">
                      {editingAvail ? (
                        <div className="flex flex-col gap-0.5">
                          <input type="time" value={slot.from} onChange={(e) => updateSlot(day, slot.id, "from", e.target.value)} className="text-[10px] border border-gray-200 rounded px-1 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                          <input type="time" value={slot.to}   onChange={(e) => updateSlot(day, slot.id, "to",   e.target.value)} className="text-[10px] border border-gray-200 rounded px-1 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                          <button onClick={() => removeSlot(day, slot.id)} className="text-[9px] text-red-400 hover:text-red-600 transition text-left">remove</button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500 leading-tight">{fmt(slot.from)} – {fmt(slot.to)}</span>
                      )}
                    </div>
                  ))}

                  {editingAvail && (
                    <button onClick={() => addSlot(day)} className="text-[9px] text-indigo-500 hover:text-indigo-700 transition flex items-center gap-0.5 mt-0.5">
                      <Plus className="w-2.5 h-2.5" /> slot
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Upcoming Sessions ─────────────────────────────────────────── */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-800">Upcoming Sessions</h3>
            <div className="flex items-center gap-2">
              {/* Filter dropdown */}
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as SessionStatus | "All")}
                  className="appearance-none pl-3 pr-7 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-600"
                >
                  {FILTER_OPTIONS.map((f) => <option key={f}>{f}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={() => setAddModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">No sessions found.</div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-2 text-gray-400 font-semibold">Date &amp; Time</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Student</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Subject</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Type</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Duration</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Status</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition">
                    <td className="py-2.5 text-gray-600 font-medium">{s.dateTime}</td>
                    <td className="py-2.5 text-gray-700">{s.student}</td>
                    <td className="py-2.5 text-gray-500">{s.subject}</td>
                    <td className="py-2.5 text-gray-500">{s.type}</td>
                    <td className="py-2.5 text-gray-500">{s.duration}</td>
                    <td className="py-2.5">
                      <select
                        value={s.status}
                        onChange={(e) => updateStatus(s.id, e.target.value as SessionStatus)}
                        className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border-0 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer ${statusStyles[s.status]}`}
                      >
                        {(["Confirmed", "Pending", "Cancelled"] as SessionStatus[]).map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditSession(s)} className="p-1 rounded-lg hover:bg-indigo-50 text-indigo-400 transition" title="Edit">
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button onClick={() => deleteSession(s.id)} className="p-1 rounded-lg hover:bg-red-50 text-red-400 transition" title="Delete">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {filtered.length > 4 && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={() => setShowAll((v) => !v)}
                className="px-5 py-2 rounded-xl border border-indigo-200 text-indigo-600 text-xs font-semibold hover:bg-indigo-50 transition"
              >
                {showAll ? "↑ Show Less" : `→ View All ${filtered.length} Sessions`}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}