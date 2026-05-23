"use client";

import { useState } from "react";
import { Edit3, Check, X, Monitor, Users, User, Home } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface PersonalInfo {
  dob: string;
  qualification: string;
  gender: string;
  experience: string;
  languages: string;
  subjects: string;
}

interface TeachingPref {
  label: string;
  options: string[];
  value: string;
  bg: string;
  activeBg: string;
  iconColor: string;
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function InfoRow({
  icon,
  label,
  value,
  editing,
  inputType = "text",
  onChange,
  options,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  inputType?: string;
  onChange: (v: string) => void;
  options?: string[];
}) {
  return (
    <div className="flex items-center gap-2 min-h-[28px]">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="text-xs text-gray-400 w-24 flex-shrink-0">{label}</span>
      {editing ? (
        options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-xs border border-indigo-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            {options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ) : (
          <input
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-xs border border-indigo-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        )
      ) : (
        <span className="text-xs font-medium text-gray-700">{value}</span>
      )}
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const CalIcon = () => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
    <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M1 6h14" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 1v2M11 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const GraduateIcon = () => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
    <path d="M8 1a3 3 0 1 0 0 6A3 3 0 0 0 8 1zM2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const GenderIcon = () => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
    <path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 2L5 8.3 2 5.4l4.2-.8L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const LangIcon = () => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 2c-2 2-2 8 0 12M8 2c2 2 2 8 0 12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const SubjectIcon = () => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
    <path d="M2 12l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function DetailsTab() {
  /* About Me */
  const [bio, setBio] = useState(
    "Experienced tutor with over 6 years of teaching students in Mathematics, Physics and Computer Science. I love helping students understand complex topics in a simple way and achieve their academic goals."
  );
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(bio);

  const saveBio = () => { setBio(bioDraft); setEditingBio(false); };
  const cancelBio = () => { setBioDraft(bio); setEditingBio(false); };

  /* Personal Info */
  const [info, setInfo] = useState<PersonalInfo>({
    dob: "15 March 1990",
    qualification: "MSc in Computer Science",
    gender: "Male",
    experience: "6+ Years",
    languages: "English, Bengali",
    subjects: "Mathematics, Physics, Computer Science",
  });
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoDraft, setInfoDraft] = useState<PersonalInfo>(info);

  const saveInfo = () => { setInfo(infoDraft); setEditingInfo(false); };
  const cancelInfo = () => { setInfoDraft(info); setEditingInfo(false); };
  const setField = (key: keyof PersonalInfo) => (v: string) =>
    setInfoDraft((d) => ({ ...d, [key]: v }));

  /* Teaching Preferences */
  const [prefs, setPrefs] = useState<TeachingPref[]>([
    { label: "Online",        options: ["Preferred", "Not Preferred", "Neutral"], value: "Preferred",     bg: "bg-blue-50",   activeBg: "bg-blue-100",   iconColor: "text-blue-500" },
    { label: "One to One",    options: ["Preferred", "Not Preferred", "Neutral"], value: "Preferred",     bg: "bg-purple-50", activeBg: "bg-purple-100", iconColor: "text-purple-500" },
    { label: "Group Session", options: ["Yes", "No"],                             value: "Yes",            bg: "bg-indigo-50", activeBg: "bg-indigo-100", iconColor: "text-indigo-500" },
    { label: "Home Tutoring", options: ["Yes", "No"],                             value: "No",             bg: "bg-orange-50", activeBg: "bg-orange-100", iconColor: "text-orange-400" },
  ]);
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [prefsDraft, setPrefsDraft] = useState<TeachingPref[]>(prefs);

  const savePrefs = () => { setPrefs(prefsDraft); setEditingPrefs(false); };
  const cancelPrefs = () => { setPrefsDraft(prefs); setEditingPrefs(false); };

  const prefIcons: Record<string, React.ReactNode> = {
    "Online":        <Monitor className="w-5 h-5" />,
    "One to One":    <User className="w-5 h-5" />,
    "Group Session": <Users className="w-5 h-5" />,
    "Home Tutoring": <Home className="w-5 h-5" />,
  };

  return (
    <div className="flex flex-col gap-4">

      {/* ── About Me ──────────────────────────────────────────────────────── */}
      <div className="border border-gray-100 rounded-2xl p-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-800">About Me</h3>
          {editingBio ? (
            <div className="flex gap-1.5">
              <button onClick={saveBio} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition">
                <Check className="w-3 h-3" /> Save
              </button>
              <button onClick={cancelBio} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition">
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => { setBioDraft(bio); setEditingBio(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          )}
        </div>
        {editingBio ? (
          <textarea
            value={bioDraft}
            onChange={(e) => setBioDraft(e.target.value)}
            rows={4}
            className="w-full text-xs border border-indigo-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none leading-relaxed"
          />
        ) : (
          <p className="text-xs text-gray-500 leading-relaxed">{bio}</p>
        )}
      </div>

      {/* ── Personal Information ───────────────────────────────────────────── */}
      <div className="border border-gray-100 rounded-2xl p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800">Personal Information</h3>
          {editingInfo ? (
            <div className="flex gap-1.5">
              <button onClick={saveInfo} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition">
                <Check className="w-3 h-3" /> Save
              </button>
              <button onClick={cancelInfo} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition">
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => { setInfoDraft(info); setEditingInfo(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-y-3 gap-x-6">
          <InfoRow icon={<CalIcon />}      label="Date of Birth"  value={editingInfo ? infoDraft.dob           : info.dob}           editing={editingInfo} onChange={setField("dob")}           />
          <InfoRow icon={<GraduateIcon />} label="Qualification"  value={editingInfo ? infoDraft.qualification : info.qualification}  editing={editingInfo} onChange={setField("qualification")} />
          <InfoRow icon={<GenderIcon />}   label="Gender"         value={editingInfo ? infoDraft.gender        : info.gender}         editing={editingInfo} onChange={setField("gender")}        options={["Male", "Female", "Other"]} />
          <InfoRow icon={<StarIcon />}     label="Experience"     value={editingInfo ? infoDraft.experience    : info.experience}     editing={editingInfo} onChange={setField("experience")}    options={["1+ Years", "2+ Years", "3+ Years", "4+ Years", "5+ Years", "6+ Years", "8+ Years", "10+ Years"]} />
          <InfoRow icon={<LangIcon />}     label="Languages"      value={editingInfo ? infoDraft.languages     : info.languages}      editing={editingInfo} onChange={setField("languages")}     />
          <InfoRow icon={<SubjectIcon />}  label="Subjects"       value={editingInfo ? infoDraft.subjects      : info.subjects}       editing={editingInfo} onChange={setField("subjects")}      />
        </div>
      </div>

      {/* ── Teaching Preferences ──────────────────────────────────────────── */}
      <div className="border border-gray-100 rounded-2xl p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800">Teaching Preference</h3>
          {editingPrefs ? (
            <div className="flex gap-1.5">
              <button onClick={savePrefs} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition">
                <Check className="w-3 h-3" /> Save
              </button>
              <button onClick={cancelPrefs} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition">
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => { setPrefsDraft(prefs); setEditingPrefs(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {(editingPrefs ? prefsDraft : prefs).map((pref, idx) => (
            <div key={pref.label} className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl ${pref.bg}`}>
              <div className={`w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm ${pref.iconColor}`}>
                {prefIcons[pref.label]}
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center">{pref.label}</span>
              {editingPrefs ? (
                <select
                  value={prefsDraft[idx].value}
                  onChange={(e) => {
                    const next = [...prefsDraft];
                    next[idx] = { ...next[idx], value: e.target.value };
                    setPrefsDraft(next);
                  }}
                  className="text-[10px] border border-gray-200 rounded-lg px-1 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 w-full text-center"
                >
                  {pref.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <span className="text-[10px] text-gray-400">{pref.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}