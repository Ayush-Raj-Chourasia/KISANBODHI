import { MarketData, Location } from "../types/index.js";

/**
 * Market Service
 * Fetches market prices from eNAM and other agricultural markets
 * Analyzes price trends for advisory
 */
export class MarketService {
  private apiEndpoint: string;

  constructor() {
    this.apiEndpoint = "https://api.enam.gov.in"; // eNAM API endpoint
  }

  /**
   * Get current market prices for a crop
   */
  async getMarketPrices(
    cropName: string,
    location: Location
  ): Promise<MarketData[]> {
    try {
      // Mock implementation - in production, integrate with actual eNAM API
      const prices = await this.fetchFromENAM(cropName, location);
      return prices;
    } catch (error) {
      console.error("Error fetching market prices:", error);
      return this.getMockMarketData(cropName, location);
    }
  }

  /**
   * Fetch from eNAM API
   */
  private async fetchFromENAM(
    cropName: string,
    location: Location
  ): Promise<MarketData[]> {
    const response = await fetch(`${this.apiEndpoint}/api/prices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commodity: cropName,
        state: location.state,
        district: location.district,
        market: `${location.district}_Market`,
      }),
    });

    if (!response.ok) {
      throw new Error(`eNAM API error: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return this.formatMarketData(data.records, cropName, location);
  }

  /**
   * Format market data from API response
   */
  private formatMarketData(
    records: any[],
    cropName: string,
    location: Location
  ): MarketData[] {
    return records.map((record) => ({
      cropName,
      price: parseFloat(record.price),
      trend: this.calculateTrend(record),
      volume: parseInt(record.quantity) || 0,
      timestamp: new Date(record.date),
      market: record.market_name || `${location.district} APMC`,
      location,
    }));
  }

  /**
   * Calculate price trend
   */
  private calculateTrend(record: any): "up" | "down" | "stable" {
    const change = record.price_change_percent || 0;
    if (change > 2) return "up";
    if (change < -2) return "down";
    return "stable";
  }

  /**
   * Get mock market data (for testing/demo)
   */
  private getMockMarketData(cropName: string, location: Location): MarketData[] {
    const basePrice = this.getBasePrice(cropName);
    const variation = Math.random() * 500 - 250; // -250 to +250

    return [
      {
        cropName,
        price: basePrice + variation,
        trend: Math.random() > 0.5 ? "up" : "down",
        volume: Math.floor(Math.random() * 5000) + 1000,
        timestamp: new Date(),
        market: `${location.district} APMC`,
        location,
      },
      {
        cropName,
        price: basePrice + variation - 100,
        trend: "stable",
        volume: Math.floor(Math.random() * 3000) + 500,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        market: `${location.state} Wholesale`,
        location,
      },
    ];
  }

  /**
   * Get base price for a crop (reference data)
   */
  private getBasePrice(cropName: string): number {
    const prices: { [key: string]: number } = {
      wheat: 2500,
      rice: 2800,
      maize: 1800,
      cotton: 5200,
      sugarcane: 350, // per 100kg
      soybean: 4500,
      groundnut: 5000,
      pulses: 6000,
      onion: 2000,
      potato: 1500,
    };
    return prices[cropName.toLowerCase()] || 3000;
  }

  /**
   * Analyze price trend over time
   */
  async analyzePriceTrend(
    cropName: string,
    location: Location,
    days: number = 30
  ): Promise<{
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    volatility: number;
    trend: string;
  }> {
    const prices = await this.getMarketPrices(cropName, location);

    if (prices.length === 0) {
      return {
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        volatility: 0,
        trend: "unknown",
      };
    }

    const priceValues = prices.map((p) => p.price);
    const avgPrice = priceValues.reduce((a, b) => a + b) / priceValues.length;
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);

    // Calculate volatility (coefficient of variation)
    const variance =
      priceValues.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) /
      priceValues.length;
    const stdDev = Math.sqrt(variance);
    const volatility = (stdDev / avgPrice) * 100;

    // Determine trend
    let trend = "stable";
    if (prices.length > 1) {
      const currentPrice = prices[0].price;
      const prevPrice = prices[prices.length - 1].price;
      const changePercent = ((currentPrice - prevPrice) / prevPrice) * 100;

      if (changePercent > 3) trend = "increasing";
      else if (changePercent < -3) trend = "decreasing";
    }

    return {
      avgPrice: parseFloat(avgPrice.toFixed(2)),
      minPrice,
      maxPrice,
      volatility: parseFloat(volatility.toFixed(2)),
      trend,
    };
  }

  /**
   * Get price comparison across markets
   */
  async getPriceComparison(
    cropName: string,
    location: Location
  ): Promise<
    Array<{
      market: string;
      price: number;
      volume: number;
    }>
  > {
    const prices = await this.getMarketPrices(cropName, location);

    return prices.map((p) => ({
      market: p.market,
      price: p.price,
      volume: p.volume,
    }));
  }

  /**
   * Recommend best time to sell based on price trends
   */
  async getSellingRecommendation(
    cropName: string,
    location: Location
  ): Promise<string> {
    const analysis = await this.analyzePriceTrend(cropName, location);

    if (analysis.trend === "increasing") {
      return "Wait 1-2 weeks as prices are trending upward";
    } else if (analysis.trend === "decreasing") {
      return "Sell now if possible, prices are declining";
    } else {
      return "Market is stable; sell when convenient";
    }
  }
}
