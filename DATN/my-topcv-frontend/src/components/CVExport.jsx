// CVExport.jsx
import React from 'react';
import html2pdf from 'html2pdf.js';

function CVExport({ targetRef, fileName = 'cv-export.pdf', buttonLabel = 'Xuất PDF' }) {
  const handleExport = () => {
    if (targetRef.current) {
      html2pdf()
        .set({
          margin: 0.5,
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        })
        .from(targetRef.current)
        .save();
    }
  };

  return (
    <button
      onClick={handleExport}
      style={{
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        marginBottom: '16px',
      }}
    >
      {buttonLabel}
    </button>
  );
}

export default CVExport;
