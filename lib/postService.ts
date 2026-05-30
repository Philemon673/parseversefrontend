import { api } from './api';

export async function getAllPosts() {
  try {
    return await api.get('/posts');
  } catch (error) {
    throw error;
  }
}

export async function getPost(postId: string) {
  try {
    return await api.get(`/posts/${postId}`);
  } catch (error) {
    throw error;
  }
}

export async function createPost(data: {
  text: string;
  image?: string;
  videoUrl?: string;
  videoDuration?: string;
  type?: "TEXT" | "IMAGE" | "VIDEO";
  tags?: string[];
}) {
  try {
    return await api.post('/posts', data);
  } catch (error) {
    throw error;
  }
}

export async function likePost(postId: string) {
  try {
    return await api.post(`/posts/${postId}/like`);
  } catch (error) {
    throw error;
  }
}

export async function dislikePost(postId: string) {
  try {
    return await api.post(`/posts/${postId}/dislike`);
  } catch (error) {
    throw error;
  }
}

export async function deletePost(postId: string) {
  try {
    return await api.delete(`/posts/${postId}`);
  } catch (error) {
    throw error;
  }
}

export async function getPostComments(postId: string) {
  try {
    return await api.get(`/posts/${postId}/comments`);
  } catch (error) {
    throw error;
  }
}

export async function addPostComment(postId: string, text: string) {
  try {
    return await api.post(`/posts/${postId}/comments`, { text });
  } catch (error) {
    throw error;
  }
}

export async function deletePostComment(postId: string, commentId: string) {
  try {
    return await api.delete(`/posts/${postId}/comments/${commentId}`);
  } catch (error) {
    throw error;
  }
}

export async function uploadPostMedia(file: File, type: "image" | "video" = "image") {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  try {
    return await api.upload('/uploads/post-media', formData);
  } catch (error) {
    throw error;
  }
}
