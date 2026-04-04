import {
  AdvisorReport,
  Farmer,
  ActionItem,
  ContextualGuidance,
  GovernmentScheme,
} from "../types/index.js";
import { SchemeService } from "../services/scheme.service.js";
import { WeatherService } from "../services/weather.service.js";
import { MarketService } from "../services/market.service.js";

/**
 * ADVISOR AGENT
 * Generates actionable farmer-facing guidance matched to applicable government schemes
 * Supports PMFBY, eNAM, PM-KISAN, and other schemes
 *
 * Responsibilities:
 * - Personalized farmer guidance
 * - Government scheme recommendations
 * - Action plan generation
 * - Contextual advice in farmer's language
 */
export class AdvisorAgent {
  private agentId: string = "advisor-001";
  private schemeService: SchemeService;
  private weatherService: WeatherService;
  private marketService: MarketService;

  constructor() {
    this.schemeService = new SchemeService();
    this.weatherService = new WeatherService();
    this.marketService = new MarketService();
  }

  /**
   * Generate comprehensive advisory report for a farmer
   */
  async generateReport(farmer: Farmer): Promise<AdvisorReport> {
    try {
      // Get current conditions
      const weatherData = await this.weatherService.getCurrentWeather({
        district: farmer.district,
        state: farmer.state,
        latitude: farmer.latitude,
        longitude: farmer.longitude,
      });

      // Get market conditions
      const marketData = await this.marketService.getMarketPrices(
        farmer.cropType,
        {
          district: farmer.district,
          state: farmer.state,
          latitude: farmer.latitude,
          longitude: farmer.longitude,
        }
      );

      // Get applicable schemes
      const schemes = this.schemeService.getApplicableSchemes(farmer);

      // Generate immediate and medium-term actions
      const { immediateActions, mediumTermActions } = this.generateActionPlan(
        farmer,
        weatherData,
        marketData,
        schemes
      );

      // Create contextual guidance
      const guidance: ContextualGuidance = {
        farmerProfile: farmer,
        currentConditions: weatherData,
        marketConditions: marketData,
        activeSchemes: schemes,
        immediateActions,
        mediumTermActions,
      };

      // Get scheme recommendations with reasons
      const schemeRecommendations =
        this.schemeService.getSchemeRecommendationsWithReason(farmer);
      const topSchemes = schemeRecommendations
        .slice(0, 3)
        .map((r) => r.scheme);

      // Generate custom message in farmer's language
      const customMessage = this.generateCustomMessage(
        farmer,
        weatherData,
        marketData,
        topSchemes
      );

      // Combine all immediate and medium-term actions
      const allActions = [...immediateActions, ...mediumTermActions];

      return {
        agentId: this.agentId,
        timestamp: new Date(),
        farmerGuidance: guidance,
        schemeRecommendations: topSchemes,
        actionPlan: allActions,
        customMessage,
      };
    } catch (error) {
      console.error("Error generating advisor report:", error);
      throw error;
    }
  }

