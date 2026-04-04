# 🌾 KISANBODHI — किसानबोधि

> **Kisan-Bodhi: Farmer's Intelligence** — An autonomous multi-agent AI system protecting India's 100M+ smallholder farmers from climate-driven agricultural crises.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![SDG Aligned](https://img.shields.io/badge/UN%20SDG-1%2C2%2C8%2C13-blue)]()
[![Portfolio](https://img.shields.io/badge/Portfolio-Takshashila%20Institution-orange)]()
[![Team](https://img.shields.io/badge/Team-IQ%20Zero-purple)]()

---

## 🎯 What is KISANBODHI?

KISANBODHI is a **multi-agent AI disaster-response and advisory system** built for Indian smallholder farmers. It autonomously monitors weather, analyzes crop risks, recommends government schemes, and generates governance-ready policy briefs — all in **English, Hindi (हिन्दी), and Odia (ଓଡ଼ିଆ)**.

Unlike chatbots or simple wrappers, KISANBODHI uses **five specialized AI agents** that reason, coordinate, and adapt to real-time crisis scenarios without constant human input.

### 🏛️ Policy Alignment: Takshashila Institution

KISANBODHI operates through the **Takshashila Institution governance framework**, incorporating:
- **Samaaj-Sarkaar-Bazaar** balanced regulatory lens (Society-Government-Market)
- **Light-touch regulation** favoring voluntary compliance and innovation
- **Strategic autonomy** with focus on indigenous AI capabilities
- **Data sovereignty** with farmer data remaining at state/district level
- **Competitive market** participation at every AI value-chain stage

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR AGENT                         │
│          Hierarchical coordination & dynamic re-planning     │
├──────────┬──────────┬──────────────┬────────────────────────┤
│          │          │              │                          │
▼          ▼          ▼              ▼                          │
┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐               │
│SENTINEL│ │ANALYST │ │ ADVISOR  │ │ POLICY   │               │
│ Agent  │ │ Agent  │ │  Agent   │ │  Agent   │               │
├────────┤ ├────────┤ ├──────────┤ ├──────────┤               │
│Weather │ │Crop    │ │Farmer    │ │SDG       │               │
│Markets │ │Loss    │ │Action    │ │Mapping   │               │
│News    │ │Income  │ │Plans     │ │Governance│               │
│Alerts  │ │Risk    │ │Schemes   │ │Briefs    │               │
└────────┘ └────────┘ └──────────┘ └──────────┘               │
     │          │          │              │                     │
     └──────────┴──────────┴──────────────┘                    │
                        │                                      │
              ┌─────────▼──────────┐                           │
              │ CRISIS MODE TOGGLE │ ← Real-time re-planning  │
              └────────────────────┘                           │
└──────────────────────────────────────────────────────────────┘
```

### The Five Agents

| Agent | Role | Tools Used |
|-------|------|-----------|
| **🛰️ Sentinel** | Real-time weather, market price, & news monitoring | OpenWeatherMap, eNAM, News APIs |
| **📊 Analyst** | Crop-loss probability modeling & income-risk scoring | Statistical models, historical data |
| **🧑‍🌾 Advisor** | Personalized farmer guidance with scheme recommendations | PMFBY, PM-KISAN, eNAM matching |
| **📜 Policy** | SDG mapping & governance-ready briefs | Takshashila governance framework |
| **🧠 Orchestrator** | Hierarchical coordination & crisis re-planning | Task decomposition, agent routing |

---

## 🌍 SDG Alignment

| SDG | Target | KISANBODHI Contribution |
|-----|--------|------------------------|
| **SDG 1** | No Poverty (1.1, 1.2) | Income protection through crop risk management |
| **SDG 2** | Zero Hunger (2.1, 2.3, 2.4) | Reduced crop losses, sustainable food production |
| **SDG 8** | Decent Work (8.2, 8.3) | Agricultural modernization, rural employment |
| **SDG 13** | Climate Action (13.1, 13.3) | Climate resilience, early warning systems |
| **SDG 17** | Partnerships (17.17) | Multi-stakeholder AI coordination |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript + Vite
- **UI:** TailwindCSS + Radix UI + Framer Motion
- **State:** TanStack React Query
- **i18n:** react-i18next (English, Hindi, Odia)
- **Charts:** Recharts

### Backend
- **Runtime:** Node.js + Express + TypeScript
- **Architecture:** 5-Agent Hierarchical System
- **APIs:** OpenWeatherMap, eNAM Market Data, News aggregation
- **Data:** Government scheme matching (PMFBY, PM-KISAN, eNAM)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or bun

### 1. Install & Run Frontend
```bash
cd KISANBODHI
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

### 2. Install & Run Backend
```bash
cd backend
npm install
npm run dev
# Backend API runs at http://localhost:3001
```

### 3. Environment Setup
Copy the example env and configure API keys (optional — mock data works without keys):
```bash
cp backend/.env.example backend/.env
```

### Demo Credentials
```
Email: farmer@example.com
Password: password
```

---

## 📱 Features

### 👨‍🌾 Farmer View (Voice-First)
- **Voice Input** — Tap-to-speak interface in local languages
- **Real-time Alerts** — Weather warnings, flood/cyclone alerts
- **Action Plans** — Step-by-step guidance for crisis response
- **Scheme Matching** — Automatically matched government schemes
- **Multilingual** — Full interface in English, Hindi, and Odia

### 🛠️ Developer View
- **Agent Terminal** — Real-time multi-agent orchestration logs
- **Crisis Simulator** — Inject crisis scenarios and watch agents re-plan
- **Dashboard** — Query agents directly, view structured outputs

### 🚨 Crisis Mode
- **Live Re-planning** — Agents automatically adapt to new crisis inputs
- **Scenario Injection** — Toggle crisis mode to stress-test the system
- **Resilient Architecture** — Mock data fallback when APIs are unavailable

---

## 📂 Project Structure

```
KISANBODHI/
├── src/                      # Frontend (React + TypeScript)
│   ├── pages/                # Landing, Login, Register, Dashboard
│   ├── components/           # FarmerDashboard, Navbar, ChatWidget
│   ├── contexts/             # AuthContext
│   ├── hooks/                # useApi (React Query hooks)
│   ├── services/             # API client
│   ├── i18n/locales/         # en.json, hi.json, or.json
│   └── types/                # TypeScript interfaces
├── backend/                  
│   └── src/
│       ├── agents/           # 5 specialized agents
│       │   ├── orchestrator.agent.ts
│       │   ├── sentinel.agent.ts
│       │   ├── analyst.agent.ts
│       │   ├── advisor.agent.ts
│       │   └── policy.agent.ts
│       ├── services/         # Weather, Market, News, Scheme services
│       ├── api/              # Express routes
│       └── types/            # Shared types
├── index.html
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analysis` | District-level multi-agent analysis |
| `POST` | `/api/advisory` | Personalized farmer advisory |
| `POST` | `/api/crisis` | Emergency crisis response |
| `GET` | `/api/agents` | All agents status |
| `GET` | `/api/health` | System health check |
| `GET` | `/api/tasks` | Active tasks |
| `GET` | `/api/task/:id` | Task status & result |
| `POST` | `/api/demo` | Generate demo data |

---

## 📝 Abstract (199 words)

> KISANBODHI (Kisan-Bodhi: Farmer's Intelligence) is an autonomous multi-agent AI system designed to protect India's smallholder farmers from climate-driven agricultural crises. Operating through the Takshashila Institution governance framework with its Samaaj-Sarkaar-Bazaar regulatory lens, the system deploys five specialised agents — Sentinel, Analyst, Advisor, Orchestrator, and Policy — coordinated through a hierarchical framework. The Sentinel agent continuously monitors live weather feeds, market price streams, and news events. The Analyst agent performs crop-loss probability modelling and income-risk scoring at the district level. The Advisor agent generates actionable farmer-facing guidance matched to applicable government schemes such as PMFBY, eNAM, and PM-KISAN. The Policy agent auto-maps outcomes to UN SDG targets and produces governance-ready briefs aligned with Takshashila's light-touch regulation and strategic autonomy principles. KISANBODHI supports dynamic re-planning in response to new crisis inputs, making it robust to unexpected scenarios. The system advances SDG 1 (No Poverty), SDG 2 (Zero Hunger), SDG 8 (Decent Work), and SDG 13 (Climate Action), with direct applicability across India's 100 million smallholder farming households.

---

## 📋 Policy Brief (Takshashila Institution Perspective)

**Problem in Context:** India loses ₹50,000 crore annually to agricultural disasters. Over 86% of farmers are smallholders with no access to real-time decision support. Existing government alert systems are unidirectional, not advisory. The gap between early warning and farmer action is the single biggest preventable loss driver.

**Key Deployment Risks:** 
- Algorithmic bias in crop-loss modelling if training data skews toward better-documented districts
- Over-reliance on AI recommendations by semi-literate users without fallback human oversight
- Data sovereignty risks when farmer profiles are stored in centralised cloud systems

**Stakeholder Analysis:** 
- **Primary** — Smallholder farmers, district agricultural officers
- **Secondary** — State governments, crop insurance companies, commodity exchanges
- **Tertiary** — International food security bodies (FAO, WFP)

**Takshashila Institution's Stance:**
Applying the Samaaj-Sarkaar-Bazaar framework, Takshashila recommends:
- **Samaaj (Society):** Community-driven data collection with farmer-owned profiles
- **Sarkaar (Government):** Light-touch regulation enabling voluntary AI adoption without rigid mandates
- **Bazaar (Market):** Competitive market for agricultural AI services preventing monopolistic capture

**Policy Recommendations:**
1. Phased district-level pilot rollouts with competitive vendor participation
2. Federated data architecture — farmer profiles remain at state level (data sovereignty)
3. Voluntary compliance frameworks with transparent AI auditing
4. Integration with existing Kisan Suvidha app infrastructure
5. Quarterly SDG-aligned impact assessment and public reporting

**Current Limitations:** Prototype relies on public APIs with rate limits; production deployment requires direct MoU with IMD and NABARD. Language localisation to additional vernaculars needed for pan-India accessibility.

---

## 👥 Team IQ Zero

Built for **Anant Chakra: Agentic Council** at **Chakravyuh Genesis 2026**, ITER SOA, Bhubaneswar.

**Portfolio:** Takshashila Institution

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
