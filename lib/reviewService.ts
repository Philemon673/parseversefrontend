import { api } from './api';

export async function addCourseReview(courseId, rating, comment) {
  try {
    const response = await api.post(`/reviews/${courseId}`, { rating, comment });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseReviews(courseId) {
  try {
    const response = await api.get(`/reviews/course/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
