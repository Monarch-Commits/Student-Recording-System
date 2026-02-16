import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getDatabase,
  set,
  ref,
  push,
  onValue, // DAGDAG: Kailangan ito para sa fetchStudents
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { firebaseConfig } from '../../firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Global State (Para hindi mag-error ang fetch)
let allStudents = [];

const mobileBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

// Sidebar toggle
function toggleSidebar() {
  sidebar.classList.toggle('-translate-x-full');
  overlay.classList.toggle('hidden');
}

if (mobileBtn) mobileBtn.addEventListener('click', toggleSidebar);
if (overlay) overlay.addEventListener('click', toggleSidebar);

// Close sidebar when clicking links on mobile
sidebar?.querySelectorAll('button, a').forEach((item) => {
  item.addEventListener('click', () => {
    if (window.innerWidth < 1024) toggleSidebar();
  });
});

// ---------------------------------------------------------
// RENDER TABLE FUNCTION (Dapat defined ito para hindi mag-error)
// ---------------------------------------------------------
function renderTablePage() {
  console.log('Data updated, rendering table...', allStudents);
  // Dito mo ilalagay yung logic ng pag-render ng table rows na ginawa natin kanina
}

document.addEventListener('DOMContentLoaded', () => {
  const studentForm = document.getElementById('studentForm');
  const modal = document.getElementById('modalWrapper');
  const openBtn = document.getElementById('toggleFormStudent');
  const closeBtn = document.getElementById('studentFormBack');

  if (!studentForm) return;

  // OPEN MODAL
  openBtn?.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  // CLOSE MODAL
  closeBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // FORM SUBMIT
  studentForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = studentForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    // Get values
    const name = document.getElementById('name').value.trim();
    const year = document.getElementById('year').value.trim();
    const address = document.getElementById('address').value.trim();
    const program = document.getElementById('program').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const major = document.getElementById('major').value.trim();
    const ip = document.getElementById('ip').value.trim();
    const workingStudent = document
      .getElementById('workingStudent')
      .value.trim();
    const contactNumber = document.getElementById('contactNumber').value.trim();

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

    Swal.fire({
      title: 'Saving...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const studentRef = ref(database, 'students');
      const newStudentRef = push(studentRef);

      await set(newStudentRef, {
        name,
        year,
        address,
        gender,
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
        text: 'Student added successfully.',
        confirmButtonColor: '#059669',
      });

      studentForm.reset();
      modal.classList.add('hidden');
    } catch (error) {
      Swal.close();
      await Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
    submitBtn.disabled = false;
  });

  // Simulan ang pakikinig sa data
  fetchStudents();
});

// ---------------------------------------------------------
// FETCH STUDENTS FUNCTION
// ---------------------------------------------------------
function fetchStudents() {
  const studentRef = ref(database, 'students');

  onValue(studentRef, (snapshot) => {
    allStudents = [];
    let maleCounter = 0;
    let femaleCounter = 0;

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const student = childSnapshot.val();
        const studentId = childSnapshot.key;
        allStudents.push({ id: studentId, ...student });

        // Bilangin ang Male at Female
        const gender = (student.gender || '').toLowerCase();
        if (gender === 'male') maleCounter++;
        else if (gender === 'female') femaleCounter++;
      });
    }

    allStudents.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    const totalDisplay = document.getElementById('totalRegisteredCount');
    const maleDisplay = document.getElementById('maleCount');
    const femaleDisplay = document.getElementById('femaleCount');

    if (totalDisplay) totalDisplay.textContent = allStudents.length;
    if (maleDisplay) maleDisplay.textContent = maleCounter;
    if (femaleDisplay) femaleDisplay.textContent = femaleCounter;
    renderTablePage();
  });
}
