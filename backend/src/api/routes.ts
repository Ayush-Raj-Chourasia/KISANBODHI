import express, { Request, Response, Router } from "express";
import { OrchestratorAgent } from "../agents/orchestrator.agent.js";
import {
  AnalysisRequest,
  AdvisoryRequest,
  PolicyBriefRequest,
  Farmer,
  Location,
} from "../types/index.js";

const router = Router();
const orchestrator = new OrchestratorAgent();

// ─── In-Memory Auth Store (demo/competition) ───────────────────────────────
interface UserRecord {
  id: string;
  email: string;
  password: string;
  name: string;
  district: string;
  language: string;
}

const users: UserRecord[] = [
  {
    id: "farmer-001",
    email: "farmer@example.com",
    password: "password",
    name: "Rajesh Kumar",
    district: "Kendrapara",
    language: "en",
  },
  {
    id: "farmer-002",
    email: "kisan@example.com",
    password: "password",
    name: "ସୁନୀଲ ମହାନ୍ତି",
    district: "Puri",
    language: "or",
  },
];

let nextUserId = 3;

function generateToken(userId: string): string {
  return Buffer.from(JSON.stringify({ userId, iat: Date.now() })).toString("base64");
}

// ─── Auth Routes ────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 */
router.post("/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    token: generateToken(user.id),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      district: user.district,
      language: user.language,
    },
  });
});

/**
 * POST /api/auth/register
 */
router.post("/auth/register", (req: Request, res: Response) => {
  const { email, password, name, district, language } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required" });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: "User already exists" });
  }

  const newUser: UserRecord = {
    id: `farmer-${String(nextUserId++).padStart(3, "0")}`,
    email,
    password,
    name,
    district: district || "Khordha",
    language: language || "en",
  };

  users.push(newUser);

  res.status(201).json({
    token: generateToken(newUser.id),
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      district: newUser.district,
      language: newUser.language,
    },
  });
});

/**
 * POST /api/agent/query
 * Natural language query from dashboard — runs all agents
 */
