import {
  SentinelReport,
  WeatherData,
  MarketData,
  NewsEvent,
  Alert,
  Location,
} from "../types/index.js";
import { WeatherService } from "../services/weather.service.js";
import { MarketService } from "../services/market.service.js";
import { NewsService } from "../services/news.service.js";

/**
 * SENTINEL AGENT
 * Continuously monitors live weather feeds, market price streams, and news events
 * Generates real-time alerts and updates
 *
 * Responsibilities:
 * - Real-time weather monitoring
 * - Market price tracking
 * - News aggregation and filtering
 * - Alert generation and escalation
 */
export class SentinelAgent {
  private agentId: string = "sentinel-001";
  private weatherService: WeatherService;
  private marketService: MarketService;
  private newsService: NewsService;

  constructor() {
    this.weatherService = new WeatherService();
    this.marketService = new MarketService();
    this.newsService = new NewsService();
  }

  /**
   * Generate comprehensive sentinel report
   */
  async generateReport(
    location: Location,
    crops: string[]
  ): Promise<SentinelReport> {
    try {
      // Fetch data in parallel
      const [weatherData, marketData, newsEvents] = await Promise.all([
        this.weatherService.getCurrentWeather(location),
        this.fetchMarketDataForCrops(crops, location),
        this.newsService.getRelevantNews(location, crops),
      ]);

      // Generate alerts based on collected data
      const alerts = this.generateAlerts(weatherData, marketData, newsEvents);

      return {
        agentId: this.agentId,
        timestamp: new Date(),
        weatherData,
        marketData,
        newsEvents,
        alerts,
      };
    } catch (error) {
      console.error("Error generating sentinel report:", error);
      throw error;
    }
  }

  /**
   * Fetch market data for multiple crops
   */
  private async fetchMarketDataForCrops(
    crops: string[],
    location: Location
  ): Promise<MarketData[]> {
    const marketDataPromises = crops.map((crop) =>
      this.marketService.getMarketPrices(crop, location)
    );

    const allMarketData = await Promise.all(marketDataPromises);
    return allMarketData.flat();
  }

  /**
   * Generate alerts based on current conditions
   */
  private generateAlerts(
    weather: WeatherData,
    marketData: MarketData[],
    newsEvents: NewsEvent[]
  ): Alert[] {
    const alerts: Alert[] = [];

    // Weather-based alerts
    const weatherAlerts = this.weatherService.getWeatherAlerts(weather);
    weatherAlerts.forEach((alert, index) => {
      alerts.push({
        id: `alert-${Date.now()}-${index}`,
        agentId: this.agentId,
        severity: this.getAlertSeverity(alert),
        title: "Weather Alert",
        description: alert,
        category: "weather",
        affectedCrops: [],
        affectedRegions: [],
        timestamp: new Date(),
        expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        recommendedAction: this.getWeatherRecommendation(alert),
      });
    });

    // Market-based alerts
    if (marketData.length > 0) {
      const priceAlerts = this.generatePriceAlerts(marketData);
      alerts.push(...priceAlerts);
    }

    // News-based alerts
    const highSeverityNews = this.newsService.getLatestAlerts(newsEvents);
    highSeverityNews.forEach((news) => {
      alerts.push({
        id: `alert-news-${news.id}`,
        agentId: this.agentId,
        severity: news.severity,
        title: news.title,
        description: news.content,
        category: news.category,
        affectedCrops: news.relevantCrops,
        affectedRegions: news.relevantRegions,
        timestamp: news.timestamp,
        expiryTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
        recommendedAction: this.getNewsRecommendation(news),
      });
    });

    return alerts;
  }

