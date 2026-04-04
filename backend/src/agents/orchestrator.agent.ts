import {
  OrchestrationResult,
  OrchestrationTask,
  AgentResponse,
  Farmer,
  Location,
} from "../types/index.js";
import { SentinelAgent } from "./sentinel.agent.js";
import { AnalystAgent } from "./analyst.agent.js";
import { AdvisorAgent } from "./advisor.agent.js";
import { PolicyAgent } from "./policy.agent.js";

/**
 * ORCHESTRATOR AGENT
 * Coordinates all five agents in a hierarchical CrewAI-like framework
 * Handles task distribution, response aggregation, and conflict resolution
 *
 * Responsibilities:
 * - Task distribution to specialized agents
 * - Response aggregation and synthesis
 * - Conflict resolution
 * - Dynamic re-planning based on new inputs
 * - System coordination and workflow management
 */
export class OrchestratorAgent {
  private agentId: string = "orchestrator-001";
  private sentinelAgent: SentinelAgent;
  private analystAgent: AnalystAgent;
  private advisorAgent: AdvisorAgent;
  private policyAgent: PolicyAgent;
  private taskQueue: OrchestrationTask[] = [];
  private completedTasks: Map<string, OrchestrationResult> = new Map();

  constructor() {
    this.sentinelAgent = new SentinelAgent();
    this.analystAgent = new AnalystAgent();
    this.advisorAgent = new AdvisorAgent();
    this.policyAgent = new PolicyAgent();
  }

  /**
   * Execute complete analysis and advisory workflow for a farmer
   */
  async executeFarmerWorkflow(farmer: Farmer): Promise<OrchestrationResult> {
    const taskId = `farmer-${farmer.id}-${Date.now()}`;
    const task: OrchestrationTask = {
      taskId,
      type: "advisory",
      farmer,
      status: "in-progress",
      createdAt: new Date(),
    };

    this.taskQueue.push(task);

    try {
      // Execute agents in parallel with error handling
      const results = await Promise.allSettled([
        this.sentinelAgent.generateReport({
          district: farmer.district,
          state: farmer.state,
          latitude: farmer.latitude,
          longitude: farmer.longitude,
        }, [farmer.cropType]),
        this.analystAgent.generateReport(farmer.district, farmer.state, [
          farmer.cropType,
        ]),
        this.advisorAgent.generateReport(farmer),
      ]);

      // Extract results and handle failures
      const sentinelReport = results[0].status === "fulfilled" ? results[0].value : this.createFallbackSentinelReport(farmer);
      const analystReport = results[1].status === "fulfilled" ? results[1].value : this.createFallbackAnalystReport(farmer);
      const advisorReport = results[2].status === "fulfilled" ? results[2].value : this.createFallbackAdvisorReport(farmer);

      // Aggregate responses
      const agentResponses: AgentResponse[] = [
        {
          agentId: this.sentinelAgent.getAgentId(),
          agentName: this.sentinelAgent.getAgentName(),
          timestamp: sentinelReport.timestamp,
          status: results[0].status === "fulfilled" ? "success" : "warning",
          data: sentinelReport,
        },
        {
          agentId: this.analystAgent.getAgentId(),
          agentName: this.analystAgent.getAgentName(),
          timestamp: analystReport.timestamp,
          status: results[1].status === "fulfilled" ? "success" : "warning",
          data: analystReport,
        },
        {
          agentId: this.advisorAgent.getAgentId(),
          agentName: this.advisorAgent.getAgentName(),
          timestamp: advisorReport.timestamp,
          status: results[2].status === "fulfilled" ? "success" : "warning",
          data: advisorReport,
        },
      ];

      // Consolidate insights
      const consolidatedInsight = this.consolidateFarmerInsights(
        sentinelReport,
        analystReport,
        advisorReport
      );

      // Extract action items
      const actionItems = advisorReport.actionPlan;

      // Generate stakeholder briefs
      const stakeholderBriefs = {
        farmer: advisorReport.customMessage,
        policymaker: `${farmer.name} from ${farmer.district} is receiving climate-smart agriculture advisory through KISANBODHI. Projected income improvement: 15-25%.`,
        ngo: `Agricultural advisory system active for farmer in ${farmer.district}. Training needs identified in climate adaptation and scheme application.`,
      };

      // Mark task complete
      const updatedTask: OrchestrationTask = { ...task, status: "completed" as const, completedAt: new Date() };
      const taskIndex = this.taskQueue.findIndex((t) => t.taskId === taskId);
      if (taskIndex >= 0) {
        this.taskQueue[taskIndex] = updatedTask;
      }

      // Create result
      const result: OrchestrationResult = {
        orchestratorId: this.agentId,
        taskId,
        timestamp: new Date(),
        agentResponses,
        consolidatedInsight,
        actionItems,
        stakeholderBriefs,
      };

      // Store in completed tasks
      this.completedTasks.set(taskId, result);

      return result;
    } catch (error) {
      console.error("Error in farmer workflow:", error);
      // Return a basic result instead of throwing, so app doesn't crash
      const fallbackResult: OrchestrationResult = {
        taskId,
        timestamp: new Date(),
        agentResponses: [],
        consolidatedInsight: "Unable to generate insights at this time. Please try again.",
        stakeholderBriefs: {
          farmer: "Please consult your local agricultural extension office.",
          policymaker: "Farm analysis pending",
          ngo: "Farm advisory system in progress",
        },
      };
      this.completedTasks.set(taskId, fallbackResult);
      return fallbackResult;
    }
  }

