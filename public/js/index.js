/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alert';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
  try {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
  } catch (error) {
    console.error('Error parsing map locations:', error);
    showAlert('error', 'Unable to load map locations. Please refresh the page.');
  }
}

async function handleAjaxError(error, defaultMessage = 'An error occurred') {
  console.error('Full error details:', error);
  
  // Check if it's a response error
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Error response data:', error.response.data);
    console.error('Error response status:', error.response.status);
    console.error('Error response headers:', error.response.headers);
    
    // Try to parse and show server error message
    try {
      const errorMessage = error.response.data.message || defaultMessage;
      showAlert('error', errorMessage);
    } catch {
      showAlert('error', defaultMessage);
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    showAlert('error', 'No response from server. Please check your connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error setting up request:', error.message);
    showAlert('error', defaultMessage);
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    if (email && password) {
      login(email.value, password.value)
        .catch(error => handleAjaxError(error, 'Login failed'));
    }
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', () => {
    logout().catch(error => handleAjaxError(error, 'Logout failed'));
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data')
      .catch(error => handleAjaxError(error, 'Failed to update user data'));
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const saveButton = document.querySelector('.btn--save-password');
    saveButton.textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    try {
      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password'
      );
      
      // Reset form and button
      saveButton.textContent = 'Save password';
      e.target.reset();
      showAlert('success', 'Password updated successfully');
    } catch (error) {
      handleAjaxError(error, 'Failed to update password');
      saveButton.textContent = 'Save password';
    }
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    
    bookTour(tourId)
      .catch(error => {
        handleAjaxError(error, 'Failed to book tour');
        e.target.textContent = 'Book tour';
      });
  });

  const alertMessage = document.querySelector('body').dataset.alert;
  if (alertMessage) {
    showAlert('success', alertMessage, 20);
  }
}