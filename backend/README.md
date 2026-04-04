# KISANBODHI Backend

Multi-agent AI system for protecting India's smallholder farmers from climate-driven agricultural crises.

## System Architecture

### Five Specialized Agents

1. **Sentinel Agent** (`sentinel.agent.ts`)
   - Real-time weather monitoring
   - Market price tracking
   - News aggregation and filtering
   - Alert generation and escalation

2. **Analyst Agent** (`analyst.agent.ts`)
   - Crop-loss probability modeling
   - Income-risk assessment and scoring
   - District-level trend analysis
   - Data-driven risk recommendations

3. **Advisor Agent** (`advisor.agent.ts`)
   - Personalized farmer-facing guidance
   - Government scheme matching
   - Contextual action plans
   - Multi-language support (Hindi, Marathi, Tamil, Telugu, Kannada, Malayalam)

4. **Policy Agent** (`policy.agent.ts`)
   - UN SDG target mapping (SDG 1, 2, 8, 13, 17)
   - Governance-ready briefs for NITI Aayog
   - Impact quantification
   - Policy recommendations

5. **Orchestrator Agent** (`orchestrator.agent.ts`)
   - Hierarchical workflow coordination
   - Task distribution to specialized agents
   - Response aggregation and synthesis
   - Crisis response management

### Services

- **WeatherService**: OpenWeatherMap integration, forecasting, agricultural alerts
- **MarketService**: eNAM price data, trend analysis, market recommendations
- **NewsService**: Agricultural news aggregation, categorization, severity scoring
- **SchemeService**: Government scheme database, eligibility matching, application guidance

## API Endpoints

### Analysis & Advisory

```bash
# District-level analysis
POST /api/analysis
{
  "district": "Nashik",
  "state": "Maharashtra",
  "crops": ["sugarcane", "wheat"]
}

# Personalized farmer advisory
POST /api/advisory
{
  "id": "farmer-123",
  "name": "Rajesh Kumar",
  "email": "rajesh@farm.com",
  "phone": "+91-9876543210",
  "district": "Nashik",
  "state": "Maharashtra",
  "cropType": "sugarcane",
  "farmSize": 2.5,
  "latitude": 19.9975,
  "longitude": 73.791,
  "language": "mr"
}

# Emergency crisis response
POST /api/crisis
{
  "district": "Nashik",
  "state": "Maharashtra",
  "crops": ["sugarcane"],
  "crisisType": "flood"
}
```

### Status & Management

```bash
# Get task status
GET /api/task/:taskId

# Get all active tasks
GET /api/tasks

# Get agent status
GET /api/agents

# System health check
GET /api/health

# Generate demo data
POST /api/demo
```

## Government Schemes Supported

- **PMFBY** - Pradhan Mantri Fasal Bima Yojana (Crop Insurance)
- **PM-KISAN** - Direct Income Support Scheme
- **eNAM** - e-National Agricultural Market
- **Kisan Credit Card** - Agricultural Credit Facility
- **Soil Health Card** - Free Soil Testing
- **PRATISHTHAN** - Agricultural Value Chain

## SDG Alignment

- **SDG 1**: Eradicate Poverty (Target 1.1, 1.2)
- **SDG 2**: Zero Hunger (Targets 2.1, 2.3, 2.4)
- **SDG 8**: Decent Work (Targets 8.2, 8.3)
- **SDG 13**: Climate Action (Targets 13.1, 13.3)
- **SDG 17**: Partnerships (Target 17.17)

## Installation

```bash
cd backend
npm install
```

## Development

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript
npm run type-check # Type checking only
```

## Production

```bash
npm run build
npm run start
```

## Environment Variables

```bash
PORT=3001
WEATHER_API_KEY=your_openweathermap_api_key
```

## Technology Stack

- **Runtime**: Node.js with ES2020 modules
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Framework**: Custom multi-agent orchestration system
- **Data Sources**: OpenWeatherMap, eNAM, Agricultural News APIs

## Coverage

- **Target Farmers**: 100+ million smallholder farming households
- **Geographic**: All Indian states and union territories
- **Crops**: All major crops (wheat, rice, sugarcane, cotton, pulses, oilseeds, etc.)
- **Schemes**: 7+ major government agricultural schemes

## Features Roadmap

- [ ] Integration with satellite imagery for crop health monitoring
- [ ] Soil sensor network integration
- [ ] Real-time pest/disease detection with computer vision
- [ ] Blockchain-based crop traceability
- [ ] Drone-based field monitoring
- [ ] ML model training on historical data
- [ ] GraphQL API alongside REST
- [ ] WebSocket support for real-time alerts
- [ ] Mobile app backend for offline advisory

## Contributing

This project implements the KISANBODHI vision for rural self-reliance as part of Atma Nirbhar Bharat.

## License

MIT

---

**KISANBODHI**: Farmer's Intelligence for Climate-Resilient Agriculture
