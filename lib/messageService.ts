import { api } from './api';

/**
 * messageService — Frontend service for 1-on-1 Direct Messaging REST calls.
 * Real-time delivery is handled via socket-context (sendDirectMessage, newDirectMessage events).
 */
export const messageService = {
  /**
   * Fetch the DM inbox: a list of unique conversation partners with last message preview + unread count.
   */
  async getInbox(): Promise<any[]> {
    try {
      const res = await api.get<any[]>('/messages/inbox');
      return Array.isArray(res) ? res : [];
    } catch (err) {
      console.error('Failed to fetch inbox:', err);
      return [];
    }
  },

  /**
   * Fetch the full message history with a specific user.
   */
  async getConversation(userId: string, take = 50): Promise<any[]> {
    try {
      const res = await api.get<any[]>(`/messages/conversation/${userId}?take=${take}`);
      return Array.isArray(res) ? res : [];
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
      return [];
    }
  },

  /**
   * Get total unread DM count for the current user.
   */
  async getUnreadCount(): Promise<number> {
    try {
      const res = await api.get<{ count: number }>('/messages/unread-count');
      return res?.count ?? 0;
    } catch {
      return 0;
    }
  },

  /**
   * Mark all messages from a sender as read.
   */
  async markConversationAsRead(senderId: string): Promise<void> {
    try {
      await api.patch(`/messages/read/${senderId}`, {});
    } catch (err) {
      console.error('Failed to mark conversation as read:', err);
    }
  },
};