  /**
   * Generate price-related alerts
   */
  private generatePriceAlerts(marketData: MarketData[]): Alert[] {
    const alerts: Alert[] = [];

    marketData.forEach((market, index) => {
      if (market.trend === "down") {
        alerts.push({
          id: `alert-price-${index}`,
          agentId: this.agentId,
          severity: "medium",
          title: `${market.cropName} Price Alert`,
          description: `${market.cropName} prices are decreasing in ${market.market}. Current: ₹${market.price}`,
          category: "market",
          affectedCrops: [market.cropName],
          affectedRegions: [],
          timestamp: new Date(),
          expiryTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
          recommendedAction: "Monitor prices closely; consider selling soon",
        });
      } else if (market.trend === "up") {
        alerts.push({
          id: `alert-price-up-${index}`,
          agentId: this.agentId,
          severity: "low",
          title: `${market.cropName} Price Up`,
          description: `Good news! ${market.cropName} prices are increasing. Current: ₹${market.price}`,
          category: "market",
          affectedCrops: [market.cropName],
          affectedRegions: [],
          timestamp: new Date(),
          expiryTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
          recommendedAction: "Consider waiting a bit longer for better prices",
        });
      }
    });

    return alerts;
  }

  /**
   * Map alert text to severity level
   */
  private getAlertSeverity(
    alert: string
  ): "low" | "medium" | "high" | "critical" {
    const upperAlert = alert.toUpperCase();

    if (
      upperAlert.includes("FROST") ||
      upperAlert.includes("EXTREME") ||
      upperAlert.includes("SEVERE")
    ) {
      return "critical";
    }
    if (
      upperAlert.includes("DANGER") ||
      upperAlert.includes("RISK") ||
      upperAlert.includes("WARNING")
    ) {
      return "high";
    }
    if (
      upperAlert.includes("ADVISABLE") ||
      upperAlert.includes("MONITOR") ||
      upperAlert.includes("INCREASE")
    ) {
      return "medium";
    }

    return "low";
  }

  /**
   * Get recommended action for weather alert
   */
  private getWeatherRecommendation(alert: string): string {
    if (alert.includes("Frost")) {
      return "Use frost cloth, smudge pots, or sprinkle water on crops";
    }
    if (alert.includes("Heat")) {
      return "Increase irrigation frequency; apply mulch to retain soil moisture";
    }
    if (alert.includes("waterlogging")) {
      return "Ensure proper drainage; avoid standing water in fields";
    }
    if (alert.includes("fungal")) {
      return "Apply recommended fungicide; ensure proper ventilation in crops";
    }
    if (alert.includes("lodging")) {
      return "Reduce irrigation; stake tall crops; apply growth regulators";
    }
    return "Monitor closely and take preventive measures";
  }

  /**
   * Get recommended action for news alert
   */
  private getNewsRecommendation(news: NewsEvent): string {
    if (news.category === "pest" || news.category === "disease") {
      return "Monitor fields closely; use recommended pesticides/fungicides preventively";
    }
    if (news.category === "weather") {
      return "Prepare irrigation systems and cover crops as appropriate";
    }
    if (news.category === "market") {
      return "Review market prices; plan harvest timing accordingly";
    }
    if (news.category === "policy") {
      return "Check eligibility and apply for schemes before deadline";
    }
    return "Take appropriate action based on the alert";
  }

  /**
   * Get forecast-based alerts
   */
  async getForecalertAlerts(location: Location, crops: string[]): Promise<Alert[]> {
    try {
      const forecast = await this.weatherService.getForecast(location, 5);
      const alerts: Alert[] = [];

      forecast.forEach((weather, index) => {
        const weatherAlerts = this.weatherService.getWeatherAlerts(weather);
        weatherAlerts.forEach((alert, alertIndex) => {
          alerts.push({
            id: `forecast-alert-${index}-${alertIndex}`,
            agentId: this.agentId,
            severity: this.getAlertSeverity(alert),
            title: "Forecast Weather Alert",
            description: `${alert} on ${weather.timestamp.toDateString()}`,
            category: "weather",
            affectedCrops: crops,
            affectedRegions: [],
            timestamp: new Date(),
            expiryTime: weather.timestamp,
            recommendedAction: this.getWeatherRecommendation(alert),
          });
        });
      });

      return alerts;
    } catch (error) {
      console.error("Error generating forecast alerts:", error);
      return [];
    }
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
    return "Sentinel";
  }

  /**
   * Get agent description
   */
  getAgentDescription(): string {
    return "Monitors weather, market prices, and agricultural news in real-time to provide timely alerts";
  }
}
