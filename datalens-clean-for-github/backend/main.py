from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import Base, engine
from api.routes import upload, datasets

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DataLens API", description="AI-Powered Data Analytics Platform")

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/v1/upload", tags=["upload"])
app.include_router(datasets.router, prefix="/api/v1/datasets", tags=["datasets"])

@app.get("/")
def read_root():
    return {"message": "Welcome to DataLens API"}
