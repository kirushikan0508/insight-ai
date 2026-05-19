# InsightAI — AI-Powered Dataset Insight & Prediction Platform

> Upload any dataset and instantly get AI-powered insights, beautiful visualizations, machine learning predictions, and time series forecasting.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![Python](https://img.shields.io/badge/Python-3.11+-yellow)

## Features

- 📊 **Auto EDA** — Automatic exploratory data analysis with smart chart generation
- 🤖 **AI Insights** — Gemini-powered business insights and recommendations
- 🧠 **ML Predictions** — Auto-trains Linear Regression, Random Forest, XGBoost and compares performance
- 📈 **Forecasting** — Time series prediction with confidence intervals
- 💬 **AI Chat** — Ask questions about your data in natural language
- 🎨 **Premium UI** — Dark theme, glassmorphism, smooth animations

## Tech Stack

| Frontend | Backend | AI/ML |
|----------|---------|-------|
| React 19 + TypeScript | FastAPI | Pandas + NumPy |
| Tailwind CSS v4 | Python 3.11+ | scikit-learn |
| Framer Motion | Uvicorn | XGBoost |
| Recharts | | Google Gemini API |

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open

Visit `http://localhost:5173` and upload the included `sample_data.csv` to test.

### 4. (Optional) Gemini API

Add your API key to `backend/.env`:
```
GEMINI_API_KEY=your_key_here
```

## Project Structure

```
├── frontend/           # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── charts/     # Recharts visualizations
│   │   ├── services/   # API integration
│   │   ├── types/      # TypeScript types
│   │   └── lib/        # Utilities
│
├── backend/            # FastAPI Python
│   ├── app/
│   │   ├── routes/     # API endpoints
│   │   ├── services/   # ML, EDA, AI engines
│   │   └── schemas/    # Pydantic models
│
└── sample_data.csv     # Test dataset
```

## License

MIT
