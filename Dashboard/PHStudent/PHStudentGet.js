import './SearchPHStudents.js';
import './ExportStudentsPHData.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getDatabase,
  ref,
  onValue,
  remove,
  get,
  update,
  push,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { firebaseConfig } from '../../firebaseConfig.js';
import {
  getAuth,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Logged in UID:', user.uid);
    fetchStudents();
  } else {
    console.log('User not logged in.');
    window.location.href = '/index.html';
  }
});

// DOM Elements
const tableBody = document.getElementById('tableBody');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageContainer = document.getElementById('pageContainer');
const pageStart = document.getElementById('pageStart');
const pageEnd = document.getElementById('pageEnd');
const totalEntries = document.getElementById('totalEntries');
const genderFilter = document.getElementById('genderFilter');

// Pagination & Data State
let allStudents = [];
let currentPage = 1;
const rowsPerPage = 10;

//FETCH DATA (REALTIME)

function fetchStudents() {
  const studentRef = ref(database, 'studentsPH');

  onValue(studentRef, (snapshot) => {
    allStudents = [];

    let maleCounter = 0;
    let femaleCounter = 0;
    let workingCounter = 0;

    snapshot.forEach((childSnapshot) => {
      const student = childSnapshot.val();
      const studentId = childSnapshot.key;
      allStudents.push({ id: studentId, ...student });

      const gender = (student.genderPH || '').toLowerCase();
      if (gender === 'male') maleCounter++;
      else if (gender === 'female') femaleCounter++;

      if (student.workingStudentPH === 'Yes') workingCounter++;
    });

    // Sort: Latest entries first
    allStudents.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    updateDashboardStats(
      allStudents.length,
      maleCounter,
      femaleCounter,
      workingCounter,
    );

    renderTablePage();
  });
}

function updateDashboardStats(total, male, female, working) {
  const displays = {
    totalRegisteredCount: total,
    maleCount: male,
    femaleCount: female,
    workingCount: working,
  };

  for (const [id, value] of Object.entries(displays)) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
}

