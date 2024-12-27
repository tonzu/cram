import React from 'react';
import { jsPDF } from 'jspdf'; // Import jsPDF
import html2canvas from 'html2canvas'; // Import html2canvas
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './NotesSection.css';

function NotesSection({ notes, setNotes, setEditorFocus }) {
  // Export the notes as a PDF
  const handleExportNotes = async () => {
    const editorDiv = document.querySelector('.ql-editor'); // Get the Quill editor's content
    if (editorDiv) {
      const pdf = new jsPDF('p', 'mm', 'a4'); // Initialize PDF with A4 size
      const margin = 10; // Margin for the PDF
      const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2; // Width of the PDF content
      const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2; // Height of the PDF content

      pdf.setFontSize(1); // Adjust font size for smaller text

      // Use html2canvas to render the HTML content
      await html2canvas(editorDiv, {
        scale: 2, // Scale up for better quality
        useCORS: true, // Allow cross-origin styles like fonts
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png'); // Get the rendered image data
        const imgWidth = pageWidth; // Width of the image in the PDF
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

        if (imgHeight > pageHeight) {
          let heightLeft = imgHeight;
          let position = margin;

          while (heightLeft > 0) {
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            if (heightLeft > 0) {
              pdf.addPage(); // Add a new page for overflow
              position = margin;
            }
          }
        } else {
          pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight); // Add the rendered image
        }

        pdf.save('notes.pdf'); // Save the PDF
      });
    }
  };

  // ReactQuill modules for the toolbar
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // Formatting buttons
      [{ list: 'bullet' }], // Bullet points
      ['clean'], // Remove formatting
    ],
  };

  // ReactQuill formats to support
  const formats = [
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
  ];

  const editorBlurred = () => setEditorFocus(false);
  const editorFocused = () => setEditorFocus(true);


  return (
    <div className="left-column">
      {/* Rich Text Editor */}
      <div id="quill-editor" className="quill-editor">
        <input type="button" value="Export" onClick={handleExportNotes} className="export-notes-button" />
        <ReactQuill
          value={notes} // Pass the current notes as the value
          onBlur={editorBlurred}
          onFocus={editorFocused}
          onChange={setNotes} // Update notes state on content change
          modules={modules} // Pass the toolbar configuration
          formats={formats} // Specify the supported formats
          className="textarea"
        />
      </div>
    </div>
  );
}

export default NotesSection;
