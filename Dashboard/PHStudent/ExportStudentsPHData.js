document.getElementById('download').addEventListener('click', function () {
  const { jsPDF } = window.jspdf;

  // Create jsPDF document in landscape
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Table headers
  const headers = [
    [
      'Name',
      'Gender',
      'Physical Handicap',
      'Year',
      'Program',
      'Major',
      'Ethnicity',
      'Working',
      'Contact',
      'Address',
    ],
  ];

  // Get all visible table rows
  function getFilteredTableData() {
    const rows = [];
    const tableRows = document.querySelectorAll('#tableBody tr');

    tableRows.forEach((row) => {
      if (row.style.display !== 'none') {
        const cells = row.querySelectorAll('td');

        if (cells.length >= 9) {
          rows.push([
            cells[0]?.innerText.trim(),
            cells[1]?.innerText.trim(),
            cells[2]?.innerText.trim(),
            cells[3]?.innerText.trim(),
            cells[4]?.innerText.trim(),
            cells[5]?.innerText.trim(),
            cells[6]?.innerText.trim(),
            cells[7]?.innerText.trim(),
            cells[8]?.innerText.trim(),
            cells[9]?.innerText.trim(),
          ]);
        }
      }
    });

    return rows;
  }

  const allData = getFilteredTableData();

  // Alert kung walang data
  if (!allData.length) {
    Swal.fire({
      icon: 'warning',
      title: 'No Data Found',
      text: 'No filtered records available for export.',
    });
    return;
  }

  // Title & metadata
  doc.setFontSize(16);
  doc.text('Student Records Report', 14, 15);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 21);
  doc.text(`Total Records: ${allData.length}`, 14, 27);

  // Table
  doc.autoTable({
    head: headers,
    body: allData,
    startY: 32,
    theme: 'grid',
    headStyles: {
      fillColor: [6, 78, 59],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [240, 248, 245],
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    margin: { left: 14, right: 14 },
  });

  const fileName = `StudentPH_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
});
