from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
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

@app.get("/")
async def read_root():
    return FileResponse("static/viewer.html")

@app.get("/driver.html")
async def read_driver():
    return FileResponse("static/driver.html")

@app.get("/viewer.html")
async def read_viewer():
    return FileResponse("static/viewer.html")

@app.get("/viewer_online.html")
async def read_viewer_online(request: Request):
    # Get all query parameters
    params = request.query_params
    # Reconstruct the query string
    query_string = '&'.join(f"{k}={v}" for k, v in params.items())
    # Redirect to the static version with all parameters preserved
    return RedirectResponse(url=f"/static/viewer_online.html?{query_string}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003) 
