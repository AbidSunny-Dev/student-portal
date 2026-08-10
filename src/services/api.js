const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (data) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    updateProfile: (data) =>
      request('/auth/profile', { method: 'POST', body: JSON.stringify(data) }),
    changePassword: (data) =>
      request('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
    resetPassword: (email, password) =>
      request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, password }) }),
  },

  // Students
  students: {
    getAll: () => request('/students'),
    create: (data) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/students/${id}`, { method: 'DELETE' }),
  },

  // Notices
  notices: {
    getAll: () => request('/notices'),
    create: (data) => request('/notices', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/notices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/notices/${id}`, { method: 'DELETE' }),
  },

  // Assignments
  assignments: {
    getAll: () => request('/assignments'),
    create: (data) => request('/assignments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/assignments/${id}`, { method: 'DELETE' }),
    submit: (id, studentId) => request(`/assignments/${id}/submit`, { method: 'POST', body: JSON.stringify({ studentId }) }),
    unsubmit: (id, studentId) => request(`/assignments/${id}/unsubmit`, { method: 'POST', body: JSON.stringify({ studentId }) }),
  },

  // Faculty
  faculty: {
    getAll: () => request('/faculty'),
    create: (data) => request('/faculty', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/faculty/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/faculty/${id}`, { method: 'DELETE' }),
  },

  // Study Materials
  materials: {
    getAll: () => request('/materials'),
    create: (data) => request('/materials', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/materials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/materials/${id}`, { method: 'DELETE' }),
  },

  // Question Bank
  questions: {
    getAll: () => request('/questions'),
    create: (data) => request('/questions', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/questions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/questions/${id}`, { method: 'DELETE' }),
  },

  // Results
  results: {
    getAll: () => request('/results'),
    save: (semesterId, studentId, subjectResults) =>
      request('/results', { method: 'POST', body: JSON.stringify({ semesterId, studentId, subjectResults }) }),
    deleteSemester: (semesterId) => request(`/results/${semesterId}`, { method: 'DELETE' }),
    deleteStudent: (semesterId, studentId) => request(`/results/${semesterId}/${studentId}`, { method: 'DELETE' }),
  },

  // Routine
  routine: {
    getAll: () => request('/routine'),
    update: (day, slots) => request(`/routine/${day}`, { method: 'PUT', body: JSON.stringify(slots) }),
  },

  // Subjects (lookup)
  subjects: {
    getAll: () => request('/subjects'),
  }
};
