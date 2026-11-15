import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('km_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = (err.config && err.config.url) || '';
    if (err.response && err.response.status === 401 && !url.startsWith('/auth/login')) {
      localStorage.removeItem('km_token');
      window.dispatchEvent(new Event('km-logout'));
    }
    return Promise.reject(err);
  }
);

export default api;