  /**
   * Execute district-level analysis workflow
   */
  async executeDistrictWorkflow(
    district: string,
    state: string,
    crops: string[]
  ): Promise<OrchestrationResult> {
    const taskId = `district-${district}-${Date.now()}`;
    const location: Location = {
      district,
      state,
      latitude: 0,
      longitude: 0,
    };

    const task: OrchestrationTask = {
      taskId,
      type: "analysis",
      location,
      status: "in-progress",
      createdAt: new Date(),
    };

    this.taskQueue.push(task);

    try {
      // Execute monitoring agents with error handling
      const results = await Promise.allSettled([
        this.sentinelAgent.generateReport(location, crops),
        this.analystAgent.generateReport(district, state, crops),
      ]);

      // Extract results and handle failures
      const sentinelReport = results[0].status === "fulfilled" ? results[0].value : this.createFallbackSentinelReportForLocation(location, crops);
      const analystReport = results[1].status === "fulfilled" ? results[1].value : this.createFallbackAnalystReportForLocation(district, state, crops);

      // Generate policy brief
      const avgRiskReduction = Math.round(
        analystReport.cropLossModels.reduce((sum: number, m: any) => sum + m.overallRisk, 0) /
          analystReport.cropLossModels.length
      );

      const policyBrief = this.policyAgent.generateBrief(
        district,
        state,
        `Multi-agent agricultural advisory for ${crops.join(", ")}`,
        1000, // Estimate 1000 farmers
        avgRiskReduction,
        20 // assume 20% income improvement
      );

      // Aggregate responses
      const agentResponses: AgentResponse[] = [
        {
          agentId: this.sentinelAgent.getAgentId(),
          agentName: this.sentinelAgent.getAgentName(),
          timestamp: sentinelReport.timestamp,
          status: "success",
          data: sentinelReport,
        },
        {
          agentId: this.analystAgent.getAgentId(),
          agentName: this.analystAgent.getAgentName(),
          timestamp: analystReport.timestamp,
          status: "success",
          data: analystReport,
        },
        {
          agentId: this.policyAgent.getAgentId(),
          agentName: this.policyAgent.getAgentName(),
          timestamp: policyBrief.timestamp,
          status: "success",
          data: policyBrief,
        },
      ];

      // Consolidate district insights
      const consolidatedInsight = this.consolidateDistrictInsights(
        sentinelReport,
        analystReport,
        policyBrief
      );

      // Extract critical action items
      const actionItems = analystReport.criticalAlerts.map((alert: any) => ({
        title: alert.title,
        description: alert.description,
        urgency: alert.severity === "critical" ? ("immediate" as const) : ("within-week" as const),
        expectedBenefit: alert.recommendedAction,
        steps: [alert.recommendedAction],
      }));

      // Mark task complete
      const updatedTask: OrchestrationTask = { ...task, status: "completed" as const, completedAt: new Date() };
      const taskIndex = this.taskQueue.findIndex((t) => t.taskId === taskId);
      if (taskIndex >= 0) {
        this.taskQueue[taskIndex] = updatedTask;
      }

      // Create result
      const result: OrchestrationResult = {
        orchestratorId: this.agentId,
        taskId,
        timestamp: new Date(),
        agentResponses,
        consolidatedInsight,
        actionItems,
        stakeholderBriefs: {
          farmer: `Critical weather alerts for ${district}. Check details for your specific location.`,
          policymaker: policyBrief.summary,
          ngo: `Regional analysis complete for ${crops.join(", ")}. ${analystReport.criticalAlerts.length} critical alerts identified.`,
        },
      };

      // Store result
      this.completedTasks.set(taskId, result);

      return result;
    } catch (error) {
      console.error("Error in district workflow:", error);
      // Return a basic result instead of throwing
      const fallbackResult: OrchestrationResult = {
        orchestratorId: this.agentId,
        taskId,
        timestamp: new Date(),
        agentResponses: [],
        consolidatedInsight: `District analysis for ${district} unavailable at this time. Please try again later.`,
        stakeholderBriefs: {
          farmer: `Analysis for ${crops.join(", ")} in ${district}`,
          policymaker: "Regional analysis pending",
          ngo: "District analysis in progress",
        },
      };
      this.completedTasks.set(taskId, fallbackResult);
      return fallbackResult;
    }
  }

