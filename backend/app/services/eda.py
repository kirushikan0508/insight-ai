"""EDA engine — generates statistics, correlations, and chart-ready data."""
import pandas as pd
import numpy as np


def generate_eda(df: pd.DataFrame, column_info: list[dict]) -> dict:
    """Run full EDA and return chart-ready data structures."""
    charts = []
    statistics = {}

    numeric_cols = [c["name"] for c in column_info if c["type_category"] == "numeric"]
    categorical_cols = [c["name"] for c in column_info if c["type_category"] == "categorical"]
    datetime_cols = [c["name"] for c in column_info if c["type_category"] == "datetime"]

    # --- Descriptive Statistics ---
    if numeric_cols:
        desc = df[numeric_cols].describe().round(2).to_dict()
        statistics["descriptive"] = desc

    # --- Bar charts for categorical columns ---
    for col in categorical_cols[:4]:
        counts = df[col].value_counts().head(10)
        charts.append({
            "chart_type": "bar",
            "title": f"Distribution of {col}",
            "description": f"Top categories in {col}",
            "data": [{"name": str(k), "value": int(v)} for k, v in counts.items()],
            "x_key": "name",
            "y_key": "value",
        })

    # --- Pie charts for low-cardinality categorical ---
    for col in categorical_cols[:2]:
        if df[col].nunique() <= 8:
            counts = df[col].value_counts()
            charts.append({
                "chart_type": "pie",
                "title": f"{col} Breakdown",
                "description": f"Proportional distribution of {col}",
                "data": [{"name": str(k), "value": int(v)} for k, v in counts.items()],
                "x_key": "name",
                "y_key": "value",
            })

    # --- Histograms for numeric columns ---
    for col in numeric_cols[:4]:
        try:
            hist, edges = np.histogram(df[col].dropna(), bins=20)
            chart_data = []
            for i in range(len(hist)):
                label = f"{edges[i]:.1f}"
                chart_data.append({"bin": label, "count": int(hist[i])})
            charts.append({
                "chart_type": "histogram",
                "title": f"Distribution of {col}",
                "description": f"Frequency distribution of {col}",
                "data": chart_data,
                "x_key": "bin",
                "y_key": "count",
            })
        except Exception:
            pass

    # --- Scatter plots for top correlated pairs ---
    if len(numeric_cols) >= 2:
        corr = df[numeric_cols].corr()
        pairs = []
        for i in range(len(numeric_cols)):
            for j in range(i + 1, len(numeric_cols)):
                pairs.append((numeric_cols[i], numeric_cols[j], abs(corr.iloc[i, j])))
        pairs.sort(key=lambda x: x[2], reverse=True)

        for col1, col2, corr_val in pairs[:2]:
            sample = df[[col1, col2]].dropna().head(200)
            charts.append({
                "chart_type": "scatter",
                "title": f"{col1} vs {col2}",
                "description": f"Correlation: {corr_val:.3f}",
                "data": sample.to_dict("records"),
                "x_key": col1,
                "y_key": col2,
            })

    # --- Correlation Heatmap ---
    if len(numeric_cols) >= 2:
        corr = df[numeric_cols].corr().round(3)
        heatmap_data = []
        cols_to_show = numeric_cols[:8]  # Limit for readability
        corr_subset = corr.loc[cols_to_show, cols_to_show]
        for row_name in corr_subset.index:
            for col_name in corr_subset.columns:
                heatmap_data.append({
                    "row": row_name,
                    "col": col_name,
                    "value": float(corr_subset.loc[row_name, col_name]),
                })
        charts.append({
            "chart_type": "heatmap",
            "title": "Correlation Heatmap",
            "description": "Pairwise correlations between numeric features",
            "data": heatmap_data,
        })

    # --- Line charts for time series ---
    if datetime_cols and numeric_cols:
        date_col = datetime_cols[0]
        for num_col in numeric_cols[:2]:
            try:
                ts = df[[date_col, num_col]].dropna().sort_values(date_col)
                # Resample if too many points
                if len(ts) > 200:
                    ts = ts.set_index(date_col).resample("W").mean().reset_index()
                ts_data = []
                for _, row in ts.head(200).iterrows():
                    ts_data.append({
                        "date": row[date_col].strftime("%Y-%m-%d") if hasattr(row[date_col], "strftime") else str(row[date_col]),
                        "value": round(float(row[num_col]), 2),
                    })
                charts.append({
                    "chart_type": "line",
                    "title": f"{num_col} over Time",
                    "description": f"Trend of {num_col} across {date_col}",
                    "data": ts_data,
                    "x_key": "date",
                    "y_key": "value",
                })
            except Exception:
                pass

    return {"charts": charts, "statistics": statistics}
