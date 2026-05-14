"use client";

import { useState, useRef, useCallback } from "react";
import {
  CloudUpload,
  CheckCircle2,
  ChevronDown,
  Clock,
  Monitor,
  FileVideo,
  Play,
  Info,
  X,
  Film,
  Globe,
  Lock,
  AlertCircle,
  Type,
  Link2,
  AlignLeft,
  Save,
  Router,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ── Config ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Content" },
  { id: 2, label: "Upload Video" },
  { id: 3, label: "Details" },
  { id: 4, label: "Publishing" },
];
const CURRENT_STEP = 2;

const LANGUAGES = ["English", "French", "Spanish", "German", "Portuguese", "Mandarin", "Japanese", "Arabic"];
const VISIBILITIES = ["Public", "Private", "Unlisted", "Draft"];

const TITLE_MAX = 100;
const DESC_MAX = 1000;

// ── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator() {
  return (
    <div className="flex items-center w-full">
      {STEPS.map((step, i) => {
        const done = step.id < CURRENT_STEP;
        const active = step.id === CURRENT_STEP;
        const last = i === STEPS.length - 1;
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${
                  done
                    ? "bg-[#4f3fd8] text-white"
                    : active
                    ? "bg-[#4f3fd8] text-white ring-4 ring-[#4f3fd8]/20"
                    : "bg-white border-2 border-[#e0dcf8] text-[#b0aacf]"
                }`}
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : step.id}
              </div>
              <span
                className={`text-sm font-semibold whitespace-nowrap ${
                  active ? "text-[#4f3fd8]" : done ? "text-gray-600" : "text-[#b0aacf]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!last && (
              <div className="flex-1 mx-4 h-px bg-[#e0dcf8] relative">
                {done && <div className="absolute inset-0 bg-[#4f3fd8]" />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Drop Zone ─────────────────────────────────────────────────────────────────

function DropZone({ file, onFile, onClear }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f && f.type.startsWith("video/")) onFile(f);
    },
    [onFile]
  );

  if (file) {
    return (
      <div className="relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 py-10 px-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-md">
          <Film className="w-7 h-7 text-white" />
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-900">{file.name}</p>
          <p className="text-xs font-semibold text-emerald-600 mt-1">
            {(file.size / (1024 * 1024)).toFixed(1)} MB · Ready to upload
          </p>
        </div>
        <button
          onClick={onClear}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed py-14 px-6 cursor-pointer transition-all ${
        dragging
          ? "border-[#4f3fd8] bg-[#eeebfd] scale-[1.01]"
          : "border-[#c5bef5] bg-[#f5f3ff] hover:border-[#4f3fd8]/60 hover:bg-[#eeebfd]"
      }`}
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
          dragging ? "bg-[#4f3fd8] text-white scale-110" : "bg-[#ece9fd] text-[#4f3fd8]"
        }`}
      >
        <CloudUpload className="w-8 h-8" />
      </div>
      <div className="text-center">
        <p className="font-bold text-[#2d2560] text-base">
          {dragging ? "Drop it here!" : "Drag and drop your video file here"}
        </p>
        <p className="text-sm text-[#9b96c0] mt-1">or</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="px-8 py-2.5 rounded-xl bg-[#4f3fd8] text-white text-sm font-bold shadow-md hover:bg-[#3d2fc0] transition-all active:scale-95"
      >
        Browse Files
      </button>
      <p className="text-xs text-[#9b96c0] text-center">
        MP4, MOV, WebM or AVI &nbsp;·&nbsp; Max size 2GB &nbsp;·&nbsp; Max duration 10 minutes
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </div>
  );
}

// ── Icon Box ──────────────────────────────────────────────────────────────────

function IconBox({ icon: Icon }) {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#edeafd] flex items-center justify-center">
      <Icon className="w-4 h-4 text-[#4f3fd8]" />
    </div>
  );
}

// ── Field Label ───────────────────────────────────────────────────────────────

function FieldLabel({ label, optional, tooltip }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[10px] font-black text-[#9490b5] uppercase tracking-widest">{label}</span>
      {optional && (
        <span className="px-2 py-0.5 rounded-full bg-[#edeafd] text-[#5845d0] text-[10px] font-bold border border-[#d5cffa]">
          Optional
        </span>
      )}
      {tooltip && <TooltipIcon text={tooltip} />}
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

function TooltipIcon({ text }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-[#b0aacf] hover:text-[#4f3fd8] transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-gray-900 text-white text-[11px] font-medium rounded-xl px-3 py-2 leading-relaxed shadow-xl z-20 pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}

// ── Metadata Item ─────────────────────────────────────────────────────────────

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#edeafd] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#4f3fd8]" />
      </div>
      <div>
        <p className="text-[9px] font-black text-[#b0aacf] uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-[#3a3560]">{value || "—"}</p>
      </div>
    </div>
  );
}

// ── Select Field ──────────────────────────────────────────────────────────────

function SelectField({ value, options, onChange, prefixIcon: PrefixIcon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={`flex items-center gap-3 border rounded-xl px-3 py-2 transition-all bg-[#faf9ff] ${
        focused
          ? "border-[#4f3fd8] ring-[3px] ring-[#4f3fd8]/10 bg-white"
          : "border-[#e0dcf8] hover:border-[#c5bef5]"
      }`}
    >
      <IconBox icon={PrefixIcon} />
      <div className="flex-1 relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full appearance-none bg-transparent text-sm font-semibold text-[#2d2560] focus:outline-none pr-6 py-1 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-[#b0aacf] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function UploadVideoPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [language, setLanguage] = useState("English");
  const [visibility, setVisibility] = useState("Public");
  const [focusedField, setFocusedField] = useState(null);
  const router = useRouter();

  const fileMeta = file
    ? {
        duration: "—",
        resolution: "—",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        format: file.name.split(".").pop()?.toUpperCase() ?? "—",
      }
    : { duration: "—", resolution: "—", size: "—", format: "—" };

  const inputRowCls = (field) =>
    `flex items-center gap-3 border rounded-xl px-3 py-2 transition-all ${
      focusedField === field
        ? "border-[#4f3fd8] ring-[3px] ring-[#4f3fd8]/10 bg-white"
        : "border-[#e0dcf8] bg-[#faf9ff] hover:border-[#c5bef5]"
    }`;

  return (
    <div className="min-h-screen bg-[#f8f8fb] font-sans ">

      {/* ── Header ── */}
      <div className="bg-white border-b border-[#ede9fd] px-8 pt-7 pb-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#18165a] tracking-tight">Upload Video</h1>
              <p className="text-sm text-[#9490b5] mt-0.5">
                Upload your pre-recorded video to create a short tutorial.
              </p>
            </div>
            <button onClick={() => router.back ()} 
             className="px-7 py-3 rounded-xl bg-[#4f3fd8] text-white text-sm font-bold shadow-sm hover:bg-[#3d2fc0] transition-colors">
              Back
            </button>
          </div>
          <StepIndicator />
        </div>
      </div>

      {/* ── Body ── */}
      <main className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ── Left: drop zone + metadata ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Drop zone card */}
          <div
            className="bg-white rounded-2xl p-4"
            style={{
              border: "1px solid #ddd8fa",
              boxShadow: "0 2px 12px 0 rgba(79,63,216,0.07), 0 1px 3px 0 rgba(79,63,216,0.04)",
            }}
          >
            <DropZone file={file} onFile={setFile} onClear={() => setFile(null)} />
          </div>

          {/* Metadata card */}
          <div
            className="bg-white rounded-2xl p-5 grid grid-cols-2 gap-5"
            style={{
              border: "1px solid #ddd8fa",
              boxShadow: "0 2px 12px 0 rgba(79,63,216,0.07), 0 1px 3px 0 rgba(79,63,216,0.04)",
            }}
          >
            <MetaItem icon={Clock} label="Duration" value={fileMeta.duration} />
            <MetaItem icon={Monitor} label="Resolution" value={fileMeta.resolution} />
            <MetaItem icon={FileVideo} label="File size" value={fileMeta.size} />
            <MetaItem icon={Play} label="Format" value={fileMeta.format} />
          </div>

          {/* Alert */}
          {!file && (
            <div
              className="flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-semibold text-[#7a6520]"
              style={{
                background: "#fffbec",
                border: "1px solid #f5e2a0",
                boxShadow: "0 1px 4px 0 rgba(245,226,160,0.3)",
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#d4941a]" />
              Upload a video to populate file metadata.
            </div>
          )}
        </div>

        {/* ── Right: Video Details card ── */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div
            className="bg-white rounded-2xl flex flex-col"
            style={{
              border: "1px solid #ddd8fa",
              boxShadow:
                "0 4px 24px 0 rgba(79,63,216,0.10), 0 1px 4px 0 rgba(79,63,216,0.06)",
            }}
          >
            {/* Card header */}
            <div className="flex items-center gap-4 px-7 pt-7 pb-5 border-b border-[#f0edfb]">
              <div className="w-11 h-11 rounded-xl bg-[#4f3fd8] flex items-center justify-center shadow-md flex-shrink-0">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#18165a] tracking-tight">Video Details</h2>
                <p className="text-sm text-[#9490b5] font-medium">Add information about your video</p>
              </div>
            </div>

            {/* Form fields */}
            <div className="px-7 py-6 flex flex-col gap-6">

              {/* Video Title */}
              <div>
                <FieldLabel label="Video Title" optional />
                <div className={inputRowCls("title")}>
                  <IconBox icon={Type} />
                  <input
                    type="text"
                    value={title}
                    maxLength={TITLE_MAX}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setFocusedField("title")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="e.g. Master React in 60s"
                    className="flex-1 bg-transparent text-sm font-medium text-[#2d2560] placeholder-[#c5c0df] focus:outline-none py-1"
                  />
                  <span className="text-[11px] font-bold text-[#c5c0df] flex-shrink-0">
                    {title.length} / {TITLE_MAX}
                  </span>
                </div>
              </div>

              {/* Video Link */}
              <div>
                <FieldLabel
                  label="Video Link"
                  optional
                  tooltip="Add a link to any external resource related to this video."
                />
                <div className={inputRowCls("link")}>
                  <IconBox icon={Link2} />
                  <input
                    type="url"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    onFocus={() => setFocusedField("link")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="https://github.com/..."
                    className="flex-1 bg-transparent text-sm font-medium text-[#2d2560] placeholder-[#c5c0df] focus:outline-none py-1"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <FieldLabel
                  label="Description"
                  tooltip="Help students find your video with a clear description."
                />
                <div
                  className={`flex items-start gap-3 border rounded-xl px-3 py-3 transition-all ${
                    focusedField === "desc"
                      ? "border-[#4f3fd8] ring-[3px] ring-[#4f3fd8]/10 bg-white"
                      : "border-[#e0dcf8] bg-[#faf9ff] hover:border-[#c5bef5]"
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#edeafd] flex items-center justify-center mt-0.5">
                    <AlignLeft className="w-4 h-4 text-[#4f3fd8]" />
                  </div>
                  <div className="flex-1 relative">
                    <textarea
                      value={description}
                      onChange={(e) =>
                        e.target.value.length <= DESC_MAX && setDescription(e.target.value)
                      }
                      onFocus={() => setFocusedField("desc")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Add #hashtags and a summary..."
                      rows={5}
                      className="w-full bg-transparent text-sm font-medium text-[#2d2560] placeholder-[#c5c0df] focus:outline-none resize-none leading-relaxed pb-5"
                    />
                    <span className="absolute bottom-0 right-0 text-[11px] font-bold text-[#c5c0df]">
                      {description.length} / {DESC_MAX}
                    </span>
                  </div>
                </div>
              </div>

              {/* Language + Visibility */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel label="Language" />
                  <SelectField
                    value={language}
                    options={LANGUAGES}
                    onChange={setLanguage}
                    prefixIcon={Globe}
                  />
                </div>
                <div>
                  <FieldLabel label="Visibility" />
                  <SelectField
                    value={visibility}
                    options={VISIBILITIES}
                    onChange={setVisibility}
                    prefixIcon={Lock}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Save Button ── */}
          <button
            className="flex items-center justify-center gap-2.5 px-8 w-full py-3 rounded-xl bg-[#4f3fd8] text-white text-sm font-black hover:bg-[#3d2fc0] active:scale-[0.99] transition-all"
            style={{ boxShadow: "0 2px 10px 0 rgba(79,63,216,0.28)" }}
          >
            <Save className="w-4 h-4" />
            Save Video
          </button>
        </div>
      </main>
    </div>
  );
}