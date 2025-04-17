# PDF Viewer with Highlighting

A web application that allows viewing PDFs with the ability to highlight specific regions and navigate through document outlines.

## Features

- PDF viewing using PDF.js
- Document outline navigation
- Region highlighting with coordinates
- Two-panel interface with controls and outline
- FastAPI backend for PDF structure and highlighting

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the FastAPI server:
```bash
python backend/main.py
```

3. Open your browser and navigate to:
```
http://localhost:8000/static/index.html
```

## Usage

1. The left panel contains two tabs:
   - Outline: Shows the document structure
   - Controls: Allows manual input of page numbers and coordinates

2. To highlight a region:
   - Enter the page number
   - Enter the coordinates (comma-separated)
   - Click "Highlight Region"

3. To navigate using the outline:
   - Click on any item in the outline
   - The PDF will scroll to the corresponding page
   - If the section has coordinates, the region will be highlighted

## File Structure

- `backend/main.py`: FastAPI server implementation
- `static/index.html`: Frontend HTML template
- `static/app.js`: Frontend JavaScript implementation
- `HLLY - Amendment no 1.pdf`: Example PDF file
- `HLLY - Amendment no 1.json`: PDF structure data 

274.6066,                             732.6672000000001,                             317.32660000000004,                             723.7672