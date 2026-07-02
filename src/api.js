import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all users from the API.
 * Maps the JSONPlaceholder user schema to our app's user schema:
 *   - firstName / lastName split from `name`
 *   - department mapped from `company.name`
 */
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data.map((user) => ({
    id: user.id,
    firstName: user.name.split(' ')[0],
    lastName: user.name.split(' ').slice(1).join(' '),
    email: user.email,
    department: user.company?.name || 'N/A',
  }));
};

/**
 * Add a new user (simulated — JSONPlaceholder returns a fake ID).
 */
export const addUser = async (userData) => {
  const payload = {
    name: `${userData.firstName} ${userData.lastName}`,
    email: userData.email,
    company: { name: userData.department },
  };
  const response = await api.post('/users', payload);
  return {
    id: response.data.id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    department: userData.department,
  };
};

/**
 * Update an existing user by ID.
 */
export const updateUser = async (id, userData) => {
  const payload = {
    name: `${userData.firstName} ${userData.lastName}`,
    email: userData.email,
    company: { name: userData.department },
  };
  const response = await api.put(`/users/${id}`, payload);
  return {
    id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    department: userData.department,
  };
};

/**
 * Delete a user by ID.
 */
export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
  return id;
};
