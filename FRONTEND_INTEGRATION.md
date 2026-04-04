# 🚀 FRONTEND INTEGRATION GUIDE

**BACKEND STATUS**: ✅ **100% READY WITH MOCK DATA**

Backend is running on `http://localhost:3001` and returning live demo data **without requiring any API keys**.

---

## 🔗 How to Connect Frontend to Backend

### 1. API Base URL
```typescript
const API_BASE = 'http://localhost:3001/api'
```

### 2. Key Endpoints Ready

#### **POST /api/advisory** - Get Farmer Recommendations
```typescript
const response = await fetch('http://localhost:3001/api/advisory', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'farmer1',
    name: 'Raj Kumar',
    email: 'raj@example.com',
    phone: '9999999999',
    district: 'Nashik',
    state: 'Maharashtra',
    cropType: 'wheat',          // wheat, rice, maize, cotton, etc.
    farmSize: 5,                // hectares
    latitude: 19.99,
    longitude: 73.80,
    language: 'en'              // en, hi, mr, ta, te, kn, ml
  })
})

// ✅ Returns: Complete advisory with weather, market, schemes, alerts
```

#### **POST /api/analysis** - Get Regional Analysis
```typescript
const response = await fetch('http://localhost:3001/api/analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    district: 'Nashik',
    state: 'Maharashtra',
    crops: ['wheat', 'rice']
  })
})

// ✅ Returns: Regional risk analysis + policy recommendations
```

#### **POST /api/crisis** - Emergency Response
```typescript
const response = await fetch('http://localhost:3001/api/crisis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    district: 'Nashik',
    state: 'Maharashtra',
    crops: ['wheat'],
    crisisType: 'drought'        // drought, flood, frost, heatwave, pest-outbreak
  })
})

// ✅ Returns: Emergency alerts + immediate action items
```

#### **GET /api/task/:taskId** - Check Task Status
```typescript
const response = await fetch('http://localhost:3001/api/task/farmer-farmer1-1234567890')

// ✅ Returns: Task progress, status, results when ready
```

#### **GET /api/agents/status** - Agent Health Check
```typescript
const response = await fetch('http://localhost:3001/api/agents/status')

// ✅ Returns: All 5 agents status + tasks completed
```

---

## 📦 Response Structure

### Advisory Response Example
```json
{
  "success": true,
  "taskId": "farmer-farmer1-1234567890",
  "timestamp": "2026-04-04T02:01:29.537Z",
  "data": {
    "sentinelReport": {
      "weatherData": {
        "temperature": 21,
        "humidity": 68,
        "rainfall": 5,
        "windSpeed": 8.5,
        "uvIndex": 4,
        "soilMoisture": 62
      },
      "marketData": [
        {
          "cropName": "wheat",
          "price": 2287,
          "trend": "up",
          "volume": 2400
        }
      ],
      "newsEvents": [...],
      "alerts": [...]
    },
    "analystReport": {
      "cropLossModels": [...],
      "incomeRisks": [...],
      "recommendations": [...]
    },
    "advisorReport": {
      "farmerAdvice": "Personalized recommendation in farmer's language...",
      "actionPlan": [
        {
          "title": "Frost Protection",
          "urgency": "immediate",
          "description": "..."
        }
      ],
      "schemeRecommendations": [...]
    },
    "consolidatedInsight": "Combined insights from all agents..."
  }
}
```

---

## 🎨 What to Display on Frontend

### Dashboard Sections

**1. Weather Card**
```
Temperature: 21°C
Humidity: 68%
Rainfall: 5mm
Wind Speed: 8.5 km/h
Soil Moisture: 62%
```

**2. Market Prices**
```
Wheat: ₹2,287 (↑ UP)
Rice: ₹2,650 (→ STABLE)
```

**3. Alerts Section**
```
🔴 CRITICAL:
   - Frost risk: Protect sensitive crops

🟠 HIGH:
   - High humidity: Fungal disease risk
   
🟡 MEDIUM:
   - Market prices trending down
```

**4. Action Plan**
```
Today:
  □ Check soil moisture
  □ Monitor weather forecast

This Week:
  □ Prepare frost protection
  □ Check market prices

This Month:
  □ Apply for PM-KISAN scheme
  □ Get soil health card
```

**5. Recommended Schemes**
```
✅ PM-KISAN - ₹2000/4 months
✅ PMFBY - Crop insurance
✅ Soil Health Card - Free soil testing
```

---

## 💻 React Integration Example

### Create API Client Hook
```typescript
// src/hooks/useAdvisory.ts
import { useQuery } from '@tanstack/react-query'

export const useAdvisory = (farmer: Farmer) => {
  return useQuery({
    queryKey: ['advisory', farmer.id],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/api/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farmer)
      })
      return res.json()
    },
    enabled: !!farmer.id,
    refetchInterval: 60000,  // Refresh every minute
  })
}
```

