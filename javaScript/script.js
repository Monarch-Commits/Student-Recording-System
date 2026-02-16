import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getDatabase,
  set,
  ref,
  push,
  onValue,
  remove,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { firebaseConfig } from '../firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const studentForm = document.getElementById('studentForm');
const studentPH = document.getElementById('studentPH');

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = '../index.html';
  }
});

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', function () {
  if (confirm('Are you sure you want to logout?')) {
    signOut(auth)
      .then(() => {
        alert('Successfully logged out');
        window.location.href = '../index.html';
      })
      .catch((error) => {
        alert(error.message);
      });
  }
});

document.getElementById('studentForm').addEventListener('submit', function (e) {
  e.preventDefault();

  studentForm.disabled = true;
  const name = document.getElementById('name').value;
  const year = document.getElementById('year').value;
  const address = document.getElementById('address').value;
  const program = document.getElementById('program').value;
  const gender = document.getElementById('gender').value;
  const major = document.getElementById('major').value;
  const ip = document.getElementById('ip').value;
  const workingStudent = document.getElementById('workingStudent').value;
  const contactNumber = document.getElementById('contactNumber').value;

  if (name === '' || year === '' || contactNumber === '' || address === '') {
    alert('Please fill out all required fields');
    studentForm.disabled = false;
    return;
  }

  const addStudent = push(ref(database, 'students'));
  set(addStudent, {
    name: name,
    year: year,
    address: address,
    gender: gender,
    program: program,
    major: major,
    ip: ip,
    workingStudent: workingStudent,
    contactNumber: contactNumber,
  })
    .then(() => {
      alert('Student added successfully!!');
      document.getElementById('studentForm').reset();
    })
    .catch((error) => {
      console.log('Error', error);
      alert('Somethings Wrong Please try again!!');
    });
});

document.getElementById('studentPH').addEventListener('submit', function (e) {
  e.preventDefault();
  studentPH.disabled = true;
  const namePH = document.getElementById('namePH').value;
  const yearPH = document.getElementById('yearPH').value;
  const programPH = document.getElementById('programPH').value;
  const majorPH = document.getElementById('majorPH').value;
  const physicalHandicap = document.getElementById('physicalHandicap').value;
  const addressPH = document.getElementById('addressPH').value;
  const ipPH = document.getElementById('ipPH').value;
  const workingStudentPH = document.getElementById('workingStudentPH').value;
  const contactNumberPH = document.getElementById('contactNumberPH').value;
  const genderPH = document.getElementById('genderPH').value;

  if (
    namePH === '' ||
    yearPH === '' ||
    physicalHandicap === '' ||
    contactNumberPH === '' ||
    addressPH === ''
  ) {
    alert('Please fill out all required fields');
    studentPH.disabled = false;
    return;
  }

  const addStudentPH = push(ref(database, 'studentsPH'));
  set(addStudentPH, {
    namePH: namePH,
    yearPH: yearPH,
    addressPH: addressPH,
    genderPH: genderPH,
    physicalHandicap: physicalHandicap,
    programPH: programPH,
    majorPH: majorPH,
    ipPH: ipPH,
    workingStudentPH: workingStudentPH,
    contactNumberPH: contactNumberPH,
  })
    .then(() => {
      alert('Student PH added successfully!!');
      document.getElementById('studentPH').reset();
    })
    .catch((error) => {
      console.log('Error', error);
      alert('Somethings Wrong Please try again!!');
    });
});

document
  .getElementById('toggleFormStudent')
  .addEventListener('click', function () {
    const studentForm = document.getElementById('studentForm');
    const studentPHForm = document.getElementById('studentPH');
    const records = document.getElementById('records');
    if (
      studentForm.style.display === 'none' ||
      studentForm.style.display === ''
    ) {
      studentForm.style.display = 'flex';
      studentPHForm.style.display = 'none';
      records.style.display = 'none';
    } else {
      studentForm.style.display = 'none';
    }
  });

