import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Account created successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    // Handle specific error messages
    const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
    showAlert('error', errorMessage);
  }
};

// Event Listener for Signup Form
if (document.querySelector('.form--signup')) {
  document.querySelector('.form--signup').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    // Basic client-side validation
    if (password !== passwordConfirm) {
      showAlert('error', 'Passwords do not match');
      return;
    }

    signup(name, email, password, passwordConfirm);
  });
};
