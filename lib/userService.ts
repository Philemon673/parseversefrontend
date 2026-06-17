// User API service functions with enhanced security
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Request interceptor for security headers
const secureRequest = async (url: string, options: RequestInit = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-cache',
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const secureOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    // In dev, cross-origin might happen if api is on different port, 
    // but credentials: 'same-origin' is fine as long as we use Bearer token
  };

  return fetch(url, secureOptions);
};

const handleApiError = (error: any, operation: string) => {
  // Don't use console.error in Next.js dev mode as it triggers the full-screen error overlay
  // even for handled errors.
  
  if (error && error.message && error.message.includes('fetch')) {
    throw new Error('Network error. Please check your connection to the backend API.');
  }
  
  throw error;
};

export const userService = {
  async getMyBadges() {
    try {
      const response = await secureRequest(`${API_BASE_URL}/badges/my`, {
        method: 'GET',
      });
      if (!response.ok) return { total: 0, badges: [] };
      return await response.json();
    } catch (error) {
      console.error('Error fetching badges:', error);
      return { total: 0, badges: [] };
    }
  },

  async checkBadges() {
    try {
      const response = await secureRequest(`${API_BASE_URL}/badges/check`, {
        method: 'POST',
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error checking badges:', error);
      return null;
    }
  },

  // ── Scheduling & Availability API ──────────────────────────────────────────
  async getSessions() {
    try {
      const response = await secureRequest(`${API_BASE_URL}/schedule`, { method: 'GET' });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  },

  async createSession(data: any) {
    try {
      const response = await secureRequest(`${API_BASE_URL}/schedule`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create session');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async updateSession(id: string, data: any) {
    try {
      const response = await secureRequest(`${API_BASE_URL}/schedule/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update session');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async deleteSession(id: string) {
    try {
      const response = await secureRequest(`${API_BASE_URL}/schedule/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete session');
      }
      return true;
    } catch (error) {
      throw error;
    }
  },

  async updateAvailability(availability: any) {
    try {
      const response = await secureRequest(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        body: JSON.stringify({ availability }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save availability');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // ── Notifications API ──────────────────────────────────────────────────────
  async getUserNotifications() {
    try {
      // Get the profile first to get the user ID, or use 'me' if backend supports it.
      // Wait, backend expects /notifications/user/:userId
      const user = await this.getUserProfile();
      if (!user || !user.id) return [];
      const response = await secureRequest(`${API_BASE_URL}/notifications/user/${user.id}`, { method: 'GET' });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  async markNotificationAsRead(id: string) {
    try {
      const response = await secureRequest(`${API_BASE_URL}/notifications/read/${id}`, { method: 'GET' });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      return true;
    } catch (error) {
      console.error('Error marking notification read:', error);
      return false;
    }
  },

  // Get current logged-in user profile via /users/me
  async getUserProfile(_userId?: any) {
    try {
      const response = await secureRequest(`${API_BASE_URL}/users/me`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: Failed to fetch user profile`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      handleApiError(error, 'getUserProfile');
    }
  },

  async logSearch(query: string) {
    try {
      const response = await secureRequest(`${API_BASE_URL}/users/search-log`, {
        method: 'POST',
        body: JSON.stringify({ query }),
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to log search', error);
      return false;
    }
  },

  async getTrendingSearches() {
    try {
      const response = await secureRequest(`${API_BASE_URL}/users/search-trending`, {
        method: 'GET',
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch trending searches', error);
      return [];
    }
  },

  // Update current logged-in user profile via PATCH /users/me
  async updateUserProfile(_userId: any, profileData: UpdateProfileData) {
    try {
      // Client-side validation
      if (profileData.email && !this.validateEmail(profileData.email)) {
        throw new Error('Invalid email format');
      }

      if (profileData.phone && !this.validatePhone(profileData.phone)) {
        throw new Error('Invalid phone number format');
      }

      // Sanitize input data
      const sanitizedData = this.sanitizeProfileData(profileData);

      const response = await secureRequest(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: Failed to update profile`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      handleApiError(error, 'updateUserProfile');
    }
  },

  // Upload user avatar with security checks
  async uploadAvatar(file: File) {
    try {
      // Validate file
      const validationResult = this.validateFile(file);
      if (!validationResult.valid) {
        throw new Error(validationResult.error);
      }

      const formData = new FormData();
      formData.append('file', file);

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const response = await fetch(`${API_BASE_URL}/uploads/avatar`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to upload avatar');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      handleApiError(error, 'uploadAvatar');
    }
  },

  // Validation utilities
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 255;
  },

  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
  },

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }

    return { valid: true };
  },

  // Sanitize input data
  sanitizeProfileData(data: UpdateProfileData): UpdateProfileData {
    const capitalize = (str: string) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

    const sanitized: UpdateProfileData = {};

    if (data.firstName) {
      sanitized.firstName = data.firstName.trim().substring(0, 100);
    }
    if (data.lastName) {
      sanitized.lastName = data.lastName.trim().substring(0, 100);
    }

    // email is lowercased before saving
    if (data.email) {
      sanitized.email = data.email.toLowerCase().trim();
    }

    if (data.country) {
      sanitized.country = capitalize(data.country.trim()).substring(0, 100);
    }

    if (data.phone) {
      sanitized.phone = data.phone.replace(/[^\d+\-\s()]/g, '').trim();
    }

    if (data.city) {
      sanitized.city = capitalize(data.city.trim()).substring(0, 100);
    }

    if (data.address) {
      sanitized.address = data.address.trim().substring(0, 255);
    }

    if (data.state) {
      sanitized.state = data.state.trim().substring(0, 100);
    }

    if (data.interests) {
      sanitized.interests = data.interests.map(i => i.trim()).filter(Boolean);
    }

    if (data.bio) {
      sanitized.bio = data.bio.trim().substring(0, 500);
    }
    if (data.dob) {
      sanitized.dob = data.dob.trim().substring(0, 100);
    }
    if (data.qualification) {
      sanitized.qualification = data.qualification.trim().substring(0, 255);
    }
    if (data.gender) {
      sanitized.gender = data.gender.trim().substring(0, 50);
    }
    if (data.experience) {
      sanitized.experience = data.experience.trim().substring(0, 100);
    }
    if (data.languages) {
      sanitized.languages = data.languages.trim().substring(0, 255);
    }
    if (data.subjects) {
      sanitized.subjects = data.subjects.trim().substring(0, 255);
    }
    if (data.prefOnline) {
      sanitized.prefOnline = data.prefOnline.trim().substring(0, 100);
    }
    if (data.prefOneToOne) {
      sanitized.prefOneToOne = data.prefOneToOne.trim().substring(0, 100);
    }
    if (data.prefGroupSession) {
      sanitized.prefGroupSession = data.prefGroupSession.trim().substring(0, 100);
    }
    if (data.prefHomeTutoring) {
      sanitized.prefHomeTutoring = data.prefHomeTutoring.trim().substring(0, 100);
    }

    return sanitized;
  },

  // ── Weekly Availability ─────────────────────────────────────────
  // Availability is stored as JSON on the User model via PATCH /users/me
  async updateAvailability(availability: Record<string, any>) {
    try {
      const response = await secureRequest(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        body: JSON.stringify({ availability }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update availability`);
      }
      return await response.json();
    } catch (error) {
      handleApiError(error, 'updateAvailability');
    }
  },

  // ── Scheduled Sessions ──────────────────────────────────────────
  async getSessions(): Promise<any[]> {
    try {
      const response = await secureRequest(`${API_BASE_URL}/schedule`, { method: 'GET' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch sessions`);
      }
      return await response.json();
    } catch (error) {
      handleApiError(error, 'getSessions');
      return [];
    }
  },

  async createSession(sessionData: SessionData): Promise<any> {
    try {
      const response = await secureRequest(`${API_BASE_URL}/schedule`, {
        method: 'POST',
        body: JSON.stringify(sessionData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create session`);
      }
      return await response.json();
    } catch (error) {
      handleApiError(error, 'createSession');
    }
  },

  async updateSession(sessionId: string, sessionData: Partial<SessionData>): Promise<any> {
    try {
      const response = await secureRequest(`${API_BASE_URL}/schedule/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify(sessionData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update session`);
      }
      return await response.json();
    } catch (error) {
      handleApiError(error, 'updateSession');
    }
  },

  async deleteSession(sessionId: string): Promise<any> {
    try {
      const response = await secureRequest(`${API_BASE_URL}/schedule/${sessionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to delete session`);
      }
      return await response.json();
    } catch (error) {
      handleApiError(error, 'deleteSession');
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await secureRequest(`${API_BASE_URL}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // ── Follow System API ──────────────────────────────────────────────────
  async followUser(userId: string) {
    try {
      const response = await secureRequest(`${API_BASE_URL}/users/${userId}/follow`, {
        method: 'POST',
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to follow user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  },

  async unfollowUser(userId: string) {
    try {
      const response = await secureRequest(`${API_BASE_URL}/users/${userId}/unfollow`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to unfollow user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  },

  async getFollowers(userId: string = 'me') {
    try {
      const response = await secureRequest(`${API_BASE_URL}/users/${userId}/followers`, {
        method: 'GET',
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching followers:', error);
      return [];
    }
  },

  async getFollowing(userId: string = 'me') {
    try {
      const response = await secureRequest(`${API_BASE_URL}/users/${userId}/following`, {
        method: 'GET',
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching following:', error);
      return [];
    }
  }
};

// Enhanced TypeScript interfaces
export interface User {
  id: number;
  name: string;
  email: string;
  country: string;
  phone: string;
  city: string;
  memberSince: string;
  role: 'STUDENT' | 'MENTOR' | 'ADMIN';
  avatar: string;
  stats: {
    enrolledCourses: number;
    certificates: number;
    points: number;
    hoursStudied: number;
    completedCourses: number;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  phone?: string;
  city?: string;
  address?: string;
  state?: string;
  interests?: string[];
  // Details tab fields
  bio?: string;
  dob?: string;
  qualification?: string;
  gender?: string;
  experience?: string;
  languages?: string;
  subjects?: string;
  prefOnline?: string;
  prefOneToOne?: string;
  prefGroupSession?: string;
  prefHomeTutoring?: string;
  availability?: Record<string, any>;
}

export interface SessionData {
  dateTime: string;
  student: string;
  subject: string;
  type: string;
  duration: string;
  status?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}