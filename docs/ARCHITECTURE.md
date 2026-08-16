# Architecture

AgriMitra follows a decoupled, serverless-friendly architecture designed to optimize for cost, performance, and clear separation of concerns.

## System Diagram

```mermaid
graph TD
    subgraph Frontend [Frontend (Vercel)]
        UI[React UI]
        i18n[i18next]
        Chat[Chatbot UI]
    end

    subgraph Backend [Backend (Render Web Service)]
        API[FastAPI]
        Auth[Mock Auth]
        Advisory[Advisory Engine]
        API --> UI
    end

    subgraph Database [Database (Supabase)]
        PG[(PostgreSQL)]
        API --> PG
    end

    subgraph Cron [Render Cron Job]
        Job[refresh_data.py]
        Job --> PG
    end

    subgraph External APIs
        Agmarknet[data.gov.in Agmarknet]
        Weather[OpenWeatherMap]
        LLM[OpenAI / Claude]
        Job -.-> Agmarknet
        Job -.-> Weather
        API -.-> LLM
    end
```

## Components

### 1. Frontend (Vercel)
The React + Vite application is hosted statically on Vercel Edge Network. Vercel provides best-in-class caching and zero-cost hosting for static assets. It communicates entirely via REST APIs.

### 2. Backend API (Render)
The FastAPI backend runs as a persistent Web Service on Render. It provides typed (Pydantic) API contracts. We chose Render over Vercel Serverless Functions to avoid cold starts and 10-second timeout limits, which are problematic for LLM calls and complex data processing.

### 3. Nightly Cron Job (Render Cron)
External data (prices and weather) is fetched via a nightly script (`cron/refresh_data.py`) running on Render Cron, which writes to the Supabase database. This guarantees that user API requests never block waiting for slow 3rd-party APIs.

### 4. Database (Supabase)
Supabase provides a free-tier managed PostgreSQL database. All API read operations query this DB directly, ensuring fast `<50ms` response times.

### 5. Fallback Mechanism (Graceful Degradation)
If the database or external APIs are unavailable, the backend automatically falls back to serving bundled `seed_data`, ensuring the demo is never completely broken during an interview presentation.
