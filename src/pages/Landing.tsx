import { Sprout, Shield, Users, Zap, Leaf, ArrowRight, Terminal, Mic, Globe, Bot, BarChart3, FileText, AlertTriangle, Brain, Database, Cpu, Search, ChevronRight, Activity, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LandingChatbot } from "@/components/LandingChatbot";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const sdgs = [
  { num: 1, label: "No Poverty", color: "bg-red-500", desc: "Income protection for 100M+ smallholder farmers" },
  { num: 2, label: "Zero Hunger", color: "bg-amber-600", desc: "Reduced crop losses through early warning" },
  { num: 8, label: "Decent Work", color: "bg-rose-700", desc: "Agricultural modernization & rural employment" },
  { num: 11, label: "Sustainable Cities", color: "bg-orange-500", desc: "Rural community climate resilience" },
  { num: 13, label: "Climate Action", color: "bg-green-700", desc: "Real-time climate adaptation systems" },
];

const agents = [
  { name: "Sentinel", icon: Search, color: "from-blue-500 to-blue-700", desc: "Weather · Alerts · News", role: "Real-time monitoring of IMD weather, market prices, and agricultural news" },
  { name: "Analyst", icon: BarChart3, color: "from-amber-500 to-amber-700", desc: "Risk Score · Crop Impact", role: "Crop-loss probability modeling & income-risk scoring (1-10)" },
  { name: "Advisor", icon: Users, color: "from-green-500 to-green-700", desc: "Scheme Match · Action Plan", role: "Personalized farmer guidance with PMFBY/PM-KISAN matching" },
  { name: "Policy", icon: FileText, color: "from-emerald-600 to-emerald-800", desc: "SDG Map · Gov Briefs", role: "Takshashila governance briefs with SDG alignment" },
  { name: "Orchestrator", icon: Brain, color: "from-indigo-500 to-indigo-700", desc: "Task Routing · Memory", role: "Hierarchical coordination & dynamic re-planning" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/4" />
        <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-20 text-center">
          {/* Logo */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Sprout className="w-11 h-11 text-primary-foreground" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-none">
            KISANBODHI
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={1.5}
            className="mt-2 text-lg text-primary font-semibold tracking-wide">
            किसानबोधि · କିସାନବୋଧି
          </motion.p>

          {/* Subtitle */}
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="mt-6 text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Autonomous multi-agent AI protecting India's{" "}
            <span className="text-foreground font-semibold">100 million+</span>{" "}
            smallholder farmers from climate-driven agricultural crises.
          </motion.p>

          {/* Feature Pills */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: Shield, text: "PMFBY Integrated" },
              { icon: Brain, text: "5-Agent Architecture" },
              { icon: Leaf, text: "SDG 1, 2, 8, 11, 13" },
              { icon: Globe, text: "EN · हिंदी · ଓଡ଼ିଆ" },
              { icon: Activity, text: "Crisis Re-Planning" },
              { icon: Sparkles, text: "Takshashila Aligned" },
            ].map((f) => (
              <div key={f.text}
                className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:shadow-md transition-shadow">
                <f.icon className="w-4 h-4 text-primary" />
                {f.text}
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="mt-10 flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate("/login")}
              className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => document.getElementById("agents")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 bg-card border-2 border-border text-foreground px-8 py-3.5 rounded-2xl font-bold text-lg hover:border-primary/50 transition-colors">
              Explore Agents
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Portfolio Badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="mt-8 inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-5 py-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Portfolio: <span className="font-semibold text-foreground">Takshashila Institution</span> · Team IQ Zero
          </motion.div>
        </div>
      </header>

      {/* ─── AGENT ARCHITECTURE ─────────────────────────────────────── */}
      <section id="agents" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Five Autonomous Agents</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each agent reasons independently, coordinates through the Orchestrator, and adapts in real-time to crisis scenarios.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {agents.map((agent, i) => (
              <motion.div key={agent.name} variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="group bg-card border border-border rounded-2xl p-6 text-center hover:shadow-xl hover:shadow-primary/10 transition-all hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <agent.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-1">{agent.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{agent.desc}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{agent.role}</p>
              </motion.div>
            ))}
          </div>

          {/* Architecture flow arrow */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={6}
            className="mt-10 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="bg-card border border-border rounded-full px-4 py-2 font-medium">Farmer Query</span>
            <ArrowRight className="w-4 h-4" />
            <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 rounded-full px-4 py-2 font-bold">Orchestrator</span>
            <ArrowRight className="w-4 h-4" />
            <span className="bg-card border border-border rounded-full px-4 py-2 font-medium">Parallel Agent Execution</span>
            <ArrowRight className="w-4 h-4" />
            <span className="bg-primary/10 border border-primary/30 text-primary rounded-full px-4 py-2 font-bold">Advisory + Policy Brief</span>
          </motion.div>
        </div>
      </section>

      {/* ─── SDG ALIGNMENT ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-primary/3 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">SDG Alignment</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every advisory maps directly to UN Sustainable Development Goal targets.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {sdgs.map((sdg, i) => (
              <motion.div key={sdg.num} variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-card border border-border rounded-2xl p-5 text-center hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 ${sdg.color} rounded-xl flex items-center justify-center mx-auto mb-3 text-white font-extrabold text-lg`}>
                  {sdg.num}
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{sdg.label}</h3>
                <p className="text-xs text-muted-foreground">{sdg.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TAKSHASHILA POLICY ───────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="bg-card border-2 border-primary/20 rounded-3xl p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Takshashila Institution</h2>
                <p className="text-sm text-primary font-medium">Samaaj · Sarkaar · Bazaar</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              {[
                { title: "Samaaj (Society)", desc: "Community-driven data collection with farmer-owned profiles. Empowering local Krishi Vigyan Kendras as first responders." },
                { title: "Sarkaar (Government)", desc: "Light-touch regulation enabling voluntary AI adoption. Integration with existing Kisan Suvidha infrastructure." },
                { title: "Bazaar (Market)", desc: "Competitive market for agri-AI services preventing monopolistic capture. eNAM and PMFBY integration." },
              ].map((pillar) => (
                <div key={pillar.title} className="bg-background rounded-2xl p-5 border border-border">
                  <h3 className="font-bold text-foreground mb-2 text-sm">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-primary/5 rounded-2xl border border-primary/10">
              <h3 className="font-bold text-foreground mb-2 text-sm">Key Policy Recommendations</h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex gap-2"><span className="text-primary">①</span> Phased district-level pilot rollouts with competitive vendor participation</li>
                <li className="flex gap-2"><span className="text-primary">②</span> Federated data architecture — farmer profiles remain at state level (data sovereignty)</li>
                <li className="flex gap-2"><span className="text-primary">③</span> Voluntary compliance frameworks with transparent AI auditing</li>
                <li className="flex gap-2"><span className="text-primary">④</span> Quarterly SDG-aligned impact assessment and public reporting</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── LOGIN CARDS ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-primary/3 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Choose Your View</h2>
            <p className="text-lg text-muted-foreground">Farmer-friendly voice interface or full developer control panel.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Farmer Login */}
            <motion.button
              variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
              className="group relative bg-card border-2 border-border hover:border-primary rounded-3xl p-10 text-left transition-colors duration-300 hover:shadow-2xl hover:shadow-primary/15"
            >
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3">Farmer Login</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Simple, voice-first interface. Real-time alerts, crop advisories, and scheme info in your language.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {[
                  { icon: Mic, label: "Voice Input" },
                  { icon: Globe, label: "Local Languages" },
                  { icon: Bot, label: "AI Sahayak" },
                ].map((tag) => (
                  <span key={tag.label} className="inline-flex items-center gap-1.5 text-sm font-semibold bg-primary/10 text-primary px-4 py-1.5 rounded-full">
                    <tag.icon className="w-3.5 h-3.5" />
                    {tag.label}
                  </span>
                ))}
              </div>
            </motion.button>

            {/* Developer Login */}
            <motion.button
              variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
              className="group relative bg-panel-bg border-2 border-panel-border hover:border-panel-accent rounded-3xl p-10 text-left transition-colors duration-300 hover:shadow-2xl hover:shadow-panel-accent/15"
            >
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-6 h-6 text-panel-accent" />
              </div>
              <div className="w-20 h-20 rounded-2xl bg-panel-accent/10 flex items-center justify-center mb-6">
                <Terminal className="w-10 h-10 text-panel-accent" />
              </div>
              <h2 className="text-3xl font-bold text-panel-fg mb-3">Developer Login</h2>
              <p className="text-lg text-panel-fg/70 leading-relaxed">
                Full agentic control panel with multi-agent terminal, crisis simulator, and orchestration logs.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {[
                  { icon: Terminal, label: "Agent Terminal" },
                  { icon: Zap, label: "Crisis Sim" },
                  { icon: Shield, label: "Full Logs" },
                ].map((tag) => (
                  <span key={tag.label} className="inline-flex items-center gap-1.5 text-sm font-semibold bg-panel-accent/10 text-panel-accent px-4 py-1.5 rounded-full">
                    <tag.icon className="w-3.5 h-3.5" />
                    {tag.label}
                  </span>
                ))}
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* ─── CRISIS MODE ────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="bg-gradient-to-br from-red-950/80 to-red-900/40 border-2 border-red-500/30 rounded-3xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Crisis Mode</h2>
            <p className="text-lg text-red-200/80 max-w-xl mx-auto mb-6">
              Mid-demo scenario injection. Toggle a crisis event and watch all 5 agents re-plan autonomously — no manual prompting.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Flood → Cyclone", "API Failure", "Bias Flag", "New District"].map((scenario) => (
                <span key={scenario} className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-2 rounded-full text-sm font-medium">
                  {scenario}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <motion.footer
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
        className="py-10 border-t border-border"
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sprout className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">KISANBODHI v1.0</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Anant Chakra: Agentic Council · Chakravyuh Genesis 2026 · ITER SOA Bhubaneswar
          </p>
          <p className="text-sm text-muted-foreground">
            Team <span className="font-semibold text-foreground">IQ Zero</span>
          </p>
        </div>
      </motion.footer>

      {/* Floating Chatbot */}
      <LandingChatbot />
    </div>
  );
}
