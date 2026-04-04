// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  district: string;
  language: 'en' | 'hi' | 'or';
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

// Farmer Types
export interface Farmer {
  id: string;
  userId: string;
  crops: string[];
  landArea: number; // in hectares
  district: string;
  language: 'en' | 'hi' | 'or';
}

// Alert Types
export interface Alert {
  id: string;
  type: 'WEATHER_WARNING' | 'PEST_ALERT' | 'MARKET_INFO' | 'SCHEME_REMINDER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  timestamp: string;
  isRead: boolean;
}

// AgentResponse Types
export interface AgentResponse {
  status: string;
  query: string;
  agents_output: {
    sentinel: {
      hazard_signal: string;
      weather_alert: string;
      probability: number;
    };
    analyst: {
      risk_score: number;
      crop_loss_probability: number;
      income_impact: string;
    };
    advisor: {
      recommendations: string[];
    };
    policy: {
      sdg_alignment: string[];
      applicable_schemes: string[];
    };
  };
  timestamp: string;
}

// Government Scheme Types
export interface Scheme {
  id: string;
  name: string;
  description: string;
  amount: string;
  eligibility: string[];
  applicableCrops: string[];
}
