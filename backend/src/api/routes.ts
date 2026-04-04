import express, { Request, Response, Router } from "express";
import { OrchestratorAgent } from "../agents/orchestrator.agent.js";
import { GoogleGenAI } from '@google/genai';
import {
  AnalysisRequest,
  AdvisoryRequest,
  PolicyBriefRequest,
  Farmer,
  Location,
} from "../types/index.js";

const router = Router();
const orchestrator = new OrchestratorAgent();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── In-Memory Auth Store (demo/competition) ───────────────────────────────
interface UserRecord {
  id: string;
  phone: string;
  email: string;
  password: string;
  name: string;
  district: string;
  language: string;
  cropType: string;
  farmSize: number;
}

const users: UserRecord[] = [
  {
    id: "farmer-001",
    phone: "9876543210",
    email: "farmer@example.com",
    password: "password",
    name: "Rajesh Kumar",
    district: "Kendrapara",
    language: "en",
    cropType: "paddy",
    farmSize: 5,
  },
  {
    id: "farmer-002",
    phone: "8765432109",
    email: "kisan@example.com",
    password: "password",
    name: "ସୁନୀଲ ମହାନ୍ତି",
    district: "Puri",
    language: "or",
    cropType: "rice",
    farmSize: 3,
  },
];

let nextUserId = 3;

// In-memory OTP store: phone → { otp, expiresAt }
const otpStore: Map<string, { otp: string; expiresAt: number }> = new Map();

function generateToken(userId: string): string {
  return Buffer.from(JSON.stringify({ userId, iat: Date.now() })).toString("base64");
}

function userResponse(user: UserRecord) {
  return {
    id: user.id,
    phone: user.phone,
    email: user.email,
    name: user.name,
    district: user.district,
    language: user.language,
    cropType: user.cropType,
    farmSize: user.farmSize,
  };
}

// ─── Auth Routes ────────────────────────────────────────────────────────────

/**
 * POST /api/auth/send-otp
 * Send OTP to phone number via Twilio
 */
