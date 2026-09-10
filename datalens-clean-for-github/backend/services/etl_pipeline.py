import pandas as pd
import numpy as np
import os

def analyze_dataset(file_path: str):
    """
    Reads a CSV or Excel file and extracts schema and statistical information.
    """
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)
        
    # Basic info
    rows, columns = df.shape
    missing_percent = (df.isnull().sum().sum() / (rows * columns)) * 100
    duplicates = int(df.duplicated().sum())
    
    # Schema info
    schema_info = []
    for col in df.columns:
        dtype = str(df[col].dtype)
        col_type = "numeric" if pd.api.types.is_numeric_dtype(df[col]) else "categorical"
        
        schema_info.append({
            "name": col,
            "pandas_dtype": dtype,
            "type": col_type,
            "unique_values": int(df[col].nunique())
        })
        
    # Business stats (mocked extraction, attempts to find 'revenue', 'sales', etc.)
    business_stats = {}
    
    revenue_cols = [c for c in df.columns if 'revenue' in c.lower() or 'sales' in c.lower() or 'price' in c.lower()]
    if revenue_cols:
        target_col = revenue_cols[0]
        if pd.api.types.is_numeric_dtype(df[target_col]):
            total_revenue = float(df[target_col].sum())
            business_stats["total_revenue"] = total_revenue
            business_stats["avg_order"] = float(df[target_col].mean())
            
    # Time series info (attempt to find date column)
    date_cols = [c for c in df.columns if 'date' in c.lower() or 'time' in c.lower()]
    if date_cols and revenue_cols:
        date_col = date_cols[0]
        try:
            df[date_col] = pd.to_datetime(df[date_col])
            df = df.sort_values(by=date_col)
            # Create a simple trend for chart
            trend = df.groupby(df[date_col].dt.date)[revenue_cols[0]].sum().reset_index()
            trend[date_col] = trend[date_col].astype(str)
            business_stats["revenue_trend"] = trend.to_dict(orient="records")
        except Exception:
            pass

    stats = {
        "rows": rows,
        "columns": columns,
        "missing_percent": float(missing_percent),
        "duplicates": duplicates,
        "business_stats": business_stats
    }
    
    return stats, schema_info
