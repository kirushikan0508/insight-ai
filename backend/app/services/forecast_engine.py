"""Forecast engine — time series forecasting with sklearn fallback."""
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression


def generate_forecast(df: pd.DataFrame, date_column: str, value_column: str, period: int = 30) -> dict:
    """Generate time series forecast using linear trend + seasonality estimation."""

    if date_column not in df.columns:
        raise ValueError(f"Date column '{date_column}' not found")
    if value_column not in df.columns:
        raise ValueError(f"Value column '{value_column}' not found")

    ts = df[[date_column, value_column]].dropna().copy()
    ts[date_column] = pd.to_datetime(ts[date_column], errors="coerce")
    ts = ts.dropna().sort_values(date_column).reset_index(drop=True)

    if len(ts) < 5:
        raise ValueError("Need at least 5 data points for forecasting")

    # Create numeric features
    ts["ordinal"] = (ts[date_column] - ts[date_column].min()).dt.days.astype(float)
    ts["day_of_week"] = ts[date_column].dt.dayofweek.astype(float)
    ts["month"] = ts[date_column].dt.month.astype(float)

    y = ts[value_column].values.astype(float)
    X = ts[["ordinal", "day_of_week", "month"]].values

    # Fit model
    model = LinearRegression()
    model.fit(X, y)

    # Compute residual std for confidence intervals
    y_pred_train = model.predict(X)
    residual_std = float(np.std(y - y_pred_train))

    # Generate future dates
    last_date = ts[date_column].max()
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=period, freq="D")

    future_ordinal = (future_dates - ts[date_column].min()).days.astype(float)
    future_dow = future_dates.dayofweek.astype(float)
    future_month = future_dates.month.astype(float)
    X_future = np.column_stack([future_ordinal, future_dow, future_month])

    y_future = model.predict(X_future)

    # Build forecast results with actuals
    forecast = []

    # Include recent historical data
    recent = ts.tail(min(30, len(ts)))
    for _, row in recent.iterrows():
        forecast.append({
            "ds": row[date_column].strftime("%Y-%m-%d"),
            "yhat": float(row[value_column]),
            "yhat_lower": float(row[value_column]),
            "yhat_upper": float(row[value_column]),
            "actual": float(row[value_column]),
        })

    # Add forecasted data
    for i in range(len(future_dates)):
        val = float(y_future[i])
        margin = residual_std * 1.96 * (1 + i * 0.01)  # Widening CI
        forecast.append({
            "ds": future_dates[i].strftime("%Y-%m-%d"),
            "yhat": round(val, 2),
            "yhat_lower": round(val - margin, 2),
            "yhat_upper": round(val + margin, 2),
            "actual": None,
        })

    # Trend summary
    trend_dir = "upward" if model.coef_[0] > 0 else "downward"
    avg_val = float(y.mean())
    last_val = float(y[-1])
    forecast_avg = float(np.mean(y_future))

    trend_summary = (
        f"The data shows a general {trend_dir} trend. "
        f"Historical average: {avg_val:.2f}, most recent value: {last_val:.2f}. "
        f"The {period}-day forecast projects an average of {forecast_avg:.2f}. "
        f"{'Values are expected to increase.' if forecast_avg > last_val else 'Values may stabilize or decrease.'}"
    )

    return {
        "forecast": forecast,
        "trend_summary": trend_summary,
        "date_column": date_column,
        "value_column": value_column,
        "period": period,
    }
