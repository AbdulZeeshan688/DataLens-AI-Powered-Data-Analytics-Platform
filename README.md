# DataLens

Upload a CSV or Excel file and DataLens profiles it for you: rows, columns, missing values, duplicates, column types, and revenue totals and trends if it finds a revenue or sales column. Then it asks OpenAI for three short business insights about the data.

It's a full-stack project: a FastAPI backend with PostgreSQL, and a React + TypeScript frontend, all running together with Docker Compose.

## How it works

1. You upload a `.csv`, `.xlsx` or `.xls` file in the frontend.
2. The backend saves the file, creates a dataset record in PostgreSQL and starts processing in the background.
3. pandas reads the file and works out the stats and schema.
4. The stats go to OpenAI, which returns three insights. Without an API key it falls back to simple rule-based insights, so the app still works offline.
5. The dataset status moves from `uploaded` → `processing` → `ready` (or `failed`).

## Tech

| Part | Tools |
|---|---|
| Backend | Python, FastAPI, SQLAlchemy, pandas |
| Database | PostgreSQL |
| AI | OpenAI API (optional) |
| Frontend | React, TypeScript, Vite, Recharts, Axios |
| Running it | Docker Compose, Netlify for the frontend |

## Run it locally

You need Docker installed.

```bash
git clone https://github.com/AbdulZeeshan688/DataLens-AI-Powered-Data-Analytics-Platform.git
cd DataLens-AI-Powered-Data-Analytics-Platform/datalens-clean-for-github
docker compose up --build
```

- Frontend: http://localhost:5173
- API: http://localhost:8000 (interactive docs at http://localhost:8000/docs)

To get real AI insights, set your key before starting:

```bash
export OPENAI_API_KEY=your-key-here
```

## API

| Method | Endpoint | What it does |
|---|---|---|
| `POST` | `/api/v1/upload/` | Upload a file and start processing |
| `GET` | `/api/v1/datasets/` | List uploaded datasets |
| `GET` | `/api/v1/datasets/{id}` | Get one dataset with its stats and insights |

## Project structure

```
datalens-clean-for-github/
├── backend/
│   ├── api/routes/     upload and dataset endpoints
│   ├── services/       etl_pipeline.py (pandas), ai_insights.py (OpenAI)
│   ├── models/         SQLAlchemy models
│   ├── worker/         processing task + Celery setup
│   └── main.py
├── frontend/
│   └── src/components/ Upload and Dashboard
└── docker-compose.yml
```

## Still to do

- The Overview dashboard shows example numbers. Next step is wiring it to the real stats from `/api/v1/datasets/`.
- Processing runs as a FastAPI background task. Celery and Redis are set up in Docker Compose but the task isn't sent through the worker yet.
- There's a User model but no login yet.
- No tests yet.
