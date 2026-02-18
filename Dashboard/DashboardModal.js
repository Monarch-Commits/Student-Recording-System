import '../Authentication/Logout.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getDatabase,
  set,
  ref,
  push,
  onValue,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { firebaseConfig } from '../firebaseConfig.js';

//  INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// SIDEBAR & MODAL LOGIC
const mobileBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

function toggleSidebar() {
  sidebar?.classList.toggle('-translate-x-full');
  overlay?.classList.toggle('hidden');
}

mobileBtn?.addEventListener('click', toggleSidebar);
overlay?.addEventListener('click', toggleSidebar);

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

//  HELPER FUNCTIONS
function updateText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function updateBar(id, percent) {
  const el = document.getElementById(id);
  if (el) el.style.width = `${percent}%`;
}

// STATISTICS UPDATE LOGIC (FIXED)
function updateStatsUI(snapshot, type) {
  let male = 0,
    female = 0,
    working = 0,
    nonWorking = 0,
    total = 0;

  if (snapshot.exists()) {
    snapshot.forEach((child) => {
      const s = child.val();
      total++;

      const genderValue = type === 'PH' ? s.genderPH : s.gender;
      const g = (genderValue || '').toLowerCase();
      if (g === 'male') male++;
      else if (g === 'female') female++;
      const workValue = type === 'PH' ? s.workingStudentPH : s.workingStudent;

      if (workValue === 'Yes') {
        working++;
      } else {
        nonWorking++;
      }
    });
  }

  const workPerc = total > 0 ? Math.round((working / total) * 100) : 0;
  const nonWorkPerc = total > 0 ? 100 - workPerc : 0;

  if (type === 'PH') {
    // PHYSICAL HANDICAP CARD
    updateText('totalHandicapCount', total);
    updateText('PHmaleCount', male);
    updateText('PHfemaleCount', female);
    updateText('PHworkingCount', working);
    updateText('PHnonWorkingCount', nonWorking);
    updateText('PHworkingPercentLabel', `${workPerc}%`);
    updateText('PHnonWorkingPercentLabel', `${nonWorkPerc}%`);
    updateBar('PHworkingProgressBar', workPerc);
    updateBar('PHnonWorkingProgressBar', nonWorkPerc);
  } else {
    // REGULAR STUDENT CARD
    updateText('totalRegisteredCount', total);
    updateText('maleCount', male);
    updateText('femaleCount', female);
    updateText('workingCount', working);
    updateText('nonWorkingCount', nonWorking);
    updateText('workingPercentLabel', `${workPerc}%`);
    updateText('nonWorkingPercentLabel', `${nonWorkPerc}%`);
    updateBar('workingProgressBar', workPerc);
    updateBar('nonWorkingProgressBar', nonWorkPerc);
  }
}

// DATA SYNC
function initDataSync() {
  onValue(ref(database, 'students'), (snap) => updateStatsUI(snap, 'REG'));
  onValue(ref(database, 'studentsPH'), (snap) => updateStatsUI(snap, 'PH'));
}

async function handleFormSubmit(event, dbPath, formId, modalId) {
  event.preventDefault();
  const form = document.getElementById(formId);
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  const formData = {};
  form.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.id) {
      formData[el.id] = el.value.trim();
    }
  });

  const nameValue = formData.name || formData.namePH || formData.studentNamePH;
  if (!nameValue) {
    Swal.fire({ icon: 'warning', title: 'Paki-fill up ang pangalan' });
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  Swal.fire({ title: 'Saving...', didOpen: () => Swal.showLoading() });

  try {
    const newRef = push(ref(database, dbPath));
    await set(newRef, { ...formData, createdAt: Date.now() });

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Data saved successfully.',
      timer: 1500,
      showConfirmButton: false,
    });

    form.reset();
    document.getElementById(modalId).classList.add('hidden');
    document.body.style.overflow = 'auto';
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: error.message });
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDataSync();

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
