// src/components/PDFDownloadButton.tsx

import React from 'react';

interface PDFDownloadButtonProps {
  filename?: string;
}

export default function PDFDownloadButton({ 
  filename = 'Kixago-Whitepaper.pdf'
}: PDFDownloadButtonProps): JSX.Element {
  
  const handleDownload = () => {
    // Option 1: Use browser's print-to-PDF (SIMPLEST - Recommended)
    window.print();
    
    // Option 2: If you have a pre-generated PDF in /static/downloads/
    // Uncomment below if you want direct PDF download instead of print dialog:
    /*
    const link = document.createElement('a');
    link.href = `/downloads/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    */
  };

  return (
    <button
      onClick={handleDownload}
      className="button button--primary button--lg"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download PDF
    </button>
  );
}
