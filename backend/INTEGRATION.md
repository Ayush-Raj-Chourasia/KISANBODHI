# KISANBODHI - Integration Guide

## Frontend Integration

### Installation

```typescript
// Add to frontend package.json
npm install axios  // or your preferred HTTP client
```

### Basic Usage

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

// 1. Get personalized advisory for a farmer
const getFarmerAdvisory = async (farmer: Farmer) => {
  const response = await axios.post(`${API_BASE}/advisory`, farmer);
  return response.data;
};

// 2. Get district-level analysis
const getDistrictAnalysis = async (district: string, state: string) => {
  const response = await axios.post(`${API_BASE}/analysis`, {
    district,
    state,
    crops: ['wheat', 'rice', 'sugarcane']
  });
  return response.data;
};

// 3. Handle crisis alert
const triggerCrisisResponse = async (crisis: CrisisData) => {
  const response = await axios.post(`${API_BASE}/crisis`, {
    district: crisis.district,
    state: crisis.state,
    crops: crisis.affectedCrops,
    crisisType: crisis.type
  });
  return response.data;
};

// 4. Poll task status
const getTaskStatus = async (taskId: string) => {
  const response = await axios.get(`${API_BASE}/task/${taskId}`);
  return response.data;
};

// 5. Get system health
const getSystemStatus = async () => {
  const response = await axios.get(`${API_BASE}/health`);
  return response.data;
};
```

### React Component Example

```typescript
import React, { useState, useEffect } from 'react';
import { Farmer, OrchestrationResult } from '@backend/types';

