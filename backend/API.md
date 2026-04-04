# KISANBODHI API Documentation

## System Overview

KISANBODHI is a multi-agent AI system designed to protect India's 100+ million smallholder farmers through intelligent, real-time agricultural advisory powered by five specialized agents working in coordination.

## Base URL

```
http://localhost:3001/api
```

## Content-Type

All requests use `application/json` content-type.

---

## 1. ADVISORY ENDPOINTS

### POST /advisory

Generate comprehensive personalized advisory for an individual farmer.

**Request:**
```json
{
  "id": "farmer-001",
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
```

**Field Descriptions:**
- `id`: Unique farmer identifier
- `name`: Farmer's full name
- `email`: Email for communications
- `phone`: Phone number with country code
- `district`: District name
- `state`: State/Union Territory
- `cropType`: Primary crop (wheat, rice, sugarcane, cotton, maize, pulses, etc.)
- `farmSize`: Farm size in hectares (decimal)
- `latitude`: Geographic latitude (can be 0 if not available)
- `longitude`: Geographic longitude (can be 0 if not available)
- `language`: Preferred language code (en, hi, mr, ta, te, kn, ml)

**Response (Success - 200):**
```json
{
  "success": true,
  "taskId": "farmer-farmer-001-1699567890123",
  "timestamp": "2024-11-09T10:31:30.000Z",
  "data": {
    "orchestratorId": "orchestrator-001",
    "taskId": "farmer-farmer-001-1699567890123",
    "timestamp": "2024-11-09T10:31:30.000Z",
    "agentResponses": [
      {
        "agentId": "sentinel-001",
        "agentName": "Sentinel",
        "timestamp": "2024-11-09T10:31:30.000Z",
        "status": "success",
        "data": {
          "timestamp": "2024-11-09T10:31:30.000Z",
          "weatherData": {
            "timestamp": "2024-11-09T10:31:30.000Z",
            "temperature": 28.5,
            "humidity": 72,
            "rainfall": 0,
            "windSpeed": 12,
            "uvIndex": 6.5,
            "soilMoisture": 65
          },
          "marketData": [
            {
              "cropName": "sugarcane",
              "price": 350.50,
              "trend": "stable",
              "volume": 1500,
              "timestamp": "2024-11-09T10:31:30.000Z",
              "market": "Nashik APMC"
            }
          ],
          "alerts": []
        }
      },
      {
        "agentId": "analyst-001",
        "agentName": "Analyst",
        "status": "success",
        "data": {
          "cropLossModels": [
            {
              "cropType": "sugarcane",
              "overallRisk": 35,
              "confidence": 85,
              "factors": {
                "weather": 30,
                "pest": 25,
                "disease": 20,
                "market": 40,
                "soil": 30
              }
            }
          ]
        }
      },
      {
        "agentId": "advisor-001",
        "agentName": "Advisor",
        "status": "success",
        "data": {
          "customMessage": "नमस्कार राजेश!\n\nआपके खेत के लिए सलाह:\n...",
          "schemeRecommendations": [
            {
              "id": "pmkisan-001",
              "name": "PM-KISAN",
              "description": "Receive direct income support of ₹6000 annually"
            }
          ],
          "actionPlan": [
            {
              "title": "Soil Health Check",
              "urgency": "within-month",
              "steps": ["Visit nearest testing lab", "Get soil card"]
            }
          ]
        }
      }
    ],
    "actionItems": [
      {
        "title": "Soil Health Check",
        "description": "Get your soil tested for comprehensive analysis",
        "urgency": "within-month",
        "expectedBenefit": "Optimize fertilizer use and improve yield",
        "steps": [
          "Visit nearest soil testing lab",
          "Provide soil samples",
          "Get soil health card"
        ]
      }
    ]
  }
}
```

**Response (Error - 400):**
```json
{
  "error": "Missing required farmer fields"
}
```

---

## 2. ANALYSIS ENDPOINTS

### POST /analysis

Perform district-level agricultural analysis for multiple crops.

