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
| **Memory & Context** | Short-term conversation memory + long-term vector store (ChromaDB architecture) |

---

## 🏗️ System Architecture

```
                    ┌──────────────────────────────┐
                    │     Farmer Query / Input      │
                    │  "Flood warning, Kendrapara,  │
                    │         50 acres paddy"       │
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
              │ Markets   │ │Loss    │ │Action │ │Mapping │
              │ News      │ │Risk    │ │Plans  │ │Gov     │
              │ Alerts    │ │Income  │ │Schemes│ │Briefs  │
              └─────┬─────┘ └───┬────┘ └──┬────┘ └──┬─────┘
                    │           │         │         │
                    └───────────┴─────────┴─────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │   CRISIS MODE TOGGLE          │
                    │   Real-time re-planning       │
                    │   Inject: Flood → Cyclone,    │
                    │   API Failure, Bias Flag      │
                    └──────────────┬───────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              │                                         │
    ┌─────────▼─────────┐              ┌───────────────▼──────────┐
    │ Farmer Advisory    │              │ Policy Brief (auto-gen)  │
    │ Harvest early,     │              │ SDG 1.5, SDG 2.4,       │
    │ file PMFBY claim,  │              │ SDG 13.1 aligned,       │
    │ call 1800-XXX      │              │ Takshashila governance   │
    └────────────────────┘              └──────────────────────────┘
```

### The Five Agents

| Agent | Role | Data Sources | Output |
|-------|------|--------------|--------|
| **🛰️ Sentinel** | Real-time environmental monitoring | OpenWeatherMap API, Serper.dev News, eNAM market data | Weather alerts, market prices, agricultural news events |
| **📊 Analyst** | Quantitative risk assessment | Statistical crop-loss models, historical yield data | Risk scores (1-10), crop-loss probability, income projections |
| **🧑‍🌾 Advisor** | Personalized farmer guidance | Government scheme databases (PMFBY, PM-KISAN, eNAM, KCC) | Step-by-step action plans, scheme recommendations, helpline numbers |
| **📜 Policy** | Governance & SDG alignment | Takshashila Institution governance framework | SDG-mapped policy briefs, stakeholder reports, governance outcomes |
| **🧠 Orchestrator** | Hierarchical coordination | All agent outputs | Consolidated insights, retry logic, crisis re-planning |

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

### Key Policy Recommendations
1. Phased district-level pilot rollouts with competitive vendor participation
2. Federated data architecture — farmer profiles remain at state level
3. Voluntary compliance frameworks with transparent AI auditing
4. Integration with Kisan Suvidha app infrastructure
5. Quarterly SDG-aligned impact assessment with public reporting

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** + TypeScript | Component architecture |
| **Vite** | Build tool & dev server |
| **TailwindCSS** | Utility-first styling |
| **Radix UI** | Accessible component primitives |
| **Framer Motion** | Scroll-triggered animations |
| **react-i18next** | Trilingual support (EN, हिंदी, ଓଡ଼ିଆ) |
| **TanStack React Query** | Server state management |
| **Recharts** | Data visualization |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** + Express | API server |
| **TypeScript** | Type-safe agent logic |
| **5-Agent Architecture** | Hierarchical multi-agent system |
| **OpenWeatherMap API** | Live weather data for Sentinel |
| **Serper.dev API** | Google News search for alerts |
| **In-memory auth** | JWT-based demo authentication |

