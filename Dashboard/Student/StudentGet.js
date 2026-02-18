import './SearchStudents.js';
import './ExportStudentsData.js';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements
const tableBody = document.getElementById('tableBody');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageContainer = document.getElementById('pageContainer');
const pageStart = document.getElementById('pageStart');
const pageEnd = document.getElementById('pageEnd');
const totalEntries = document.getElementById('totalEntries');
const genderFilter = document.getElementById('genderFilter');
const searchInput = document.getElementById('searchInput'); // Dagdag para sa search-aware pagination
const filterOption = document.getElementById('filterOption'); // Dagdag para sa search-aware pagination

// Pagination & Data State
let allStudents = [];
let currentPage = 1;
const rowsPerPage = 10;

// FETCH DATA (REALTIME)
function fetchStudents() {
  const studentRef = ref(database, 'students');

  onValue(studentRef, (snapshot) => {
    allStudents = [];
    let maleCounter = 0;
    let femaleCounter = 0;
    let workingCounter = 0;

    snapshot.forEach((childSnapshot) => {
      const student = childSnapshot.val();
      const studentId = childSnapshot.key;
      allStudents.push({ id: studentId, ...student });

      const gender = (student.gender || '').toLowerCase();
      if (gender === 'male') maleCounter++;
      else if (gender === 'female') femaleCounter++;
      if (student.workingStudent === 'Yes') workingCounter++;
    });

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

// RENDER TABLE & FILTERING (INTEGRATED SEARCH)
function renderTablePage() {
  const selectedGender = genderFilter
    ? genderFilter.value.toLowerCase()
    : 'all';
  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const selectedSearchKey = filterOption ? filterOption.value : 'all';

  //  Filter by Gender AND Search Input
  const filteredStudents = allStudents.filter((student) => {
    // Gender Filter logic
    const matchesGender =
      selectedGender === 'all' ||
      (student.gender || '').toLowerCase() === selectedGender;

    // Search Filter logic
    let matchesSearch = true;
    if (searchValue) {
      if (selectedSearchKey === 'all') {
        matchesSearch = Object.values(student).some((val) =>
          String(val).toLowerCase().includes(searchValue),
        );
      } else {
        // Mapping search keys to object properties if necessary
        const dbKey = selectedSearchKey.replace('PH', '');
        matchesSearch = String(student[dbKey] || '')
          .toLowerCase()
          .includes(searchValue);
      }
    }

    return matchesGender && matchesSearch;
  });

  // Pagination Calculations based on FILTERED results
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = filteredStudents.slice(start, end);

  tableBody.innerHTML = '';

  paginatedItems.forEach((student) => {
    const row = document.createElement('tr');
    row.className =
      'hover:bg-slate-50 transition-all duration-200 border-b border-slate-100';

    row.innerHTML = `
      <td class="px-6 py-4"> <p class="text-sm font-semibold text-slate-900 truncate even:bg-gray-50">${student.name}</p> </td> 
      <td class="px-4 py-4 text-sm text-center font-medium even:bg-gray-50"> <span class="${(student.gender || '').toLowerCase() === 'male' ? 'bg-emerald-200 text-emerald-800' : 'bg-pink-200 text-pink-800'} rounded-full px-2 py-1"> ${student.gender || '-'} </span> </td> 
      <td class="px-4 py-4 text-sm text-slate-600 whitespace-nowrap even:bg-gray-50">${student.year}</td> 
      <td class="px-4 py-4 text-sm text-slate-600 whitespace-nowrap even:bg-gray-50">${student.program}</td> 
      <td class="px-4 py-4 text-sm text-slate-600 even:bg-gray-50">${student.major}</td> 
      <td class="px-4 py-4 text-sm text-slate-600 whitespace-nowrap even:bg-gray-50">${student.ip}</td> 
      <td class="px-4 py-4 text-center even:bg-gray-50"> <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${student.workingStudent === 'Yes' ? 'bg-emerald-100/50 text-emerald-800' : 'bg-red-200 text-slate-700'}"> ${student.workingStudent} </span> </td> 
      <td class="px-4 py-4 text-sm text-slate-600 even:bg-gray-50">${student.contactNumber || '-'}</td> 
      <td class="px-4 py-4 text-sm text-slate-600 even:bg-gray-50">${student.address || '-'}</td> 
      <td class="px-6 py-4 text-right even:bg-gray-50"> 
        <div class="flex justify-end gap-2"> 
          <button onclick="editStudent('${student.id}')" class="p-1.5 text-slate-400"> <span class="material-symbols-outlined hover:text-green-900 text-xl">edit</span> </button> 
          <button onclick="deleteStudent('${student.id}')" class="p-1.5 text-slate-400 hover:text-red-500"> <span class="material-symbols-outlined text-xl">delete</span> </button> 
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

//  EVENT LISTENERS
if (genderFilter)
  genderFilter.addEventListener('change', () => {
    currentPage = 1;
    renderTablePage();
  });
if (searchInput)
  searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderTablePage();
  });
if (filterOption)
  filterOption.addEventListener('change', () => {
    currentPage = 1;
    renderTablePage();
  });

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderTablePage();
  }
});

nextBtn.addEventListener('click', () => {
  const totalItems = tableBody.querySelectorAll('tr').length;
  renderTablePage();
});

// 5. CRUD OPERATIONS
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
        await remove(ref(database, `students/${id}`));
        Swal.fire('Deleted!', 'Record removed.', 'success');
      } catch (e) {
        Swal.fire('Error', e.message, 'error');
      }
    }
  });
};

window.editStudent = async function (id) {
  const snapshot = await get(ref(database, `students/${id}`));
  if (snapshot.exists()) {
    const data = snapshot.val();
    document.getElementById('modalWrapper').classList.remove('hidden');
    document.getElementById('studentId').value = id;

    const fields = [
      'name',
      'gender',
      'year',
      'program',
      'major',
      'ip',
      'workingStudent',
      'contactNumber',
      'address',
    ];
    fields.forEach((f) => {
      const el = document.getElementById(f);
      if (el) el.value = data[f] || '';
    });

    document.querySelector(
      '#studentUpdateForm button[type="submit"]',
    ).textContent = 'Update Student';
  }
};

document
  .getElementById('studentUpdateForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('studentId').value;
    const studentData = {
      name: document.getElementById('name').value,
      gender: document.getElementById('gender').value,
      year: document.getElementById('year').value,
      program: document.getElementById('program').value,
      major: document.getElementById('major').value,
      ip: document.getElementById('ip').value,
      workingStudent: document.getElementById('workingStudent').value,
      contactNumber: document.getElementById('contactNumber').value,
      address: document.getElementById('address').value,
      updatedAt: Date.now(),
    };

    try {
      if (id) await update(ref(database, `students/${id}`), studentData);
      else {
        studentData.createdAt = Date.now();
        await push(ref(database, 'students'), studentData);
      }
      this.reset();
      document.getElementById('modalWrapper').classList.add('hidden');
      Swal.fire('Success!', 'Data saved.', 'success');
    } catch (e) {
      Swal.fire('Error', e.message, 'error');
    }
  });

document.getElementById('studentFormBack').addEventListener('click', () => {
  document.getElementById('modalWrapper').classList.add('hidden');
});

document.getElementById('toggleFormStudent').addEventListener('click', () => {
  document.getElementById('studentUpdateForm').reset();
  document.getElementById('studentId').value = '';
  document.querySelector(
    '#studentUpdateForm button[type="submit"]',
  ).textContent = 'Add Student';
  document.getElementById('modalWrapper').classList.remove('hidden');
});

fetchStudents();
