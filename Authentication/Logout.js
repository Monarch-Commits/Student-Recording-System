import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';

import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { firebaseConfig } from '../firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Reference to elements
const logoutButton = document.getElementById('logout');

if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to exit the system?',

      showCancelButton: true,
      confirmButtonColor: '#064e3b',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      heightAuto: false,
    });

    if (result.isConfirmed) {
      try {
        await signOut(auth);
        await Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        window.location.replace('/index.html');
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    }
  });
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace('/index.html');
  } else {
    console.log('User active:', user.email);

    document.body.classList.remove('invisible');
  }
});
