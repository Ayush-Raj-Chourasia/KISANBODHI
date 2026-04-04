import { Sprout, Shield, Users, Zap, Leaf, ArrowRight, Terminal, Mic, Globe, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
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

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary/8 blur-3xl" />
      </div>

      {/* Hero Section */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/4" />
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Sprout className="w-11 h-11 text-primary-foreground" />
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-none"
          >
            KISANBODHI
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-6 text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            AI-powered disaster response for India's smallholder farmers.
            <br className="hidden sm:block" />
            Real-time advisories. Local languages. Zero complexity.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            {[
              { icon: Shield, text: "PMFBY Integrated" },
              { icon: Zap, text: "Multi-Agent AI" },
              { icon: Leaf, text: "SDG Aligned" },
              { icon: Globe, text: "Multilingual" },
            ].map((f) => (
              <div
                key={f.text}
                className="flex items-center gap-2.5 bg-card border border-border rounded-full px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm"
              >
                <f.icon className="w-4.5 h-4.5 text-primary" />
                {f.text}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Login Cards */}
      <section className="flex-1 flex items-start justify-center px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          {/* Farmer Login */}
          <motion.button
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            custom={4}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/farmer")}
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
              Simple, voice-first interface for farmers. Get real-time disaster alerts, crop advisories, and government scheme info in your language.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {[
                { icon: Mic, label: "Voice Input" },
                { icon: Globe, label: "Local Languages" },
                { icon: Bot, label: "AI Sahayak" },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold bg-primary/10 text-primary px-4 py-1.5 rounded-full"
                >
                  <tag.icon className="w-3.5 h-3.5" />
                  {tag.label}
                </span>
              ))}
            </div>
          </motion.button>

          {/* Developer Login */}
          <motion.button
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            custom={5}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/developer")}
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
              Full agentic control panel with multi-agent terminal, crisis simulator, and real-time orchestration logs for judges and developers.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {[
                { icon: Terminal, label: "Agent Terminal" },
                { icon: Zap, label: "Crisis Sim" },
                { icon: Shield, label: "Full Logs" },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold bg-panel-accent/10 text-panel-accent px-4 py-1.5 rounded-full"
                >
                  <tag.icon className="w-3.5 h-3.5" />
                  {tag.label}
                </span>
              ))}
            </div>
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={6}
        className="py-8 border-t border-border text-center"
      >
        <p className="text-sm text-muted-foreground">
          Kisanbodhi v1.0 · AI Governance Hackathon · Multi-Agent Disaster Response System
        </p>
      </motion.footer>
    </div>
  );
}
