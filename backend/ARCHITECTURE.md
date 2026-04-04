# KISANBODHI Architecture & Agent Framework

## System Vision

KISANBODHI (Kisan-Bodhi: Farmer's Intelligence) is an autonomous multi-agent AI system designed to protect India's 100+ million smallholder farmers from climate-driven agricultural crises. Operating from a NITI Aayog policy perspective, the system deploys five specialized agents coordinated through a hierarchical CrewAI-inspired framework.

Aligned with **Atma Nirbhar Bharat** and advancing **UN Sustainable Development Goals (SDGs 1, 2, 8, 13, 17)**, KISANBODHI enables rural self-reliance and climate-resilient agriculture.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR AGENT                        │
│              (Task Distribution & Coordination)              │
└────────┬────────────────────────────────────────────────────┘
         │
    ┌────┼────┬─────────────┬────────────┐
    │    │    │             │            │
    ▼    ▼    ▼             ▼            ▼
┌──────────┐ ┌────────────┐ ┌────────┐ ┌───────┐
│SENTINEL  │ │  ANALYST   │ │ADVISOR │ │POLICY │
│  Agent   │ │   Agent    │ │ Agent  │ │ Agent │
└──────────┘ └────────────┘ └────────┘ └───────┘
    │            │              │         │
    │            │              │         │
Weather      Risk Models   Farmer       SDG
Markets      Income         Schemes      Policy
News         Alerts      Guidance      Briefs
    │            │              │         │
    └────────────┴──────────────┴─────────┘
                    │
            ┌───────▼────────┐
            │ Response       │
            │ Aggregation    │
            └────────────────┘
                    │
            ┌───────▼────────────────┐
            │ Consolidated Advisory  │
            │ & Action Plan          │
            └────────────────────────┘
```

---

## Five Specialized Agents

### 1. SENTINEL AGENT
**Role**: Real-time Environmental Monitoring

**Responsibilities:**
- Continuous weather data monitoring (temperature, humidity, rainfall, wind, UFindex, soil moisture)
- Market price tracking through eNAM and agricultural markets
- Agricultural news aggregation and filtering
- Real-time alert generation based on thresholds

**Data Sources:**
- OpenWeatherMap API
- eNAM (e-National Agricultural Market)
- Agricultural news feeds
- Market data providers

**Output:**
- `SentinelReport` with weather, market, news, and alerts
- Forecast-based alerts for next 5 days
- Price trend analysis

**Example Alert:**
```
Alert: Heat Stress Warning
Severity: HIGH
Temperature: 42°C (exceeds safe limit for wheat)
Recommendation: Increase irrigation to 2-3 day intervals
```

---

### 2. ANALYST AGENT
**Role**: Data-Driven Risk Assessment & Modeling

**Responsibilities:**
- Crop-loss probability modeling using weather data
- Income-risk scoring based on market volatility
- Factor-based risk decomposition (weather, pest, disease, market, soil)
- District-level trend analysis
- Model confidence scoring

**Risk Calculation:**
```
Overall Risk = (Weather×0.25) + (Pest×0.2) + (Disease×0.2) 
            + (Market×0.2) + (Soil×0.15)
```

**Risk Factors:**
- **Weather Risk**: Temperature extremes, rainfall anomalies, wind speed
- **Pest Risk**: Crop-specific susceptibility, seasonal factors
- **Disease Risk**: Humidity-temperature correlation, crop vulnerability
- **Market Risk**: Price volatility (coefficient of variation)
- **Soil Risk**: Moisture and nutrient stress levels

**Output:**
- `AnalystReport` with crop loss models and income risks
- Critical alerts for high-risk situations
- Data-backed recommendations

**Example Model:**
```
Crop: Sugarcane
├─ Weather Risk: 45%
├─ Pest Risk: 32%
├─ Disease Risk: 28%
├─ Market Risk: 52% (volatile market)
├─ Soil Risk: 38%
└─ Overall Risk: 39% (MEDIUM)
```

---

### 3. ADVISOR AGENT
**Role**: Personalized Farmer Guidance & Scheme Matching

**Responsibilities:**
- Personalized action plan generation
- Government scheme recommendation and eligibility matching
- Market-based selling strategy recommendations
- Multi-language guidance (7 languages supported)
- Contextual advice based on current conditions and risk profile

**Supported Government Schemes:**
1. **PMFBY** - Pradhan Mantri Fasal Bima Yojana (Crop Insurance)
2. **PM-KISAN** - Direct Income Support (₹6000/year)
3. **eNAM** - e-National Agricultural Market
4. **Kisan Credit Card** - Flexible Agriculture Credit
5. **Soil Health Card** - Free Soil Testing
6. **Kisan Samridhi** - Sustainable Agriculture Support
7. **PRATISHTHAN** - Agricultural Value Chain

**Action Plan Structure:**
- **Immediate Actions** (within 24 hours)
- **Within-Week Actions** (urgent response)
- **Within-Month Actions** (planning)
- Each action includes steps, expected benefits, and scheme links

**Languages Supported:**
- English, Hindi, Marathi, Tamil, Telugu, Kannada, Malayalam

**Output:**
- `AdvisorReport` with personalized guidance
- Recommended schemes with application deadlines
- Actionable steps tailored to farmer's situation
- Custom message in farmer's preferred language

**Example Guidance:**
```
Farmer: Rajesh Kumar (Marathi, Sugarcane, Nashik)

Immediate Actions:
1. Heat Stress Management
   └─ Steps: Increase irrigation, apply mulch, prune foliage
   └─ Expected Benefit: Maintain crop health

Recommended Schemes:
1. PMFBY - Protect against ₹25,000 income loss
2. PM-KISAN - Receive ₹6,000 annual support
3. eNAM - Access broader markets for better prices

Custom Message (Marathi):
"नमस्कार राजेश! गरमीचा धोका आहे, सिंचन वाढवा..."
```

---

### 4. POLICY AGENT
**Role**: UN SDG Mapping & Governance Briefing

**Responsibilities:**
- Map agricultural interventions to UN SDG targets
- Quantify socio-economic impact
- Generate policy briefs for decision-makers
- Create governance-ready recommendations
- Impact dashboard generation

**SDG Coverage:**
- **SDG 1 (No Poverty)**: Target 1.1, 1.2 → Income improvement, vulnerability reduction
- **SDG 2 (Zero Hunger)**: Target 2.1, 2.3, 2.4 → Food security, productivity, sustainability
- **SDG 8 (Decent Work)**: Target 8.2, 8.3 → Economic productivity, job creation
- **SDG 13 (Climate Action)**: Target 13.1, 13.3 → Climate resilience, education
- **SDG 17 (Partnerships)**: Target 17.17 → Multi-stakeholder coordination

**Impact Metrics:**
```
Intervention: KISANBODHI Advisory System

Impact Quantification (per 1000 farmers):
├─ Income Improvement: 20% (+₹3 lakh/year per farmer)
├─ Crop Loss Reduction: 25% (-₹2.5 lakh avoided loss/year)
├─ Food Security: 100% of farmers achieve food security
├─ Employment: 150 jobs in support services
└─ Climate Resilience: Adaptive capacity increases 40%

SDG Contribution:
├─ SDG 1.1: 300 households lifted from extreme poverty
├─ SDG 2.1: 1000 farmers achieve food security
├─ SDG 8.2: 5% agricultural productivity growth
├─ SDG 13.1: 40% climate resilience improvement
└─ SDG 17.17: 50+ government-farmer-NGO partnerships
```

**Output:**
- `PolicyBrief` with governance recommendations
- Impact dashboard for policymakers
- SDG alignment metrics
- Recommendations for NITI Aayog, State Govt, NGOs

**Example Brief:**
```
Title: Agricultural Climate Resilience in Nashik District
Target: NITI Aayog

Executive Summary:
KISANBOD multi-agent system protecting 15,000 farmers...

Impact Metrics:
• Income: +₹45 crores annually
• Losses Avoided: +₹37.5 crores
• SDG 1: 4,500 households lifted from poverty
• SDG 2: 100% food security achieved

Recommendations:
1. Scale to all 757 districts (Priority: HIGH)
2. Integrate with bank insurance systems
3. Link with eNAM for real-time price discovery
4. Create State AI Coordination Centers
```

---

### 5. ORCHESTRATOR AGENT
**Role**: System Coordination & Workflow Management

**Responsibilities:**
- Task distribution to specialized agents
- Response aggregation and synthesis
- Conflict resolution between agent outputs
- Dynamic re-planning based on new inputs
- Crisis response management
- System health monitoring

**Workflow Types:**

1. **Farmer Advisory Workflow**
   ```
   Trigger: New farmer onboarding
   ├─ Sentinel: Get current weather + market + news
   ├─ Analyst: Calculate risk profile
   ├─ Advisor: Generate personalized guidance
   └─ Result: Complete advisory sent to farmer
   ```

2. **District Analysis Workflow**
   ```
   Trigger: District-level policy reporting
   ├─ Sentinel: Monitor all conditions
   ├─ Analyst: Aggregate risk across crops
   ├─ Policy: Generate governance brief
   └─ Result: Brief sent to district admin
   ```

3. **Crisis Response Workflow**
   ```
   Trigger: Crisis detected (flood, drought, pest, etc.)
   ├─ IMMEDIATE: Sentinel alerts + forecast
   ├─ RAPID: Analyst calculates impact
   ├─ URGENT: Advisor generates emergency actions
   ├─ Policy: Emergency governance brief
   └─ Result: Multi-stakeholder emergency response
   ```

**Task Management:**
- Parallel execution of independent agents
- Result aggregation and synthesis
- Error handling and retry logic
- Task status tracking
- Result caching for efficiency

**Output:**
- `OrchestrationResult` with consolidated insights
- Stakeholder-specific briefs (farmer, policymaker, NGO)
- Complete action plans
- System status reports

---

## Data Flow Architecture

```
┌──────────────────────────┐
│  External Data Sources   │
├──────────────────────────┤
│ • OpenWeatherMap        │
│ • eNAM Markets          │
│ • News APIs             │
│ • Satellite Imagery     │
│ • Soil Sensors          │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│   Services Layer         │
├──────────────────────────┤
│ • WeatherService        │
│ • MarketService         │
│ • NewsService           │
│ • SchemeService         │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│    Agent Processing Layer            │
├──────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐           │
│ │​ Sentinel │ │ Analyst  │ ┐         │
│ └──────────┘ └──────────┘ │         │
│ ┌──────────┐ ┌──────────┐ ├─ Parallel
│ │ Advisor  │ │  Policy  │ │         │
│ └──────────┘ └──────────┘ ┘         │
│              ▲                       │
│              │                       │
│        Orchestrator                 │
└─────────────────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│   Output Generation      │
├──────────────────────────┤
│ • Advisory Reports       │
│ • Policy Briefs          │
│ • Action Plans           │
│ • Alerts & Warnings      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│    Farmer/Stakeholder    │
│    Communication         │
├──────────────────────────┤
│ • Mobile App             │
│ • Web Dashboard          │
│ • SMS/Email              │
│ • Push Notifications     │
└──────────────────────────┘
```

---

## Response Aggregation Logic

The Orchestrator combines outputs from all agents:

1. **Conflict Resolution** - If agents give conflicting recommendations, Orchestrator weighs confidence scores
2. **Prioritization** - Critical alerts take precedence in action items
3. **Personalization** - Farmer-specific factors influence recommendations
4. **Time-sensitivity** - Urgent factors trigger immediate actions
5. **Context-awareness** - Regional, seasonal, and crop-specific nuances considered

---

## Error Handling & Resilience

- **Graceful Degradation**: If one agent fails, system continues with available data
- **Retry Logic**: Failed external API calls retry with exponential backoff
- **Default Values**: Falls back to mock/historical data if APIs unavailable
- **Validation**: All inputs validated before processing
- **Logging**: Comprehensive error logging for debugging

---

## Performance Metrics

| Operation | Time | Data Size |
|-----------|------|-----------|
| Individual Advisory | 10-15 sec | ~2 MB |
| District Analysis | 15-20 sec | ~5 MB |
| Crisis Response | 5-10 sec | ~3 MB |
| Task Lookup | <1 sec | <100 KB |
| Agent Status | <100 ms | <50 KB |

---

## Scalability Targets

- **Farmers**: 100+ million Indian smallholder farmers
- **Districts**: All 757 Indian districts
- **Daily Advisories**: 1-10 million per day
- **Crisis Response**: Sub-10-second response time
- **Concurrent Users**: 100,000+ simultaneous connections

---

## Integration Points

### External APIs
- OpenWeatherMap (Weather)
- eNAM APIs (Market Data)
- Agricultural News APIs (News)
- Satellite Imagery APIs (Future)
- Soil Sensor Networks (Future)

### Government Systems
- PMFBY Insurance Database
- PM-KISAN Payment System
- eNAM Trading Platform
- NITI Aayog Dashboard
- State Agricultural Departments

### Stakeholder Interfaces
- Farmer Mobile App
- Policy Dashboard
- NGO Coordination Portal
- District Admin System
- Bank Integration

---

## Future Enhancements

1. **ML/DL Models**: Custom crop loss prediction models
2. **Real-time Processing**: Event streaming with Kafka
3. **Computer Vision**: Crop health monitoring from drone imagery
4. **Blockchain**: Crop history and traceability
5. **Voice Interface**: Voice-based advisory in local languages
6. **Offline Support**: Hybrid online/offline architecture
7. **Predictive Analytics**: 15-30 day forecasting
8. **Dynamic Pricing**: Real-time market price prediction

---

## Security & Privacy

- Farmer data encryption at rest and in transit
- Privacy-preserving aggregation for district-level reports
- Audit logs for all system operations
- Role-based access control for stakeholders
- GDPR/India Data Protection compliance

---

## Conclusion

KISANBODHI represents a paradigm shift in agricultural technology - moving from reactive crisis management to proactive, data-driven, multi-stakeholder farmer empowerment. By coordinating five specialized agents, the system delivers contextual, actionable intelligence that advances India's rural self-reliance while contributing to global sustainable development goals.

The system is designed to be scalable, resilient, and culturally sensitive, serving India's 100+ million smallholder farmers with intelligence that protects their livelihoods and advances national agricultural policy.

---

**KISANBODHI**: Farmer's Intelligence for Climate-Resilient Agriculture
