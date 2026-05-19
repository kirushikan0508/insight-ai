"""Data preprocessing service — cleaning, type detection, and preparation."""
import pandas as pd
import numpy as np


def detect_column_types(df: pd.DataFrame) -> list[dict]:
    """Detect column types and return metadata for each column."""
    columns = []
    for col in df.columns:
        dtype = str(df[col].dtype)
        # Determine type category
        if pd.api.types.is_numeric_dtype(df[col]):
            type_cat = "numeric"
        elif pd.api.types.is_datetime64_any_dtype(df[col]):
            type_cat = "datetime"
        else:
            # Try parsing as datetime
            try:
                pd.to_datetime(df[col], infer_datetime_format=True, errors="raise")
                type_cat = "datetime"
            except (ValueError, TypeError):
                if df[col].nunique() < min(50, len(df) * 0.5):
                    type_cat = "categorical"
                else:
                    type_cat = "text"

        samples = df[col].dropna().head(3).astype(str).tolist()
        columns.append({
            "name": col,
            "dtype": dtype,
            "type_category": type_cat,
            "missing": int(df[col].isna().sum()),
            "unique": int(df[col].nunique()),
            "sample_values": samples,
        })
    return columns


def clean_dataset(df: pd.DataFrame, column_info: list[dict]) -> tuple[pd.DataFrame, dict]:
    """Clean dataset and return cleaned df + cleaning summary."""
    actions = []
    missing_before = int(df.isna().sum().sum())

    # Convert detected datetime columns
    for col_meta in column_info:
        if col_meta["type_category"] == "datetime" and not pd.api.types.is_datetime64_any_dtype(df[col_meta["name"]]):
            try:
                df[col_meta["name"]] = pd.to_datetime(df[col_meta["name"]], errors="coerce")
                actions.append(f"Converted '{col_meta['name']}' to datetime format")
            except Exception:
                pass

    # Handle missing values
    for col_meta in column_info:
        col = col_meta["name"]
        if df[col].isna().sum() == 0:
            continue
        if col_meta["type_category"] == "numeric":
            median_val = df[col].median()
            df[col] = df[col].fillna(median_val)
            actions.append(f"Filled missing values in '{col}' with median ({median_val:.2f})")
        elif col_meta["type_category"] == "categorical":
            mode_val = df[col].mode().iloc[0] if not df[col].mode().empty else "Unknown"
            df[col] = df[col].fillna(mode_val)
            actions.append(f"Filled missing values in '{col}' with mode ('{mode_val}')")
        elif col_meta["type_category"] == "datetime":
            df[col] = df[col].fillna(method="ffill")
            actions.append(f"Forward-filled missing dates in '{col}'")
        else:
            df[col] = df[col].fillna("Unknown")
            actions.append(f"Filled missing text in '{col}' with 'Unknown'")

    missing_after = int(df.isna().sum().sum())

    # Remove duplicates
    dup_count = int(df.duplicated().sum())
    if dup_count > 0:
        df = df.drop_duplicates()
        actions.append(f"Removed {dup_count} duplicate rows")

    # Detect outliers (IQR method on numeric columns)
    outlier_count = 0
    for col_meta in column_info:
        if col_meta["type_category"] == "numeric":
            col = col_meta["name"]
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            outliers = ((df[col] < Q1 - 1.5 * IQR) | (df[col] > Q3 + 1.5 * IQR)).sum()
            outlier_count += int(outliers)

    if outlier_count > 0:
        actions.append(f"Detected {outlier_count} potential outliers across numeric columns")

    if not actions:
        actions.append("Dataset was already clean — no preprocessing needed")

    summary = {
        "missing_before": missing_before,
        "missing_after": missing_after,
        "duplicates_removed": dup_count,
        "outliers_detected": outlier_count,
        "actions": actions,
    }

    return df, summary
