document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const filterOption = document.getElementById('filterOption');
  const tableBody = document.getElementById('tableBody');

  function performSearch() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const selectedFilter = filterOption.value;
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach((row) => {
      let cellValue = '';

      // MATCHED EXACTLY to your <option value="">
      switch (selectedFilter) {
        case 'namePH':
          cellValue = row.cells[0]?.innerText || '';
          break;
        case 'physical handicap':
          cellValue = row.cells[2]?.innerText || '';
          break;
        case 'yearPH':
          cellValue = row.cells[3]?.innerText || '';
          break;
        case 'programPH':
          cellValue = row.cells[4]?.innerText || '';
          break;
        case 'majorPH':
          cellValue = row.cells[5]?.innerText || '';
          break;
        case 'ipPH':
          cellValue = row.cells[6]?.innerText || '';
          break;
        case 'workingStudentPH':
          cellValue = row.cells[7]?.innerText || '';
          break;
        case 'contactPH':
          cellValue = row.cells[8]?.innerText || '';
          break;
        case 'addressPH':
          cellValue = row.cells[9]?.innerText || '';
          break;
        default:
          cellValue = row.innerText;
      }

      row.style.display = cellValue.toLowerCase().includes(searchValue)
        ? ''
        : 'none';
    });
  }

  searchInput.addEventListener('input', performSearch);
  filterOption.addEventListener('change', performSearch);
});
