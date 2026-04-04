// Core System Types
export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  state: string;
  cropType: string;
  farmSize: number; // in hectares
  latitude: number;
  longitude: number;
  language: "en" | "hi" | "mr" | "ta" | "te" | "kn" | "ml";
}

export interface Location {
  district: string;
  state: string;
  latitude: number;
  longitude: number;
}

// Sentinel Agent Types
export interface WeatherData {
  timestamp: Date;
  temperature: number; // Celsius
  humidity: number; // Percentage
  rainfall: number; // mm
  windSpeed: number; // km/h
  uvIndex: number;
  soilMoisture: number; // Percentage
  location: Location;
}

export interface MarketData {
  cropName: string;
  price: number; // INR per quintal
  trend: "up" | "down" | "stable";
  volume: number; // quintals traded
  timestamp: Date;
  market: string; // eNAM market name
  location: Location;
}

export interface NewsEvent {
  id: string;
  title: string;
  content: string;
  category: "weather" | "market" | "policy" | "pest" | "disease";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  relevantCrops: string[];
  relevantRegions: string[];
}

export interface SentinelReport {
  agentId: string;
  timestamp: Date;
  weatherData: WeatherData;
  marketData: MarketData[];
  newsEvents: NewsEvent[];
  alerts: Alert[];
}

// Analyst Agent Types
export interface CropLossModel {
  cropType: string;
  factors: {
    weather: number; // 0-100 risk score
    pest: number;
    disease: number;
    market: number;
    soil: number;
  };
  overallRisk: number; // 0-100
  confidence: number; // 0-100
}

export interface IncomeRisk {
  cropType: string;
  projectedIncome: number; // INR
  minIncome: number; // 10th percentile
  maxIncome: number; // 90th percentile
  volatility: number; // Coefficient of variation
  riskScore: number; // 0-100
}

export interface AnalystReport {
  agentId: string;
  timestamp: Date;
  district: string;
  cropLossModels: CropLossModel[];
  incomeRisks: IncomeRisk[];
  criticalAlerts: Alert[];
  recommendations: string[];
}

// Advisor Agent Types
export interface GovernmentScheme {
  id: string;
  name: string;
  fullName: string;
  description: string;
  ministries: string[];
  eligibility: string[];
  benefits: string[];
  applicationDeadline: Date;
  contactInfo: string;
  website: string;
  applicableCrops: string[];
  applicableStates: string[];
}

export interface ContextualGuidance {
  farmerProfile: Farmer;
  currentConditions: WeatherData;
  marketConditions: MarketData[];
  activeSchemes: GovernmentScheme[];
  immediateActions: ActionItem[];
  mediumTermActions: ActionItem[];
}

export interface ActionItem {
  title: string;
  description: string;
  urgency: "immediate" | "within-week" | "within-month";
  schemeRef?: string; // Reference to applicable government scheme
  expectedBenefit: string;
  steps: string[];
}

export interface AdvisorReport {
  agentId: string;
  timestamp: Date;
  farmerGuidance: ContextualGuidance;
  schemeRecommendations: GovernmentScheme[];
  actionPlan: ActionItem[];
  customMessage: string; // In farmer's preferred language
}

// Policy Agent Types
export interface SDGMapping {
  target: string; // e.g., "SDG 1.1", "SDG 2.3"
  description: string;
  contribution: string;
  metrics: string[];
}

export interface GovernanceOutcome {
  interventionType: string;
  affectedFarmers: number;
  estimatedImpact: {
    incomeImprovement: number; // Percentage
    riskReduction: number; // Percentage
    sdgContribution: SDGMapping[];
  };
}

export interface PolicyBrief {
  agentId: string;
  timestamp: Date;
  title: string;
  summary: string;
  governanceOutcome: GovernanceOutcome;
  sdgMappings: SDGMapping[];
  recommendations: PolicyRecommendation[];
  confidenceLevel: number; // 0-100
}

export interface PolicyRecommendation {
  title: string;
  description: string;
  targetAudience: "takshashila-institution" | "state-govt" | "district-admin" | "ngos";
  priority: "high" | "medium" | "low";
  estimatedImpact: string;
}

// Orchestrator Agent Types
export interface AgentResponse {
  agentId: string;
  agentName: string;
  timestamp: Date;
  status: "success" | "failed" | "processing" | "warning";
  data: unknown;
  error?: string;
}

export interface OrchestrationTask {
  taskId: string;
  type: "analysis" | "advisory" | "policy-brief" | "alert-response";
  farmer?: Farmer;
  location?: Location;
  triggerEvent?: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  createdAt: Date;
  completedAt?: Date;
}

export interface OrchestrationResult {
  orchestratorId?: string;
  taskId: string;
  timestamp: Date;
  agentResponses: AgentResponse[];
  consolidatedInsight: string;
  actionItems?: ActionItem[];
  stakeholderBriefs: {
    farmer: string;
    policymaker: string;
    ngo: string;
  };
}

// Alert Types
export interface Alert {
  id: string;
  agentId: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  category: "weather" | "pest" | "disease" | "market" | "policy";
  affectedCrops: string[];
  affectedRegions: string[];
  timestamp: Date;
  expiryTime: Date;
  recommendedAction: string;
}

// API Request/Response Types
export interface AnalysisRequest {
  farmerId?: string;
  location: Location;
  cropType: string;
  farmSize: number;
  urgentOnly?: boolean;
}

export interface AdvisoryRequest {
  farmer: Farmer;
  urgencyLevel: "routine" | "moderate" | "urgent";
  specificConcerns?: string[];
}

export interface PolicyBriefRequest {
  district: string;
  state: string;
  timeframe: "immediate" | "short-term" | "medium-term";
  focusAreas?: string[];
}

// Configuration
export interface KisanboodhiConfig {
  apiEndpoints: {
    weather: string;
    enam: string;
    newsFeed: string;
    policyDB: string;
  };
  models: {
    cropLossModel: string; // Model identifier
    incomeRiskModel: string;
  };
  schemes: GovernmentScheme[];
  updateIntervals: {
    weather: number; // milliseconds
    market: number;
    news: number;
  };
}
