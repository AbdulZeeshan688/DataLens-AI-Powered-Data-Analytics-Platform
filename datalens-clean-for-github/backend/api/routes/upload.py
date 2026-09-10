from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from core.database import get_db
from models.dataset import Dataset
from worker.tasks import process_dataset_task
import os
import shutil
import uuid

router = APIRouter()

DATA_DIR = "/app/data"

@router.post("/")
async def upload_dataset(background_tasks: BackgroundTasks, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Only CSV or Excel files are allowed.")
    
    # Ensure data dir exists
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # Save file
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(DATA_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Create dataset record
    dataset = Dataset(
        filename=file.filename,
        original_path=file_path,
        status="uploaded"
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    
    # Trigger Background Task
    background_tasks.add_task(process_dataset_task, dataset.id)
    
    return {"message": "Dataset uploaded successfully. Processing started.", "dataset_id": dataset.id}