export const FarmerAdvisoryComponent: React.FC = () => {
  const [farmer, setFarmer] = useState<Farmer>(null);
  const [advisory, setAdvisory] = useState<OrchestrationResult>(null);
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string>(null);

  const handleGetAdvisory = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/advisory', farmer);
      setTaskId(response.data.taskId);
      
      // Poll for result
      let result = null;
      while (!result) {
        const statusResponse = await axios.get(`/api/task/${response.data.taskId}`);
        if (statusResponse.data.result) {
          result = statusResponse.data.result;
          setAdvisory(result);
        }
        // Wait 2 seconds before polling again
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (error) {
      console.error('Error fetching advisory:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advisory-container">
      <h2>Farm Advisory</h2>
      
      {farmer && (
        <div className="farmer-info">
          <p>Farmer: {farmer.name}</p>
          <p>Crop: {farmer.cropType}</p>
          <p>Location: {farmer.district}, {farmer.state}</p>
          <button onClick={handleGetAdvisory} disabled={loading}>
            {loading ? 'Generating...' : 'Get Advisory'}
          </button>
        </div>
      )}

      {advisory && (
        <div className="advisory-result">
          <h3>Personalized Advisory</h3>
          
          {/* Sentinel Alerts */}
          <section className="alerts-section">
            <h4>⚠️ Real-time Alerts</h4>
            {advisory.agentResponses[0].data?.alerts?.map(alert => (
              <div key={alert.id} className={`alert alert-${alert.severity}`}>
                <span>{alert.title}</span>
                <p>{alert.description}</p>
              </div>
            ))}
          </section>

          {/* Risk Analysis */}
          <section className="analysis-section">
            <h4>📊 Risk Analysis</h4>
            {advisory.agentResponses[1].data?.cropLossModels?.map(model => (
              <div key={model.cropType} className="crop-model">
                <h5>{model.cropType}</h5>
                <p>Risk Score: {model.overallRisk}/100</p>
                <p>Confidence: {model.confidence}%</p>
              </div>
            ))}
          </section>

          {/* Action Items */}
          <section className="actions-section">
            <h4>✅ Recommended Actions</h4>
            {advisory.actionItems?.map((action, idx) => (
              <div key={idx} className={`action action-${action.urgency}`}>
                <h5>{action.title}</h5>
                <p>{action.description}</p>
                <ul>
                  {action.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Schemes */}
          <section className="schemes-section">
            <h4>🏛️ Available Schemes</h4>
            {advisory.agentResponses[2].data?.schemeRecommendations?.map(scheme => (
              <div key={scheme.id} className="scheme-card">
                <h5>{scheme.name}</h5>
                <p>{scheme.description}</p>
                <a href={scheme.website} target="_blank">
                  Apply Now
                </a>
              </div>
            ))}
          </section>

          {/* Custom Message */}
          <section className="message-section">
            <h4>💬 Personalized Message</h4>
            <pre>{advisory.agentResponses[2].data?.customMessage}</pre>
          </section>
        </div>
      )}
    </div>
  );
};
```

## Mobile App Integration

### React Native Example

```typescript
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';

export const MobileAdvisoryScreen = ({ farmer }) => {
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvisory = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://api.kisanbodhi.com/advisory', farmer);
      setAdvisory(response.data.data);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <Button title="Get Advisory" onPress={fetchAdvisory} />
      {loading && <ActivityIndicator size="large" />}
      {advisory && (
        <View>
          {/* Display advisory content */}
          <Text>{advisory.consolidatedInsight}</Text>
        </View>
      )}
    </ScrollView>
  );
};
```

## Dashboard Integration

### Display Agent Status

```typescript
const AgentStatusDashboard = () => {
  const [agentStatus, setAgentStatus] = useState([]);

  useEffect(() => {
    axios.get('/api/agents').then(res => {
      setAgentStatus(res.data.agents);
    });
  }, []);

  return (
    <div className="agent-dashboard">
      {agentStatus.map(agent => (
        <div key={agent.agentId} className="agent-card">
          <h3>{agent.agentName}</h3>
          <p>Status: {agent.status}</p>
          <p>Tasks: {agent.tasksCompleted}</p>
        </div>
      ))}
    </div>
  );
};
```

## Real-time Updates with WebSockets (Future)

```typescript
// Coming soon: WebSocket support for real-time alert delivery
const socket = io('http://localhost:3001');

socket.on('new-alert', (alert) => {
  console.log('New Alert:', alert);
  // Update UI with new alert
});

socket.on('advisory-ready', (result) => {
  console.log('Advisory Ready:', result);
  // Notify user that advisory is ready
});
```

## API Response Examples

### Advisory Response

```json
{
  "success": true,
  "taskId": "farmer-farmer-123-1699567890123",
  "timestamp": "2024-11-09T10:31:30Z",
  "data": {
    "orchestratorId": "orchestrator-001",
    "taskId": "farmer-farmer-123-1699567890123",
    "timestamp": "2024-11-09T10:31:30Z",
    "agentResponses": [
      {
        "agentId": "sentinel-001",
        "agentName": "Sentinel",
        "status": "success",
        "data": {
          "alerts": [
            {
              "id": "alert-weather-1",
              "severity": "high",
              "title": "Heat Stress Warning",
              "description": "Temperature exceeding safe limits for crops",
              "category": "weather",
              "recommendedAction": "Increase irrigation frequency"
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
              "confidence": 82,
              "factors": {
                "weather": 50,
                "pest": 30,
                "disease": 25,
                "market": 40,
                "soil": 35
              }
            }
          ]
        }
      }
    ],
    "actionItems": [
      {
        "title": "Irrigation Management",
        "urgency": "immediate",
        "steps": [
          "Increase irrigation to 2-3 day interval",
          "Apply mulch to retain soil moisture"
        ]
      }
    ]
  }
}
```

## Error Handling

```typescript
const handleAPIError = (error) => {
  if (error.response?.status === 400) {
    console.error('Bad Request:', error.response.data.error);
  } else if (error.response?.status === 500) {
    console.error('Server Error:', error.response.data.error);
  } else {
    console.error('Network Error:', error.message);
  }
};
```

## Performance Optimization

1. **Caching**: Cache advisory results for same farmer+conditions
2. **Pagination**: For district analysis with many farmers
3. **Compression**: Use gzip for response compression
4. **CDN**: Cache static content on CDN
5. **Rate Limiting**: Implement rate limiting per farmer ID

## Security Considerations

- Validate farmer data on frontend
- Use HTTPS for API calls in production
- Implement authentication for farmer access
- Store sensitive data securely
- Add CORS headers appropriately
- Implement rate limiting
- Sanitize user inputs

---

For more information, refer to the main KISANBODHI README and API documentation.
