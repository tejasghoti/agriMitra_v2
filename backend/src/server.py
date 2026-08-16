from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

app = FastAPI(title="AgriMitra Backend", version="0.1.0")

# CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Simple in-memory demo data (replace with DB later) ---
np.random.seed(42)
start = datetime.now() - timedelta(days=60)
dates = pd.date_range(start, periods=60, freq="D")
prices = pd.Series(2000 + np.cumsum(np.random.randn(60) * 10), index=dates).round(2)
temps = pd.Series(28 + np.sin(np.linspace(0, 6, 60)) * 5 + np.random.randn(60), index=dates).round(1)
rain = pd.Series(np.clip(np.random.randn(60) * 3, 0, None), index=dates).round(1)

price_df = pd.DataFrame({"date": dates, "price": prices}).reset_index(drop=True)
weather_df = pd.DataFrame({"date": dates, "temp": temps, "rain": rain}).reset_index(drop=True)

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None

class PriceForecastRequest(BaseModel):
    days: int = 7

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/price/history")
def price_history():
    return price_df.to_dict(orient="records")

@app.post("/price/forecast")
def price_forecast(req: PriceForecastRequest):
    # naive forecast using last delta mean
    s = price_df["price"].values
    deltas = np.diff(s[-14:])
    drift = deltas.mean() if len(deltas) else 0.0
    last = s[-1]
    future = []
    for i in range(1, req.days + 1):
        last = last + drift
        future.append({
            "date": (price_df["date"].iloc[-1] + timedelta(days=i)).strftime("%Y-%m-%d"),
            "price": round(float(last), 2),
        })
    return future

@app.get("/weather/history")
def weather_history():
    return weather_df.to_dict(orient="records")

@app.get("/summary")
def summary():
  # Simple aggregates for dashboard KPIs
  latest_price = float(price_df["price"].iloc[-1])
  price_chg = float(price_df["price"].iloc[-1] - price_df["price"].iloc[-7]) if len(price_df) > 7 else 0.0
  latest_temp = float(weather_df["temp"].iloc[-1])
  latest_rain = float(weather_df["rain"].iloc[-1])
  return {
    "price": {"latest": latest_price, "change7": round(price_chg, 2)},
    "weather": {"temp": latest_temp, "rain": latest_rain},
  }

@app.get("/")
async def root():
    # Minimal static HTML with charts fed from our endpoints
    html = """
    <!doctype html>
    <html>
    <head>
      <meta charset='utf-8'/>
      <meta name='viewport' content='width=device-width,initial-scale=1'/>
      <title>AgriMitra Dashboard</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 0; background: #0b1020; color: #e8eefb; }
        header { padding: 16px 20px; border-bottom: 1px solid #1e2a4a; background: #0f1530; }
        main { padding: 20px; display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
        .card { background: #101a3a; border: 1px solid #1e2a4a; border-radius: 12px; padding: 16px; }
        h2 { margin: 0 0 8px 0; font-size: 18px; }
        .small { color: #a5b4d4; font-size: 12px; }
        canvas { width: 100%; height: 260px; }
        footer { color: #a5b4d4; padding: 12px 20px; border-top: 1px solid #1e2a4a; background: #0f1530; }
        .legend { display:flex; gap:12px; align-items:center; font-size:12px; color:#a5b4d4 }
        .dot { width:10px; height:10px; border-radius:999px; display:inline-block }
      </style>
      <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    </head>
    <body>
      <header>
        <h1 style="margin:0;font-size:20px">AgriMitra – Live Farm Insights</h1>
      </header>
      <main>
        <section class="card">
          <h2>Mandi Price – History</h2>
          <div class="small">Last 60 days</div>
          <canvas id="priceHistory"></canvas>
        </section>
        <section class="card">
          <h2>Mandi Price – Forecast</h2>
          <div class="small">Next 7 days (naive drift)</div>
          <canvas id="priceForecast"></canvas>
        </section>
        <section class="card">
          <h2>Weather – Temp & Rain</h2>
          <div class="legend"><span class="dot" style="background:#60a5fa"></span>Temp <span class="dot" style="background:#34d399"></span>Rain</div>
          <canvas id="weather"></canvas>
        </section>
      </main>
      <footer>Powered by FastAPI + Chart.js</footer>

      <script>
      async function fetchJSON(url){ const r = await fetch(url); return r.json(); }

      function lineChart(ctx, labels, series, colors){
        return new Chart(ctx, {
          type: 'line',
          data: { labels, datasets: series.map((s, i) => ({
            label: s.label, data: s.data, borderColor: colors[i], backgroundColor: colors[i], tension: 0.3, fill: false
          }))},
          options: { scales: { x: { ticks: { color:'#a5b4d4' }}, y: { ticks: { color:'#a5b4d4' } } }, plugins:{ legend:{ labels:{ color:'#c7d2fe' } } } }
        });
      }

      (async () => {
        const ph = await fetchJSON('/price/history');
        const labelsH = ph.map(p => new Date(p.date).toLocaleDateString());
        const prices = ph.map(p => p.price);
        lineChart(document.getElementById('priceHistory'), labelsH, [{ label: 'Price', data: prices }], ['#c084fc']);

        const pf = await fetch('/price/forecast', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ days:7 })}).then(r=>r.json());
        const labelsF = pf.map(p => new Date(p.date).toLocaleDateString());
        const pricesF = pf.map(p => p.price);
        lineChart(document.getElementById('priceForecast'), labelsF, [{ label: 'Forecast', data: pricesF }], ['#f59e0b']);

        const wh = await fetchJSON('/weather/history');
        const labelsW = wh.map(w => new Date(w.date).toLocaleDateString());
        const temp = wh.map(w => w.temp);
        const rain = wh.map(w => w.rain);
        new Chart(document.getElementById('weather'), {
          type: 'bar',
          data: { labels: labelsW, datasets: [
            { type:'line', label:'Temp', data: temp, borderColor:'#60a5fa', backgroundColor:'#60a5fa', tension:0.3, yAxisID:'y' },
            { type:'bar', label:'Rain', data: rain, backgroundColor:'#34d399', yAxisID:'y1' }
          ]},
          options: {
            scales: {
              y: { position: 'left', ticks:{ color:'#a5b4d4' } },
              y1: { position: 'right', grid: { drawOnChartArea: false }, ticks:{ color:'#a5b4d4' } },
              x: { ticks: { color:'#a5b4d4' } }
            },
            plugins:{ legend:{ labels:{ color:'#c7d2fe' } } }
          }
        });
      })();
      </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html)
