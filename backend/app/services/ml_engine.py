"""ML engine — auto-detect task, train models, compare, and return results."""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import (
    accuracy_score, f1_score, precision_score, recall_score,
    mean_squared_error, mean_absolute_error, r2_score,
    confusion_matrix,
)

try:
    from xgboost import XGBClassifier, XGBRegressor
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False


def train_and_evaluate(df: pd.DataFrame, target_column: str, column_info: list[dict]) -> dict:
    """Auto-detect task type, train multiple models, and return comparison results."""

    if target_column not in df.columns:
        raise ValueError(f"Column '{target_column}' not found in dataset")

    # Determine task type
    target_info = next((c for c in column_info if c["name"] == target_column), None)
    y = df[target_column].copy()

    if target_info and target_info["type_category"] == "numeric" and y.nunique() > 15:
        task_type = "regression"
    else:
        task_type = "classification"

    # Prepare features
    feature_cols = [c["name"] for c in column_info
                    if c["name"] != target_column
                    and c["type_category"] in ("numeric", "categorical")]

    X = df[feature_cols].copy()

    # Encode categoricals
    label_encoders = {}
    for col in X.columns:
        col_info = next((c for c in column_info if c["name"] == col), None)
        if col_info and col_info["type_category"] == "categorical":
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
            label_encoders[col] = le

    # Encode target for classification
    target_le = None
    class_labels = None
    if task_type == "classification":
        target_le = LabelEncoder()
        y = pd.Series(target_le.fit_transform(y.astype(str)))
        class_labels = target_le.classes_.tolist()

    # Handle remaining NaN
    X = X.fillna(0)
    y = y.fillna(y.median() if task_type == "regression" else y.mode().iloc[0])

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Scale
    scaler = StandardScaler()
    X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train), columns=X_train.columns)
    X_test_scaled = pd.DataFrame(scaler.transform(X_test), columns=X_test.columns)

    # Define models
    if task_type == "classification":
        models = {
            "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
            "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        }
        if HAS_XGBOOST:
            models["XGBoost"] = XGBClassifier(
                n_estimators=100, random_state=42, eval_metric="mlogloss",
                use_label_encoder=False, verbosity=0,
            )
    else:
        models = {
            "Linear Regression": LinearRegression(),
            "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42),
        }
        if HAS_XGBOOST:
            models["XGBoost"] = XGBRegressor(
                n_estimators=100, random_state=42, verbosity=0,
            )

    # Train and evaluate
    results = []
    best_score = -np.inf
    best_model_name = ""
    best_model_obj = None

    for name, model in models.items():
        try:
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)

            if task_type == "classification":
                avg = "weighted" if len(np.unique(y)) > 2 else "binary"
                metrics = {
                    "accuracy": float(accuracy_score(y_test, y_pred)),
                    "f1_score": float(f1_score(y_test, y_pred, average=avg, zero_division=0)),
                    "precision": float(precision_score(y_test, y_pred, average=avg, zero_division=0)),
                    "recall": float(recall_score(y_test, y_pred, average=avg, zero_division=0)),
                }
                score = metrics["f1_score"]
            else:
                metrics = {
                    "rmse": float(np.sqrt(mean_squared_error(y_test, y_pred))),
                    "mae": float(mean_absolute_error(y_test, y_pred)),
                    "r2": float(r2_score(y_test, y_pred)),
                }
                score = metrics["r2"]

            results.append({"name": name, "metrics": metrics, "is_best": False})

            if score > best_score:
                best_score = score
                best_model_name = name
                best_model_obj = model
        except Exception as e:
            results.append({
                "name": name,
                "metrics": {"error": str(e)},
                "is_best": False,
            })

    # Mark best
    for r in results:
        if r["name"] == best_model_name:
            r["is_best"] = True

    # Feature importance
    feature_importance = []
    if best_model_obj is not None:
        if hasattr(best_model_obj, "feature_importances_"):
            importances = best_model_obj.feature_importances_
        elif hasattr(best_model_obj, "coef_"):
            importances = np.abs(best_model_obj.coef_).flatten()
        else:
            importances = np.zeros(len(feature_cols))

        for feat, imp in zip(feature_cols, importances):
            feature_importance.append({"feature": feat, "importance": round(float(imp), 4)})
        feature_importance.sort(key=lambda x: x["importance"], reverse=True)

    # Confusion matrix for classification
    cm = None
    if task_type == "classification" and best_model_obj is not None:
        y_pred_best = best_model_obj.predict(X_test_scaled)
        cm = confusion_matrix(y_test, y_pred_best).tolist()

    # Predictions vs actual for regression
    pva = None
    if task_type == "regression" and best_model_obj is not None:
        y_pred_best = best_model_obj.predict(X_test_scaled)
        pva = [
            {"actual": float(a), "predicted": float(p)}
            for a, p in zip(y_test.values[:100], y_pred_best[:100])
        ]

    return {
        "task_type": task_type,
        "target_column": target_column,
        "models": results,
        "best_model": best_model_name,
        "feature_importance": feature_importance,
        "confusion_matrix": cm,
        "predictions_vs_actual": pva,
        "class_labels": class_labels,
    }
