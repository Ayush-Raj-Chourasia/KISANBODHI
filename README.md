# KISANBODHI - Farmer Intelligence System

🌾 **KISANBODHI** (किसानबोधि / କିସାନବୋଧି) - An autonomous multi-agent AI system protecting India's smallholder farmers through real-time weather alerts, crop loss predictions, and government scheme guidance.

## 🎯 Project Overview

Built for **Anant Chakra: Agentic Council** - A hardcore agentic AI challenge emphasizing real-world problem-solving with governance and ethical considerations.

**Key Features:**
- ✅ Multi-language support (English, Hindi, Odia)
- ✅ Autonomous agent system with 5 specialized agents (Sentinel, Analyst, Advisor, Policy, Orchestrator)
- ✅ Real-time weather forecasts & hazard alerts
- ✅ Crop loss probability modeling
- ✅ Government scheme recommendations (PMFBY, PM-KISAN, eNAM)
- ✅ UN SDG alignment mapping
- ✅ Beautiful, farmer-friendly UI
- ✅ Full-stack with authentication

## 🏗️ Architecture

### Frontend
- **Framework:** React 18 + TypeScript + Vite
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Internationalization:** i18next (Odia, Hindi, English)
- **Authentication:** JWT with Context API
- **Deployment:** Vercel

### Backend
- **Framework:** Express.js + TypeScript
- **Authentication:** JWT + bcryptjs
- **Database:** PostgreSQL (structured data)
- **Agent Framework:** CrewAI (multi-agent orchestration)
- **APIs:** OpenWeatherMap, Serper/Tavily, Agmarknet
- **Deployment:** Render/Railway/Heroku

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- PostgreSQL 12+ (optional for MVP)

## 🚀 Quick Start

### 1. **Clone & Install Dependencies**

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. **Environment Setup**

Create `.env` files:

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=KISANBODHI
```

**Backend `.env`:**
```
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production
DATABASE_URL=postgresql://user:password@localhost:5432/kisanbodhi
```

### 3. **Run Locally**

```bash
# Terminal 1: Frontend (Port 5173)
npm run dev

# Terminal 2: Backend (Port 5000)
cd backend
npm run dev
```

### 4. **Access the Application**

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 🔐 Demo Credentials

```
Email: farmer@example.com
Password: password
District: Kendrapara (Odisha)
Language: Odia / Hindi / English
```

## 📁 Project Structure

```
KISANBODHI/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── contexts/           # Auth context
│   ├── i18n/              # i18n configuration & translations
│   ├── types/             # TypeScript type definitions
│   ├── services/          # API services
│   ├── App.tsx
│   └── main.tsx
├── backend/
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── agents/        # CrewAI agent definitions
│   │   ├── services/      # Business logic
│   │   ├── database/      # DB schemas & migrations
│   │   └── server.ts      # Express server entry
│   ├── package.json
│   └── .env.example
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🤖 Agent System Architecture

### The 5 Agents

1. **Sentinel Agent** 🌍
   - Monitors weather forecasts, IMD alerts, news
   - Outputs: Hazard signals, probability scores

2. **Analyst Agent** 📊
   - Calculates crop loss probability & income impact
   - Outputs: Risk scores, loss estimations

3. **Advisor Agent** 🌾
   - Generates actionable farmer guidance
   - Suggests harvest timing, crop protection, insurance

4. **Policy Agent** 📋
   - Maps to SDG targets
   - Recommends government schemes
   - Produces governance briefs

5. **Orchestrator Agent** 🎯
   - Coordinates all agents
   - Decomposes queries into subtasks
   - Assembles final responses

## 🔄 Data Flow

```
User Query → Orchestrator
    ↓
[Sentinel → Analyst → Advisor → Policy]
    ↓
Consolidated Response & Recommendations
    ↓
Government Schemes + SDG Alignment
```

## 🌐 Multi-Language Support