// RENDER TABLE & FILTERING
function renderTablePage() {
  const selectedGender = genderFilter
    ? genderFilter.value.toLowerCase()
    : 'all';

  // Apply Gender Filter using the correct DB key: genderPH
  const filteredStudents = allStudents.filter((student) => {
    if (selectedGender === 'all') return true;
    return (student.genderPH || '').toLowerCase() === selectedGender;
  });

  const totalItems = filteredStudents.length;
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = filteredStudents.slice(start, end);

  tableBody.innerHTML = '';

  paginatedItems.forEach((student) => {
    const row = document.createElement('tr');
    row.className =
      'hover:bg-slate-50 transition-all duration-200 border-b border-slate-100';

    row.innerHTML = `
      <td class="px-6 py-4 even:bg-gray-50">
        <p class="text-sm font-semibold text-slate-900 truncate">${student.namePH || '-'}</p>
      </td>
      <td class="px-4 py-4 text-sm text-center font-medium even:bg-gray-50">
        <span class="${(student.genderPH || '').toLowerCase() === 'male' ? 'bg-emerald-200 text-emerald-800' : 'bg-pink-200 text-pink-800'} rounded-full px-2 py-1">
          ${student.genderPH || '-'}
        </span>
      </td>
      <td class="px-4 py-4 text-sm text-slate-600 even:bg-gray-50">${student.physicalHandicap || '-'}</td> 
      <td class="px-4 py-4 text-sm text-slate-600 even:bg-gray-50">${student.yearPH || '-'}</td>
      <td class="px-4 py-4 text-sm text-slate-600 even:bg-gray-50">${student.programPH || '-'}</td>
      <td class="px-4 py-4 text-sm text-slate-600 even:bg-gray-50">${student.majorPH || '-'}</td>
      <td class="px-4 py-4 text-sm text-slate-600 even:bg-gray-50">${student.ipPH || '-'}</td>
      <td class="px-4 py-4 text-center even:bg-gray-50">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase ${student.workingStudentPH === 'Yes' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
          ${student.workingStudentPH || 'No'}
        </span>
      </td>
      <td class="px-4 py-4 text-sm text-slate-600 even:bg-gray-50">${student.contactNumberPH || '-'}</td>
      <td class="px-4 py-4 text-sm text-slate-600 even:bg-gray-50">${student.addressPH || '-'}</td>
      <td class="px-6 py-4 text-right even:bg-gray-50">
        <div class="flex justify-end gap-2">
          <button onclick="editStudent('${student.id}')" class="p-1.5 text-slate-400 hover:text-green-700">
            <span class="material-symbols-outlined text-xl">edit</span>
          </button>
          <button onclick="deleteStudent('${student.id}')" class="p-1.5 text-slate-400 hover:text-red-500">
            <span class="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });

  updatePaginationControls(totalItems);
}

// PAGINATION CONTROLS

function updatePaginationControls(totalItems) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  pageStart.textContent =
    totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  pageEnd.textContent = Math.min(currentPage * rowsPerPage, totalItems);
  totalEntries.textContent = totalItems;

  const oldPageButtons = pageContainer.querySelectorAll('.page-num-btn');
  oldPageButtons.forEach((btn) => btn.remove());

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `page-num-btn h-8 w-8 flex items-center justify-center rounded text-xs font-bold transition-all ${
      i === currentPage
        ? 'bg-green-900 text-white shadow-md'
        : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
    }`;
    btn.textContent = i;
    btn.onclick = () => {
      currentPage = i;
      renderTablePage();
    };
    pageContainer.insertBefore(btn, nextBtn);
  }

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
  prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
  nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
}

if (genderFilter) {
  genderFilter.addEventListener('change', () => {
    currentPage = 1;
    renderTablePage();
  });
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderTablePage();
  }
});

nextBtn.addEventListener('click', () => {
  const selected = (genderFilter ? genderFilter.value : 'all').toLowerCase();
  const filteredCount = allStudents.filter(
    (s) => selected === 'all' || (s.genderPH || '').toLowerCase() === selected,
  ).length;

  if (currentPage < Math.ceil(filteredCount / rowsPerPage)) {
    currentPage++;
    renderTablePage();
  }
});

// CRUD OPERATIONS

window.deleteStudent = function (id) {
  Swal.fire({
    title: 'Delete Student?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete',
    confirmButtonColor: '#ef4444',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await remove(ref(database, `studentsPH/${id}`));
        Swal.fire('Deleted!', 'Record removed.', 'success');
      } catch (e) {
        Swal.fire('Error', e.message, 'error');
      }
    }
  });
};

window.editStudent = async function (id) {
  const snapshot = await get(ref(database, `studentsPH/${id}`));
  if (snapshot.exists()) {
    const data = snapshot.val();
    document.getElementById('modalWrapper').classList.remove('hidden');
    document.getElementById('studentId').value = id;

    const fields = [
      'namePH',
      'genderPH',
      'yearPH',
      'programPH',
      'majorPH',
      'ipPH',
      'workingStudentPH',
      'contactNumberPH',
      'addressPH',
      'physicalHandicap',
    ];

    fields.forEach((fieldId) => {
      const el = document.getElementById(fieldId);
      if (el) el.value = data[fieldId] || '';
    });

    const submitBtn = document.querySelector(
      '#studentUpdateForm button[type="submit"]',
    );
    if (submitBtn) submitBtn.textContent = 'Update Student';
  }
};

document
  .getElementById('studentUpdateForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('studentId').value;

    const studentData = {
      namePH: document.getElementById('namePH').value,
      genderPH: document.getElementById('genderPH').value,
      yearPH: document.getElementById('yearPH').value,
      programPH: document.getElementById('programPH').value,
      majorPH: document.getElementById('majorPH').value,
      ipPH: document.getElementById('ipPH').value,
      workingStudentPH: document.getElementById('workingStudentPH').value,
      contactNumberPH: document.getElementById('contactNumberPH').value,
      addressPH: document.getElementById('addressPH').value,
      physicalHandicap:
        document.getElementById('physicalHandicap')?.value || '',
      updatedAt: Date.now(),
    };

    try {
      if (id) {
        await update(ref(database, `studentsPH/${id}`), studentData);
      } else {
        studentData.createdAt = Date.now();
        await push(ref(database, 'studentsPH'), studentData);
      }
      this.reset();
      document.getElementById('modalWrapper').classList.add('hidden');
      Swal.fire('Success!', 'Data saved.', 'success');
    } catch (e) {
      Swal.fire('Error', e.message, 'error');
    }
  });

// Modal
document.getElementById('studentFormBack').addEventListener('click', () => {
  document.getElementById('modalWrapper').classList.add('hidden');
});

document.getElementById('toggleFormStudent').addEventListener('click', () => {
  document.getElementById('studentUpdateForm').reset();
  document.getElementById('studentId').value = '';
  const submitBtn = document.querySelector(
    '#studentUpdateForm button[type="submit"]',
  );
  if (submitBtn) submitBtn.textContent = 'Add Student';
  document.getElementById('modalWrapper').classList.remove('hidden');
});

fetchStudents();
