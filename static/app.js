// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let currentPage = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
let canvas = document.getElementById('pdf-viewer');
let ctx = canvas.getContext('2d');
let currentHighlightCoordinates = null;

// Load PDF
async function loadPDF() {
    try {
        // Load the PDF file
        const loadingTask = pdfjsLib.getDocument('/static/data/HLLY - Amendment no 1.pdf');
        pdfDoc = await loadingTask.promise;
        renderPage(currentPage);
    } catch (error) {
        console.error('Error loading PDF:', error);
    }
}

// Render page
function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function(page) {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        const renderTask = page.render(renderContext);
        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
            // Reapply highlight after page render
            if (currentHighlightCoordinates) {
                console.log('Reapplying highlight after render:', currentHighlightCoordinates);
                applyHighlight(currentHighlightCoordinates);
            }
        });
    });
}

// Queue page rendering
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

// Apply highlight with current viewport
function applyHighlight(coordinates) {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 4) {
        console.error('Invalid coordinates format:', coordinates);
        return;
    }

    // Remove existing highlights and debug points
    document.querySelectorAll('.highlight, .debug-point').forEach(el => el.remove());

    // Get current viewport
    pdfDoc.getPage(currentPage).then(function(page) {
        const viewport = page.getViewport({ scale: scale });
        const container = document.getElementById('pdf-container');
        const canvas = document.getElementById('pdf-viewer');

        // Get container dimensions
        const containerRect = container.getBoundingClientRect();
        
        // Calculate the scale ratio between container and canvas
        const scaleRatio = {
            x: containerRect.width / canvas.width,
            y: containerRect.height / canvas.height
        };
        
        console.log('Dimensions:', {
            container: {
                width: containerRect.width,
                height: containerRect.height
            },
            canvas: {
                width: canvas.width,
                height: canvas.height
            },
            ratio: scaleRatio
        });
        
        // Get coordinates [x1, y1, x2, y2] from PDF space
        const [x1, y1, x2, y2] = coordinates;
        
        /* Debug points - commented out but preserved for future debugging
        const debugPoints = [
            { x: 0, y: 0, color: 'red', label: 'Origin' },
            { x: containerRect.width/2, y: containerRect.height/2, color: 'blue', label: 'Center' },
            { x: containerRect.width, y: containerRect.height, color: 'green', label: 'Max' }
        ];
        
        debugPoints.forEach(point => {
            const dot = document.createElement('div');
            dot.className = 'debug-point';
            dot.style.position = 'absolute';
            dot.style.left = `${point.x}px`;
            dot.style.top = `${point.y}px`;
            dot.style.width = '10px';
            dot.style.height = '10px';
            dot.style.backgroundColor = point.color;
            dot.style.border = '2px solid black';
            dot.style.borderRadius = '50%';
            dot.style.zIndex = '100';
            
            const label = document.createElement('div');
            label.style.position = 'absolute';
            label.style.left = '12px';
            label.style.top = '0px';
            label.style.backgroundColor = 'white';
            label.style.padding = '2px';
            label.style.fontSize = '12px';
            label.style.whiteSpace = 'nowrap';
            label.textContent = `${point.label} (${point.x.toFixed(0)}, ${point.y.toFixed(0)})`;
            dot.appendChild(label);
            
            container.appendChild(dot);
        });
        */

        // Convert PDF coordinates to container-relative coordinates
        // 1. First normalize to 0-1 range in PDF space
        const normalizedX = x1 / 612;  // PDF width
        const normalizedY = y1 / 792;  // PDF height
        
        // 2. Convert to container space
        const x = normalizedX * containerRect.width;
        const y = (1 - normalizedY) * containerRect.height;  // Flip Y coordinate
        
        // 3. Calculate dimensions in container space
        const w = ((x2 - x1) / 612) * containerRect.width;
        const h = ((y1 - y2) / 792) * containerRect.height;

        console.log('Coordinate Transformation:', {
            pdf: {
                raw: [x1, y1, x2, y2],
                normalized: [normalizedX, normalizedY]
            },
            container: {
                position: [x, y],
                size: [w, h]
            }
        });

        // Create highlight
        const highlight = document.createElement('div');
        highlight.className = 'highlight';
        highlight.style.position = 'absolute';
        highlight.style.left = `${x}px`;
        highlight.style.top = `${y}px`;
        highlight.style.width = `${w}px`;
        highlight.style.height = `${h}px`;
        highlight.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
        highlight.style.border = '2px solid yellow';
        highlight.style.pointerEvents = 'none';
        highlight.style.zIndex = '1';
        
        /* Coordinate label - commented out but preserved for future debugging
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.top = '-20px';
        label.style.left = '0';
        label.style.color = 'black';
        label.style.backgroundColor = 'white';
        label.style.padding = '2px';
        label.style.fontSize = '10px';
        label.textContent = `PDF(${x1.toFixed(1)},${y1.toFixed(1)}) → Container(${x.toFixed(1)},${y.toFixed(1)})`;
        highlight.appendChild(label);
        */
        
        container.appendChild(highlight);
    });
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log('Window resized, re-rendering page');
        renderPage(currentPage);
    }, 100);
});

// Switch tabs
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`.tab[onclick*="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Highlight region from controls
async function highlightRegion() {
    const pageNumber = parseInt(document.getElementById('page-number').value);
    const coordinates = document.getElementById('coordinates').value
        .split(',')
        .map(coord => parseFloat(coord.trim()));
    
    console.log('Manual highlight requested:', {
        page: pageNumber,
        coordinates: coordinates
    });
    
    if (pageNumber && coordinates.length === 4) {
        currentPage = pageNumber;
        currentHighlightCoordinates = coordinates;
        queueRenderPage(currentPage);
        
        try {
            await fetch('/api/highlight', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: pageNumber,
                    coordinates: coordinates
                })
            });
        } catch (error) {
            console.error('Error highlighting region:', error);
        }
    }
}

// Initialize
loadPDF(); 