# AgriMitra Backend

Minimal FastAPI backend with chart-friendly endpoints and a static dashboard at `/`.

## Endpoints

- `GET /` – HTML dashboard with charts (Chart.js)
- `GET /health` – health check
- `GET /price/history` – last 60 days of synthetic mandi prices
- `POST /price/forecast` – naive 7-day forecast (body: `{ "days": 7 }`)
- `GET /weather/history` – last 60 days synthetic temperature and rain

## Setup

```bash
# From this folder
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt

# Run server
uvicorn src.server:app --reload --port 8008
```

Then open http://localhost:8008 in your browser.