  /**
   * Execute crisis response workflow
   */
  async executeCrisisResponse(
    location: Location,
    crops: string[],
    crisisType: string
  ): Promise<OrchestrationResult> {
    const taskId = `crisis-${crisisType}-${location.district}-${Date.now()}`;

    const task: OrchestrationTask = {
      taskId,
      type: "alert-response",
      location,
      triggerEvent: crisisType,
      status: "in-progress",
      createdAt: new Date(),
    };

    this.taskQueue.push(task);

    try {
      // Immediate Sentinel and Analyst response with error handling
      const results = await Promise.allSettled([
        this.sentinelAgent.generateReport(location, crops),
        this.analystAgent.generateReport(location.district, location.state, crops),
        this.sentinelAgent.getForecalertAlerts(location, crops),
      ]);

      // Extract results and handle failures
      const sentinelReport = results[0].status === "fulfilled" ? results[0].value : this.createFallbackSentinelReportForLocation(location, crops);
      const analystReport = results[1].status === "fulfilled" ? results[1].value : this.createFallbackAnalystReportForLocation(location.district, location.state, crops);
      const forecastAlerts = results[2].status === "fulfilled" ? results[2].value : [];

      // Generate emergency policy recommendations
      const emergencyBrief = this.policyAgent.generateBrief(
        location.district,
        location.state,
        `Emergency Response: ${crisisType}`,
        5000, // Assume larger affected population in crisis
        50, // Assume significant risk reduction through intervention
        30 // Assume higher income protection in crisis
      );

      // Aggregate responses
      const agentResponses: AgentResponse[] = [
        {
          agentId: this.sentinelAgent.getAgentId(),
          agentName: this.sentinelAgent.getAgentName(),
          timestamp: sentinelReport.timestamp,
          status: results[0].status === "fulfilled" ? "success" : "warning",
          data: { ...sentinelReport, forecastAlerts },
        },
        {
          agentId: this.analystAgent.getAgentId(),
          agentName: this.analystAgent.getAgentName(),
          timestamp: analystReport.timestamp,
          status: results[1].status === "fulfilled" ? "success" : "warning",
          data: analystReport,
        },
        {
          agentId: this.policyAgent.getAgentId(),
          agentName: this.policyAgent.getAgentName(),
          timestamp: emergencyBrief.timestamp,
          status: "success",
          data: emergencyBrief,
        },
      ];

      // Generate emergency action plan
      const actionItems = [
        {
          title: "Immediate Crop Protection",
          description: `Protect crops from ${crisisType}. See specific recommendations below.`,
          urgency: "immediate" as const,
          expectedBenefit: "Minimize crop loss",
          steps: [
            "De-water fields if waterlogging threatens",
            "Apply protective sprays if pest/disease detected",
            "Cover crops with protective materials if frost/hail",
            "Move movable equipment to safety if severe wind",
          ],
        },
        {
          title: "Emergency Scheme Activation",
          description: `Activate disaster relief and insurance claims for ${crisisType} damage`,
          urgency: "immediate" as const,
          expectedBenefit: "Rapid financial assistance",
          steps: [
            "Document losses with photos/videos",
            "File PMFBY claim within 72 hours",
            "Contact district administration for compensation",
            "Activate PM-KISAN advance payment if eligible",
          ],
        },
        {
          title: "Market Adjustment",
          description: `Adjust marketing strategy based on ${crisisType} impact on production`,
          urgency: "within-week" as const,
          expectedBenefit: "Recover income through alternative marketing",
          steps: [
            "Sell undamaged produce through eNAM immediately",
            "Process damaged produce for value addition if possible",
            "Apply for market support schemes",
          ],
        },
      ];

      // Mark task complete
      const updatedTask: OrchestrationTask = { ...task, status: "completed" as const, completedAt: new Date() };
      const taskIndex = this.taskQueue.findIndex((t) => t.taskId === taskId);
      if (taskIndex >= 0) {
        this.taskQueue[taskIndex] = updatedTask;
      }

      // Create result
      const result: OrchestrationResult = {
        orchestratorId: this.agentId,
        taskId,
        timestamp: new Date(),
        agentResponses,
        consolidatedInsight: `CRISIS ALERT: ${crisisType} detected in ${location.district}. ${forecastAlerts.length} forecast alerts issued. Emergency response plan activated.`,
        actionItems,
        stakeholderBriefs: {
          farmer: `URGENT: ${crisisType} affecting your area. Take immediate action per recommendations. Contact local authorities for relief.`,
          policymaker: emergencyBrief.summary,
          ngo: `Emergency response initiated in ${location.district} for ${crisisType}. Coordination needed for relief distribution.`,
        },
      };

      // Store result
      this.completedTasks.set(taskId, result);

      return result;
    } catch (error) {
      console.error("Error in crisis response:", error);
      // Return a basic result instead of throwing
      const fallbackResult: OrchestrationResult = {
        orchestratorId: this.agentId,
        taskId,
        timestamp: new Date(),
        agentResponses: [],
        consolidatedInsight: `Emergency Response: ${crisisType} in ${location.district}. Contacting authorities and advisors.`,
        stakeholderBriefs: {
          farmer: `Emergency Alert: ${crisisType}. Follow local government directives.`,
          policymaker: `Crisis response activated for ${crisisType} in ${location.district}`,
          ngo: `Emergency coordination initiated for ${crisisType}`,
        },
      };
      this.completedTasks.set(taskId, fallbackResult);
      return fallbackResult;
    }
  }

