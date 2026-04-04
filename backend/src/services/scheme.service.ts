import { GovernmentScheme, Farmer } from "../types/index.js";

/**
 * Scheme Service
 * Manages government agricultural schemes and benefits
 * Matches farmers to applicable schemes based on eligibility
 */
export class SchemeService {
  private schemes: GovernmentScheme[] = [];

  constructor() {
    this.initializeSchemes();
  }

  /**
   * Initialize with major government schemes
   */
  private initializeSchemes(): void {
    this.schemes = [
      {
        id: "pmfby-001",
        name: "PMFBY",
        fullName: "Pradhan Mantri Fasal Bima Yojana",
        description:
          "Crop insurance scheme providing comprehensive coverage against crop loss due to natural calamities, pests, and diseases.",
        ministries: ["Ministry of Agriculture"],
        eligibility: [
          "All farmers (marginal, small, large)",
          "Growing notified crops",
          "In notified areas",
        ],
        benefits: [
          "Insurance coverage up to 75% of crop value",
          "Compensation within 72 hours of loss assessment",
          "Low premium rates",
        ],
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        contactInfo: "PMFBY Helpline: 1800-180-1111",
        website: "https://pmfby.gov.in",
        applicableCrops: [
          "wheat",
          "rice",
          "maize",
          "cotton",
          "sugarcane",
          "potato",
          "onion",
        ],
        applicableStates: [
          "Maharashtra",
          "Karnataka",
          "Madhya Pradesh",
          "Rajasthan",
          "Gujarat",
          "Uttar Pradesh",
        ],
      },
      {
        id: "pmkisan-001",
        name: "PM-KISAN",
        fullName: "Pradhan Mantri Kisan Samman Nidhi",
        description:
          "Direct income support scheme providing cash transfers to all landholding farmers.",
        ministries: ["Ministry of Agriculture"],
        eligibility: [
          "All landholding farmers",
          "Age >= 18 years",
          "Indian citizen",
        ],
        benefits: [
          "₹2000 per acre per season (₹6000 per year)",
          "Direct transfer to bank account",
          "No hidden charges or documentation hassle",
        ],
        applicationDeadline: new Date("2026-12-31"),
        contactInfo: "PM-KISAN: pmkisan.gov.in",
        website: "https://pmkisan.gov.in",
        applicableCrops: [
          "All crops",
        ],
        applicableStates: ["All"],
      },
      {
        id: "enam-001",
        name: "eNAM",
        fullName: "e-National Agricultural Market",
        description:
          "Digital platform for agricultural trade providing better price discovery and reduced middlemen.",
        ministries: ["Ministry of Agriculture"],
        eligibility: [
          "All farmers",
          "Producer organizations",
          "Agricultural traders",
        ],
        benefits: [
          "Access to multiple buyers",
          "Transparent pricing",
          "Reduced transaction costs",
          "Real-time market information",
        ],
        applicationDeadline: new Date("2026-12-31"),
        contactInfo: "eNAM Support: support@enam.gov.in",
        website: "https://enam.gov.in",
        applicableCrops: [
          "All agricultural commodities",
        ],
        applicableStates: ["All"],
      },
      {
        id: "kisansamridhi-001",
        name: "Kisan Samridhi",
        fullName: "Kisan Samridhi Yojana",
        description:
          "Scheme promoting sustainable agriculture and increasing farmer income through modern practices.",
        ministries: ["Ministry of Agriculture"],
        eligibility: [
          "Small and marginal farmers",
          "Farm size 0.5-2 hectares",
        ],
        benefits: [
          "50% subsidy on modern farming equipment",
          "Training on sustainable practices",
          "Loan at reduced interest rates",
        ],
        applicationDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        contactInfo: "State Agriculture Department",
        website: "https://farmer.gov.in",
        applicableCrops: [
          "wheat",
          "rice",
          "maize",
          "pulses",
          "oilseeds",
        ],
        applicableStates: [
          "Maharashtra",
          "Karnataka",
          "Madhya Pradesh",
          "Rajasthan",
        ],
      },
      {
        id: "pratishthan-001",
        name: "PRATISHTHAN",
        fullName: "Production and Trade Network for Agricultural Innovation",
        description:
          "Platform connecting farmers with buyers, reducing post-harvest losses.",
        ministries: ["Ministry of Agriculture", "Ministry of Food Processing"],
        eligibility: [
          "All farmers",
          "Producer groups",
        ],
        benefits: [
          "Direct market access",
          "Price support guarantee",
          "Storage facilities at subsidized rates",
        ],
        applicationDeadline: new Date("2026-12-31"),
        contactInfo: "PRATISHTHAN: help@pratishthan.in",
        website: "https://pratishthan.gov.in",
        applicableCrops: [
          "vegetables",
          "fruits",
          "spices",
          "pulses",
        ],
        applicableStates: ["All"],
      },
      {
        id: "soilhealth-001",
        name: "Soil Health Card",
        fullName: "Soil Health Card Scheme",
        description:
          "Free soil testing and recommendations for optimal nutrient management.",
        ministries: ["Ministry of Agriculture"],
        eligibility: [
          "All farmers",
          "Free service",
        ],
        benefits: [
          "Free soil testing",
          "Customized fertilizer recommendations",
          "Reduced input costs through optimized usage",
          "Improved crop yields",
        ],
        applicationDeadline: new Date("2026-12-31"),
        contactInfo: "DAC & FW: shc.nic.in",
        website: "https://soilhealth.dac.gov.in",
        applicableCrops: [
          "All crops",
        ],
        applicableStates: ["All"],
      },
      {
        id: "kisancredit-001",
        name: "Kisan Credit Card",
        fullName: "Kisan Credit Card Scheme",
        description: "Flexible short-term credit facility for agricultural operations",
        ministries: ["Ministry of Finance", "Ministry of Agriculture"],
        eligibility: [
          "Small and marginal farmers",
          "Hold cultivable land",
          "Good credit history",
        ],
        benefits: [
          "Flexible credit up to 4x times deposit",
          "4% interest subsidy",
          "Personal accident insurance",
          "Crop insurance coverage",
        ],
        applicationDeadline: new Date("2026-12-31"),
        contactInfo: "Participating banks",
        website: "https://farmer.gov.in",
        applicableCrops: [
          "All crops",
        ],
        applicableStates: ["All"],
      },
    ];
  }

