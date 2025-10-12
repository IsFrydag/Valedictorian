document.addEventListener('DOMContentLoaded', () => {
    const pdfFile = document.getElementById('pdfFile');
    const uploadPdfBtn = document.getElementById('uploadPdfBtn');
    const pdfDisplay = document.getElementById('pdfDisplay');
    const pdfDisplayIframe = document.getElementById('pdfDisplayIframe');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    let currentPdfUrl = null;
    let currentFileName = "uploaded_document.pdf";

    // 1. Trigger the hidden file input when the main button is clicked
    uploadPdfBtn.addEventListener('click', () => {
        pdfFile.click();
    });

    // 2. Handle the file selection
    pdfFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            // Get a local URL for the file
            currentPdfUrl = URL.createObjectURL(file);
            currentFileName = file.name;
            
            // Display the PDF using the browser's native viewer
            // Using embed is often better for direct content inclusion
            // Use iframe as a fallback or alternative
            
            // Set source for both, and show one
            pdfDisplay.src = currentPdfUrl;
            pdfDisplay.style.display = 'block';
            pdfDisplayIframe.style.display = 'none'; // Hide iframe if showing embed

            // Enable controls
            zoomInBtn.disabled = false;
            zoomOutBtn.disabled = false;
            downloadBtn.disabled = false;

            // Update the download link URL and filename
            downloadBtn.setAttribute('data-url', currentPdfUrl);
            downloadBtn.setAttribute('data-filename', currentFileName);
            
        } else {
            alert("Please select a valid PDF file.");
            // Reset everything if invalid file is chosen
            currentPdfUrl = null;
            pdfDisplay.style.display = 'none';
            pdfDisplayIframe.style.display = 'none';
            zoomInBtn.disabled = true;
            zoomOutBtn.disabled = true;
            downloadBtn.disabled = true;
        }
    });

    // 3. Download functionality
    downloadBtn.addEventListener('click', () => {
        const url = downloadBtn.getAttribute('data-url');
        const filename = downloadBtn.getAttribute('data-filename');

        if (url) {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename; // Set the filename for the download
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up the object URL after download is initiated
            // URL.revokeObjectURL(url); // Can be called later, but good practice
        }
    });

    // 4. Placeholder Zoom functionality
    // Note: True PDF zoom requires a library like PDF.js or direct PDF manipulation, 
    // which is beyond basic client-side JS.
    let currentZoomLevel = 100;
    
    // Simple alert-based "zoom" to demonstrate the button action
    zoomInBtn.addEventListener('click', () => {
        if (currentPdfUrl) {
            currentZoomLevel += 10;
            // In a real implementation with PDF.js, you'd call a function here to change the scale
            console.log(`Zooming In. New level: ${currentZoomLevel}%`);
            // alert(`Attempting to Zoom In. New level: ${currentZoomLevel}% (Functionality Limited to Browser Support)`);
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        if (currentPdfUrl) {
            currentZoomLevel -= 10;
            if (currentZoomLevel < 10) currentZoomLevel = 10;
            // In a real implementation with PDF.js, you'd call a function here to change the scale
            console.log(`Zooming Out. New level: ${currentZoomLevel}%`);
            // alert(`Attempting to Zoom Out. New level: ${currentZoomLevel}% (Functionality Limited to Browser Support)`);
        }
    });
});