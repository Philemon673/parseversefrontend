import { api } from './api';

export const forumService = {
  getAllForums() {
    return api.get<any[]>('/forums');
  },

  getForum(id: string) {
    return api.get<any>(`/forums/${id}`);
  },

  getMessages(forumId: string, take = 50) {
    return api.get<any[]>(`/forums/${forumId}/messages?take=${take}`);
  },

  createForum(data: { name: string; description?: string }) {
    return api.post<any>('/forums', data);
  },

  updateForum(id: string, data: { name?: string; description?: string }) {
    return api.patch<any>(`/forums/${id}`, data);
  },

  joinForum(id: string) {
    return api.post<any>(`/forums/${id}/join`);
  },

  leaveForum(id: string) {
    return api.delete<any>(`/forums/${id}/leave`);
  },

  removeMember(forumId: string, memberId: string) {
    return api.delete<any>(`/forums/${forumId}/members/${memberId}`);
  },

  addMember(forumId: string, userId: string) {
    return api.post<any>(`/forums/${forumId}/members`, { userId });
  },

  getAllUsers() {
    return api.get<any[]>('/users');
  },

  muteForum(id: string) {
    return api.patch<any>(`/forums/${id}/mute`);
  },

  unmuteForum(id: string) {
    return api.patch<any>(`/forums/${id}/unmute`);
  },

  deleteForum(id: string) {
    return api.delete<any>(`/forums/${id}`);
  },
};