**Translated into:**
- **English** - Global accessibility
- **हिंदी (Hindi)** - National language
- **ଓଡିଆ (Odia)** - Regional language (Odisha primary)

Switch languages in navbar dropdown or `localStorage.setItem('language', 'or')`

## 🔑 Authentication Flow

1. **Register** → Create account with district & language preference
2. **Login** → JWT token issued
3. **Protected Routes** → Token verified via `ProtectedRoute` wrapper
4. **Logout** → Token cleared, redirect to landing

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Agent
- `POST /api/agent/query` - Send farmer query (Protected)
- `GET /api/agent/history` - Fetch conversation history (Protected)

### Farmer
- `GET /api/farmer/profile` - Get farmer profile (Protected)
- `PUT /api/farmer/profile` - Update profile (Protected)
- `GET /api/farmer/alerts` - Fetch personalized alerts (Protected)
- `GET /api/farmer/schemes` - Get applicable schemes (Protected)

## 🧪 Testing Flow

1. **Register** with:
   - Name: Any name
   - Email: farmer@test.com
   - Password: password
   - District: Pick from Odisha list
   - Language: English / हिंदी / ଓଡିଆ

2. **Dashboard:**
   - Type a query: "Flood warning in my area"
   - See agent responses in real-time
   - View SDG alignment & schemes

3. **Language Switch:**
   - Navbar dropdown
   - Entire UI updates

## 🚢 Deployment

### Frontend → Vercel

```bash
# Connect GitHub repo to Vercel
# Add environment variables in Vercel dashboard
# Deploy automatically on push
```

### Backend → Render/Railway

```bash
# Connect GitHub repo
# Set environment variables
# Auto-deploy on push
```

## 📊 SDG Alignment

**KISANBODHI contributes to:**
- **SDG 1** - No Poverty (income protection for farmers)
- **SDG 2** - Zero Hunger (food security)
- **SDG 8** - Decent Work (rural employment)
- **SDG 13** - Climate Action (weather adaptation)

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- CORS protection
- Protected API routes
- Environment variable secrets
- XSS protection via React's built-in sanitization

## 📱 Responsive Design

- Mobile-first approach
- Optimized for low-bandwidth areas
- Accessible on feature phones (progressive enhancement)
- Touch-friendly interfaces

## 🎨 Design Philosophy

**Farmer-Centric:**
- Simple, intuitive UI
- Large, readable fonts
- Minimal cognitive load
- Culturally appropriate visuals
- Regional language priority

## 🔗 Integration Points (Ready for Enhancement)

- OpenWeatherMap API (weather data)
- Serper/Tavily API (news & pest alerts)
- Agmarknet (market data)
- Google Sheets (government schemes database)
- Twilio (SMS alerts for low-connectivity)
- NDRF/IMD webhooks (real-time disaster alerts)

## 📝 Notes for Judges

**Technical Depth:**
- Hierarchical multi-agent orchestration
- Real-time data processing
- Asynchronous agent communication
- Memory persistence across queries

**Policy & Governance:**
- NITI Aayog-aligned recommendations
- Explicit SDG mappings
- Risk & bias assessment framework
- Stakeholder analysis for each decision

**Crisis Adaptability:**
- Prepared "crisis mode" UI toggle
- Agent re-planning without manual intervention
- Graceful degradation on API failures
- Mock data fallback system

## 🏆 Competition Context

**Anant Chakra: Agentic Council** - April 4, 2026, ITER Odisha

- Team: **IQ Zero**
- Portfolio: **NITI Aayog**
- Tech Stack: **CrewAI + React + Express**
- Deployment: **Vercel + Render**

## 📞 Support

For technical questions:
- Check backend logs: `backend/` console
- Frontend errors: Browser DevTools
- API responses: `http://localhost:5000/health`

## 📄 License

MIT License - See LICENSE file

---

**Made with 🌾 for Indian Farmers | KISANBODHI Team**
