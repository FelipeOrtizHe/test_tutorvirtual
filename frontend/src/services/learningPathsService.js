import { apiClient } from './apiClient.js';

export async function fetchLearningPaths() {
  const { data } = await apiClient.get('/api/learning-paths');
  return data.items;
}

export async function fetchLearningPathById(id) {
  const { data } = await apiClient.get(`/api/learning-paths/${id}`);
  return data;
}

export async function fetchStatus() {
  const { data } = await apiClient.get('/api/status');
  return data;
}