### Deployment
| Platform | Service |
|----------|---------|
| **Vercel** | Frontend hosting ([kisanbodhi.vercel.app](https://kisanbodhi.vercel.app)) |
| **Railway** | Backend API ([kisanbodhi-backend-production.up.railway.app](https://kisanbodhi-backend-production.up.railway.app)) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

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
WEATHER_API_KEY=your_openweathermap_key    # Free: openweathermap.org/api
NEWS_API_KEY=your_serper_api_key           # Free: serper.dev
```

**Frontend** (`.env.production`):
```env
VITE_API_URL=https://kisanbodhi-backend-production.up.railway.app
```

### 3. Run Locally
```bash
# Terminal 1: Backend (port 3001)
cd backend && npm run dev

# Terminal 2: Frontend (port 5173)
npm run dev
```

### 4. Demo Credentials
```
Email: farmer@example.com
Password: password
```

---

## 📱 Features

### 👨‍🌾 Farmer View (Voice-First)
- **Voice Input** — Tap-to-speak interface in local languages
- **Real-time Alerts** — Weather warnings, flood/cyclone alerts from live APIs
- **Action Plans** — Step-by-step guidance for crisis response
- **Scheme Matching** — Automatically matched government schemes (PMFBY, PM-KISAN, eNAM, KCC)
- **Multilingual** — Full interface in English, Hindi (हिंदी), and Odia (ଓଡ଼ିଆ)

### 🛠️ Developer View
- **Agent Terminal** — Real-time multi-agent orchestration logs with color-coded output
- **Crisis Simulator** — Inject crisis scenarios (cyclone, API failure, bias flag) and watch agents re-plan
- **Dashboard Query** — Send natural language queries and get structured 4-agent output

### 🚨 Crisis Mode
- **Live Re-planning** — Agents automatically adapt to new crisis inputs
- **Scenario Injection** — Toggle between Standard, Memory Mode (offline), and Extreme Threat
- **Resilient Architecture** — Graceful fallback to mock data when APIs are unavailable

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | System health check (5 agents status) |
| `POST` | `/api/auth/login` | Authenticate user (returns JWT) |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/agent/query` | **Main** — Natural language query → 4-agent response |
| `POST` | `/api/analysis` | District-level multi-agent analysis |
| `POST` | `/api/advisory` | Personalized farmer advisory |
| `POST` | `/api/crisis` | Emergency crisis response |
| `GET` | `/api/agents` | All agents status |
| `GET` | `/api/tasks` | Active orchestration tasks |
| `GET` | `/api/task/:id` | Task status & result |
| `POST` | `/api/demo` | Generate demo analysis data |

### Example: Agent Query
```bash
curl -X POST https://kisanbodhi-backend-production.up.railway.app/api/agent/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Flood warning in Kendrapara, 50 acres paddy", "context": {"district": "Kendrapara"}}'
```

**Response:**
```json
{
  "status": "success",
  "agents_output": {
    "sentinel": { "weather_alert": "Temperature 28.5°C, Humidity 85%", "hazard_signal": "high" },
    "analyst": { "risk_score": 7, "crop_loss_probability": 0.65 },
    "advisor": { "recommendations": ["Harvest early", "File PMFBY claim", "Move livestock"] },
    "policy": { "sdg_alignment": ["SDG 1: No Poverty", "SDG 13: Climate Action"], "applicable_schemes": ["PMFBY", "KCC"] }
  }
}
```

---

## 📂 Project Structure

```
KISANBODHI/
├── src/                          # Frontend (React + TypeScript)
│   ├── pages/
│   │   ├── Landing.tsx           # Premium 6-section landing page
│   │   ├── Login.tsx             # Authentication with demo credentials
│   │   ├── Register.tsx          # Farmer registration (Odisha districts)
│   │   ├── Dashboard.tsx         # Agent query interface with 4-panel output
│   │   ├── FarmerView.tsx        # Voice-first farmer dashboard
│   │   └── DeveloperView.tsx     # Agent terminal + crisis simulator
│   ├── components/
│   │   ├── FarmerDashboard.tsx   # Weather, alerts, schemes, actions
│   │   ├── AgentSidebar.tsx      # Real-time agent terminal logs
│   │   ├── ChatWidget.tsx        # AI Sahayak conversational widget
│   │   └── Navbar.tsx            # Navigation with language switcher
│   ├── contexts/AuthContext.tsx  # JWT auth with mock fallback
│   ├── services/api.client.ts   # Backend API client
│   ├── hooks/useApi.ts          # React Query hooks
│   ├── i18n/locales/            # en.json, hi.json, or.json
│   └── types/index.ts           # TypeScript interfaces
│
├── backend/
│   └── src/
│       ├── agents/
│       │   ├── orchestrator.agent.ts  # Hierarchical agent coordinator
│       │   ├── sentinel.agent.ts      # Weather + market + news monitoring
│       │   ├── analyst.agent.ts       # Crop-loss + income risk modeling
│       │   ├── advisor.agent.ts       # Farmer guidance + scheme matching
│       │   └── policy.agent.ts        # Takshashila governance + SDG mapping
│       ├── services/
│       │   ├── weather.service.ts     # OpenWeatherMap integration
│       │   ├── market.service.ts      # eNAM market data
│       │   ├── news.service.ts        # Serper.dev news search
│       │   └── scheme.service.ts      # Government scheme database
│       ├── api/routes.ts              # Express API routes (auth + agents)
│       └── types/index.ts             # Shared TypeScript types
│
├── .env.production                    # Frontend env (Vercel → Railway)
├── index.html                         # SEO-optimized entry point
├── package.json
└── README.md
```

---

## 🧪 Testing & Verification

### Backend API Tests (All Passing ✅)
```bash
# Health check
curl https://kisanbodhi-backend-production.up.railway.app/api/health

# Login
curl -X POST .../api/auth/login -d '{"email":"farmer@example.com","password":"password"}'

# Agent query (runs all 5 agents)
curl -X POST .../api/agent/query -d '{"query":"paddy risk Kendrapara"}'

# Crisis response
curl -X POST .../api/crisis -d '{"district":"Kendrapara","state":"Odisha","crops":["paddy"],"crisisType":"cyclone"}'
```

### Edge Cases Handled
- ✅ Backend unreachable → Frontend falls back to mock auth
- ✅ Weather API key missing → Mock weather data with realistic variation
- ✅ News API returns empty → Falls back to curated mock news
- ✅ Agent pipeline fails → Error response with fallback recommendations
- ✅ Invalid login credentials → Clear error message
- ✅ Duplicate registration → 409 Conflict response
- ✅ Empty query submission → Validation error

---

## 📝 Abstract (200 words)

> KISANBODHI (Kisan-Bodhi: Farmer's Intelligence) is an autonomous multi-agent AI system designed to protect India's smallholder farmers from climate-driven agricultural crises. Operating through the Takshashila Institution governance framework with its Samaaj-Sarkaar-Bazaar regulatory lens, the system deploys five specialised agents — Sentinel, Analyst, Advisor, Orchestrator, and Policy — coordinated through a hierarchical framework. The Sentinel agent continuously monitors live weather feeds via OpenWeatherMap and agricultural news via Serper.dev. The Analyst agent performs crop-loss probability modelling and income-risk scoring at the district level. The Advisor agent generates actionable farmer-facing guidance matched to applicable government schemes such as PMFBY, eNAM, PM-KISAN, and Kisan Credit Card. The Policy agent auto-maps outcomes to UN SDG targets and produces governance-ready briefs aligned with Takshashila's light-touch regulation and strategic autonomy principles. The system supports three languages (English, Hindi, Odia), dynamic re-planning via crisis mode injection, and graceful degradation when external APIs are unavailable. KISANBODHI advances SDG 1, 2, 8, 11, and 13, with direct applicability across India's 100 million smallholder farming households. Deployed on Vercel (frontend) and Railway (backend).

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
- **Festival:** Chakravyuh Genesis 2026
- **Date:** 4th April 2026
- **Venue:** ITER SOA, Bhubaneswar
- **Portfolio:** Takshashila Institution

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ by Team IQ Zero**

*Protecting India's farmers, one advisory at a time.*

🌾 किसानबोधि 🌾

</div>
