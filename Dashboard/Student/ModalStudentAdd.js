import '../../Authentication/Logout.js';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getDatabase,
  set,
  ref,
  push,
  onValue,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { firebaseConfig } from '../../firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Global State
let allStudents = [];
let myDonutChart;

// --- Sidebar Logic ---
const mobileBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

function toggleSidebar() {
  sidebar.classList.toggle('-translate-x-full');
  overlay.classList.toggle('hidden');
}

if (mobileBtn) mobileBtn.addEventListener('click', toggleSidebar);
if (overlay) overlay.addEventListener('click', toggleSidebar);

// --- Modal Controls ---
const setupModal = (openBtnId, modalId, closeBtnId) => {
  const openBtn = document.getElementById(openBtnId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);

  openBtn?.addEventListener('click', () => modal.classList.remove('hidden'));
  closeBtn?.addEventListener('click', () => modal.classList.add('hidden'));
};

// Initialize modals for both Student and PH Student
setupModal('toggleFormStudent', 'modalWrapper', 'studentFormBack');
setupModal('toggleFormPH', 'modalPHWrapper', 'studentFormPHBack');

// --- Chart Logic ---
function initializeChart(male, female) {
  const ctx = document.getElementById('myDonutChart').getContext('2d');
  myDonutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Male', 'Female'],
      datasets: [
        {
          data: [male, female],
          backgroundColor: ['#10b981', '#fb7185'],
          borderWidth: 0,
          borderRadius: 10,
          hoverOffset: 10,
        },
      ],
    },
    options: {
      cutout: '80%',
      plugins: { legend: { display: false } },
      animation: { animateRotate: true, duration: 2000 },
    },
  });
}

// --- Data Fetching & Sync ---
function fetchStudents() {
  const studentRef = ref(database, 'students');

  onValue(studentRef, (snapshot) => {
    allStudents = [];
    let maleCounter = 0;
    let femaleCounter = 0;

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const student = childSnapshot.val();
        allStudents.push({ id: childSnapshot.key, ...student });

        const gender = (student.gender || '').toLowerCase();
        if (gender === 'male') maleCounter++;
        else if (gender === 'female') femaleCounter++;
      });
    }

    // Sort by newest
    allStudents.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Update Text Displays
    document.getElementById('totalRegisteredCount').textContent =
      allStudents.length;
    document.getElementById('maleCount').textContent = maleCounter;
    document.getElementById('femaleCount').textContent = femaleCounter;

    // Update Chart
    if (!myDonutChart) {
      initializeChart(maleCounter, femaleCounter);
    } else {
      myDonutChart.data.datasets[0].data = [maleCounter, femaleCounter];
      myDonutChart.update();
    }

    renderTablePage();
  });
}

// Fetch PH Statistics (Separated if you want separate counters)
function fetchPHStatistics() {
  const phRef = ref(database, 'studentsPH');
  onValue(phRef, (snapshot) => {
    let phTotal = 0;
    let phMale = 0;
    let phFemale = 0;

    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        const data = child.val();
        phTotal++;
        const gender = (data.gender || '').toLowerCase();
        if (gender === 'male') phMale++;
        else if (gender === 'female') phFemale++;
      });
    }

    document.getElementById('totalHandicapCount').textContent = phTotal;
    document.getElementById('maleHandicapCount').textContent = phMale;
    document.getElementById('femaleHandicapCount').textContent = phFemale;
  });
}

// --- Form Submissions ---
async function handleFormSubmit(event, dbPath, formId, modalId) {
  event.preventDefault();
  const form = document.getElementById(formId);
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  const formData = {};
  // Automatically collect all named inputs/selects
  form.querySelectorAll('input, select').forEach((el) => {
    if (el.id) {
      // Mapping for PH fields if they have different IDs than the schema
      let key = el.id.replace('PH', '');
      formData[key] = el.value.trim();
    }
  });

  if (!formData.name || !formData.contactNumber) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Fields',
      text: 'Name and Contact are required.',
    });
    submitBtn.disabled = false;
    return;
  }

  Swal.fire({ title: 'Saving...', didOpen: () => Swal.showLoading() });

  try {
    const newRef = push(ref(database, dbPath));
    await set(newRef, { ...formData, createdAt: Date.now() });

    Swal.fire({
      icon: 'success',
      title: 'Saved!',
      showConfirmButton: false,
      timer: 1500,
    });
    form.reset();
    document.getElementById(modalId).classList.add('hidden');
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: error.message });
  }
  submitBtn.disabled = false;
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  fetchStudents();
  fetchPHStatistics();

  document
    .getElementById('studentForm')
    ?.addEventListener('submit', (e) =>
      handleFormSubmit(e, 'students', 'studentForm', 'modalWrapper'),
    );

  document
    .getElementById('studentPHForm')
    ?.addEventListener('submit', (e) =>
      handleFormSubmit(e, 'studentsPH', 'studentPHForm', 'modalPHWrapper'),
    );
});

function renderTablePage() {
  // Logic to render rows in your table
  console.log('Table Sync:', allStudents.length, 'students.');
}