document.getElementById('toggleFormPH').addEventListener('click', function () {
  const studentForm = document.getElementById('studentForm');
  const studentPHForm = document.getElementById('studentPH');
  const records = document.getElementById('records');
  if (
    studentPHForm.style.display === 'none' ||
    studentPHForm.style.display === ''
  ) {
    studentPHForm.style.display = 'flex';
    studentForm.style.display = 'none';
    records.style.display = 'none';
  } else {
    studentPHForm.style.display = 'none';
  }
});

document.getElementById('record').addEventListener('click', function () {
  const studentForm = document.getElementById('studentForm');
  const studentPHForm = document.getElementById('studentPH');
  const records = document.getElementById('records');

  if (records.style.display === 'none' || records.style.display === '') {
    records.style.display = 'flex';
    studentForm.style.display = 'none';
    studentPHForm.style.display = 'none';
  } else {
    records.style.display = 'none';
  }
});

document.getElementById('studentRecord').addEventListener('click', function () {
  const studentData = document.getElementById('tableData');
  const studentForm = document.getElementById('studentForm');
  const studentPHForm = document.getElementById('studentPH');
  const records = document.getElementById('records');
  const tableDataPH = document.getElementById('tableDataPH');

  if (
    studentData.style.display === 'none' ||
    studentData.style.display === ''
  ) {
    studentData.style.display = 'flex';
    studentPHForm.style.display = 'none';
    studentForm.style.display = 'none';
    records.style.display = 'none';
    tableDataPH.style.display = 'none';
  } else {
    studentData.style.display = 'none';
  }
});

//ph record

document.getElementById('yellow').addEventListener('click', function () {
  const tableDataPH = document.getElementById('tableDataPH');
  const studentData = document.getElementById('tableData');
  const studentForm = document.getElementById('studentForm');
  const studentPHForm = document.getElementById('studentPH');
  const records = document.getElementById('records');
  if (
    tableDataPH.style.display === 'none' ||
    tableDataPH.style.display === ''
  ) {
    tableDataPH.style.display = 'flex';
    studentPHForm.style.display = 'none';
    studentForm.style.display = 'none';
    records.style.display = 'none';
    studentData.style.display = 'none';
  } else {
    tableDataPH.style.display = 'none';
  }
});

document.getElementById('cancel').addEventListener('click', function () {
  const studentData = document.getElementById('tableData');
  const editContainer = document.getElementById('editContainer');
  editContainer.style.display = 'none';
  studentData.style.display = 'none';
});

document.getElementById('cancelPH').addEventListener('click', function () {
  const tableDataPH = document.getElementById('tableDataPH');
  const editContainerPH = document.getElementById('editContainerPH');

  editContainerPH.style.display = 'none';
  tableDataPH.style.display = 'none';
});

document.getElementById('editCancel').addEventListener('click', function () {
  const editContainer = document.getElementById('editContainer');
  const editContainerPH = document.getElementById('editContainerPH');
  editContainer.style.display = 'none';
  editContainerPH.style.display = 'none';
});

document.getElementById('editCancelPH').addEventListener('click', function () {
  const editContainerPH = document.getElementById('editContainerPH');
  editContainerPH.style.display = 'none';
});

document.getElementById('BackRecords').addEventListener('click', function () {
  const records = document.getElementById('records');
  records.style.display = 'none';
});

document
  .getElementById('studentFormBack')
  .addEventListener('click', function () {
    const studentForm = document.getElementById('studentForm');
    studentForm.style.display = 'none';
  });

document
  .getElementById('studentFormPHBack')
  .addEventListener('click', function () {
    const studentPH = document.getElementById('studentPH');
    studentPH.style.display = 'none';
  });

