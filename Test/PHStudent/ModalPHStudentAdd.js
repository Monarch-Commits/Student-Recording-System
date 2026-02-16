import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getDatabase,
  set,
  ref,
  push,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { firebaseConfig } from '../../firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
  const studentForm = document.getElementById('studentPHForm');
  const modal = document.getElementById('modalPHWrapper');
  const openBtn = document.getElementById('toggleFormPH');
  const closeBtn = document.getElementById('studentFormPHBack');

  if (!studentForm) return;

  // OPEN MODAL
  openBtn?.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  // CLOSE MODAL
  closeBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // FORM SUBMIT
  studentForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = studentForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const name = document.getElementById('namePH').value.trim();
    const year = document.getElementById('yearPH').value.trim();
    const address = document.getElementById('addressPH').value.trim();
    const program = document.getElementById('programPH').value.trim();
    const physicalHandicap = document
      .getElementById('physicalHandicap')
      .value.trim();
    const gender = document.getElementById('genderPH').value.trim();
    const major = document.getElementById('majorPH').value.trim();
    const ip = document.getElementById('ipPH').value.trim();
    const workingStudent = document
      .getElementById('workingStudentPH')
      .value.trim();
    const contactNumber = document
      .getElementById('contactNumberPH')
      .value.trim();

    // VALIDATION
    if (!name || !year || !contactNumber || !address) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill out all required fields.',
        confirmButtonColor: '#059669',
      });

      submitBtn.disabled = false;
      return;
    }

    // LOADING ALERT
    Swal.fire({
      title: 'Saving...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const addStudent = push(ref(database, 'studentsPH'));

      await set(addStudent, {
        name,
        year,
        address,
        gender,
        physicalHandicap,
        program,
        major,
        ip,
        workingStudent,
        contactNumber,
        createdAt: Date.now(),
      });

      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'PH Student added successfully.',
        confirmButtonColor: '#059669',
      });

      studentForm.reset();
      modal.classList.add('hidden');
    } catch (error) {
      Swal.close();

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }

    submitBtn.disabled = false;
  });
});
