import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { firebaseConfig } from '../firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('loginForm');

// Login Handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    Swal.fire({
      icon: 'error',
      title: 'Missing Fields',
      text: 'Please enter both email and password.',
      background: '#0f172a',
      color: '#f1f5f9',
      confirmButtonColor: '#0ea5e9',
    });
    return;
  }

  try {
    Swal.fire({
      title: 'Authenticating...',
      allowOutsideClick: false,
      background: '#0f172a',
      color: '#f1f5f9',
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    Swal.fire({
      icon: 'success',
      title: 'Welcome back!',
      text: userCredential.user.email,
      timer: 1500,
      showConfirmButton: false,
      background: '#0f172a',
      color: '#f1f5f9',
    });

    setTimeout(() => {
      window.location.href = '/Test/Student/StudentGet.html';
    }, 1500);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: 'Invalid email or password.',
      background: '#0f172a',
      color: '#f1f5f9',
    });
  }
});