function fetchStudents() {
  const database = getDatabase();
  const studentRef = ref(database, 'students');

  const studentMaleData = document.getElementById('StudentDataMale');
  const studentFemaleData = document.getElementById('StudentDataFemale');

  studentMaleData.innerHTML = '';
  studentFemaleData.innerHTML = '';

  onValue(studentRef, (snapshot) => {
    let studentsArray = [];
    snapshot.forEach((childSnapshot) => {
      const student = childSnapshot.val();
      const studentId = childSnapshot.key;

      studentsArray.push({ id: studentId, ...student });
    });

    studentsArray.sort((a, b) => a.name.localeCompare(b.name));

    studentMaleData.innerHTML = '';
    studentFemaleData.innerHTML = '';

    studentsArray.forEach((student) => {
      const row = `
              <tr>
                  <td>${student.name}</td>
                  <td>${student.gender}</td>
                  <td>${student.year}</td>
                  <td>${student.address}</td>
                  <td>${student.program}</td>
                  <td>${student.major}</td>
                  <td>${student.ip}</td>
                  <td>${student.workingStudent}</td>
                  <td>${student.contactNumber}</td>
                  <td class="action">
                      <button type="button" onclick="editStudent('${student.id}')"><i class="fas fa-edit"></i></button>
                      <button onclick="deleteStudent('${student.id}')"><i class="fas fa-trash"></i></button>
                  </td>
              </tr>
          `;

      if (student.gender === 'Male') {
        studentMaleData.innerHTML += row;
      } else if (student.gender === 'Female') {
        studentFemaleData.innerHTML += row;
      }
    });
  });
}
fetchStudents();

window.deleteStudent = function (studentId) {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this record?',
  );

  if (confirmDelete) {
    const studentRef = ref(database, `students/${studentId}`);
    remove(studentRef)
      .then(() => {
        alert('Student deleted successfully!');
        fetchStudents();
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
        alert('Error, Please try again.');
      });
  }
};

window.editStudent = function (studentId) {
  const studentRef = ref(database, `students/${studentId}`);

  onValue(
    studentRef,
    (snapshot) => {
      const student = snapshot.val();

      if (student) {
        document.getElementById('editName').value = student.name;
        document.getElementById('editYear').value = student.year;
        document.getElementById('editAddress').value = student.address;
        document.getElementById('editGender').value = student.gender;
        document.getElementById('editProgram').value = student.program;
        document.getElementById('Editmajor').value = student.major;
        document.getElementById('editIp').value = student.ip;
        document.getElementById('editWorkingStudent').value =
          student.workingStudent;
        document.getElementById('editContactNumber').value =
          student.contactNumber;

        document.getElementById('editContainer').style.display = 'flex';

        document.getElementById('editForm').onsubmit = function (e) {
          e.preventDefault();

          const updatedStudent = {
            name: document.getElementById('editName').value,
            year: document.getElementById('editYear').value,
            address: document.getElementById('editAddress').value,
            gender: document.getElementById('editGender').value,
            program: document.getElementById('editProgram').value,
            major: document.getElementById('Editmajor').value,
            ip: document.getElementById('editIp').value,
            workingStudent: document.getElementById('editWorkingStudent').value,
            contactNumber: document.getElementById('editContactNumber').value,
          };

          set(ref(database, `students/${studentId}`), updatedStudent)
            .then(() => {
              alert('Student updated successfully!');
              document.getElementById('editContainer').style.display = 'none';
              fetchStudents();
            })
            .catch((error) => {
              console.error('Error updating student:', error);
              alert('Error updating student, please try again!!');
            });
        };
      }
    },
    { onlyOnce: true },
  );
};

//Student Search Data

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const filterOption = document.getElementById('filterOption');

  function performSearch() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const selectedFilter = filterOption.value;
    const maleRows = document.querySelectorAll('#StudentDataMale tr');
    const femaleRows = document.querySelectorAll('#StudentDataFemale tr');

    function filterTable(rows) {
      rows.forEach((row) => {
        let cellValue = '';

        switch (selectedFilter) {
          case 'name':
            cellValue = row.cells[0]?.innerText.toLowerCase() || '';
            break;
          case 'gender':
            cellValue = row.cells[1]?.innerText.toLowerCase() || '';
            break;
          case 'address':
            cellValue = row.cells[3]?.innerText.toLowerCase() || '';
            break;
          case 'contact':
            cellValue = row.cells[8]?.innerText.toLowerCase() || '';
            break;
          case 'year':
            cellValue = row.cells[2]?.innerText.toLowerCase() || '';
            break;
          case 'program':
            cellValue = row.cells[4]?.innerText.toLowerCase() || '';
            break;
          case 'major':
            cellValue = row.cells[5]?.innerText.toLowerCase() || '';
            break;
          case 'ip':
            cellValue = row.cells[6]?.innerText.toLowerCase() || '';
            break;
          case 'workingStudent':
            cellValue = row.cells[7]?.innerText.toLowerCase() || '';
            break;
          default:
            cellValue = '';
        }

        row.style.display = cellValue.includes(searchValue) ? '' : 'none';
      });
    }

    filterTable(maleRows);
    filterTable(femaleRows);
  }

  searchInput.addEventListener('input', performSearch);
  filterOption.addEventListener('change', performSearch);
});