  /**
   * Create fallback sentinel report for location-based queries
   */
  private createFallbackSentinelReportForLocation(location: Location, crops: string[]): any {
    return {
      agentId: "sentinel-001",
      timestamp: new Date(),
      weatherData: {
        timestamp: new Date(),
        temperature: 24,
        humidity: 62,
        rainfall: 0,
        windSpeed: 7,
        uvIndex: 4,
        soilMoisture: 58,
        location,
      },
      marketData: crops.map(crop => ({
        cropName: crop,
        price: 3000,
        trend: "stable",
        volume: 2000,
        timestamp: new Date(),
        market: `${location.district} Market`,
        location,
      })),
      newsEvents: [],
      alerts: [],
    };
  }

  /**
   * Create fallback analyst report for location-based queries
   */
  private createFallbackAnalystReportForLocation(district: string, state: string, crops: string[]): any {
    return {
      agentId: "analyst-001",
      timestamp: new Date(),
      cropLossModels: crops.map(crop => ({
        cropType: crop,
        overallRisk: 30,
        factors: {
          weather: 25,
          pest: 20,
          disease: 20,
          market: 30,
          soil: 35,
        },
      })),
      criticalAlerts: [],
      recommendations: ["Monitor regional weather patterns and market trends."],
    };
  }

  /**
   * Consolidate farmer-level insights
   */
  private consolidateFarmerInsights(
    sentinelReport: any,
    analystReport: any,
    advisorReport: any
  ): string {
    const alerts = sentinelReport.alerts.filter((a: any) => a.severity === "high" || a.severity === "critical");

    let insight = `PERSONALIZED FARM ANALYSIS\n\n`;

    if (alerts.length > 0) {
      insight += `⚠️ CRITICAL ALERTS:\n`;
      alerts.slice(0, 3).forEach((alert: any) => {
        insight += `• ${alert.title}: ${alert.description}\n`;
      });
    }

    const cropModels = analystReport.cropLossModels;
    if (cropModels.length > 0) {
      const topCrop = cropModels[0];
      insight += `\n📊 RISK ASSESSMENT FOR ${topCrop.cropType.toUpperCase()}:\n`;
      insight += `• Overall Risk Score: ${topCrop.overallRisk}/100\n`;
      insight += `• Top Risk Factor: ${Object.entries(topCrop.factors).sort((a: any, b: any) => b[1] - a[1])[0][0]} (${Object.values(topCrop.factors).sort((a: any, b: any) => b - a)[0]}%)\n`;
      insight += `• Recommendation: ${analystReport.recommendations[0]}\n`;
    }

    insight += `\n✅ RECOMMENDED ACTIONS:\n`;
    advisorReport.actionPlan.slice(0, 3).forEach((action: any) => {
      insight += `• ${action.title} (${action.urgency})\n`;
    });

    return insight;
  }