**Request:**
```json
{
  "district": "Nashik",
  "state": "Maharashtra",
  "crops": ["sugarcane", "wheat", "onion"]
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "taskId": "district-Nashik-1699567890123",
  "timestamp": "2024-11-09T10:31:30.000Z",
  "data": {
    "orchestratorId": "orchestrator-001",
    "taskId": "district-Nashik-1699567890123",
    "agentResponses": [
      {
        "agentId": "sentinel-001",
        "agentName": "Sentinel",
        "status": "success",
        "data": {
          "alerts": [
            {
              "id": "alert-001",
              "severity": "medium",
              "title": "High Humidity Alert",
              "description": "High humidity increases fungal disease risk",
              "recommendedAction": "Apply preventive fungicide"
            }
          ]
        }
      },
      {
        "agentId": "analyst-001",
        "agentName": "Analyst",
        "status": "success",
        "data": {
          "cropLossModels": [
            {
              "cropType": "sugarcane",
              "overallRisk": 45,
              "confidence": 82
            },
            {
              "cropType": "wheat",
              "overallRisk": 28,
              "confidence": 80
            }
          ],
          "recommendations": [
            "Weather risk is high. Strengthen irrigation systems.",
            "Apply for PMFBY insurance to manage crop loss risk."
          ]
        }
      },
      {
        "agentId": "policy-001",
        "agentName": "Policy",
        "status": "success",
        "data": {
          "summary": "EXECUTIVE SUMMARY\n\n...",
          "sdgMappings": [
            {
              "target": "SDG 1.1",
              "contribution": "1000 households lifted from poverty"
            }
          ]
        }
      }
    ],
    "consolidatedInsight": "DISTRICT-LEVEL ANALYSIS..."
  }
}
```

---

## 3. CRISIS ENDPOINTS

### POST /crisis

Trigger emergency response for agricultural crisis.

**Request:**
```json
{
  "district": "Nashik",
  "state": "Maharashtra",
  "crops": ["sugarcane"],
  "crisisType": "flood"
}
```

**Crisis Types Supported:**
- `flood` - Waterlogging/excessive rainfall
- `drought` - Severe water scarcity
- `hail` - Hail storm damage
- `pest-outbreak` - Pest/insect infestation
- `disease-outbreak` - Disease epidemic
- `frost` - Frost/cold damage
- `heat-wave` - Extreme heat
- `wind-storm` - High wind damage

**Response (Success - 200):**
```json
{
  "success": true,
  "taskId": "crisis-flood-Nashik-1699567890123",
  "timestamp": "2024-11-09T10:31:30.000Z",
  "priority": "high",
  "data": {
    "consolidatedInsight": "CRISIS ALERT: flood detected in Nashik...",
    "actionItems": [
      {
        "title": "Immediate Crop Protection",
        "urgency": "immediate",
        "steps": [
          "De-water fields if waterlogging threatens",
          "Document losses with photos/videos",
          "File PMFBY claim within 72 hours"
        ]
      }
    ],
    "stakeholderBriefs": {
      "farmer": "URGENT: flood affecting your area. Take immediate action...",
      "policymaker": "Emergency response initiated...",
      "ngo": "Coordination needed for relief distribution."
    }
  }
}
```

---

## 4. TASK MANAGEMENT ENDPOINTS

### GET /task/:taskId

Get status and result of a specific task.

**Example:**
```
GET /api/task/farmer-farmer-001-1699567890123
```

**Response (Success - 200):**
```json
{
  "taskId": "farmer-farmer-001-1699567890123",
  "status": "completed",
  "result": {
    "orchestratorId": "orchestrator-001",
    "taskId": "farmer-farmer-001-1699567890123",
    "timestamp": "2024-11-09T10:31:30.000Z",
    "agentResponses": [...]
  }
}
```

**Response (In Progress - 200):**
```json
{
  "taskId": "farmer-farmer-001-1699567890123",
  "status": "in-progress"
}
```

**Response (Not Found - 404):**
```json
{
  "error": "Task not found"
}
```

### GET /tasks

Get all active tasks.

**Response (Success - 200):**
```json
{
  "activeTaskCount": 3,
  "tasks": [
    {
      "taskId": "farmer-farmer-001-1699567890123",
      "type": "advisory",
      "status": "in-progress",
      "createdAt": "2024-11-09T10:31:30.000Z"
    }
  ]
}
```

