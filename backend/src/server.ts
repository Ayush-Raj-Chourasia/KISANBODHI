import express from "express";
import cors from "cors";
import apiRoutes from "./api/routes.js";

/**
 * KISANBODHI - Multi-Agent Agricultural Advisory System
 *
 * A sophisticated autonomous AI system protecting India's smallholder farmers
 * from climate-driven agricultural crises, aligned with Atma Nirbhar Bharat vision.
 *
 * Five Specialized Agents:
 * 1. Sentinel - Real-time monitoring of weather, markets, and news
 * 2. Analyst - Data-driven crop loss and income risk modeling
 * 3. Advisor - Personalized farmer guidance with scheme recommendations
 * 4. Policy - SDG mapping and governance-ready briefs
 * 5. Orchestrator - Hierarchical coordination and workflow management
 */

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use("/api", apiRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "KISANBODHI",
    version: "1.0.0",
    description:
      "Multi-Agent AI System for Protected India's Smallholder Farmers",
    vision: "Atma Nirbhar Bharat - Rural Self-Reliance",
    agents: [
      {
        name: "Sentinel",
        role: "Real-time monitoring of weather, market, and agricultural news",
      },
      {
        name: "Analyst",
        role: "Crop-loss probability modeling and income-risk scoring",
      },
      {
        name: "Advisor",
        role: "Personalized farmer guidance with government scheme recommendations",
      },
      {
        name: "Policy",
        role: "SDG mapping and governance-ready briefs for policy makers",
      },
      {
        name: "Orchestrator",
        role: "Hierarchical coordination and dynamic re-planning",
      },
    ],
    endpoints: {
      analysis: "POST /api/analysis - District-level analysis",
      advisory: "POST /api/advisory - Personalized farmer advisory",
      crisis: "POST /api/crisis - Emergency crisis response",
      tasks: "GET /api/tasks - Active tasks status",
      agents: "GET /api/agents - Agent status",
      health: "GET /api/health - System health check",
      demo: "POST /api/demo - Generate demo data",
    },
    coverage: "100+ million smallholder farming households across India",
    sdgAlignment: [
      "SDG 1: No Poverty",
      "SDG 2: Zero Hunger",
      "SDG 8: Decent Work",
      "SDG 13: Climate Action",
    ],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                   KISANBODHI BACKEND                       ║
║              Multi-Agent Agricultural Advisory              ║
║                                                            ║
║  Five Specialized Agents Working in Harmony:              ║
║  ✓ Sentinel    - Live monitoring                          ║
║  ✓ Analyst     - Risk assessment                          ║
║  ✓ Advisor     - Farmer guidance                          ║
║  ✓ Policy      - Governance briefs                        ║
║  ✓ Orchestrator - System coordination                     ║
║                                                            ║
║  Protecting 100+ million Indian smallholder farmers       ║
║  Aligned with Atma Nirbhar Bharat vision                  ║
║                                                            ║
║  Server running on http://localhost:${PORT}                ║
║  API Documentation: http://localhost:${PORT}/              ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
