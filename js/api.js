const API_BASE_URL = 'http://localhost:4000/api';

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const payload = await res.json();
  if (!res.ok) throw new Error(payload.error || payload.message || 'API error');
  return payload.data;
};

export const fetchStudents = () => request('/students');
export const fetchStudent = (id) => request(`/students/${id}`);
export const createStudent = (data) => request('/students', { method: 'POST', body: JSON.stringify(data) });
export const updateStudent = (id, data) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteStudent = (id) => request(`/students/${id}`, { method: 'DELETE' });

export default { fetchStudents, fetchStudent, createStudent, updateStudent, deleteStudent };
