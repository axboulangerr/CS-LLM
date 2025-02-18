from fastapi import FastAPI
from fastapi.responses import FileResponse
from starlette.staticfiles import StaticFiles

app = FastAPI()

app.mount("/", StaticFiles(directory=".", html=True), name="static")

@app.get("/")
async def serve_index():
    return FileResponse("index.html")
