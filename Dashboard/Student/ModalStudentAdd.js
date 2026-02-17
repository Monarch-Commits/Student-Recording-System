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

// --- Sidebar Logic ---
const mobileBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

function toggleSidebar() {
  sidebar?.classList.toggle('-translate-x-full');
  overlay?.classList.toggle('hidden');
}

mobileBtn?.addEventListener('click', toggleSidebar);
overlay?.addEventListener('click', toggleSidebar);

// --- Modal Controls ---
const setupModal = (openBtnId, modalId, closeBtnId) => {
  const openBtn = document.getElementById(openBtnId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);

  openBtn?.addEventListener('click', () => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
  closeBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  });
};

setupModal('toggleFormStudent', 'modalWrapper', 'studentFormBack');
setupModal('toggleFormPH', 'modalPHWrapper', 'studentFormPHBack');

// --- Statistics Update Function ---
function updateDashboardUI(male, female, working, nonWorking) {
  const totalStudents = allStudents.length;

  // 1. Update Employment Stats
  const totalEmp = working + nonWorking;
  const workingPerc = totalEmp > 0 ? Math.round((working / totalEmp) * 100) : 0;
  const nonWorkingPerc =
    totalEmp > 0 ? Math.round((nonWorking / totalEmp) * 100) : 0;

  // Progress Bars
  const workingBar = document.getElementById('workingProgressBar');
  const nonWorkingBar = document.getElementById('nonWorkingProgressBar');
  if (workingBar) workingBar.style.width = `${workingPerc}%`;
  if (nonWorkingBar) nonWorkingBar.style.width = `${nonWorkingPerc}%`;

  // Labels & Counts
  document.getElementById('workingPercentLabel').textContent =
    `${workingPerc}%`;
  document.getElementById('nonWorkingPercentLabel').textContent =
    `${nonWorkingPerc}%`;
  document.getElementById('workingCount').textContent = working;
  document.getElementById('nonWorkingCount').textContent = nonWorking;

  // 2. Update Gender Counts
  document.getElementById('maleCount').textContent = male;
  document.getElementById('femaleCount').textContent = female;

  // 3. Overall Total
  document.getElementById('totalRegisteredCount').textContent = totalStudents;
}

// --- Data Fetching & Real-time Sync ---
function fetchStudents() {
  const studentRef = ref(database, 'students');

  onValue(studentRef, (snapshot) => {
    allStudents = [];
    let maleCount = 0;
    let femaleCount = 0;
    let workingCount = 0;
    let nonWorkingCount = 0;

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const student = childSnapshot.val();
        allStudents.push({ id: childSnapshot.key, ...student });

        // Logic for Gender
        const gender = (student.gender || '').toLowerCase();
        if (gender === 'male') maleCount++;
        else if (gender === 'female') femaleCount++;

        // Logic for Employment (Working Student)
        if (student.workingStudent === 'Yes') {
          workingCount++;
        } else {
          nonWorkingCount++;
        }
      });
    }

    // Sort by latest
    allStudents.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Update the Dashboard UI
    updateDashboardUI(maleCount, femaleCount, workingCount, nonWorkingCount);
    renderTablePage();
  });
}

function fetchPHStatistics() {
  const phRef = ref(database, 'studentsPH');
  onValue(phRef, (snapshot) => {
    let phTotal = 0;
    if (snapshot.exists()) {
      snapshot.forEach(() => {
        phTotal++;
      });
    }
    const phEl = document.getElementById('totalHandicapCount');
    if (phEl) phEl.textContent = phTotal;
  });
}

// --- Form Submissions ---
async function handleFormSubmit(event, dbPath, formId, modalId) {
  event.preventDefault();
  const form = document.getElementById(formId);
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  const formData = {};
  form.querySelectorAll('input, select').forEach((el) => {
    if (el.id) {
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
    document.body.style.overflow = 'auto';
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: error.message });
  } finally {
    submitBtn.disabled = false;
  }
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
  console.log('Syncing Data... Current records:', allStudents.length);
}
