# AgriMitra Demo Script (2 Minutes)

**Goal**: Walk a technical interviewer through the product, highlighting system design choices and failure-mode handling.

---

**[Start on the Landing Page]**
"Hi, this is AgriMitra, a full-stack decision-support system for farmers. The landing page here is built with React, Lenis for smooth scrolling, and Framer Motion. As we scroll, you can see the 'Harvest Cycle' parallax effect, illustrating how we aggregate market, weather, and advisory data into a single ecosystem."

**[Click 'View Live Demo' -> Navigate to Dashboard]**
"Let's jump into the core dashboard. Notice the 'As of [Timestamp]' badge in the corner. This is crucial for offline-first design — farmers often have spotty internet, so we make it explicit exactly how fresh their data is.

This data is pulled from the government's Agmarknet API, but we *never* query it live in the request path."

**[Show Architecture Diagram (Mental or actual split screen)]**
"Instead, a nightly cron job on Render fetches the data, computes a 7-day moving average and forecast, and stores it in Postgres. The FastAPI backend here is only doing fast DB reads.

I also built in Graceful Degradation: if the database or external APIs go down, the API catches the exception and serves bundled JSON seed data. The UI never breaks during a demo or in the field."

**[Click on the Chat Widget]**
"Finally, the most important part is distribution. Farmers don't download new apps; they use WhatsApp. This chat widget simulates a WhatsApp bot experience. 

It supports English, Hindi, and Marathi via NLP intent parsing. I can ask 'Should I sell my tomato?' and the advisory engine analyzes the 7-day moving average against the current price to return a plain-language recommendation, not just a raw chart."

**[Wrap up]**
"The entire stack is designed to be free-tier deployable: Vercel for the Edge frontend, Render for the async Python backend, and Supabase for Postgres."
