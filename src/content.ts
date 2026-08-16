export const CONTENT = {
  hero: {
    title: "AGRIMITRA",
    subtitle: "Real Data. Real Prices. Real Decisions.",
    images: [
      "/assets/hero/farmland-aerial-1.webp",
      "/assets/hero/farmland-aerial-2.webp",
      "/assets/hero/farmland-aerial-3.webp",
    ]
  },
  stats: [
    { value: "85%", label: "Small & marginal farmers in India with under 2 hectares of land" },
    { value: "30-40%", label: "Typical price gap farmers lose to middlemen and info asymmetry" },
    { value: "<10%", label: "Smallholder farmers actively using digital agri-advisory tools" }
  ],
  harvest_cycle_images: [
    "/assets/floating/wheat.webp",
    "/assets/floating/tomato.webp",
    "/assets/floating/sack.webp",
    "/assets/floating/cloud.webp",
    "/assets/floating/rupee.webp"
  ],
  marquee_bands: {
    band1: [
      "/assets/marquee/farm1.webp",
      "/assets/marquee/farm2.webp",
      "/assets/marquee/farm3.webp",
      "/assets/marquee/farm4.webp",
    ],
    band2: [
      "/assets/floating/wheat.webp",
      "/assets/floating/tomato.webp",
      "/assets/floating/sack.webp",
      "/assets/floating/cloud.webp",
      "/assets/floating/rupee.webp"
    ]
  },
  how_it_works: [
    { title: "Real Mandi Data", desc: "Pulls from data.gov.in Agmarknet, 60-day history + 7-day forecast." },
    { title: "Weather-Aware", desc: "District-level rainfall and temperature trends." },
    { title: "Sell or Hold Advisory", desc: "Plain-language recommendation engine, not just raw numbers." }
  ],
  features: [
    "Multilingual chatbot (EN/HI/MR)",
    "Voice input",
    "WhatsApp-style interface",
    "Offline-tolerant 'as of' timestamps",
    "Nightly-refreshed real data",
    "Open system design docs"
  ],
  faq: [
    { q: "What data does AgriMitra use?", a: "We pull nightly data from Agmarknet (Mandi prices) and OpenWeatherMap." },
    { q: "Is this a real product or a demo?", a: "This is a portfolio demo project illustrating full-stack system design." },
    { q: "How does the price forecast work?", a: "Currently uses a naive moving average + drift for demo purposes." },
    { q: "What languages are supported?", a: "English, Hindi, and Marathi via react-i18next." },
    { q: "Is farmer data collected or sold?", a: "No. The demo does not collect real user PII." },
    { q: "How is this deployed?", a: "Frontend on Vercel, Backend and Cron on Render, Database on Supabase." }
  ]
};
