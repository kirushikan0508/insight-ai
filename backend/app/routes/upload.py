"""Upload route — handles CSV/XLSX file uploads and initial processing."""
import uuid
import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException, Request

from app.services.preprocessing import detect_column_types, clean_dataset

router = APIRouter()


@router.post("/upload")
async def upload_file(request: Request, file: UploadFile = File(...)):
    """Upload a CSV or XLSX file. Returns overview + cleaning summary."""

    # Validate file type
    filename = file.filename or "unknown"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ("csv", "xlsx", "xls"):
        raise HTTPException(400, "Only CSV and Excel files are supported")

    # Read file
    content = await file.read()
    try:
        if ext == "csv":
            df = pd.read_csv(io.BytesIO(content))
        else:
            df = pd.read_excel(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(400, f"Failed to parse file: {str(e)}")

    if df.empty:
        raise HTTPException(400, "The uploaded file is empty")

    # Detect column types
    column_info = detect_column_types(df)

    # Clean dataset
    df_clean, cleaning_summary = clean_dataset(df.copy(), column_info)

    # Re-detect after cleaning
    column_info_clean = detect_column_types(df_clean)

    # Generate session
    session_id = str(uuid.uuid4())[:8]

    # Store in memory
    request.app.state.sessions[session_id] = {
        "df": df_clean,
        "column_info": column_info_clean,
        "filename": filename,
    }

    # Build overview
    mem = df_clean.memory_usage(deep=True).sum()
    mem_str = f"{mem / 1024:.1f} KB" if mem < 1048576 else f"{mem / 1048576:.1f} MB"

    overview = {
        "filename": filename,
        "rows": len(df_clean),
        "columns": len(df_clean.columns),
        "missing_values": int(df_clean.isna().sum().sum()),
        "duplicate_rows": int(df_clean.duplicated().sum()),
        "memory_usage": mem_str,
        "column_info": column_info_clean,
        "preview": df_clean.head(10).fillna("").to_dict("records"),
    }

    return {
        "session_id": session_id,
        "overview": overview,
        "cleaning": cleaning_summary,
    }
