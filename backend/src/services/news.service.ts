import { NewsEvent, Location } from "../types/index.js";

/**
 * News Service
 * Fetches agricultural news and alerts from various sources
 * Processes and categorizes news for farming communities
 */
export class NewsService {
  private serperApiKey: string;

  constructor() {
    this.serperApiKey = process.env.NEWS_API_KEY || "";
  }

  /**
   * Fetch relevant news events for a location and crops
   */
  async getRelevantNews(
    location: Location,
    crops: string[],
    limit: number = 10
  ): Promise<NewsEvent[]> {
    try {
      if (this.serperApiKey) {
        const realNews = await this.fetchFromSerper(crops, location);
        if (realNews.length > 0) return realNews.slice(0, limit);
      }
      console.warn("No NEWS_API_KEY or Serper returned empty. Using mock news.");
      return this.getMockNews(crops, location).slice(0, limit);
    } catch (error) {
      console.error("Error fetching news:", error);
      return this.getMockNews(crops, location).slice(0, limit);
    }
  }

  /**
   * Fetch news via Serper.dev Google Search API
   */
  private async fetchFromSerper(
    crops: string[],
    location: Location
  ): Promise<NewsEvent[]> {
    const query = `${location.state} ${location.district} agriculture ${crops.slice(0, 2).join(" ")} farming news India`;
    
    try {
      const response = await fetch("https://google.serper.dev/news", {
        method: "POST",
        headers: {
          "X-API-KEY": this.serperApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query, gl: "in", num: 10 }),
      });

      if (!response.ok) {
        console.warn(`Serper API error: ${response.status}`);
        return [];
      }

      const data = await response.json() as any;
      const articles = data.news || [];

      return articles.map((article: any, idx: number) => ({
        id: `serper-${idx}-${Date.now()}`,
        title: article.title || "Agricultural News",
        content: article.snippet || article.title || "",
        category: this.categorizeNews({ title: article.title, content: article.snippet || "" }),
        severity: this.calculateSeverity({ title: article.title, content: article.snippet || "" }),
        timestamp: new Date(article.date || Date.now()),
        relevantCrops: this.extractRelevantCrops({ title: article.title, content: article.snippet || "" }, crops),
        relevantRegions: [location.state, location.district],
      }));
    } catch (error) {
      console.error("Serper API error:", error);
      return [];
    }
  }

  /**
   * Format news data to NewsEvent
   */
  private formatNewsData(
    data: any[],
    crops: string[],
    location: Location
  ): NewsEvent[] {
    return data.map((item) => ({
      id: item.id || Math.random().toString(36).substr(2, 9),
      title: item.title,
      content: item.content || item.description,
      category: this.categorizeNews(item),
      severity: this.calculateSeverity(item),
      timestamp: new Date(item.date || Date.now()),
      relevantCrops: this.extractRelevantCrops(item, crops),
      relevantRegions: [location.state, location.district],
    }));
  }

  /**
   * Categorize news based on keywords
   */
  private categorizeNews(
    item: any
  ): "weather" | "market" | "policy" | "pest" | "disease" {
    const text = (item.title + " " + item.content).toLowerCase();

    if (
      text.includes("weather") ||
      text.includes("rain") ||
      text.includes("flood") ||
      text.includes("drought")
    ) {
      return "weather";
    }
    if (text.includes("price") || text.includes("market") || text.includes("enam")) {
      return "market";
    }
    if (
      text.includes("scheme") ||
      text.includes("subsidy") ||
      text.includes("government") ||
      text.includes("policy")
    ) {
      return "policy";
    }
    if (
      text.includes("pest") ||
      text.includes("insect") ||
      text.includes("infestation")
    ) {
      return "pest";
    }
    if (
      text.includes("disease") ||
      text.includes("virus") ||
      text.includes("blight") ||
      text.includes("rot")
    ) {
      return "disease";
    }

    return "policy"; // Default category
  }

  /**
   * Calculate severity based on keywords
   */
  private calculateSeverity(
    item: any
  ): "low" | "medium" | "high" | "critical" {
    const text = (item.title + " " + item.content).toLowerCase();

    if (
      text.includes("critical") ||
      text.includes("emergency") ||
      text.includes("alert")
    ) {
      return "critical";
    }
    if (
      text.includes("warning") ||
      text.includes("severe") ||
      text.includes("outbreak")
    ) {
      return "high";
    }
    if (text.includes("advisable") || text.includes("possible")) {
      return "medium";
    }

    return "low";
  }

  /**
   * Extract relevant crops from news
   */
  private extractRelevantCrops(item: any, availableCrops: string[]): string[] {
    const text = (item.title + " " + item.content).toLowerCase();
    return availableCrops.filter((crop) => text.includes(crop.toLowerCase()));
  }

  /**
   * Get mock news data (for testing)
   */
  private getMockNews(crops: string[], location: Location): NewsEvent[] {
    const mockNews: NewsEvent[] = [
      {
        id: "news-001",
        title: "Monsoon Early Arrival Alert",
        content: `Early monsoon expected in ${location.state} starting next week. Prepare drainage systems and cover sensitive crops.`,
        category: "weather",
        severity: "high",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        relevantCrops: crops,
        relevantRegions: [location.state],
      },
      {
        id: "news-002",
        title: "PM-KISAN Payment Approved",
        content: `Latest installment of PM-KISAN has been processed. Check your account for credit within 24 hours.`,
        category: "policy",
        severity: "medium",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        relevantCrops: crops,
        relevantRegions: [location.state],
      },
      {
        id: "news-003",
        title: "Armyworm Outbreak Warning",
        content: `Armyworm detected in neighboring districts. Farmers advised to monitor fields and use recommended pesticides.`,
        category: "pest",
        severity: "high",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        relevantCrops: ["maize", "rice", "sugarcane"],
        relevantRegions: [location.district, `${location.state} Region`],
      },
      {
        id: "news-004",
        title: "Wheat Prices Increase",
        content: `Wheat prices on eNAM increased by 3% this week due to increased demand.`,
        category: "market",
        severity: "low",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        relevantCrops: ["wheat"],
        relevantRegions: [location.state],
      },
      {
        id: "news-005",
        title: "Soil Health Card Distribution",
        content: `Free soil testing and health card distribution drive starting next month in ${location.district}.`,
        category: "policy",
        severity: "low",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        relevantCrops: crops,
        relevantRegions: [location.district],
      },
    ];

    return mockNews;
  }

  /**
   * Filter news by severity
   */
  filterNewsBySeverity(
    news: NewsEvent[],
    minSeverity: "low" | "medium" | "high" | "critical"
  ): NewsEvent[] {
    const severityLevels = { low: 0, medium: 1, high: 2, critical: 3 };
    return news.filter(
      (n) => severityLevels[n.severity] >= severityLevels[minSeverity]
    );
  }

  /**
   * Filter news by category
   */
  filterNewsByCategory(
    news: NewsEvent[],
    category: "weather" | "market" | "policy" | "pest" | "disease"
  ): NewsEvent[] {
    return news.filter((n) => n.category === category);
  }

  /**
   * Get latest alerts
   */
  getLatestAlerts(news: NewsEvent[], hours: number = 48): NewsEvent[] {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    return news
      .filter((n) => n.timestamp.getTime() > cutoffTime)
      .sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
  }
}
