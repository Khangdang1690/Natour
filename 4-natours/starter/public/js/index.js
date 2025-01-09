/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

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
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    if (email && password) {
      login(email.value, password.value).catch(error => {
        console.error('Login error:', error);
      });
    }
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', () => {
    logout().catch(error => {
      console.error('Logout error:', error);
    });
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
    } catch (error) {
      console.error('Update password error:', error);
      saveButton.textContent = 'Save password';
    }
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    
    bookTour(tourId).catch(error => {
      console.error('Book tour error:', error);
      e.target.textContent = 'Book tour';
    });
  });
}