//SEARCH PH Student

document.addEventListener('DOMContentLoaded', function () {
  const searchInputPH = document.getElementById('searchPH');
  const filterOptionPH = document.getElementById('filterOptionPH');

  function performSearch() {
    const searchValuePH = searchInputPH.value.trim().toLowerCase();
    const selectedFilterPH = filterOptionPH.value;
    const maleRowsPH = document.querySelectorAll('#StudentDataMalePH tr');
    const femaleRowsPH = document.querySelectorAll('#StudentDataFemalePH tr');

    function filterTable(rows) {
      rows.forEach((row) => {
        let cellValue = '';

        switch (selectedFilterPH) {
          case 'namePH':
            cellValue = row.cells[0]?.innerText.toLowerCase() || '';
            break;
          case 'genderPH':
            cellValue = row.cells[1]?.innerText.toLowerCase() || '';
            break;
          case 'yearPH':
            cellValue = row.cells[3]?.innerText.toLowerCase() || '';
            break;
          case 'workingStudentPH':
            cellValue = row.cells[8]?.innerText.toLowerCase() || '';
            break;
          case 'physicalHandicap':
            cellValue = row.cells[2]?.innerText.toLowerCase() || '';
            break;
          case 'addressPH':
            cellValue = row.cells[4]?.innerText.toLowerCase() || '';
            break;
          case 'programPH':
            cellValue = row.cells[5]?.innerText.toLowerCase() || '';
            break;
          case 'majorPH':
            cellValue = row.cells[6]?.innerText.toLowerCase() || '';
            break;
          case 'ipPH':
            cellValue = row.cells[7]?.innerText.toLowerCase() || '';
            break;
          case 'contactNumberPH':
            cellValue = row.cells[9]?.innerText.toLowerCase() || '';
            break;
          default:
            cellValue = '';
        }

        row.style.display = cellValue.includes(searchValuePH) ? '' : 'none';
      });
    }

    filterTable(maleRowsPH);
    filterTable(femaleRowsPH);
  }

  searchInputPH.addEventListener('input', performSearch);
  filterOptionPH.addEventListener('change', performSearch);
});

//

document.getElementById('download').addEventListener('click', function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape');

  const headers = [
    [
      'Name',
      'Gender',
      'Year',
      'Address',
      'Program',
      'Major',
      'Ethnicity',
      'Working Student',
      'Contact Number',
    ],
  ];

  function getFilteredTableData(tableId) {
    const rows = [];
    const tableRows = document.querySelectorAll(`${tableId} tr`);

    tableRows.forEach((row) => {
      if (row.style.display !== 'none') {
        const cells = row.querySelectorAll('td:not(.action)');
        if (cells.length > 0) {
          const rowData = Array.from(cells).map((cell) =>
            cell.textContent.trim(),
          );
          rows.push(rowData);
        }
      }
    });

    return rows;
  }

  const maleData = getFilteredTableData('#StudentDataMale');
  const femaleData = getFilteredTableData('#StudentDataFemale');

  if (maleData.length === 0 && femaleData.length === 0) {
    alert('No filtered data available for download.');
    return;
  }

  let yPosition = 20;
  if (maleData.length > 0) {
    doc.text('Male Students', 14, yPosition - 5);
    doc.autoTable({
      head: headers,
      body: maleData,
      startY: yPosition,
      headStyles: { fillColor: [0, 128, 255], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 10 },
    });
    yPosition = doc.autoTable.previous.finalY + 10;
  }

  if (femaleData.length > 0) {
    doc.text('Female Students', 14, yPosition - 5);
    doc.autoTable({
      head: headers,
      body: femaleData,
      startY: yPosition,
      headStyles: { fillColor: [255, 0, 128], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 10 },
    });
  }

  doc.save('filtered_students_report.pdf');
});