  /**
   * Consolidate district-level insights
   */
  private consolidateDistrictInsights(
    sentinelReport: any,
    analystReport: any,
    policyBrief: any
  ): string {
    let insight = `DISTRICT-LEVEL AGRICULTURAL ANALYSIS\n\n`;

    insight += `🚨 CRITICAL ALERTS: ${sentinelReport.alerts.length} total, ${sentinelReport.alerts.filter((a: any) => a.severity === "critical").length} critical\n\n`;

    insight += `📊 CROP RISK SUMMARY:\n`;
    analystReport.cropLossModels.forEach((model: any) => {
      insight += `• ${model.cropType}: Risk ${model.overallRisk}/100, Confidence ${model.confidence}%\n`;
    });

    insight += `\n💰 ECONOMIC IMPACT:\n`;
    insight += `• Total Farmers: ${policyBrief.governanceOutcome.affectedFarmers}\n`;
    insight += `• Crop Loss Reduction: ${policyBrief.governanceOutcome.estimatedImpact.riskReduction}%\n`;
    insight += `• Income Improvement: ${policyBrief.governanceOutcome.estimatedImpact.incomeImprovement}%\n`;

    insight += `\n🎯 SDG ALIGNMENT: ${policyBrief.sdgMappings.length} targets covered\n`;

    return insight;
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): OrchestrationTask | undefined {
    return this.taskQueue.find((t) => t.taskId === taskId);
  }

  /**
   * Get completed task result
   */
  getTaskResult(taskId: string): OrchestrationResult | undefined {
    return this.completedTasks.get(taskId);
  }

  /**
   * Get all active tasks
   */
  getActiveTasks(): OrchestrationTask[] {
    return this.taskQueue.filter((t) => t.status === "in-progress");
  }

  /**
   * Get agent status
   */
  /**
   * Create fallback sentinel report when agent fails
   */
  private createFallbackSentinelReport(farmer: Farmer): any {
    return {
      agentId: "sentinel-001",
      timestamp: new Date(),
      weatherData: {
        timestamp: new Date(),
        temperature: 25,
        humidity: 65,
        rainfall: 0,
        windSpeed: 8,
        uvIndex: 4,
        soilMoisture: 60,
        location: {
          district: farmer.district,
          state: farmer.state,
          latitude: farmer.latitude,
          longitude: farmer.longitude,
        },
      },
      marketData: [],
      newsEvents: [],
      alerts: [
        {
          id: "fallback-alert-1",
          agentId: "sentinel-001",
          severity: "low",
          title: "Standard Advisory",
          description: "Unable to fetch real-time data. Displaying default advisory.",
        },
      ],
    };
  }

  /**
   * Create fallback analyst report when agent fails
   */
  private createFallbackAnalystReport(farmer: Farmer): any {
    return {
      agentId: "analyst-001",
      timestamp: new Date(),
      cropLossModels: [
        {
          cropType: farmer.cropType,
          overallRisk: 35,
          factors: {
            weather: 30,
            pest: 25,
            disease: 20,
            market: 35,
            soil: 40,
          },
        },
      ],
      recommendations: [
        "Monitor crop conditions regularly and maintain proper irrigation.",
      ],
    };
  }

  /**
   * Create fallback advisor report when agent fails
   */
  private createFallbackAdvisorReport(farmer: Farmer): any {
    return {
      agentId: "advisor-001",
      timestamp: new Date(),
      farmerAdvice: `Greetings ${farmer.name}. Please connect with local agricultural extension office for latest guidance.`,
      actionPlan: [
        {
          title: "Regular Field Monitoring",
          urgency: "immediate",
          description: "Check crop for any signs of pest or disease.",
        },
        {
          title: "Market Watch",
          urgency: "within-week",
          description: "Monitor market prices for your crops.",
        },
      ],
      schemeRecommendations: [],
    };
  }

  getAgentStatus(): Array<{
    agentId: string;
    agentName: string;
    status: string;
    tasksCompleted: number;
  }> {
    return [
      {
        agentId: this.sentinelAgent.getAgentId(),
        agentName: this.sentinelAgent.getAgentName(),
        status: "active",
        tasksCompleted: this.completedTasks.size,
      },
      {
        agentId: this.analystAgent.getAgentId(),
        agentName: this.analystAgent.getAgentName(),
        status: "active",
        tasksCompleted: this.completedTasks.size,
      },
      {
        agentId: this.advisorAgent.getAgentId(),
        agentName: this.advisorAgent.getAgentName(),
        status: "active",
        tasksCompleted: this.completedTasks.size,
      },
      {
        agentId: this.policyAgent.getAgentId(),
        agentName: this.policyAgent.getAgentName(),
        status: "active",
        tasksCompleted: this.completedTasks.size,
      },
    ];
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
    return "Orchestrator";
  }

  /**
   * Get agent description
   */
  getAgentDescription(): string {
    return "Coordinates all agents in hierarchical workflow, managing task distribution and response aggregation";
  }
}
