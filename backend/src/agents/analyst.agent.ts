import {
  AnalystReport,
  CropLossModel,
  IncomeRisk,
  Alert,
  Location,
} from "../types/index.js";
import { WeatherService } from "../services/weather.service.js";
import { MarketService } from "../services/market.service.js";

/**
 * ANALYST AGENT
 * Performs crop-loss probability modelling and income-risk scoring at the district level
 * Provides data-driven risk assessments
 *
 * Responsibilities:
 * - Crop loss probability modeling
 * - Income risk assessment
 * - Risk factor analysis
 * - District-level trend analysis
 */
export class AnalystAgent {
  private agentId: string = "analyst-001";
  private weatherService: WeatherService;
  private marketService: MarketService;

  constructor() {
    this.weatherService = new WeatherService();
    this.marketService = new MarketService();
  }

  /**
   * Generate comprehensive analyst report for a district
   */
  async generateReport(
    district: string,
    state: string,
    crops: string[]
  ): Promise<AnalystReport> {
    try {
      const location: Location = {
        district,
        state,
        latitude: 0, // Would be set based on district geo data
        longitude: 0,
      };

      // Generate crop loss models
      const cropLossModels = await this.generateCropLossModels(location, crops);

      // Generate income risk assessments
      const incomeRisks = await this.generateIncomeRisks(location, crops);

      // Identify critical alerts
      const criticalAlerts = this.identifyCriticalAlerts(
        cropLossModels,
        incomeRisks
      );

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        cropLossModels,
        incomeRisks,
        crops
      );

      return {
        agentId: this.agentId,
        timestamp: new Date(),
        district,
        cropLossModels,
        incomeRisks,
        criticalAlerts,
        recommendations,
      };
    } catch (error) {
      console.error("Error generating analyst report:", error);
      throw error;
    }
  }

  /**
   * Generate crop loss probability models for each crop
   */
  private async generateCropLossModels(
    location: Location,
    crops: string[]
  ): Promise<CropLossModel[]> {
    const models: CropLossModel[] = [];

    for (const crop of crops) {
      const weather = await this.weatherService.getCurrentWeather(location);

      // Calculate risk factors based on weather
      const weatherRisk = this.calculateWeatherRisk(weather, crop);
      const pestRisk = this.calculatePestRisk(crop, location);
      const diseaseRisk = this.calculateDiseaseRisk(crop, weather);
      const marketRisk = await this.calculateMarketRisk(crop, location);
      const soilRisk = this.calculateSoilRisk(weather, crop);

      // Calculate overall risk (weighted average)
      const weights = {
        weather: 0.25,
        pest: 0.2,
        disease: 0.2,
        market: 0.2,
        soil: 0.15,
      };

      const overallRisk =
        weatherRisk * weights.weather +
        pestRisk * weights.pest +
        diseaseRisk * weights.disease +
        marketRisk * weights.market +
        soilRisk * weights.soil;

      const model: CropLossModel = {
        cropType: crop,
        factors: {
          weather: weatherRisk,
          pest: pestRisk,
          disease: diseaseRisk,
          market: marketRisk,
          soil: soilRisk,
        },
        overallRisk: Math.round(overallRisk),
        confidence: this.calculateModelConfidence(crop),
      };

      models.push(model);
    }

    return models;
  }

  /**
   * Generate income risk assessments
   */
  private async generateIncomeRisks(
    location: Location,
    crops: string[]
  ): Promise<IncomeRisk[]> {
    const risks: IncomeRisk[] = [];

    for (const crop of crops) {
      // Get historical market data and volatility
      const priceAnalysis = await this.marketService.analyzePriceTrend(
        crop,
        location,
        30
      );

      // Assume average yield per hectare (can be refined)
      const avgYield = this.getAverageYield(crop); // quintals per hectare
      const avgPrice = priceAnalysis.avgPrice;

      // Calculate projected income (assuming 1 hectare farm)
      const projectedIncome = avgYield * avgPrice;

      // Calculate min/max based on volatility
      const volatilityFactor = 1 + priceAnalysis.volatility / 100;
      const minIncome = projectedIncome / volatilityFactor;
      const maxIncome = projectedIncome * volatilityFactor;

      // Risk score based on coefficient of variation
      const riskScore = Math.min(100, priceAnalysis.volatility * 2);

      risks.push({
        cropType: crop,
        projectedIncome: Math.round(projectedIncome),
        minIncome: Math.round(minIncome),
        maxIncome: Math.round(maxIncome),
        volatility: priceAnalysis.volatility,
        riskScore: Math.round(riskScore),
      });
    }

    return risks;
  }

  /**
   * Calculate weather-related risk
   */
  private calculateWeatherRisk(weather: any, crop: string): number {
    let risk = 0;

    // Temperature risk
    const tempThresholds: { [key: string]: { min: number; max: number } } = {
      wheat: { min: 5, max: 25 },
      rice: { min: 15, max: 35 },
      maize: { min: 10, max: 30 },
      cotton: { min: 15, max: 35 },
      sugarcane: { min: 15, max: 40 },
    };

    const thresholds = tempThresholds[crop.toLowerCase()] || { min: 10, max: 30 };

    if (
      weather.temperature < thresholds.min ||
      weather.temperature > thresholds.max
    ) {
      risk += 20;
    }

    // Rainfall risk
    if (weather.rainfall > 150 || weather.rainfall < 5) {
      risk += 25;
    }

    // Wind risk
    if (weather.windSpeed > 40) {
      risk += 15;
    }

    // Soil moisture risk
    if (weather.soilMoisture < 20 || weather.soilMoisture > 80) {
      risk += 20;
    }

    // UV index risk
    if (weather.uvIndex > 8) {
      risk += 10;
    }

    return Math.min(100, risk);
  }

  /**
   * Calculate pest-related risk
   */
  private calculatePestRisk(crop: string, location: Location): number {
    // Pest risk varies by crop, location, and season
    const pestRisks: { [key: string]: number } = {
      wheat: 25,
      rice: 30,
      maize: 35,
      cotton: 40, // Cotton highly susceptible
      sugarcane: 20,
      soybean: 28,
    };

    let baseRisk = pestRisks[crop.toLowerCase()] || 25;

    // High humidity increases pest risk
    // This would use real-time weather data
    const seasonalFactor = this.getSeasonalFactor(crop);
    baseRisk = baseRisk * seasonalFactor;

    // Regional factors (simplified)
    const locationSeed = location.latitude + location.longitude;
    const regionFactor = 0.8 + (Math.sin(locationSeed) * 0.4);
    baseRisk = baseRisk * regionFactor;

    return Math.min(100, baseRisk);
  }

  /**
   * Calculate disease-related risk
   */
  private calculateDiseaseRisk(crop: string, weather: any): number {
    let risk = 0;

    // Disease risk increases with humidity and moderate temperature
    if (weather.humidity > 85 && weather.temperature > 15 && weather.temperature < 25) {
      risk = 40;
    } else if (weather.humidity > 75) {
      risk = 25;
    } else {
      risk = 10;
    }

    // Crop-specific disease susceptibility
    const diseaseFactors: { [key: string]: number } = {
      rice: 1.2, // Rice more susceptible
      wheat: 0.9,
      maize: 1.0,
      potato: 1.3, // Potatoes susceptible to blight
      sugarcane: 0.8,
    };

    const factor = diseaseFactors[crop.toLowerCase()] || 1.0;
    risk = risk * factor;

    return Math.min(100, risk);
  }

  /**
   * Calculate market-related risk
   */
  private async calculateMarketRisk(
    crop: string,
    location: Location
  ): Promise<number> {
    try {
      const analysis = await this.marketService.analyzePriceTrend(
        crop,
        location,
        30
      );

      // Volatility is the main market risk indicator
      // High volatility = high risk
      const volatilityRisk = Math.min(100, analysis.volatility * 1.5);

      return volatilityRisk;
    } catch {
      return 30; // Default medium risk
    }
  }

  /**
   * Calculate soil-related risk
   */
  private calculateSoilRisk(weather: any, crop: string): number {
    let risk = 0;

    // Soil moisture optimization risk
    if (weather.soilMoisture < 30) {
      risk += 20; // Drought risk
    } else if (weather.soilMoisture > 75) {
      risk += 15; // Waterlogging risk
    }

    // Soil nutrient depletion risk (generic)
    const nutrientRisk: { [key: string]: number } = {
      rice: 25, // High nutrient demand
      wheat: 20,
      maize: 28,
      cotton: 30,
      sugarcane: 35,
    };

    risk += nutrientRisk[crop.toLowerCase()] || 15;

    return Math.min(100, risk);
  }

  /**
   * Identify critical alerts from models
   */
  private identifyCriticalAlerts(
    models: CropLossModel[],
    incomeRisks: IncomeRisk[]
  ): Alert[] {
    const alerts: Alert[] = [];

    // Flag crops with high loss probability
    models.forEach((model) => {
      if (model.overallRisk > 70) {
        alerts.push({
          id: `analyst-alert-${model.cropType}`,
          agentId: this.agentId,
          severity: model.overallRisk > 85 ? "critical" : "high",
          title: `High Risk for ${model.cropType}`,
          description: `Crop loss probability is ${model.overallRisk}%. Primary risk factors: ${this.getRiskFactors(model)}`,
          category: "policy",
          affectedCrops: [model.cropType],
          affectedRegions: [],
          timestamp: new Date(),
          expiryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          recommendedAction: `Implement risk mitigation strategies for ${model.cropType}`,
        });
      }
    });

    // Flag crops with high income volatility
    incomeRisks.forEach((risk) => {
      if (risk.riskScore > 60) {
        alerts.push({
          id: `analyst-income-alert-${risk.cropType}`,
          agentId: this.agentId,
          severity: "medium",
          title: `Income Instability for ${risk.cropType}`,
          description: `Income volatility is ${risk.volatility.toFixed(1)}% with projected income ₹${risk.projectedIncome}`,
          category: "market",
          affectedCrops: [risk.cropType],
          affectedRegions: [],
          timestamp: new Date(),
          expiryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          recommendedAction: "Consider diversification or crop insurance",
        });
      }
    });

    return alerts;
  }

  /**
   * Get primary risk factors for a crop
   */
  private getRiskFactors(model: CropLossModel): string {
    const factors = model.factors;
    const sorted = Object.entries(factors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    return sorted.map(([key, value]) => `${key}: ${value}%`).join(", ");
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(
    models: CropLossModel[],
    incomeRisks: IncomeRisk[],
    crops: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Weather-related recommendations
    const highWeatherRiskCrops = models.filter((m) => m.factors.weather > 60);
    if (highWeatherRiskCrops.length > 0) {
      recommendations.push(
        `Weather risk is high for ${highWeatherRiskCrops.map((m) => m.cropType).join(", ")}. Strengthen irrigation systems and implement drainage.`
      );
    }

    // Pest/Disease recommendations
    const highDiseaseRiskCrops = models.filter(
      (m) => m.factors.disease > 50 || m.factors.pest > 50
    );
    if (highDiseaseRiskCrops.length > 0) {
      recommendations.push(
        `Pest and disease pressure is high. Schedule field scouting and have pesticides ready for ${highDiseaseRiskCrops.map((m) => m.cropType).join(", ")}.`
      );
    }

    // Market-related recommendations
    const highMarketRiskCrops = models.filter((m) => m.factors.market > 60);
    if (highMarketRiskCrops.length > 0) {
      recommendations.push(
        `Market prices are volatile for ${highMarketRiskCrops.map((m) => m.cropType).join(", ")}. Consider forward contracts or crop insurance.`
      );
    }

    // Income diversification
    const highIncomeRisks = incomeRisks.filter((r) => r.riskScore > 60);
    if (highIncomeRisks.length === crops.length) {
      recommendations.push(
        "All crops show high income volatility. Consider crop diversification strategy."
      );
    }

    // Insurance recommendations
    const highOverallRiskCrops = models.filter((m) => m.overallRisk > 70);
    if (highOverallRiskCrops.length > 0) {
      recommendations.push(
        `Apply for PMFBY crop insurance for ${highOverallRiskCrops.map((m) => m.cropType).join(", ")} to protect against losses.`
      );
    }

    return recommendations.length > 0
      ? recommendations
      : [
          "Current risk levels are manageable. Continue regular monitoring and practice preventive measures.",
        ];
  }

  /**
   * Get average yield for a crop (quintals per hectare)
   */
  private getAverageYield(crop: string): number {
    const yields: { [key: string]: number } = {
      wheat: 50,
      rice: 55,
      maize: 60,
      cotton: 25,
      sugarcane: 800, // in kg, higher base
      soybean: 20,
      groundnut: 20,
      pulses: 20,
    };

    return (yields[crop.toLowerCase()] || 40) / 100; // Convert to quintals
  }

  /**
   * Get seasonal factor for pest risk
   */
  private getSeasonalFactor(crop: string): number {
    const month = new Date().getMonth();

    // Simplified seasonality (would be location-specific)
    if (month >= 5 && month <= 9) {
      // Monsoon season - higher pest pressure
      return 1.3;
    } else if (month >= 1 && month <= 3) {
      // Winter - lower pressure for most crops
      return 0.8;
    }

    return 1.0;
  }

  /**
   * Calculate model confidence
   */
  private calculateModelConfidence(crop: string): number {
    // Confidence increases with more historical data
    // For now, use a base confidence
    const cropConfidence: { [key: string]: number } = {
      wheat: 85,
      rice: 85,
      maize: 80,
      cotton: 75,
      sugarcane: 70,
    };

    return cropConfidence[crop.toLowerCase()] || 70;
  }

  /**
   * Get agent ID
   */
  getAgentId(): string {
    return this.agentId;
  }

  /**
   * Get agent name
   */
  getAgentName(): string {
    return "Analyst";
  }

  /**
   * Get agent description
   */
  getAgentDescription(): string {
    return "Analyzes crop loss probability and income risks using data-driven models";
  }
}