//DOWNLOAD FOR PH

document.getElementById('downloadPH').addEventListener('click', function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape');

  const headers = [
    [
      'Name',
      'Gender',
      'Physical Handicap',
      'Year',
      'Address',
      'Program',
      'Major',
      'Ethnicity',
      'Working Student',
      'Contact Number',
    ],
  ];

  function getFilteredTableData(tableId) {
    const rows = [];
    const tableRows = document.querySelectorAll(`${tableId} tr`);

    tableRows.forEach((row) => {
      if (row.style.display !== 'none') {
        const cells = row.querySelectorAll('td:not(.action)');
        if (cells.length > 0) {
          const rowData = Array.from(cells).map((cell) =>
            cell.textContent.trim(),
          );
          rows.push(rowData);
        }
      }
    });

    return rows;
  }

  const maleData = getFilteredTableData('#StudentDataMalePH');
  const femaleData = getFilteredTableData('#StudentDataFemalePH');

  if (maleData.length === 0 && femaleData.length === 0) {
    alert('No filtered data available for download.');
    return;
  }

  let yPosition = 20;
  if (maleData.length > 0) {
    doc.text('Male PH Students', 14, yPosition - 5);
    doc.autoTable({
      head: headers,
      body: maleData,
      startY: yPosition,
      headStyles: { fillColor: [0, 128, 255], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 10 },
    });
    yPosition = doc.autoTable.previous.finalY + 10;
  }

  if (femaleData.length > 0) {
    doc.text('Female PH Students', 14, yPosition - 5);
    doc.autoTable({
      head: headers,
      body: femaleData,
      startY: yPosition,
      headStyles: { fillColor: [255, 0, 128], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 10 },
    });
  }

  doc.save('filtered_studentsPH_report.pdf');
});

//total student
function countStudents() {
  const studentRef = ref(database, 'students');

  onValue(studentRef, (snapshot) => {
    let total = 0;
    let maleCount = 0;
    let femaleCount = 0;

    snapshot.forEach((childSnapshot) => {
      const student = childSnapshot.val();
      total++;
      if (student.gender === 'Male') {
        maleCount++;
      } else if (student.gender === 'Female') {
        femaleCount++;
      }
    });

    document.getElementById('totalStudents').textContent =
      `Student Count: ${total}`;
    document.getElementById('maleStudents').textContent =
      `Student Male Count: ${maleCount}`;
    document.getElementById('femaleStudents').textContent =
      `Student Female Count: ${femaleCount}`;
  });
}

countStudents();

function countStudentsPH() {
  const studentRef = ref(database, 'studentsPH');

  onValue(studentRef, (snapshot) => {
    let total = 0;
    let maleCountPH = 0;
    let femaleCountPH = 0;

    snapshot.forEach((childSnapshot) => {
      const student = childSnapshot.val();
      total++;
      if (student.genderPH === 'Male') {
        maleCountPH++;
      } else if (student.genderPH === 'Female') {
        femaleCountPH++;
      }
    });

    document.getElementById('totalStudentsPH').textContent =
      `Student Count: ${total}`;
    document.getElementById('maleStudentsPH').textContent =
      `Student Male Count: ${maleCountPH}`;
    document.getElementById('femaleStudentsPH').textContent =
      `Student Female Count: ${femaleCountPH}`;
  });
}

countStudentsPH();

//Student PH Fetch Data

