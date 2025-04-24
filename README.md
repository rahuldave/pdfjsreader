# PDF Viewer with Text Highlighting

A FastAPI and JavaScript-based PDF viewer application that loads PDFs and highlights text regions based on coordinate data from a JSON file.

## Features

- PDF viewing with PDF.js
- Interactive table of contents
- Text highlighting based on coordinates
- Search functionality
- Clean, modern UI

## Setup

1. Install uv (if not already installed):
```bash
pip install uv
```

2. Create and activate a new virtual environment:
```bash
uv venv
source .venv/bin/activate  # On Unix/macOS
# or
.venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
uv pip install -r requirements.txt
```

4. Place your data files:
   - Put your PDF and JSON files in `static/data/` directory
   - See `static/data/README.md` for the expected file structure

## Running the Application

1. Start the FastAPI server:
```bash
uvicorn backend.main:app --reload
```

2. Open your browser and navigate to:
```
http://localhost:8000
```

## Development

The application uses:
- FastAPI for the backend
- PDF.js for PDF rendering
- Vanilla JavaScript for the frontend
- CSS for styling

### Project Structure

```
├── backend/
│   └── main.py           # FastAPI application
├── static/
│   ├── data/            # PDF and JSON files (gitignored)
│   ├── app.js           # PDF viewer logic
│   ├── OutlineView.js   # Table of contents component
│   ├── init.js          # Application initialization
│   ├── styles.css       # Main styles
│   └── OutlineView.css  # Table of contents styles
└── requirements.txt     # Python dependencies
```

## Push to AWS

```bash
aws sso login
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/t0a9q9b2
```

## License

TBD