router.post("/agent/query", async (req: Request, res: Response) => {
  try {
    const { query, context } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const district = context?.district || "Kendrapara";
    const state = context?.state || "Odisha";
    const crops = context?.crops || ["paddy", "rice"];

    const result = await orchestrator.executeDistrictWorkflow(district, state, crops);

    // Transform orchestrator output into the AgentResponse format the frontend expects
    const sentinelData = result.agentResponses?.find((r: any) => r.agentName === "Sentinel");
    const analystData = result.agentResponses?.find((r: any) => r.agentName === "Analyst");
    const advisorData = result.agentResponses?.find((r: any) => r.agentName === "Advisor");
    const policyData = result.agentResponses?.find((r: any) => r.agentName === "Policy");

    const weatherData = (sentinelData?.data as any)?.weatherData;
    const alerts = (sentinelData?.data as any)?.alerts || [];
    const cropModels = (analystData?.data as any)?.cropLossModels || [];
    const incomeRisks = (analystData?.data as any)?.incomeRisks || [];
    const actionPlan = (advisorData?.data as any)?.actionPlan || [];
    const schemes = (advisorData?.data as any)?.schemeRecommendations || [];
    const sdgMappings = (policyData?.data as any)?.sdgMappings || [];

    res.json({
      status: "success",
      query,
      agents_output: {
        sentinel: {
          weather_alert: alerts[0]?.title || (weatherData ? `Temperature ${weatherData.temperature}°C, Humidity ${weatherData.humidity}%` : "No active weather alerts"),
          hazard_signal: alerts[0]?.severity || "low",
          probability: cropModels[0]?.factors?.weather ? cropModels[0].factors.weather / 100 : 0.2,
        },
        analyst: {
          risk_score: cropModels[0]?.overallRisk ? Math.round(cropModels[0].overallRisk / 10) : 3,
          crop_loss_probability: cropModels[0]?.overallRisk ? cropModels[0].overallRisk / 100 : 0.15,
          income_impact: incomeRisks[0] ? `₹${incomeRisks[0].projectedIncome?.toLocaleString()} projected` : "Moderate impact expected",
        },
        advisor: {
          recommendations: actionPlan.length > 0
            ? actionPlan.map((a: any) => a.title || a.description || String(a)).slice(0, 5)
            : ["Monitor weather conditions", "Check PMFBY enrollment status", "Diversify crop portfolio"],
        },
        policy: {
          sdg_alignment: sdgMappings.length > 0
            ? sdgMappings.map((s: any) => `${s.target}: ${s.description}`)
            : ["SDG 1: No Poverty", "SDG 2: Zero Hunger", "SDG 13: Climate Action"],
          applicable_schemes: schemes.length > 0
            ? schemes.map((s: any) => s.name || s.fullName || String(s)).slice(0, 4)
            : ["PMFBY", "PM-KISAN", "eNAM", "KCC"],
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Agent query error:", error);
    res.status(500).json({
      status: "error",
      error: "Agent pipeline failed. Using fallback response.",
      agents_output: {
        sentinel: { weather_alert: "System processing", hazard_signal: "low", probability: 0.1 },
        analyst: { risk_score: 2, crop_loss_probability: 0.1, income_impact: "Minimal" },
        advisor: { recommendations: ["Contact your local KVK for assistance"] },
        policy: { sdg_alignment: ["SDG 2: Zero Hunger"], applicable_schemes: ["PMFBY"] },
      },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * POST /api/analysis
 * Request agricultural analysis for a location and crops
 */
router.post("/analysis", async (req: Request, res: Response) => {
  try {
    const { district, state, crops } = req.body;

    if (!district || !state || !crops || crops.length === 0) {
      return res.status(400).json({
        error: "Missing required fields: district, state, crops",
      });
    }

    const result = await orchestrator.executeDistrictWorkflow(
      district,
      state,
      crops
    );

    res.json({
      success: true,
      taskId: result.taskId,
      timestamp: result.timestamp,
      data: result,
    });
  } catch (error) {
    console.error("Error in analysis endpoint:", error);
    res.status(500).json({
      error: "Failed to generate analysis",
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/advisory
 * Generate personalized advisory for a farmer
 */
router.post("/advisory", async (req: Request, res: Response) => {
  try {
    const farmer: Farmer = req.body;

    // Validate farmer data
    if (
      !farmer.id ||
      !farmer.name ||
      !farmer.district ||
      !farmer.state ||
      !farmer.cropType
    ) {
      return res.status(400).json({
        error: "Missing required farmer fields",
      });
    }

    // Set defaults
    farmer.latitude = farmer.latitude || 0;
    farmer.longitude = farmer.longitude || 0;
    farmer.language = farmer.language || "en";
    farmer.farmSize = farmer.farmSize || 1;

    const result = await orchestrator.executeFarmerWorkflow(farmer);

    res.json({
      success: true,
      taskId: result.taskId,
      timestamp: result.timestamp,
      data: result,
    });
  } catch (error) {
    console.error("Error in advisory endpoint:", error);
    res.status(500).json({
      error: "Failed to generate advisory",
      details: (error as Error).message,
    });
  }
});

/**
 * POST /api/crisis
 * Trigger emergency crisis response
 */
router.post("/crisis", async (req: Request, res: Response) => {
  try {
    const { district, state, crops, crisisType } = req.body;

    if (!district || !state || !crisisType) {
      return res.status(400).json({
        error: "Missing required fields: district, state, crisisType",
      });
    }

    const location: Location = {
      district,
      state,
      latitude: 0,
      longitude: 0,
    };

    const result = await orchestrator.executeCrisisResponse(
      location,
      crops || ["wheat", "rice"],
      crisisType
    );

    res.json({
      success: true,
      taskId: result.taskId,
      timestamp: result.timestamp,
      priority: "high",
      data: result,
    });
  } catch (error) {
    console.error("Error in crisis endpoint:", error);
    res.status(500).json({
      error: "Failed to handle crisis",
      details: (error as Error).message,
    });
  }
});

/**
 * GET /api/task/:taskId
 * Get status and result of a specific task
 */
router.get("/task/:taskId", (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const status = orchestrator.getTaskStatus(taskId);
    const result = orchestrator.getTaskResult(taskId);

    if (!status && !result) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    res.json({
      taskId,
      status: status?.status || "completed",
      result,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve task",
    });
  }
});

/**
 * GET /api/tasks
 * Get all active tasks
 */
router.get("/tasks", (req: Request, res: Response) => {
  try {
    const activeTasks = orchestrator.getActiveTasks();

    res.json({
      activeTaskCount: activeTasks.length,
      tasks: activeTasks,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve tasks",
    });
  }
});

/**
 * GET /api/agents
 * Get status of all agents
 */
router.get("/agents", (req: Request, res: Response) => {
  try {
    const agentStatus = orchestrator.getAgentStatus();

    res.json({
      agents: agentStatus,
      orchestratorId: orchestrator.getAgentId(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve agent status",
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date(),
    system: "KISANBODHI Multi-Agent Agricultural Advisory",
    agents: [
      "Sentinel - Real-time monitoring",
      "Analyst - Risk assessment",
      "Advisor - Personalized guidance",
      "Policy - Governance mapping",
      "Orchestrator - Coordination",
    ],
  });
});

/**
 * POST /api/demo
 * Generate demo data for testing
 */
router.post("/demo", async (req: Request, res: Response) => {
  try {
    // Demo farmer
    const demoFarmer: Farmer = {
      id: "demo-farmer-001",
      name: "Rajesh Kumar",
      email: "rajesh@farm.com",
      phone: "+91-9876543210",
      district: "Nashik",
      state: "Maharashtra",
      cropType: "sugarcane",
      farmSize: 2.5,
      latitude: 19.9975,
      longitude: 73.791,
      language: "mr",
    };

    const result = await orchestrator.executeFarmerWorkflow(demoFarmer);

    res.json({
      success: true,
      message: "Demo data generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error generating demo:", error);
    res.status(500).json({
      error: "Failed to generate demo",
    });
  }
});

export default router;
