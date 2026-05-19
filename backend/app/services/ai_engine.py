"""AI engine — Gemini API integration for insights and chat."""
import os
import json
import pandas as pd

try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False


def _get_model():
    """Initialize and return Gemini model."""
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key or api_key == "your_gemini_api_key_here":
        return None
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-2.0-flash")


def _build_context(df: pd.DataFrame, column_info: list[dict]) -> str:
    """Build dataset context string for AI prompts."""
    desc = df.describe(include="all").round(2).to_string()
    cols = ", ".join([f"{c['name']} ({c['type_category']})" for c in column_info])
    sample = df.head(5).to_string()
    return (
        f"Dataset has {len(df)} rows and {len(df.columns)} columns.\n"
        f"Columns: {cols}\n\n"
        f"Statistics:\n{desc}\n\n"
        f"Sample data:\n{sample}"
    )


def generate_insights(df: pd.DataFrame, column_info: list[dict]) -> list[dict]:
    """Generate AI-powered business insights from dataset."""
    model = _get_model()
    if model is None:
        return _generate_fallback_insights(df, column_info)

    context = _build_context(df, column_info)
    prompt = f"""You are a senior data analyst. Analyze this dataset and provide exactly 6 smart business insights.

{context}

Return a JSON array with exactly 6 objects, each having:
- "id": unique string number
- "title": short headline (max 10 words)
- "description": detailed insight (2-3 sentences)
- "category": one of "trend", "pattern", "anomaly", "recommendation", "summary"
- "importance": one of "high", "medium", "low"

Focus on actionable, business-relevant insights. Be specific with numbers and column names.
Return ONLY the JSON array, no other text."""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean markdown if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            text = text.rsplit("```", 1)[0]
        insights = json.loads(text)
        return insights
    except Exception as e:
        print(f"Gemini API error: {e}")
        return _generate_fallback_insights(df, column_info)


def chat_with_data(df: pd.DataFrame, column_info: list[dict], message: str) -> str:
    """Chat with AI about the dataset."""
    model = _get_model()
    if model is None:
        return _fallback_chat(df, column_info, message)

    context = _build_context(df, column_info)
    prompt = f"""You are an AI data analyst assistant. Answer the user's question about this dataset.
Be concise, specific, and reference actual data values when possible.

Dataset Context:
{context}

User Question: {message}

Provide a helpful, data-driven response in 2-4 sentences."""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"I encountered an error analyzing your data: {str(e)}"


def _generate_fallback_insights(df: pd.DataFrame, column_info: list[dict]) -> list[dict]:
    """Generate basic statistical insights when AI API is unavailable."""
    insights = []
    numeric_cols = [c["name"] for c in column_info if c["type_category"] == "numeric"]
    categorical_cols = [c["name"] for c in column_info if c["type_category"] == "categorical"]

    insights.append({
        "id": "1",
        "title": "Dataset Size Overview",
        "description": f"The dataset contains {len(df)} rows and {len(df.columns)} columns. {len(numeric_cols)} numeric and {len(categorical_cols)} categorical features detected.",
        "category": "summary",
        "importance": "high",
    })

    if numeric_cols:
        col = numeric_cols[0]
        mean_val = df[col].mean()
        std_val = df[col].std()
        insights.append({
            "id": "2",
            "title": f"Key Metric: {col}",
            "description": f"Average {col} is {mean_val:.2f} with standard deviation {std_val:.2f}. Range: {df[col].min():.2f} to {df[col].max():.2f}.",
            "category": "pattern",
            "importance": "high",
        })

    if len(numeric_cols) >= 2:
        corr = df[numeric_cols].corr()
        max_corr = 0
        pair = ("", "")
        for i in range(len(numeric_cols)):
            for j in range(i+1, len(numeric_cols)):
                if abs(corr.iloc[i, j]) > abs(max_corr):
                    max_corr = corr.iloc[i, j]
                    pair = (numeric_cols[i], numeric_cols[j])
        insights.append({
            "id": "3",
            "title": "Strongest Correlation Found",
            "description": f"{pair[0]} and {pair[1]} show a correlation of {max_corr:.3f}. {'Strong positive' if max_corr > 0.5 else 'Moderate' if max_corr > 0.3 else 'Weak'} relationship detected.",
            "category": "pattern",
            "importance": "medium",
        })

    missing = df.isna().sum().sum()
    if missing > 0:
        insights.append({
            "id": "4",
            "title": "Data Quality Alert",
            "description": f"Found {missing} missing values across the dataset. Auto-cleaning has been applied using median/mode imputation.",
            "category": "anomaly",
            "importance": "medium",
        })

    if categorical_cols:
        col = categorical_cols[0]
        top = df[col].value_counts().head(1)
        insights.append({
            "id": "5",
            "title": f"Dominant Category in {col}",
            "description": f"'{top.index[0]}' is the most frequent value with {top.values[0]} occurrences ({top.values[0]/len(df)*100:.1f}% of data).",
            "category": "trend",
            "importance": "medium",
        })

    insights.append({
        "id": "6",
        "title": "Recommendation",
        "description": "Configure the Gemini API key in backend/.env for richer AI-powered insights and natural language Q&A about your data.",
        "category": "recommendation",
        "importance": "low",
    })

    return insights[:6]


def _fallback_chat(df: pd.DataFrame, column_info: list[dict], message: str) -> str:
    """Basic chat responses without AI API."""
    msg = message.lower()
    numeric_cols = [c["name"] for c in column_info if c["type_category"] == "numeric"]

    if "summary" in msg or "summarize" in msg:
        return f"The dataset has {len(df)} rows and {len(df.columns)} columns with {len(numeric_cols)} numeric features. Configure Gemini API for deeper analysis."
    if "trend" in msg:
        if numeric_cols:
            col = numeric_cols[0]
            return f"For {col}: mean={df[col].mean():.2f}, min={df[col].min():.2f}, max={df[col].max():.2f}. Connect Gemini API for trend analysis."
        return "No numeric columns found for trend analysis."
    if "feature" in msg or "important" in msg:
        return "Use the ML Predictions section to train a model and see feature importance rankings."
    return f"I can help analyze your {len(df)}-row dataset. Configure the Gemini API key for full AI capabilities, or try the ML/Forecast tools above."
