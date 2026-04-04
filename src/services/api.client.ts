/**
 * API Client Service
 * Centralized API communication layer
 * - Handles all backend requests
 * - Configurable for mock or real data
 * - Type-safe with full TypeScript support
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')

// Type definitions (mirror from backend for type safety)
export interface Farmer {
  id: string
  name: string
  email: string
  phone: string
  district: string
  state: string
  cropType: string
  farmSize: number
  latitude: number
  longitude: number
  language?: 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'kn' | 'ml'
}

export interface WeatherData {
  timestamp: Date
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  uvIndex: number
  soilMoisture: number
  location: { district: string; state: string }
}

export interface MarketData {
  cropName: string
  price: number
  trend: 'up' | 'down' | 'stable'
  volume: number
  timestamp: Date
  market: string
  location: { district: string; state: string }
}

export interface Alert {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  category: string
}

export interface ActionItem {
  title: string
  urgency: 'immediate' | 'within-week' | 'within-month'
  description: string
  expectedBenefit?: string
  steps?: string[]
}

export interface SchemeRecommendation {
  id: string
  name: string
  description: string
  benefits: string
  eligibility: string
  rating?: number
  reason?: string
}

export interface AdvisoryResponse {
  success: boolean
  taskId: string
  timestamp: string
  data: {
    sentinelReport: {
      agentId: string
      timestamp: string
      weatherData: WeatherData
      marketData: MarketData[]
      newsEvents: any[]
      alerts: Alert[]
    }
    analystReport: {
      agentId: string
      timestamp: string
      cropLossModels: any[]
      incomeRisks: any[]
      criticalAlerts: Alert[]
      recommendations: string[]
    }
    advisorReport: {
      agentId: string
      timestamp: string
      farmerAdvice: string
      actionPlan: ActionItem[]
      schemeRecommendations: SchemeRecommendation[]
    }
    consolidatedInsight: string
  }
}

export interface AnalysisResponse {
  success: boolean
  taskId: string
  timestamp: string
  data: any
}

// Generic request wrapper with error handling
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${API_TIMEOUT}ms`)
      }
      throw error
    }
    
    throw new Error('Unknown error occurred')
  }
}

// API Methods
export const apiClient = {
  /**
   * Get personalized advisory for a farmer
   */
  getAdvisory: async (farmer: Farmer): Promise<AdvisoryResponse> => {
    return request<AdvisoryResponse>('/advisory', {
      method: 'POST',
      body: JSON.stringify(farmer),
    })
  },

  /**
   * Get regional analysis for a district
   */
  getAnalysis: async (
    district: string,
    state: string,
    crops: string[]
  ): Promise<AnalysisResponse> => {
    return request<AnalysisResponse>('/analysis', {
      method: 'POST',
      body: JSON.stringify({ district, state, crops }),
    })
  },

  /**
   * Get crisis response
   */
  getCrisisResponse: async (
    district: string,
    state: string,
    crops: string[],
    crisisType: string
  ): Promise<any> => {
    return request('/crisis', {
      method: 'POST',
      body: JSON.stringify({ district, state, crops, crisisType }),
    })
  },

  /**
   * Get task status and result
   */
  getTaskStatus: async (taskId: string): Promise<any> => {
    return request(`/task/${taskId}`, {
      method: 'GET',
    })
  },

  /**
   * Get all agents status
   */
  getAgentsStatus: async (): Promise<any> => {
    return request('/agents/status', {
      method: 'GET',
    })
  },

  /**
   * Health check - verify backend is running
   */
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/`)
      return response.ok
    } catch {
      return false
    }
  },
}

export default apiClient
