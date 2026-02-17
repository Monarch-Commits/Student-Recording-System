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

      switch (selectedFilter) {
        case 'name':
          cellValue = row.cells[0]?.innerText.toLowerCase() || '';
          break;
        case 'year':
          cellValue = row.cells[2]?.innerText.toLowerCase() || '';
          break;
        case 'physical handicap':
          cellValue = row.cells[2]?.innerText.toLowerCase() || '';
          break;
        case 'program':
          cellValue = row.cells[3]?.innerText.toLowerCase() || '';
          break;
        case 'major':
          cellValue = row.cells[4]?.innerText.toLowerCase() || '';
          break;
        case 'ip':
          cellValue = row.cells[5]?.innerText.toLowerCase() || '';
          break;
        case 'workingStudent':
          cellValue = row.cells[6]?.innerText.toLowerCase() || '';
          break;
        case 'contact':
          cellValue = row.cells[7]?.innerText.toLowerCase() || '';
          break;
        case 'address':
          cellValue = row.cells[8]?.innerText.toLowerCase() || '';
          break;
        default:
          cellValue = row.innerText.toLowerCase();
      }

      row.style.display = cellValue.includes(searchValue) ? '' : 'none';
    });
  }

  searchInput.addEventListener('input', performSearch);
  filterOption.addEventListener('change', performSearch);
});
