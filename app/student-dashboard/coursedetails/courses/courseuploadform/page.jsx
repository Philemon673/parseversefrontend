"use client";

import { useState, useRef } from "react";
import { Upload, Bold, Italic, Underline, List, Link2, Image, ChevronDown, X, FileVideo, FileText } from "lucide-react";
import { categories, structure, uploadSteps } from "../coursedata/page";
import { CURRENCY_SYMBOL } from "../formatter/page";

function StepDot({ num, label, active, last }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
        active ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
      }`}>
        {num}
      </div>
      <span className={`text-sm font-medium ${active ? "text-indigo-600" : "text-gray-400"}`}>
        {label}
      </span>
      {!last && <div className="w-6 h-px bg-gray-300 mx-1" />}
    </div>
  );
}

export default function CourseUploadForm({ onSubmit }) {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [category, setCategory] = useState("");
  const [courseStructure, setCourseStructure] = useState("");
  const [price, setPrice] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  
  // File states
  const [courseFile, setCourseFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [courseFilePreview, setCourseFilePreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // File input refs
  const courseFileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // ──────────────────────────────────────────────────────────────
  // FILE VALIDATION
  // ──────────────────────────────────────────────────────────────
  
  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB for course files
  const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB for thumbnails

  const ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm'
  ];

  const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/epub+zip'
  ];

  const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  function validateCourseFile(file) {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return false;
    }

    // Check file type
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    const isDocument = ALLOWED_DOCUMENT_TYPES.includes(file.type);

    if (!isVideo && !isDocument) {
      alert('Please upload a valid video or document file (MP4, PDF, DOCX, etc.)');
      return false;
    }

    return true;
  }

  function validateThumbnail(file) {
    // Check file size
    if (file.size > MAX_THUMBNAIL_SIZE) {
      alert(`Thumbnail size must be less than ${MAX_THUMBNAIL_SIZE / (1024 * 1024)}MB`);
      return false;
    }

    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert('Please upload a valid image (JPG, PNG, WEBP)');
      return false;
    }

    return true;
  }

  // ──────────────────────────────────────────────────────────────
  // COURSE FILE HANDLERS
  // ──────────────────────────────────────────────────────────────

  function handleCourseFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateCourseFile(file)) {
      e.target.value = ''; // Reset input
      return;
    }

    setCourseFile(file);
    
    // Create preview for video files
    if (file.type.startsWith('video/')) {
      const preview = URL.createObjectURL(file);
      setCourseFilePreview(preview);
    } else {
      setCourseFilePreview(null);
    }
  }

  function handleCourseFileDrop(e) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!validateCourseFile(file)) return;

    setCourseFile(file);
    
    if (file.type.startsWith('video/')) {
      const preview = URL.createObjectURL(file);
      setCourseFilePreview(preview);
    } else {
      setCourseFilePreview(null);
    }
  }

  function removeCourseFile() {
    setCourseFile(null);
    setCourseFilePreview(null);
    if (courseFileInputRef.current) {
      courseFileInputRef.current.value = '';
    }
  }

  // ──────────────────────────────────────────────────────────────
  // THUMBNAIL HANDLERS
  // ──────────────────────────────────────────────────────────────

  function handleThumbnailChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateThumbnail(file)) {
      e.target.value = '';
      return;
    }

    setThumbnailFile(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function removeThumbnail() {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  }

  // ──────────────────────────────────────────────────────────────
  // FORM SUBMISSION
  // ──────────────────────────────────────────────────────────────

  function handleSubmit(e) {
    e.preventDefault();
    
    // Validation
    if (!courseTitle || !courseDesc || !category || !courseStructure || !price) {
      alert("Please fill in all required fields");
      return;
    }

    if (!courseFile) {
      alert("Please upload a course file");
      return;
    }

    if (!thumbnailFile) {
      alert("Please upload a thumbnail");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('title', courseTitle);
    formData.append('description', courseDesc);
    formData.append('category', category);
    formData.append('structure', courseStructure);
    formData.append('price', price);
    formData.append('courseFile', courseFile);
    formData.append('thumbnail', thumbnailFile);

    // Pass to parent (parent can upload to backend)
    onSubmit({
      title: courseTitle,
      description: courseDesc,
      category,
      structure: courseStructure,
      price: `${CURRENCY_SYMBOL}${price}`,
      courseFile,
      thumbnailFile,
      formData // Include FormData for backend upload
    });

    // Reset form
    setCourseTitle("");
    setCourseDesc("");
    setCategory("");
    setCourseStructure("");
    setPrice("");
    setCourseFile(null);
    setThumbnailFile(null);
    setCourseFilePreview(null);
    setThumbnailPreview(null);
    if (courseFileInputRef.current) courseFileInputRef.current.value = '';
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
  }

  // ──────────────────────────────────────────────────────────────
  // FORMAT FILE SIZE
  // ──────────────────────────────────────────────────────────────

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Course Upload</h2>
        <div className="flex items-center gap-1">
          {uploadSteps.map((step, i) => (
            <StepDot
              key={step.num}
              num={step.num}
              label={step.label}
              active={step.active}
              last={i === uploadSteps.length - 1}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-5">
          
          {/* ──────────────────────────────────────────────────── */}
          {/* LEFT SIDE: FILE UPLOADS */}
          {/* ──────────────────────────────────────────────────── */}
          
          <div className="flex flex-col gap-2 w-56 flex-shrink-0">
            
            {/* Course File Upload */}
            <div>
              <input
                ref={courseFileInputRef}
                type="file"
                accept="video/*,.pdf,.doc,.docx,.epub"
                onChange={handleCourseFileChange}
                className="hidden"
                id="courseFileInput"
              />
              
              {!courseFile ? (
                <label
                  htmlFor="courseFileInput"
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleCourseFileDrop}
                  className={`w-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 py-8 px-4 text-center cursor-pointer transition ${
                    isDragging ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Upload Course video/Hardcopy</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Drag & drop or{" "}
                      <span className="text-indigo-500 underline">browse</span>
                    </p>
                  </div>
                </label>
              ) : (
                <div className="w-56 border-2 border-green-200 rounded-2xl bg-green-50 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {courseFile.type.startsWith('video/') ? (
                        <FileVideo className="w-5 h-5 text-green-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-green-600" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {courseFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(courseFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCourseFile}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {courseFilePreview && (
                    <video 
                      src={courseFilePreview} 
                      className="w-full h-20 object-cover rounded-lg"
                      controls={false}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnailInput"
              />
              
              {!thumbnailFile ? (
                <label
                  htmlFor="thumbnailInput"
                  className="border border-gray-200 rounded-2xl py-2 px-3 text-center cursor-pointer transition hover:bg-indigo-50 flex items-center justify-center gap-2"
                >
                  <Image className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-500">Thumbnail Preview</p>
                </label>
              ) : (
                <div className="border-2 border-green-200 rounded-2xl bg-green-50 p-2 relative">
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-600 mt-1 text-center truncate">
                    {thumbnailFile.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ──────────────────────────────────────────────────── */}
          {/* RIGHT SIDE: FORM FIELDS */}
          {/* ──────────────────────────────────────────────────── */}
          
          <div className="flex-1 flex flex-col gap-4">
            {/* Row 1 */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter compelling course title"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  required
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400"
                />
              </div>

              <div className="w-52 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Course Structure 
                </label>
                <div className="relative">
                  <select
                    value={courseStructure}
                    onChange={(e) => setCourseStructure(e.target.value)}
                    required
                    className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-gray-700"
                  >
                    <option value="">Select structure</option>
                    {structure.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Course Description 
                </label>
                <div className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-t-xl bg-gray-50 border-b-0">
                  {[Bold, Italic, Underline].map((Icon, i) => (
                    <button 
                      key={i} 
                      type="button"
                      className="p-1 rounded hover:bg-gray-200 transition text-gray-500"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  {[List, Link2, Image].map((Icon, i) => (
                    <button 
                      key={i} 
                      type="button"
                      className="p-1 rounded hover:bg-gray-200 transition text-gray-500"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  placeholder="Write a detailed description about your course..."
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 pr-12 rounded-b-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400 resize-none"
                />
              </div>

              <div className="w-52 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Category 
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-gray-700"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Price ({CURRENCY_SYMBOL}) 
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                      {CURRENCY_SYMBOL}
                    </span>
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-gray-700"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 text-center text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition"
                >
                  Publish Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}