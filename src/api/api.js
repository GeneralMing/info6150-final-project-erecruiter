import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8001/', // Ensure this is the correct backend URL
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Set the token when the app starts, if available
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

export default api; // Fixed export statement
