from worker.celery_app import celery_app
from core.database import SessionLocal
from models.dataset import Dataset
from services.etl_pipeline import analyze_dataset
from services.ai_insights import generate_insights

def process_dataset_task(dataset_id: int):
    db = SessionLocal()
    try:
        dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not dataset:
            return "Dataset not found"

        dataset.status = "processing"
        db.commit()

        # Step 1: Analyze dataset (ETL, stats, schema)
        stats, schema_info = analyze_dataset(dataset.original_path)
        
        # Step 2: Update dataset record
        dataset.row_count = stats.get("rows")
        dataset.column_count = stats.get("columns")
        dataset.missing_values_percent = stats.get("missing_percent")
        dataset.duplicate_count = stats.get("duplicates")
        dataset.stats = stats.get("business_stats")
        dataset.schema_info = schema_info
        db.commit()

        # Step 3: Generate AI Insights
        insights = generate_insights(stats, schema_info)
        dataset.ai_insights = insights
        
        dataset.status = "ready"
        db.commit()

        return f"Processed dataset {dataset_id} successfully."

    except Exception as e:
        db.rollback()
        if 'dataset' in locals() and dataset:
            dataset.status = "failed"
            db.commit()
        return f"Error processing dataset {dataset_id}: {str(e)}"
    finally:
        db.close()