---

## 5. SYSTEM ENDPOINTS

### GET /agents

Get status of all agents in the system.

**Response (Success - 200):**
```json
{
  "agents": [
    {
      "agentId": "sentinel-001",
      "agentName": "Sentinel",
      "status": "active",
      "tasksCompleted": 152
    },
    {
      "agentId": "analyst-001",
      "agentName": "Analyst",
      "status": "active",
      "tasksCompleted": 152
    },
    {
      "agentId": "advisor-001",
      "agentName": "Advisor",
      "status": "active",
      "tasksCompleted": 152
    },
    {
      "agentId": "policy-001",
      "agentName": "Policy",
      "status": "active",
      "tasksCompleted": 152
    }
  ],
  "orchestratorId": "orchestrator-001"
}
```

### GET /health

System health check.

**Response (Success - 200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-11-09T10:31:30.000Z",
  "system": "KISANBODHI Multi-Agent Agricultural Advisory",
  "agents": [
    "Sentinel - Real-time monitoring",
    "Analyst - Risk assessment",
    "Advisor - Personalized guidance",
    "Policy - Governance mapping",
    "Orchestrator - Coordination"
  ]
}
```

### POST /demo

Generate demo data for testing.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Demo data generated successfully",
  "data": {
    "orchestratorId": "orchestrator-001",
    "taskId": "farmer-demo-farmer-001-...",
    "agentResponses": [...]
  }
}
```

---

## Error Handling

### Common HTTP Status Codes

- **200 OK** - Request successful
- **400 Bad Request** - Missing or invalid required fields
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

### Error Response Format

```json
{
  "error": "Error description",
  "details": "Additional error information"
}
```

---

## Response Time Expectations

| Endpoint | Time | Notes |
|----------|------|-------|
| /advisory | 10-15 sec | Depends on external APIs |
| /analysis | 15-20 sec | Multiple crop models |
| /crisis | 5-10 sec | Prioritized response |
| /task/:taskId | <1 sec | Cache lookup only |
| /health | <100 ms | Instant response |

---

## Rate Limiting

Currently no rate limiting. Future versions will implement:
- 100 requests per minute per farmer ID
- 500 requests per minute per IP

---

## Authentication

Currently no authentication required. Production deployment should implement:
- Bearer token authentication
- API key authentication
- OAuth2/OIDC

---

## Localization Support

The system supports responses in multiple Indian languages:

| Code | Language |
|------|----------|
| en | English |
| hi | Hindi |
| mr | Marathi |
| ta | Tamil |
| te | Telugu |
| kn | Kannada |
| ml | Malayalam |

---

## Examples using cURL

```bash
# Get advisory
curl -X POST http://localhost:3001/api/advisory \
  -H "Content-Type: application/json" \
  -d '{
    "id": "farmer-001",
    "name": "Rajesh Kumar",
    "district": "Nashik",
    "state": "Maharashtra",
    "cropType": "sugarcane",
    "farmSize": 2.5,
    "language": "mr"
  }'

# Get district analysis
curl -X POST http://localhost:3001/api/analysis \
  -H "Content-Type: application/json" \
  -d '{
    "district": "Nashik",
    "state": "Maharashtra",
    "crops": ["sugarcane", "wheat"]
  }'

# Check system health
curl http://localhost:3001/api/health

# Get agent status
curl http://localhost:3001/api/agents

# Check task status
curl http://localhost:3001/api/task/farmer-farmer-001-1699567890123
```

---

## Best Practices

1. **Always include language preference** for personalized experience
2. **Store taskId** to check results later
3. **Poll /task endpoint** for long-running operations
4. **Handle errors gracefully** with user-friendly messages
5. **Cache results** when possible to reduce API calls
6. **Validate farmer data** before submitting
7. **Use district/state** instead of coordinates when available

---

## Support & Documentation

- Main README: [README.md](./README.md)
- Integration Guide: [INTEGRATION.md](./INTEGRATION.md)
- API Examples: See cURL examples above

---

**KISANBODHI** - Farmer's Intelligence for Climate-Resilient Agriculture
