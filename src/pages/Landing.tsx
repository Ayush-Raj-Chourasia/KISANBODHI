import { Sprout, Shield, Users, Zap, Leaf, ArrowRight, Terminal, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
              <Sprout className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
            KISANBODHI
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-powered disaster response for India's smallholder farmers.
            <br className="hidden sm:block" />
            Real-time advisories. Local languages. Zero complexity.
          </p>

          {/* Feature Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: Shield, text: "PMFBY Integrated" },
              { icon: Zap, text: "Multi-Agent AI" },
              { icon: Leaf, text: "SDG Aligned" },
            ].map((f) => (
              <div
                key={f.text}
                className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-foreground shadow-sm"
              >
                <f.icon className="w-4 h-4 text-primary" />
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Login Cards */}
      <section className="flex-1 flex items-start justify-center px-6 pb-20 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {/* Farmer Login */}
          <button
            onClick={() => navigate("/farmer")}
            className="group relative bg-card border-2 border-border hover:border-primary rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Farmer Login</h2>
            <p className="text-muted-foreground leading-relaxed">
              Simple, voice-first interface for farmers. Get real-time disaster alerts, crop advisories, and government scheme info in your language.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Voice Input", "Local Languages", "Simple UI"].map((tag) => (
                <span key={tag} className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </button>

          {/* Developer Login */}
          <button
            onClick={() => navigate("/developer")}
            className="group relative bg-panel-bg border-2 border-panel-border hover:border-panel-accent rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:shadow-panel-accent/10 hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-5 h-5 text-panel-accent" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-panel-accent/10 flex items-center justify-center mb-5">
              <Terminal className="w-8 h-8 text-panel-accent" />
            </div>
            <h2 className="text-2xl font-bold text-panel-fg mb-2">Developer Login</h2>
            <p className="text-panel-fg/70 leading-relaxed">
              Full agentic control panel with multi-agent terminal, crisis simulator, and real-time orchestration logs for judges and developers.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Agent Terminal", "Crisis Sim", "Full Logs"].map((tag) => (
                <span key={tag} className="text-xs font-medium bg-panel-accent/10 text-panel-accent px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Kisanbodhi v1.0 · AI Governance Hackathon · Multi-Agent Disaster Response System
        </p>
      </footer>
    </div>
  );
}
