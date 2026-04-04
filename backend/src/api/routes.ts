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