router.post("/auth/send-otp", async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(cleanPhone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min

  // Try Twilio SMS
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_NUMBER;

  if (accountSid && authToken && from) {
    try {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const twilioAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
      const body = new URLSearchParams({
        To: `+91${cleanPhone}`,
        From: from,
        Body: `Your KISANBODHI login OTP is: ${otp}. Valid for 5 minutes. — Team IQ Zero`,
      });

      await fetch(twilioUrl, {
        method: "POST",
        headers: { Authorization: `Basic ${twilioAuth}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      console.log(`OTP ${otp} sent to +91${cleanPhone}`);
    } catch (err) {
      console.warn("Twilio SMS failed, OTP still stored for demo:", otp);
    }
  } else {
    console.log(`[DEMO] OTP for ${cleanPhone}: ${otp}`);
  }

  res.json({ success: true, message: "OTP sent successfully", demo_hint: "Use 123456 for demo" });
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP and login/register the user
 */
router.post("/auth/verify-otp", (req: Request, res: Response) => {
  const { phone, otp, name, district, language } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone and OTP required" });
  }

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);

  // Demo shortcut: 123456 always works for competition
  const stored = otpStore.get(cleanPhone);
  if (otp !== "123456" && (!stored || stored.otp !== otp || stored.expiresAt < Date.now())) {
    return res.status(401).json({ error: "Invalid or expired OTP" });
  }

  otpStore.delete(cleanPhone);

  // Find or create user
  let user = users.find((u) => u.phone === cleanPhone);
  if (!user) {
    user = {
      id: `farmer-${String(nextUserId++).padStart(3, "0")}`,
      phone: cleanPhone,
      email: "",
      password: "",
      name: name || `Farmer ${cleanPhone.slice(-4)}`,
      district: district || "Kendrapara",
      language: language || "en",
      cropType: "paddy",
      farmSize: 2,
    };
    users.push(user);
  }

  res.json({ token: generateToken(user.id), user: userResponse(user) });
});

/**
 * POST /api/auth/login (email fallback — keep for backward compatibility)
 */
router.post("/auth/login", (req: Request, res: Response) => {
  const { email, password, phone } = req.body;

  // Support phone-based lookup too
  if (phone) {
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const user = users.find((u) => u.phone === cleanPhone);
    if (user) {
      return res.json({ token: generateToken(user.id), user: userResponse(user) });
    }
  }

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ token: generateToken(user.id), user: userResponse(user) });
});

/**
 * POST /api/auth/register
 */
router.post("/auth/register", (req: Request, res: Response) => {
  const { email, password, name, district, language, phone } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const cleanPhone = phone ? phone.replace(/\D/g, "").slice(-10) : "";

  if (email && users.find((u) => u.email === email)) {
    return res.status(409).json({ error: "User already exists" });
  }
  if (cleanPhone && users.find((u) => u.phone === cleanPhone)) {
    return res.status(409).json({ error: "Phone already registered" });
  }

  const newUser: UserRecord = {
    id: `farmer-${String(nextUserId++).padStart(3, "0")}`,
    phone: cleanPhone,
    email: email || "",
    password: password || "",
    name,
    district: district || "Khordha",
    language: language || "en",
    cropType: "paddy",
    farmSize: 2,
  };

  users.push(newUser);
  res.status(201).json({ token: generateToken(newUser.id), user: userResponse(newUser) });
});

/**
 * POST /api/chat
 * Public chatbot — works without login for landing page visitors
 */
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message, district, language } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const dist = district || "Kendrapara";
    const crops = ["paddy", "rice"];

    const result = await orchestrator.executeDistrictWorkflow(dist, "Odisha", crops);

    const sentinelData = result.agentResponses?.find((r: any) => r.agentName === "Sentinel");
    const advisorData = result.agentResponses?.find((r: any) => r.agentName === "Advisor");
    const wd = (sentinelData?.data as any)?.weatherData;
    const actionPlan = (advisorData?.data as any)?.actionPlan || [];
    const schemes = (advisorData?.data as any)?.schemeRecommendations || [];

    let reply = "";
    if (wd) {
      reply += `🌤️ Current weather in ${dist}: ${Math.round(wd.temperature)}°C, Humidity ${wd.humidity}%, Wind ${Math.round(wd.windSpeed)} km/h.\n\n`;
    }
    if (actionPlan.length > 0) {
      reply += `📋 Recommendations:\n`;
      actionPlan.slice(0, 3).forEach((a: any, i: number) => {
        reply += `${i + 1}. ${a.title || a.description || String(a)}\n`;
      });
      reply += `\n`;
    }
    if (schemes.length > 0) {
      reply += `🏛️ Schemes for you: ${schemes.slice(0, 3).map((s: any) => s.name || s.fullName || String(s)).join(", ")}\n\n`;
    }

    reply += `\n💡 For personalized advice, login with your mobile number!`;

    res.json({
      reply: reply || "KISANBODHI is here to help! Ask about weather, crops, government schemes, or pest management.",
      source: "multi-agent",
      agents_used: ["Sentinel", "Advisor"],
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.json({
      reply: "🌾 KISANBODHI: I can help with weather, crop advice, PMFBY insurance, market prices, and government schemes. Try asking about today's weather or crop recommendations!\n\n💡 Login with your mobile number for personalized advice.",
      source: "fallback",
    });
  }
});

// ─── IVR (Interactive Voice Response) for Feature Phones ────────────────────
// Enables 400M+ feature phone users to access KISANBODHI via phone call
// Flow: Farmer dials toll-free → Language selection → Speaks problem →
//       AI processes → Voice reads advice → SMS with scheme link

/**
 * POST /api/ivr/welcome
 * Twilio webhook: First contact — language selection
 */
router.post("/ivr/welcome", (req: Request, res: Response) => {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="dtmf" numDigits="1" action="/api/ivr/gather" method="POST" timeout="10">
    <Say voice="Polly.Aditi" language="hi-IN">
      किसानबोधि में आपका स्वागत है। कृपया अपनी भाषा चुनें।
    </Say>
    <Say voice="Polly.Aditi" language="en-IN">
      Welcome to KISANBODHI. Press 1 for English. Press 2 for Hindi. Press 3 for Odia.
    </Say>
  </Gather>
  <Say voice="Polly.Aditi" language="en-IN">Sorry, we didn't receive any input. Goodbye.</Say>
</Response>`;
  res.type("text/xml").send(twiml);
});

/**
 * POST /api/ivr/gather
 * Twilio webhook: After language selection — gather speech input
 */
router.post("/ivr/gather", (req: Request, res: Response) => {
  const digit = req.body.Digits || "1";
  const langMap: Record<string, { code: string; voice: string; prompt: string }> = {
    "1": { code: "en-IN", voice: "Polly.Aditi", prompt: "Please describe your farming problem after the beep. For example, say: flood warning in my area, or pest attack on paddy." },
    "2": { code: "hi-IN", voice: "Polly.Aditi", prompt: "कृपया बीप के बाद अपनी खेती की समस्या बताएं। जैसे: मेरे क्षेत्र में बाढ़ की चेतावनी, या धान पर कीट हमला।" },
    "3": { code: "or-IN", voice: "Polly.Aditi", prompt: "ଦୟାକରି ବୀପ ପରେ ଆପଣଙ୍କ ଚାଷ ସମସ୍ୟା କୁହନ୍ତୁ।" },
  };

  const lang = langMap[digit] || langMap["1"];

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" speechTimeout="auto" language="${lang.code}" action="/api/ivr/process?lang=${digit}" method="POST">
    <Say voice="${lang.voice}" language="${lang.code}">${lang.prompt}</Say>
  </Gather>
  <Say voice="${lang.voice}" language="${lang.code}">Sorry, we could not hear you. Please call again.</Say>
</Response>`;
  res.type("text/xml").send(twiml);
});

/**
 * POST /api/ivr/process
 * Twilio webhook: Process speech → run agents → voice response + SMS
 */
router.post("/ivr/process", async (req: Request, res: Response) => {
  const spokenText = req.body.SpeechResult || "weather advisory";
  const callerPhone = req.body.From || "";
  const langDigit = (req.query.lang as string) || "1";

  const voiceMap: Record<string, { voice: string; lang: string }> = {
    "1": { voice: "Polly.Aditi", lang: "en-IN" },
    "2": { voice: "Polly.Aditi", lang: "hi-IN" },
    "3": { voice: "Polly.Aditi", lang: "or-IN" },
  };

  const v = voiceMap[langDigit] || voiceMap["1"];
  let adviceText = "";

  try {
    // Run the multi-agent system on the spoken query
    const result = await orchestrator.executeDistrictWorkflow("Kendrapara", "Odisha", ["paddy"]);
    const advisorData = result.agentResponses?.find((r: any) => r.agentName === "Advisor");
    const sentinelData = result.agentResponses?.find((r: any) => r.agentName === "Sentinel");
    const wd = (sentinelData?.data as any)?.weatherData;
    const actionPlan = (advisorData?.data as any)?.actionPlan || [];
    const schemes = (advisorData?.data as any)?.schemeRecommendations || [];

    if (wd) {
      adviceText += `Current weather: ${Math.round(wd.temperature)} degrees celsius, humidity ${wd.humidity} percent. `;
    }

    if (actionPlan.length > 0) {
      adviceText += `My recommendations: `;
      actionPlan.slice(0, 3).forEach((a: any, i: number) => {
        adviceText += `${i + 1}. ${a.title || a.description || String(a)}. `;
      });
    }

    if (schemes.length > 0) {
      const schemeNames = schemes.slice(0, 2).map((s: any) => s.name || s.fullName || String(s)).join(" and ");
      adviceText += `You may be eligible for ${schemeNames}. `;
    }

    adviceText += `For more help, visit your nearest Krishi Vigyan Kendra or call this number again.`;

    // Send SMS with scheme link if Twilio is configured
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_NUMBER;

    if (accountSid && authToken && from && callerPhone) {
      try {
        const smsBody = `KISANBODHI Advisory:\n${actionPlan.slice(0, 2).map((a: any, i: number) => `${i + 1}. ${a.title || a.description || String(a)}`).join("\n")}\n\nPMFBY Enrollment: https://pmfby.gov.in\nPM-KISAN: https://pmkisan.gov.in\nHelpline: 1800-180-1551`;

        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        const twilioAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
        
        await fetch(twilioUrl, {
          method: "POST",
          headers: { Authorization: `Basic ${twilioAuth}`, "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ To: callerPhone, From: from, Body: smsBody }).toString(),
        });
        console.log(`SMS advisory sent to ${callerPhone}`);

        adviceText += ` I have also sent you an SMS with scheme links and helpline numbers.`;
      } catch (smsErr) {
        console.warn("SMS send failed:", smsErr);
      }
    }
  } catch (error) {
    console.error("IVR processing error:", error);
    adviceText = "I am sorry, the system is busy right now. Please try again in a few minutes. For immediate help, call the Kisan helpline at 1800-180-1551.";
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${v.voice}" language="${v.lang}">
    Thank you for calling KISANBODHI. You said: ${spokenText}. 
    Here is my advice: ${adviceText}
  </Say>
  <Say voice="${v.voice}" language="${v.lang}">
    Thank you for using KISANBODHI. Jai Kisan!
  </Say>
</Response>`;
  res.type("text/xml").send(twiml);
});

/**
 * GET /api/ivr/status
 * Check IVR system status
 */
router.get("/ivr/status", (req: Request, res: Response) => {
  res.json({
    status: "active",
    description: "KISANBODHI IVR System for Feature Phone Farmers",
    flow: [
      "1. Farmer dials toll-free number",
      "2. Language selection (English/Hindi/Odia)",
      "3. Farmer speaks their problem",
      "4. AI processes via multi-agent system",
      "5. Voice reads advisory back to farmer",
      "6. SMS sent with scheme links & helpline numbers",
    ],
    supported_languages: ["English", "Hindi (हिंदी)", "Odia (ଓଡ଼ିଆ)"],
    twilio_configured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    toll_free_hint: "Configure Twilio phone number and point webhook to /api/ivr/welcome",
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
    const crops = (context?.crops || ["paddy"]).join(", ");

    // Takshashila Policy Prompt for Google Gemini
    const systemPrompt = `You are KISANBODHI, a 5-Agent Agricultural Intelligence system analyzing queries for a farmer in ${district} growing ${crops}.

According to the Takshashila Institution Policy Framework, you MUST apply strict risk assessment to all queries:
Policy 1: Human In The Loop (HITL). High-risk advice (e.g. premature harvesting, chemical dumps) MUST be locked pending Krishi Sahayak approval.
Policy 2: Risk-Based System. Categorize risk as 'LOW', 'MEDIUM', or 'HIGH'. 
LOW: automated suggestions. MEDIUM: warnings. HIGH: locked, human-approved only.
Policy 3: Transparency. Every response MUST factor in a Confidence Score (0-100). If confidence < 70, risk escalation is managed by human intervention.

IMPORTANT: Respond ONLY with a valid JSON object matching this schema exactly:
{
  "agents_output": {
    "sentinel": {
      "weather_alert": "Brief assessment of query weather impact",
      "hazard_signal": "LOW", "MEDIUM", or "HIGH",
      "probability": 0.0 to 1.0 (float)
    },
    "analyst": {
      "risk_score": 1 to 10 (int),
      "crop_loss_probability": 0.0 to 1.0 (float),
      "income_impact": "string describing $ impact or loss"
    },
    "advisor": {
      "recommendations": ["list", "of", "up", "to", "4", "specific", "actionable", "steps"]
    },
    "policy": {
      "sdg_alignment": ["SDG X.X: brief explanation"],
      "applicable_schemes": ["PMFBY", "PM-KISAN", "eNAM", "KCC"]
    }
  }
}

If hazard_signal is HIGH or confidence is < 70, you MUST state that human approval (Krishi Sahayak) is required in the advisor recommendations. Return ONLY JSON.`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + "\\n\\nFarmer Query: " + query }] }
      ]
    });

    let rawOutput = result.text || "{}";
    rawOutput = rawOutput.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();

    let aiData;
    try {
      aiData = JSON.parse(rawOutput);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", parseError);
      throw new Error("Invalid output format from LLM");
    }

    res.json({
      status: "success",
      query,
      agents_output: aiData.agents_output,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Agent query error:", error);
    res.status(500).json({
      status: "error",
      error: "Agent pipeline failed. Using fallback response.",
      agents_output: {
        sentinel: { weather_alert: "System processing fallback", hazard_signal: "LOW", probability: 0.1 },
        analyst: { risk_score: 3, crop_loss_probability: 0.1, income_impact: "Moderate impact expected" },
        advisor: { recommendations: ["Check internet connection", "Consult local Krishi Sahayak"] },
        policy: { sdg_alignment: ["SDG 1: No Poverty"], applicable_schemes: ["PMFBY"] },
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