  /**
   * Generate action plan based on farmer's situation
   */
  private generateActionPlan(
    farmer: Farmer,
    weather: any,
    market: any[],
    schemes: GovernmentScheme[]
  ): { immediateActions: ActionItem[]; mediumTermActions: ActionItem[] } {
    const immediateActions: ActionItem[] = [];
    const mediumTermActions: ActionItem[] = [];

    // Immediate actions based on weather
    if (weather.temperature < 0) {
      immediateActions.push({
        title: "Frost Protection",
        description: "Protect your crops from frost damage",
        urgency: "immediate",
        expectedBenefit: "Prevent crop loss from frost",
        steps: [
          "Cover sensitive crops with cloth or plastic sheeting",
          "Keep soil well-watered for heat retention",
          "Avoid pruning before frost season",
          "Apply frost-protective sprays if available",
        ],
      });
    }

    if (weather.temperature > 40) {
      immediateActions.push({
        title: "Heat Stress Management",
        description: "Reduce heat stress on crops",
        urgency: "immediate",
        expectedBenefit: "Maintain crop health during heat wave",
        steps: [
          "Increase irrigation frequency (2-3 days interval)",
          "Apply mulch to reduce soil temperature",
          "Prune excessive foliage for better ventilation",
          "Mix soil with compost for better water retention",
        ],
      });
    }

    if (weather.humidity > 85) {
      immediateActions.push({
        title: "Disease Prevention",
        description: "Prevent fungal and bacterial diseases",
        urgency: "immediate",
        expectedBenefit: "Reduce disease incidence",
        steps: [
          "Remove infected plant parts immediately",
          "Apply recommended fungicide every 10-14 days",
          "Ensure proper air circulation in fields",
          "Avoid overhead irrigation if possible",
        ],
      });
    }

    // Market-based actions
    if (market.length > 0) {
      const trend = market[0].trend;
      if (trend === "down") {
        immediateActions.push({
          title: "Market Timing Strategy",
          description: `Market prices for ${farmer.cropType} are declining`,
          urgency: "within-week",
          expectedBenefit: "Optimize selling price",
          steps: [
            "Check if early harvesting is possible",
            "Look for alternative markets through eNAM",
            "Consider value addition (processing) if feasible",
            "Wait for stabilization if you can afford to store",
          ],
          schemeRef: "enam-001",
        });
      } else if (trend === "up") {
        mediumTermActions.push({
          title: "Wait for Better Prices",
          description: `Market prices for ${farmer.cropType} are increasing`,
          urgency: "within-month",
          expectedBenefit: "Maximize income from harvest",
          steps: [
            "Ensure proper storage of already harvested produce",
            "Continue monitoring market prices",
            "Plan harvest timing for next crop cycle",
            "Use eNAM platform for best prices",
          ],
          schemeRef: "enam-001",
        });
      }
    }

    // Scheme-related actions
    const urgentSchemes = schemes.filter((s) =>
      s.id.includes("kisan") || s.id.includes("bima")
    );

    if (urgentSchemes.length > 0) {
      urgentSchemes.forEach((scheme) => {
        const daysUntilDeadline = Math.ceil(
          (scheme.applicationDeadline.getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        );

        if (daysUntilDeadline < 30 && daysUntilDeadline > 0) {
          immediateActions.push({
            title: `Apply for ${scheme.name}`,
            description: scheme.description,
            urgency: "within-week",
            schemeRef: scheme.id,
            expectedBenefit: scheme.benefits[0],
            steps: [
              `Visit ${scheme.website}`,
              "Download application form",
              "Gather required documents",
              "Submit before deadline",
              `Contact: ${scheme.contactInfo}`,
            ],
          });
        }
      });
    }

    // Soil health recommendation
    mediumTermActions.push({
      title: "Soil Health Check",
      description: "Get your soil tested and receive personalized recommendations",
      urgency: "within-month",
      schemeRef: "soilhealth-001",
      expectedBenefit: "Optimize fertilizer use and improve crop yield",
      steps: [
        "Visit nearest soil testing lab",
        "Provide soil samples from different parts of field",
        "Get soil health card with recommendations",
        "Follow nutrient recommendations for this season",
      ],
    });

    // Credit planning for next season
    mediumTermActions.push({
      title: "Plan Credit for Next Season",
      description: "Be prepared for next planting season",
      urgency: "within-month",
      schemeRef: "kisancredit-001",
      expectedBenefit: "Flexible funding for agricultural inputs",
      steps: [
        "Visit your bank branch",
        "Apply for Kisan Credit Card",
        "Get credit limit up to 4x your deposit",
        "Use for seeds, fertilizers, equipment rental",
      ],
    });

    return { immediateActions, mediumTermActions };
  }

  /**
   * Generate custom message in farmer's preferred language
   */
  private generateCustomMessage(
    farmer: Farmer,
    weather: any,
    market: any[],
    schemes: GovernmentScheme[]
  ): string {
    const messages: { [key: string]: string } = {
      en: this.generateEnglishMessage(farmer, weather, market, schemes),
      hi: this.generateHindiMessage(farmer, weather, market, schemes),
      mr: this.generateMarathiMessage(farmer, weather, market, schemes),
      ta: this.generateTamilMessage(farmer, weather, market, schemes),
      te: this.generateTeluguMessage(farmer, weather, market, schemes),
      kn: this.generateKannadaMessage(farmer, weather, market, schemes),
      ml: this.generateMalayalamMessage(farmer, weather, market, schemes),
    };

    return (
      messages[farmer.language] ||
      messages.en
    );
  }

  private generateEnglishMessage(
    farmer: Farmer,
    weather: any,
    market: any[],
    schemes: GovernmentScheme[]
  ): string {
    let message = `Hello ${farmer.name}!\n\nHere's your personalized farm advisory:\n\n`;

    message += `Weather: Temperature is ${weather.temperature}°C with ${weather.humidity}% humidity. `;

    if (weather.rainfall > 100) {
      message += `Heavy rain expected - ensure proper drainage.\n`;
    } else if (weather.rainfall < 10) {
      message += `Low rainfall expected - prepare irrigation.\n`;
    } else {
      message += `Good conditions for crop growth.\n`;
    }

    if (market.length > 0) {
      message += `\nMarket: ${farmer.cropType} prices are ₹${market[0].price}/quintal (${market[0].trend} trend).\n`;
    }

    if (schemes.length > 0) {
      message += `\nAvailable schemes for you:\n`;
      schemes.slice(0, 3).forEach((scheme) => {
        message += `• ${scheme.name} - ${scheme.description.substring(0, 50)}...\n`;
      });
    }

    message += `\nFor more details, check your dashboard.\n\nStay safe and prosper! 🌾`;

    return message;
  }

  private generateHindiMessage(
    farmer: Farmer,
    weather: any,
    market: any[],
    schemes: GovernmentScheme[]
  ): string {
    let message = `नमस्ते ${farmer.name}!\n\nआपके खेत के लिए सलाह:\n\n`;

    message += `मौसम: तापमान ${weather.temperature}°C है और नमी ${weather.humidity}% है। `;

    if (weather.rainfall > 100) {
      message += `भारी बारिश की संभावना है - सही ड्रेनेज सुनिश्चित करें।\n`;
    } else {
      message += `फसल की अच्छी बढ़ोतरी के लिए अनुकूल परिस्थितियां हैं।\n`;
    }

    message += `\nआपके लिए उपलब्ध योजनाएं:\n`;
    if (schemes.length > 0) {
      schemes.slice(0, 3).forEach((scheme) => {
        message += `• ${scheme.name}\n`;
      });
    }

    message += `\nअधिक जानकारी के लिए अपने डैशबोर्ड को देखें।\n\nसुरक्षित रहें और समृद्ध हों! 🌾`;

    return message;
  }

  private generateMarathiMessage(
    farmer: Farmer,
    weather: any,
    market: any[],
    schemes: GovernmentScheme[]
  ): string {
    let message = `नमस्कार ${farmer.name}!\n\nआपल्या शेतीसाठी सल्ला:\n\n`;

    message += `हवामान: तापमान ${weather.temperature}°C आहे. `;

    if (weather.rainfall > 100) {
      message += `जोरदार पाऊस येऊ शकतो - योग्य निधारण सुनिश्चित करा।\n`;
    } else {
      message += `फसलींच्या वाढीसाठी अनुकूल परिस्थितीं आहेत।\n`;
    }

    message += `\nआपल्यासाठी उपलब्ध योजना:\n`;
    if (schemes.length > 0) {
      schemes.slice(0, 3).forEach((scheme) => {
        message += `• ${scheme.name}\n`;
      });
    }

    message += `\nअधिक माहितीसाठी आपले डॅशबोर्ड पहा।\n\nसुरक्षित रहा आणि समृद्ध व्हा! 🌾`;

    return message;
  }

  private generateTamilMessage(
    farmer: Farmer,
    weather: any,
    market: any[],
    schemes: GovernmentScheme[]
  ): string {
    return `வணக்கம் ${farmer.name}!\n\nআपल्या शेतीसाठी सल्ला:\n\nదిक్కులో జోరుగా పంటలు పెరుగుతున్నాయి. అందుకే చేసిన దిద్దుబాటులను కూడా జరుపుకోండి.\n\nభద్రంగా ఉండండి!\n🌾`;
  }

  private generateTeluguMessage(
    farmer: Farmer,
    weather: any,
    market: any[],
    schemes: GovernmentScheme[]
  ): string {
    return `హలో ${farmer.name}!\n\nআপনার কৃষির সাথে খুব ভাল চলছে। আরও ভাল ফলাফলের জন্য এই পরামর্शগুলি অনুসরণ করুন।\n\nনিরাপদ থাকুন!\n🌾`;
  }

  private generateKannadaMessage(
    farmer: Farmer,
    weather: any,
    market: any[],
    schemes: GovernmentScheme[]
  ): string {
    return `ನಮಸ್ಕಾರ ${farmer.name}!\n\nআপনার শস্যের উন্নতি হচ্ছে। এই পরামর্শগুলি অনুসরণ করুন আরও ভাল ফলাফলের জন্য।\n\nসুরক্ষিত থাকুন!\n🌾`;
  }

  private generateMalayalamMessage(
    farmer: Farmer,
    weather: any,
    market: any[],
    schemes: GovernmentScheme[]
  ): string {
    return `നമസ്കാരം ${farmer.name}!\n\nআপনার ফসল ভাল হচ্ছে। এই টিপসগুলি অনুসরণ করে আরও লাভ করুন।\n\nসুরক্ষিত থাকুন!\n🌾`;
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
    return "Advisor";
  }

  /**
   * Get agent description
   */
  getAgentDescription(): string {
    return "Generates personalized farmer guidance matched to government schemes and actionable advice";
  }
}