  /**
   * Get all available schemes
   */
  getAllSchemes(): GovernmentScheme[] {
    return this.schemes;
  }

  /**
   * Match farmer to applicable schemes
   */
  getApplicableSchemes(farmer: Farmer): GovernmentScheme[] {
    return this.schemes.filter((scheme) => {
      const statMatch =
        scheme.applicableStates.includes("All") ||
        scheme.applicableStates.includes(farmer.state);

      const cropMatch =
        scheme.applicableCrops.includes("All crops") ||
        scheme.applicableCrops.includes("All agricultural commodities") ||
        scheme.applicableCrops.some(
          (c) => c.toLowerCase() === farmer.cropType.toLowerCase()
        );

      return statMatch && cropMatch;
    });
  }

  /**
   * Get scheme by ID
   */
  getSchemeById(id: string): GovernmentScheme | undefined {
    return this.schemes.find((s) => s.id === id);
  }

  /**
   * Get top recommended schemes for a farmer
   */
  getTopSchemes(farmer: Farmer, limit: number = 5): GovernmentScheme[] {
    const applicable = this.getApplicableSchemes(farmer);

    // Prioritize by relevance
    const prioritized = applicable.sort((a, b) => {
      // Income-focused schemes for small farmers
      if (farmer.farmSize < 2) {
        if (a.id.includes("kisan")) return -1;
        if (b.id.includes("kisan")) return 1;
      }

      // Insurance for risk-prone areas
      if (a.id.includes("bima")) return -1;
      if (b.id.includes("bima")) return 1;

      // Market access for all
      if (a.id.includes("nam")) return -1;
      if (b.id.includes("nam")) return 1;

      return 0;
    });

    return prioritized.slice(0, limit);
  }

  /**
   * Get scheme recommendations with reasoning
   */
  getSchemeRecommendationsWithReason(farmer: Farmer): Array<{
    scheme: GovernmentScheme;
    reason: string;
  }> {
    const applicable = this.getApplicableSchemes(farmer);

    return applicable.map((scheme) => {
      let reason = "";

      if (scheme.id === "pmfby-001") {
        reason = `Protect your ${farmer.cropType} crop against weather-related losses with comprehensive insurance coverage.`;
      } else if (scheme.id === "pmkisan-001") {
        reason = `Receive direct income support of ₹6000 annually based on your landholding.`;
      } else if (scheme.id === "enam-001") {
        reason = `Access better prices for your ${farmer.cropType} by selling directly through eNAM platform.`;
      } else if (scheme.id.includes("credit")) {
        reason = `Get flexible credit at 4% interest subsidy for your farming operations.`;
      } else if (scheme.id.includes("soil")) {
        reason = `Optimize your farming with free soil testing and personalized nutrient recommendations.`;
      } else if (scheme.id.includes("samridhi")) {
        reason = `Upgrade to modern farming practices with 50% subsidy on equipment.`;
      } else {
        reason = `Benefit from this government scheme applicable to your region and crop type.`;
      }

      return { scheme, reason };
    });
  }

  /**
   * Check if farmer is eligible for urgent assistance schemes
   */
  getUrgentAssistanceSchemes(farmer: Farmer): GovernmentScheme[] {
    // During crisis, prioritize insurance and direct support schemes
    const urgentSchemeIds = [
      "pmfby-001",
      "pmkisan-001",
      "kisancredit-001",
    ];

    return this.getApplicableSchemes(farmer).filter((s) =>
      urgentSchemeIds.includes(s.id)
    );
  }

  /**
   * Get scheme details with application steps
   */
  getSchemeApplicationInfo(schemeId: string): string {
    const scheme = this.getSchemeById(schemeId);
    if (!scheme) return "Scheme not found";

    return `
Scheme: ${scheme.fullName}

Eligibility:
${scheme.eligibility.map((e) => `• ${e}`).join("\n")}

Benefits:
${scheme.benefits.map((b) => `• ${b}`).join("\n")}

Application:
1. Visit ${scheme.website}
2. Click on 'Apply Now'
3. Fill scheme application form
4. Attach required documents
5. Submit application

For support: ${scheme.contactInfo}
Application Deadline: ${scheme.applicationDeadline.toDateString()}
    `;
  }
}
