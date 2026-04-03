import { useState, useEffect } from "react";
import { Terminal, Zap, WifiOff, AlertTriangle, Activity } from "lucide-react";

type CrisisMode = "standard" | "offline" | "extreme";

const MOCK_LOGS = [
  "[Orchestrator] Initializing multi-agent pipeline...",
  "[Sentinel] Fetching IMD Weather API → Paradip station...",
  "[Sentinel] Data received: Wind 145km/h, Pressure 960hPa",
  "[Analyst] Running risk model on crop: Paddy (Kharif)...",
  "[Analyst] Vulnerability Score: 82% — CRITICAL",
  "[Memory] No API? Loading local cache from last sync...",
  "[Policy] Cross-referencing PMFBY eligibility criteria...",
  "[Policy] SDG 16.3 Governance check → VERIFIED ✓",
  "[Sahayak] Generating advisory in ଓଡ଼ିଆ (Odia)...",
  "[Orchestrator] Delegating to ActionPlanner agent...",
  "[ActionPlanner] 3 priority actions generated.",
  "[Sentinel] Monitoring cyclone trajectory — ETA 14hrs...",
  "[Analyst] Re-evaluating risk with new satellite data...",
  "[Policy] NDRF guidelines cross-checked ✓",
  "[Orchestrator] Advisory delivered to farmer terminal.",
];

export default function AgentSidebar() {
  const [mode, setMode] = useState<CrisisMode>("standard");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setLogs([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < MOCK_LOGS.length) {
        setLogs((prev) => [...prev, MOCK_LOGS[i]]);
        i++;
      } else {
        i = 0;
        setLogs([]);
      }
    }, 1800);
    return () => clearInterval(interval);
  }, [mode]);

  const modeOptions: { value: CrisisMode; label: string; icon: React.ReactNode }[] = [
    { value: "standard", label: "Standard", icon: <Activity className="w-4 h-4" /> },
    { value: "offline", label: "Memory Mode", icon: <WifiOff className="w-4 h-4" /> },
    { value: "extreme", label: "Extreme Threat", icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-80 min-h-screen bg-panel-bg text-panel-fg flex flex-col border-r border-panel-border shrink-0 hidden lg:flex">
      {/* Header */}
      <div className="p-5 border-b border-panel-border">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-panel-accent" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-panel-accent">
            Agentic Control Panel
          </h2>
        </div>
      </div>

      {/* Crisis Simulator */}
      <div className="p-5 border-b border-panel-border">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-panel-fg/60 mb-3">
          Crisis Simulator
        </h3>
        <div className="flex flex-col gap-2">
          {modeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMode(opt.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === opt.value
                  ? "bg-panel-accent text-primary-foreground"
                  : "bg-panel-muted text-panel-fg/70 hover:bg-panel-muted/80"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            mode === "extreme" ? "bg-destructive animate-pulse" : mode === "offline" ? "bg-warning animate-pulse" : "bg-panel-accent"
          }`} />
          <span className="text-xs text-panel-fg/50">
            {mode === "standard" && "All systems nominal"}
            {mode === "offline" && "API disconnected — using cached data"}
            {mode === "extreme" && "⚠ Severe weather event active"}
          </span>
        </div>
      </div>

      {/* Agent Terminal */}
      <div className="flex-1 flex flex-col p-5 min-h-0">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-panel-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-panel-fg/60">
            Agent Terminal
          </h3>
        </div>
        <div className="flex-1 bg-black/40 rounded-lg p-3 overflow-y-auto font-mono-terminal text-xs leading-relaxed border border-panel-border">
          {logs.map((log, i) => (
            <div key={i} className={`mb-1 ${
              log.includes("CRITICAL") || log.includes("Extreme")
                ? "text-destructive"
                : log.includes("VERIFIED") || log.includes("✓")
                ? "text-panel-accent"
                : "text-emerald-400/80"
            }`}>
              <span className="text-panel-fg/30 mr-2">{String(i + 1).padStart(2, "0")}</span>
              {log}
            </div>
          ))}
          <span className="text-panel-accent animate-blink">█</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-panel-border text-center">
        <p className="text-[10px] text-panel-fg/30 uppercase tracking-widest">
          Kisanbodhi v1.0 · Multi-Agent System
        </p>
      </div>
    </aside>
  );
}
