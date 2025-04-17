// Initialize outline view
async function initOutline() {
    try {
        // Load the JSON data
        const response = await fetch('/static/data/HLLY - Amendment no 1.json');
        const jsonData = await response.json();
        console.log('JSON data loaded:', jsonData);
        
        // Initialize the outline view
        const outlineContainer = document.getElementById('outline');
        new OutlineView(outlineContainer, jsonData, ({ page, coordinates }) => {
            currentPage = page;
            currentHighlightCoordinates = coordinates;
            queueRenderPage(currentPage);
        });
    } catch (error) {
        console.error('Error initializing outline:', error);
    }
} 