function fetchStudentsPH() {
  const database = getDatabase();
  const studentRef = ref(database, 'studentsPH');

  const StudentDataMalePH = document.getElementById('StudentDataMalePH');
  const StudentDataFemalePH = document.getElementById('StudentDataFemalePH');

  StudentDataMalePH.innerHTML = '';
  StudentDataFemalePH.innerHTML = '';

  onValue(studentRef, (snapshot) => {
    let studentsArray = [];

    snapshot.forEach((childSnapshot) => {
      const studentPH = childSnapshot.val();
      const studentId = childSnapshot.key;

      studentsArray.push({ id: studentId, ...studentPH });
    });

    studentsArray.sort((a, b) => a.namePH.localeCompare(b.namePH));

    StudentDataMalePH.innerHTML = '';
    StudentDataFemalePH.innerHTML = '';

    studentsArray.forEach((studentPH) => {
      const row = `
              <tr>
                  <td>${studentPH.namePH}</td>
                  <td>${studentPH.genderPH}</td>
                  <td>${studentPH.physicalHandicap}</td>
                  <td>${studentPH.yearPH}</td>
                  <td>${studentPH.addressPH}</td>
                  <td>${studentPH.programPH}</td>
                  <td>${studentPH.majorPH}</td>
                  <td>${studentPH.ipPH}</td>
                  <td>${studentPH.workingStudentPH}</td>
                  <td>${studentPH.contactNumberPH}</td>
                  <td class="action">
                      <button type="button" id="editButtonPH" onclick="editStudentPH('${studentPH.id}')"><i class="fas fa-edit"></i></button>
                      <button onclick="deleteStudentPH('${studentPH.id}')"><i class="fas fa-trash"></i></button>
                  </td>
              </tr>
          `;

      if (studentPH.genderPH === 'Male') {
        StudentDataMalePH.innerHTML += row;
      } else if (studentPH.genderPH === 'Female') {
        StudentDataFemalePH.innerHTML += row;
      }
    });
  });
}
fetchStudentsPH();

//PH EDIT

window.editStudentPH = function (studentId) {
  const studentRef = ref(database, `studentsPH/${studentId}`);

  onValue(
    studentRef,
    (snapshot) => {
      const student = snapshot.val();

      if (student) {
        document.getElementById('EditnamePH').value = student.namePH;
        document.getElementById('EdityearPH').value = student.yearPH;
        document.getElementById('EditprogramPH').value = student.programPH;
        document.getElementById('EditmajorPH').value = student.majorPH;
        document.getElementById('EditphysicalHandicap').value =
          student.physicalHandicap;
        document.getElementById('EditaddressPH').value = student.addressPH;
        document.getElementById('EditipPH').value = student.ipPH;
        document.getElementById('EditworkingStudentPH').value =
          student.workingStudentPH;
        document.getElementById('EditcontactNumberPH').value =
          student.contactNumberPH;
        document.getElementById('EditgenderPH').value = student.genderPH;

        document.getElementById('editContainerPH').style.display = 'flex';

        document.getElementById('editFormPH').onsubmit = function (e) {
          e.preventDefault();

          const updatedStudent = {
            namePH: document.getElementById('EditnamePH').value,
            yearPH: document.getElementById('EdityearPH').value,
            programPH: document.getElementById('EditprogramPH').value,
            majorPH: document.getElementById('EditmajorPH').value,
            physicalHandicap: document.getElementById('EditphysicalHandicap')
              .value,
            addressPH: document.getElementById('EditaddressPH').value,
            ipPH: document.getElementById('EditipPH').value,
            workingStudentPH: document.getElementById('EditworkingStudentPH')
              .value,
            contactNumberPH: document.getElementById('EditcontactNumberPH')
              .value,
            genderPH: document.getElementById('EditgenderPH').value,
          };

          set(ref(database, `studentsPH/${studentId}`), updatedStudent)
            .then(() => {
              alert('PH Student updated successfully!');
              document.getElementById('editContainerPH').style.display = 'none';
              fetchStudentsPH();
            })
            .catch((error) => {
              console.error('Error updating student:', error);
              alert('Error updating student, please try again!!');
            });
        };
      }
    },
    { onlyOnce: true },
  );
};

window.deleteStudentPH = function (studentId) {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this record?',
  );

  if (confirmDelete) {
    const studentRef = ref(database, `studentsPH/${studentId}`);
    remove(studentRef)
      .then(() => {
        alert('PH Student deleted successfully!');
        fetchStudents();
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
        alert('Error, Please try again.');
      });
  }
};

document.getElementById('menu').addEventListener('click', function () {
  document.querySelector('.Holdings').classList.toggle('open');
});