### Use in Component
```typescript
// src/components/FarmerDashboard.tsx
import { useAdvisory } from '../hooks/useAdvisory'

export default function FarmerDashboard({ farmer }: { farmer: Farmer }) {
  const { data, isLoading, error } = useAdvisory(farmer)
  
  if (isLoading) return <Loading />
  if (error) return <Error />
  
  const { sentinelReport, advisorReport, alerts } = data.data
  
  return (
    <div>
      <WeatherCard weather={sentinelReport.weatherData} />
      <AlertsSection alerts={alerts} />
      <ActionPlanSection actions={advisorReport.actionPlan} />
      <SchemesSection schemes={advisorReport.schemeRecommendations} />
    </div>
  )
}
```

---

## 🌐 CORS - Already Configured ✅

Frontend can connect from:
- ✅ `http://localhost:3000`
- ✅ `http://localhost:5173` (Vite)
- ✅ `http://localhost:8080` (Dev server)
- ✅ Any origin (`*` for testing)

---

## 🧪 Test the API Directly

**Using curl:**
```bash
curl -X POST http://localhost:3001/api/advisory \
  -H "Content-Type: application/json" \
  -d '{
    "id":"f1",
    "name":"Raj",
    "email":"raj@farm.in",
    "phone":"9999999999",
    "district":"Nashik",
    "state":"Maharashtra",
    "cropType":"wheat",
    "farmSize":5,
    "latitude":19.99,
    "longitude":73.80,
    "language":"en"
  }'
```

**Using Postman:**
1. Method: POST
2. URL: `http://localhost:3001/api/advisory`
3. Headers: `Content-Type: application/json`
4. Body: (JSON from above)
5. Send → ✅ See live mock data

---

## 📱 ChatWidget Integration

### Connect to Chat Endpoint  
```typescript
// POST /api/chat (ready when implemented)
const chat = async (message: string, farmer: Farmer) => {
  const res = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      farmerMessage: message,
      farmer: farmer,
      context: 'last-advisory'
    })
  })
  return res.json()
}
```

---

## 🔄 Real-time Updates

### Polling Strategy
```typescript
// Fetch every minute for updates
useEffect(() => {
  const interval = setInterval(() => {
    refetchAdvisory()
  }, 60000)
  
  return () => clearInterval(interval)
}, [])
```

### WebSocket (Future Enhancement)
```typescript
// When backend adds WebSocket support
const ws = new WebSocket('ws://localhost:3001/live-updates')
ws.onmessage = (event) => {
  const { alerts, marketPrices } = JSON.parse(event.data)
  updateUI(alerts, marketPrices)
}
```

---

## ⚙️ Environment Setup

### Frontend .env File
```env
VITE_API_URL=http://localhost:3001/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEMO_MODE=true
```

### Use in Code
```typescript
const API_URL = import.meta.env.VITE_API_URL
```

---

## 🎯 Implementation Priority

**Phase 1** (Today):
- ✅ Connect to `/api/advisory` endpoint
- ✅ Display weather + market data
- ✅ Show alerts

**Phase 2** (Tomorrow):
- Store farmer profiles
- Multi-language support
- Scheme recommendations

**Phase 3** (Week 2):
- Chat widget integration
- Task tracking
- Real-time updates

---

## 🚨 Error Handling

```typescript
try {
  const res = await fetch(url)
  const data = await res.json()
  
  if (!res.ok) {
    // Backend returned error
    console.error('Error:', data.error)
    // Show user-friendly message
    showToast('Unable to fetch advisory. Using cached data.')
  }
  
  return data
} catch (error) {
  // Network error
  console.error('Network error:', error)
  showToast('Connection lost. Please check your internet.')
}
```

---

## ✅ Backend Health Checks

```typescript
// Check if backend is running
export const checkBackendHealth = async () => {
  try {
    const res = await fetch('http://localhost:3001/')
    return res.ok
  } catch {
    return false
  }
}

// Hook to use in app
export const useBackendStatus = () => {
  const [isHealthy, setIsHealthy] = useState(true)
  
  useEffect(() => {
    checkBackendHealth().then(setIsHealthy)
  }, [])
  
  return isHealthy
}
```

---

## 📚 Full API Reference

See: `backend/API.md` for complete API documentation with all endpoints

---

## 🎉 You're Ready!

**Backend Status**: 🟢 **RUNNING**  
**Mock Data**: 🟢 **ACTIVE**  
**API Status**: 🟢 **RESPONDING**

Start building your frontend! The backend will provide demo data right away.

```bash
# In frontend directory
npm run dev    # Start frontend on http://localhost:5173
```

Then connect components to the backend API and start seeing live demo data! 🚀

---

**Questions?** Backend runs on port **3001**  
**Frontend runs on port** **5173** (or **8080** for your setup)
