"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Play, BookOpen, UploadCloud, CheckCircle, Video, FileText } from "lucide-react";
import { getCourse, getCourseModules, addModule, initModuleVideoUpload, uploadVideoToBunny, uploadModulePdf, updateModule, publishCourse } from "@/lib/courseService";

export default function ModuleManagerPage() {
  const { courseId } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFile, setNewFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const c = await getCourse(courseId);
        const m = await getCourseModules(courseId);
        setCourse(c.data || c);
        setModules(m.data || m || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [courseId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewFile(file);
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!newTitle) return alert("Title is required");
    if (!newFile) return alert("Please select a file for this module");

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Create the module shell
      const modRes = await addModule(courseId, { title: newTitle, description: newDesc, status: "Draft" });
      const moduleId = modRes.data?.id || modRes.id;

      // 2. Upload file based on course category
      if (course.category === "Video") {
        const metaRes = await initModuleVideoUpload(courseId, moduleId, newTitle);
        const meta = metaRes.data || metaRes;
        await uploadVideoToBunny(newFile, meta, setUploadProgress);
        // Mark as Published and link videoId
        await updateModule(courseId, moduleId, { status: "Published", videoId: meta.videoId });
      } else {
        await uploadModulePdf(courseId, moduleId, newFile);
        await updateModule(courseId, moduleId, { status: "Published" });
      }

      // Reload modules
      const m = await getCourseModules(courseId);
      setModules(m.data || m || []);

      // Reset form
      setShowAddForm(false);
      setNewTitle("");
      setNewDesc("");
      setNewFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to create module: " + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFinishCourse = async () => {
    if (modules.length === 0) {
      if (!window.confirm("You have 0 modules. Are you sure you want to publish this course?")) return;
    }
    try {
      await publishCourse(courseId);
      alert("Course published successfully!");
      router.push("/mentor-dashboard/courses");
    } catch (err) {
      console.error(err);
      alert("Failed to publish course");
    }
  };

  if (isLoading) return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  if (!course) return <div className="p-10 text-center text-red-500">Course not found</div>;

  return (
    <div className="p-6 bg-[#f2f3fa] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Modules</h1>
            <p className="text-gray-500 text-sm mt-1">{course.title}</p>
          </div>
          <button 
            onClick={handleFinishCourse}
            className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
          >
            Publish Entire Course
          </button>
        </div>

        {/* Existing Modules */}
        <div className="space-y-4 mb-8">
          {modules.map((m, index) => (
            <div key={m.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{m.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {m.status}
                    </span>
                    {course.category === "Video" ? (
                      <span className="flex items-center text-xs text-gray-500 gap-1"><Video className="w-3 h-3" /> Video Attached</span>
                    ) : (
                      <span className="flex items-center text-xs text-gray-500 gap-1"><FileText className="w-3 h-3" /> PDF Attached</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {modules.length === 0 && !showAddForm && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No modules added yet.</p>
            </div>
          )}
        </div>

        {/* Add New Module Section */}
        {!showAddForm ? (
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-indigo-200 rounded-2xl text-indigo-600 font-semibold hover:bg-indigo-50 transition"
          >
            <Plus className="w-5 h-5" />
            Add New Module
          </button>
        ) : (
          <form onSubmit={handleCreateModule} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">New Module Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Module Title *</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description (Optional)</label>
                <textarea 
                  value={newDesc} 
                  onChange={e => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Upload {course.category} File *</label>
                <input 
                  type="file" 
                  accept={course.category === 'Video' ? 'video/*' : '.pdf,.doc,.docx,.epub'}
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  required
                />
              </div>

              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  <p className="text-xs text-center mt-1 text-gray-500">Uploading: {uploadProgress}%</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  disabled={isUploading}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Save Module"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
