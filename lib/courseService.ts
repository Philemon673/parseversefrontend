import * as tus from 'tus-js-client';
import { api } from './api';

/** Step A: Ask backend to create a Bunny Stream video slot + signing credentials */
export async function initVideoUpload(title: string) {
  try {
    const res = await api.post('/courses/init-video-upload', { title });
    return res; // returns { videoId, signature, expiry, libraryId }
  } catch (err) {
    throw new Error('Failed to initialize video upload');
  }
}

/** Step B: Upload video file directly to Bunny Stream via TUS protocol */
export function uploadVideoToBunny(
  file: File,
  meta: { videoId: string; signature: string; expiry: number; libraryId: string },
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: 'https://video.bunnycdn.com/tusupload',
      retryDelays: [0, 3000, 5000, 10000],
      headers: {
        AuthorizationSignature: meta.signature,
        AuthorizationExpire: String(meta.expiry),
        VideoId: meta.videoId,
        LibraryId: String(meta.libraryId),
      },
      metadata: { filetype: file.type, title: file.name },
      onError: reject,
      onProgress: (uploaded, total) => onProgress(Math.round((uploaded / total) * 100)),
      onSuccess: resolve,
    });
    upload.start();
  });
}

/** Step C: POST course metadata + thumbnail/PDF to backend */
export async function createCourse(data: {
  title: string;
  description: string;
  category: string;
  structure: string;
  price: string;
  isFree?: boolean;
}) {
  try {
    // Create the course shell first
    const course = await api.post('/courses', data);
    return course;
  } catch (err) {
    throw new Error('Failed to create course');
  }
}

export async function uploadThumbnail(courseId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await api.upload(`/courses/${courseId}/upload-thumbnail`, formData);
    return res;
  } catch (err) {
    throw new Error('Failed to upload thumbnail');
  }
}

export async function uploadPdf(courseId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await api.upload(`/courses/${courseId}/upload-pdf`, formData);
    return res;
  } catch (err) {
    throw new Error('Failed to upload pdf');
  }
}

export async function publishCourse(courseId: string) {
  try {
    const res = await api.patch(`/courses/${courseId}/publish`, {});
    return res;
  } catch (err) {
    throw new Error('Failed to publish course');
  }
}

/** Fetch a single course (includes fresh signed pdfUrl from backend) */
export async function getCourse(id: string) {
  try {
    const res = await api.get(`/courses/${id}`);
    return res;
  } catch (err) {
    throw new Error('Failed to fetch course');
  }
}

// ── MODULES ─────────────────────────────────────────────────────────

export async function getCourseModules(courseId: string) {
  try {
    return await api.get(`/courses/${courseId}/modules`);
  } catch (err) {
    throw new Error('Failed to fetch modules');
  }
}

export async function addModule(courseId: string, data: { title: string; description: string; status: string }) {
  try {
    return await api.post(`/courses/${courseId}/modules`, data);
  } catch (err) {
    throw new Error('Failed to create module');
  }
}

export async function initModuleVideoUpload(courseId: string, moduleId: string, title: string) {
  try {
    return await api.post(`/courses/${courseId}/modules/${moduleId}/init-video-upload`, { title });
  } catch (err) {
    throw new Error('Failed to init module video upload');
  }
}

export async function uploadModulePdf(courseId: string, moduleId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    return await api.upload(`/courses/${courseId}/modules/${moduleId}/upload-pdf`, formData);
  } catch (err) {
    throw new Error('Failed to upload module PDF');
  }
}

export async function updateModule(courseId: string, moduleId: string, data: any) {
  try {
    return await api.patch(`/courses/${courseId}/modules/${moduleId}`, data);
  } catch (err) {
    throw new Error('Failed to update module');
  }
}

// ── STUDENT METHODS ──────────────────────────────────────────────────

/** Get all published courses for student discovery */
export async function getAllCourses(category?: string, level?: string) {
  try {
    let url = '/courses';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (level) params.append('level', level);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    return await api.get(url);
  } catch (err) {
    throw new Error('Failed to fetch courses');
  }
}

/** Get student's enrolled courses */
export async function getMyEnrolledCourses() {
  try {
    return await api.get('/courses/my');
  } catch (err) {
    throw new Error('Failed to fetch enrolled courses');
  }
}

/** Enroll in a course */
export async function enrollInCourse(courseId: string) {
  try {
    return await api.post(`/courses/${courseId}/enroll`);
  } catch (err) {
    throw new Error('Failed to enroll in course');
  }
}

/** Get student progress in a course */
export async function getCourseProgress(courseId: string) {
  try {
    return await api.get(`/courses/${courseId}/progress`);
  } catch (err) {
    throw new Error('Failed to fetch progress');
  }
}

/** Update student progress (completedLessons count) */
export async function updateCourseProgress(courseId: string, completedLessons: number) {
  try {
    return await api.patch(`/courses/${courseId}/progress`, { completedLessons });
  } catch (err) {
    throw new Error('Failed to update progress');
  }
}

/** Get all courses created by the currently logged-in instructor */
export async function getInstructorCourses() {
  try {
    return await api.get('/courses/instructor');
  } catch (err) {
    throw new Error('Failed to fetch instructor courses');
  }
}
