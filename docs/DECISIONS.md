# Architecture Decision Records (ADRs)

## 1. Why the Backend is Not Hosted on Vercel
**Context**: Vercel allows hosting serverless Python functions alongside the frontend.
**Decision**: We decoupled the backend and host it on Render.
**Consequence**: Vercel Serverless Functions have a 10-second timeout on the free tier, and suffer from cold starts. Our backend requires LLM inference (which can take >10s) and a persistent Cron Job runner for nightly data ingestion. Render Web Services + Render Cron satisfies this requirement perfectly.

## 2. Precomputed Forecasts vs Live Inference
**Context**: Forecasting models (ARIMA, Prophet) require significant compute.
**Decision**: Forecasts are generated during the nightly Cron Job and saved to the database. The API only reads these precomputed values.
**Consequence**: API endpoints remain fast and non-blocking, ensuring a snappy user experience on the dashboard.

## 3. Seed Data Fallback Strategy
**Context**: External APIs (Agmarknet) can go down, and free-tier databases may pause.
**Decision**: We implement Graceful Degradation. Every API endpoint wraps its database query in a `try/except` block. On failure, it serves bundled JSON seed data.
**Consequence**: The demo is highly robust for interviews and presentations; the UI will never show a broken state or empty charts.

## 4. No Real OTP/SMS Auth
**Context**: Authentic farmer apps use mobile OTP logins.
**Decision**: We mocked the "Farmer Profile" selector in the demo instead of integrating Twilio/MSG91.
**Consequence**: Keeps the project strictly free-to-run and avoids complex telecom regulations, while still demonstrating the concept of personalized advisory.

## 5. Simulating WhatsApp via Web UI
**Context**: Farmers primarily use WhatsApp, not web apps.
**Decision**: We built a WhatsApp-styled chat widget inside the React app instead of deploying a real WhatsApp Business API bot.
**Consequence**: Avoids the lengthy Meta Business approval process and per-message costs, while still proving we understand the target distribution channel.
