/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

// Global error handler
window.addEventListener('error', (event) => {
  const errorMessage = event.error?.message || 'An unexpected error occurred';
  console.error('Uncaught error:', event.error);
  showAlert('error', errorMessage);
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason?.message || 'An unhandled error occurred';
  console.error('Unhandled promise rejection:', event.reason);
  showAlert('error', errorMessage);
});

export const login = async (email, password) => {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: { email, password },
      withCredentials: true
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      throw new Error('Login failed');
    }
  } catch (err) {
    if (err.response) {
      // Server responded with an error
      showAlert('error', err.response.data.message || 'Login failed');
    } else if (err.request) {
      // Request made but no response received
      showAlert('error', 'No response from server. Please check your connection.');
    } else {
      // Error setting up the request
      showAlert('error', err.message || 'An unexpected error occurred');
    }
    throw err; // Re-throw to allow caller to handle
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
      withCredentials: true
    });

    if (res.data.status === 'success') {
      location.reload(true);
    } else {
      throw new Error('Logout failed');
    }
  } catch (err) {
    if (err.response) {
      showAlert('error', err.response.data.message || 'Error logging out');
    } else if (err.request) {
      showAlert('error', 'No response from server during logout');
    } else {
      showAlert('error', err.message || 'Error logging out');
    }
    throw err; // Re-throw to allow caller to handle
  }
};