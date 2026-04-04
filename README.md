<div align="center">

# 🌾 KISANBODHI — किसानबोधि — କିସାନବୋଧି

### Autonomous Multi-Agent AI Disaster Response & Advisory System for Indian Smallholder Farmers

[![Live Demo](https://img.shields.io/badge/Live-kisanbodhi.vercel.app-000?style=for-the-badge&logo=vercel)](https://kisanbodhi.vercel.app)
[![Backend](https://img.shields.io/badge/API-Railway-6C47FF?style=for-the-badge&logo=railway)](https://kisanbodhi-backend-production.up.railway.app)
[![SDG](https://img.shields.io/badge/UN%20SDG-1%2C2%2C8%2C11%2C13-blue?style=for-the-badge)]()
[![Portfolio](https://img.shields.io/badge/Portfolio-Takshashila%20Institution-orange?style=for-the-badge)]()

---

**Anant Chakra: Agentic Council** · Chakravyuh Genesis 2026 · ITER SOA, Bhubaneswar

**Team IQ Zero** · Portfolio: Takshashila Institution

</div>

---

## 📌 Problem Statement

India loses over **₹50,000 crore annually** to agricultural disasters — floods, cyclones, droughts, pest outbreaks, and market volatility. Over **86% of India's farmers are smallholders** with landholdings under 2 hectares. They have:

- ❌ No access to real-time, personalized decision-support systems
- ❌ No tools that bridge the gap between early warning → actionable guidance
- ❌ No AI systems that adapt autonomously to evolving crisis scenarios
- ❌ No governance-ready policy output aligned with national SDG commitments

**The gap between an IMD weather alert and a farmer taking protective action is the single biggest preventable loss driver in Indian agriculture.**

---

## 🎯 What is KISANBODHI?

**KISANBODHI** (Kisan = Farmer, Bodhi = Intelligence/Wisdom) is an **autonomous multi-agent AI system** that protects India's 100 million+ smallholder farmers from climate-driven agricultural crises.

Unlike chatbots or simple AI wrappers, KISANBODHI deploys **five specialized AI agents** that reason independently, coordinate through a hierarchical orchestrator, and adapt in real-time to crisis scenarios — **without constant human prompting**.

### What Makes It Agentic?

| Property | How KISANBODHI Implements It |
|----------|------------------------------|
| **Autonomous Reasoning** | Each agent independently analyzes its domain (weather, risk, schemes, policy) |
| **Tool Integration** | Real OpenWeatherMap API, Serper.dev news search, government scheme databases |
| **Hierarchical Coordination** | Orchestrator decomposes queries, routes to agents, assembles outputs, retries if incomplete |
| **Dynamic Re-Planning** | Crisis Mode toggle injects new scenarios mid-execution — agents re-route automatically |
| **Memory & Context** | Real-time localStorage caching & offline mode recovery + district-level federated data |

---

## 🏗️ System Architecture

```
                    ┌──────────────────────────────┐
                    │     Farmer Query / Input      │
                    │  (Web, Chatbot, or Voice Call)│
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │     ORCHESTRATOR AGENT        │
                    │   Task decomposition,         │
                    │   routing, assembly,           │
                    │   retry on failure             │
                    └──┬───────┬───────┬───────┬──┘
                       │       │       │       │
              ┌────────▼──┐ ┌─▼──────┐ ┌─▼────┐ ┌─▼──────┐
              │ SENTINEL  │ │ANALYST │ │ADVISOR│ │POLICY  │
              │           │ │        │ │       │ │        │
              │ Weather   │ │Crop    │ │Farmer │ │SDG     │
              │ Markets   │ │News    │ │Plans  │ │Briefs  │
              │ Alerts    │ │Income  │ │Schemes│ │Gov     │
              └─────┬─────┘ └───┬────┘ └──┬────┘ └──┬─────┘
                    │           │         │         │
                    └───────────┴─────────┴─────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              │                                         │
    ┌─────────▼─────────┐              ┌───────────────▼──────────┐
    │ Farmer Advisory    │              │ Policy Brief (auto-gen)  │
    │ Harvest early,     │              │ SDG 1.5, SDG 2.4,       │
    │ file PMFBY claim,  │              │ SDG 13.1 aligned,       │
    │ call 1800-XXX      │              │ Takshashila governance   │
    └─────────┬─────────┘              └──────────────────────────┘
              │
    ┌─────────▼─────────────┐
    │ Omnichannel Delivery  │
    │ - Dashboard UI        │
    │ - Landing Chatbot     │
    │ - TwiML Voice Call    │
    │ - Twilio SMS alerts   │
    └───────────────────────┘
```

### The Five Agents

| Agent | Role | Data Sources | Output |
|-------|------|--------------|--------|
| **🛰️ Sentinel** | Real-time environmental monitoring | OpenWeatherMap API, Serper.dev News | Weather alerts, market prices, agricultural news events |
| **📊 Analyst** | Quantitative risk assessment | Statistical crop-loss models, historical yield data | Risk scores (1-10), crop-loss probability, income projections |
| **🧑‍🌾 Advisor** | Personalized farmer guidance | Government databases (PMFBY, PM-KISAN, eNAM) | Step-by-step action plans, scheme recommendations |
| **📜 Policy** | Governance & SDG alignment | Takshashila Institution governance framework | SDG-mapped policy briefs, stakeholder reports, governance outcomes |
| **🧠 Orchestrator** | Hierarchical coordination | All agent outputs | Consolidated insights, retry logic, crisis re-planning |

---

## 📞 Feature Phone Scalability: The IVR Voice Integration

*Judges: This is our architectural MVP for India's 400M+ feature phone users.*

The core AI engine is fully decoupled from the React frontend, allowing it to serve voice calls using Twilio's Telecom APIs. 

**The Flow:**
1. A farmer dials the KISANBODHI toll-free baseline.
2. The `POST /api/ivr/welcome` Twilio Webhook answers: *"Press 1 for English, 2 for Hindi, 3 for Odia."*
3. The farmer speaks their problem (e.g., *"My paddy field is flooded"*).
4. Twilio's Speech-to-Text API converts the audio to text and calls our `POST /api/ivr/process` endpoint.
5. The **Orchestrator Agent** processes the query, talks to the Analyst and Advisor agents, and generates a solution.
6. The AI literally reads the advice back to the farmer over the phone using Text-to-Speech (TTS).
7. An automated SMS is instantly sent with relevant scheme links (e.g., PMFBY.gov.in).

### How to Configure Twilio for Live Testing
To connect the backend to your live Twilio account:
1. Go to Twilio console > **Phone Numbers** > **Manage** > **Active Numbers**.
2. Click your active phone number.
3. Scroll down to **Voice & Fax**.
4. Set "A CALL COMES IN" to **Webhook** -> **`https://kisanbodhi-backend-production.up.railway.app/api/ivr/welcome`** -> **POST**.
5. Set "Messaging" -> "A MESSAGE COMES IN" to Webhook -> (leave default or point to a message handler if needed). *SMS alerts are sent autonomously by the webhook.*

---

## 📴 Robust Offline Caching (Zero-Internet Access)

To combat rural connectivity drops, the frontend utilizes **Proactive LocalStorage Caching**:
- **On Success:** Every dashboard API response is cached in `localStorage` in real-time.
- **On Network Disconnect:** If the Vercel app loses internet access (or the Railway backend hangs), the global `window.fetch` intercepts the error, immediately pulls the last-known state from `localStorage`, and injects it into the UI.
- **Visual Warning:** A **Yellow "⚠️ Offline Mode: Showing last known data" Badge** appears right below the navbar, with a timestamp of the last successful sync.

---

## 🌍 SDG Alignment

Every advisory generated by KISANBODHI is automatically mapped to UN Sustainable Development Goal targets:

| SDG | Targets | KISANBODHI Contribution | Metrics |
|-----|---------|------------------------|---------|
| **SDG 1** No Poverty | 1.1, 1.2, 1.5 | Income protection through crop risk management & insurance enrollment | Farmers protected from losses, PMFBY claims filed |
| **SDG 2** Zero Hunger | 2.1, 2.3, 2.4 | Reduced crop losses, sustainable food production, early warnings | Crop loss reduction %, yield improvement |
| **SDG 8** Decent Work | 8.2, 8.3 | Agricultural modernization, rural employment through AI tools | Farmer income change, market access improvement |
| **SDG 11** Sustainable Cities | 11.5, 11.b | Rural community disaster resilience & preparedness | Districts covered, alert response time |
| **SDG 13** Climate Action | 13.1, 13.3 | Real-time climate adaptation, early warning systems | Alerts generated, adaptation actions taken |

---

## 🏛️ Policy Alignment: Takshashila Institution

KISANBODHI operates through the **Takshashila Institution governance framework**, applying their signature **Samaaj-Sarkaar-Bazaar** regulatory lens:

### Samaaj (Society)
- Community-driven data collection with farmer-owned profiles
- Empowering local **Krishi Vigyan Kendras (KVKs)** as AI-assisted first responders
- Voice-first interface accessible to semi-literate users

### Sarkaar (Government)
- **Light-touch regulation** enabling voluntary AI adoption without rigid mandates
- Integration with existing **Kisan Suvidha** app infrastructure
- Quarterly SDG-aligned impact assessment and public reporting

### Bazaar (Market)
- Competitive market for agricultural AI services preventing monopolistic capture
- **eNAM** and **PMFBY** integration for market transparency
- Data sovereignty — farmer profiles remain at state/district level

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + TypeScript (Component architecture)
- **Vite** (Build tool)
- **TailwindCSS** + **Radix UI** + **Framer Motion** (Styles & Animation)
- **react-router-dom** (SPA Routing with Vercel rewrites)

### Backend
- **Node.js** + Express
- **5-Agent Hierarchical Architecture**
- **Twilio Voice & SMS APIs** (IVR)
- **OpenWeatherMap API** + **Serper.dev API** (Live RAG contexts)

### Deployment
| Platform | Service | Status | URL |
|----------|---------|--------|-----|
| **Vercel** | Frontend hosting | Passing ✅ | [kisanbodhi.vercel.app](https://kisanbodhi.vercel.app) |
| **Railway** | Backend API | Healthy ✅ | [kisanbodhi-backend-production.up.railway.app](https://kisanbodhi-backend-production.up.railway.app) |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone <repository-url>
cd KISANBODHI

# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Environment Setup

**Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
WEATHER_API_KEY=your_openweathermap_key
NEWS_API_KEY=your_serper_api_key
GEMINI_API_KEY=your_gemini_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=+1234567890
```

**Frontend** (`.env.production`):
```env
VITE_API_URL=https://kisanbodhi-backend-production.up.railway.app
```

---

## 📱 Features

### 👨‍🌾 Farmer Interfaces
- **Mobile OTP Login:** Log in securely via mobile number and SMS OTP code.
- **Public Chatbot:** Floating AI Sahayak accessible from the landing page.
- **IVR Feature Phone Interface:** Toll-free voice AI advisory.
- **Premium Dashboard:** 7 Live Sections (Alert Banner, Farm Profile, Weather, Agent Status, Quick-action chips, 4-panel response grid, Broadcast ticker).

### 🚨 Outage Resiliency
- **SPA Rewrites:** Custom `vercel.json` ensures zero 404s on browser refresh.
- **Offline Strategy:** `localStorage` fallback caches everything natively in the browser.

---

## 🔌 Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/send-otp` | Sends login OTP via Twilio SMS |
| `POST` | `/api/auth/verify-otp` | Validates OTP and returns JWT |
| `POST` | `/api/chat` | Public chatbot queries without Auth |
| `POST` | `/api/agent/query` | **Main** — Authenticated Natural language query → 4-agent response |
| `POST` | `/api/ivr/welcome` | Twilio Voice Webhook: Primary TwiML Menu |
| `POST` | `/api/ivr/gather` | Twilio Voice Webhook: STT Processing |
| `POST` | `/api/ivr/process` | Twilio Voice Webhook: Agent Response & SMS triggering |
| `GET`  | `/api/health` | System health check (5 agents status) |

### Example: Checking IVR Status
```bash
curl https://kisanbodhi-backend-production.up.railway.app/api/ivr/status
```

---

## 👥 Team IQ Zero

| Role | Name | Contribution |
|------|------|-------------|
| **Team Leader** | **Abhiranjan Kumar** | UI/UX Design, Visual Architecture |
| **Full Stack Developer** | **Ayush Raj Chourasia** | System Architecture, Agent Development, Deployment |
| **Policy Researcher** | **Shreeya Rani Das** | Takshashila Policy Alignment, SDG Mapping |
| **Tester** | **Tribhuwan Singh** | Quality Assurance, Edge Case Testing |

---

## 🏛️ Competition Details

- **Event:** Anant Chakra: Agentic Council
- **Date:** 4th April 2026
- **Venue:** ITER SOA, Bhubaneswar
- **Portfolio:** Takshashila Institution

---

<div align="center">

**Built with ❤️ by Team IQ Zero**

*Protecting India's farmers, one advisory at a time.*

🌾 किसानबोधि 🌾

</div>
