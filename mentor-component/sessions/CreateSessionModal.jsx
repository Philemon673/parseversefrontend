"use client";

import { useState } from 'react';
import { X, Video, Calendar, Clock, Users, Copy, Check, Link as LinkIcon } from 'lucide-react';

export default function CreateSessionModal({ isOpen, onClose, onCreateSession }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledTime: '',
    duration: '60',
    maxStudents: '50',
    isInstant: true
  });
  const [sessionCreated, setSessionCreated] = useState(false);
  const [sessionLink, setSessionLink] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const sessionId = `session-${Date.now()}`;
    const link = `${window.location.origin}/student-dashboard/sessions/${sessionId}`;
    setSessionLink(link);
    setSessionCreated(true);
    onCreateSession?.({ ...formData, sessionId, link });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setSessionCreated(false);
    setSessionLink('');
    setFormData({
      title: '',
      description: '',
      scheduledTime: '',
      duration: '60',
      maxStudents: '50',
      isInstant: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {!sessionCreated ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Video className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Create Live Session</h2>
                  <p className="text-xs text-slate-500 font-medium">Start teaching instantly or schedule for later</p>
                </div>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Session Type Toggle */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, isInstant: true})}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
                    formData.isInstant 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Video className={`w-5 h-5 mx-auto mb-2 ${formData.isInstant ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <p className={`text-sm font-bold ${formData.isInstant ? 'text-indigo-600' : 'text-slate-600'}`}>Start Now</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, isInstant: false})}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
                    !formData.isInstant 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Calendar className={`w-5 h-5 mx-auto mb-2 ${!formData.isInstant ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <p className={`text-sm font-bold ${!formData.isInstant ? 'text-indigo-600' : 'text-slate-600'}`}>Schedule</p>
                </button>
              </div>

              {/* Session Title */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Session Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Introduction to React Hooks"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="What will you cover in this session?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition text-sm resize-none"
                />
              </div>

              {/* Scheduled Time (only if not instant) */}
              {!formData.isInstant && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Scheduled Time *</label>
                  <input
                    type="datetime-local"
                    required={!formData.isInstant}
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition text-sm"
                  />
                </div>
              )}

              {/* Duration & Max Students */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Duration (mins)</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition text-sm"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Max Students</label>
                  <input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({...formData, maxStudents: e.target.value})}
                    min="1"
                    max="500"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition text-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                  {formData.isInstant ? 'Create & Start' : 'Schedule Session'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Session Created!</h3>
              <p className="text-slate-600 mb-6">Share this link with your students to invite them</p>

              {/* Session Link */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <LinkIcon className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Session Link</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sessionLink}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm text-slate-600 font-mono"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Session Details */}
              <div className="bg-indigo-50 rounded-2xl p-4 mb-6 text-left">
                <h4 className="font-bold text-slate-900 mb-3">{formData.title}</h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Duration: {formData.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Max Students: {formData.maxStudents}</span>
                  </div>
                  {!formData.isInstant && formData.scheduledTime && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>Scheduled: {new Date(formData.scheduledTime).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition"
                >
                  Close
                </button>
                {formData.isInstant && (
                  <button
                    onClick={() => window.location.href = `/mentor-dashboard/sessions/${formData.sessionId}`}
                    className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                  >
                    Start Teaching Now
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
