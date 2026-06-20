import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function login(payload) {
  return apiClient.post('/auth/login', payload);
}

export function register(payload) {
  return apiClient.post('/auth/register', payload);
}
