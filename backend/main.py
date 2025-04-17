from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

class BoundingBox(BaseModel):
    page: int
    coordinates: list[float]

def process_sections(data):
    sections = []
    if isinstance(data, list) and len(data) >= 3:
        # Get the third top-level element
        main_section = data[2]
        if isinstance(main_section, dict):
            # Process each section
            for section_key, section_data in main_section.items():
                if isinstance(section_data, dict):
                    section_items = []
                    # Find all items with region_coordinates
                    def find_regions(obj, current_path=None):
                        if current_path is None:
                            current_path = []
                        
                        if isinstance(obj, dict):
                            if "region_coordinates" in obj:
                                section_items.append({
                                    "uuid": obj.get("uuid", ""),
                                    "text": obj.get("text", ""),
                                    "page": obj.get("start_page", 1),
                                    "coordinates": obj.get("region_coordinates", []),
                                    "path": current_path.copy()
                                })
                            for key, value in obj.items():
                                current_path.append(key)
                                find_regions(value, current_path)
                                current_path.pop()
                        elif isinstance(obj, list):
                            for item in obj:
                                find_regions(item, current_path)
                    
                    find_regions(section_data)
                    
                    if section_items:
                        sections.append({
                            "section": section_key,
                            "items": section_items
                        })
    
    return sections

@app.get("/api/pdf")
async def get_pdf_info():
    try:
        with open("static/HLLY - Amendment no 1.json", "r") as f:
            pdf_structure = json.load(f)
            sections = process_sections(pdf_structure)
            return sections
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/highlight")
async def highlight_region(box: BoundingBox):
    try:
        return {
            "page": box.page,
            "coordinates": box.coordinates,
            "message": "Region highlighted successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002) 