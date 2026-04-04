import { useState } from "react";
import { Mic, Send, AlertTriangle, ShieldCheck, Sprout, Tractor, OctagonAlert, FileCheck, AlertCircle, Loader2 } from "lucide-react";
import { useAdvisory } from "../hooks/useApi";
import { Farmer } from "../services/api.client";
import { Alert, AlertDescription } from "./ui/alert";

const languages = [
  { code: "en", label: "English" },
  { code: "od", label: "ଓଡ଼ିଆ (Odia)" },
  { code: "hi", label: "हिन्दी (Hindi)" },
];

const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-24 bg-muted rounded-2xl" />
    <div className="h-40 bg-muted rounded-2xl" />
    <div className="h-32 bg-muted rounded-2xl" />
  </div>
);

interface FarmerDashboardProps {
  farmer?: Farmer;
}

export default function FarmerDashboard({ farmer }: FarmerDashboardProps) {
  const [lang, setLang] = useState("en");
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(true);
  const [isListening, setIsListening] = useState(false);
  
  // Fetch advisory data from backend
  const { data: advisoryData, isLoading, error } = useAdvisory(farmer, true);

  const handleMicClick = () => {
    setIsListening(!isListening);
    // Future: wire to Web Speech API / backend
  };

  const handleSubmit = () => {
    if (input.trim()) {
      setShowResults(true);
      setInput("");
    }
  };

  return (
    <main className="flex-1 min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Sprout className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground tracking-tight">KISANBODHI</h1>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="lang-select" className="text-sm font-medium text-muted-foreground">
            🌐
          </label>
          <select
            id="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border border-input rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-8 max-w-4xl mx-auto w-full">
        {/* Voice-First Hero */}
        <section className="text-center mb-10">
          <button
            onClick={handleMicClick}
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto transition-all hover:scale-105 active:scale-95 ${
              isListening ? "animate-pulse-mic ring-4 ring-primary/30" : ""
            }`}
            aria-label="Tap to speak"
          >
            <Mic className="w-14 h-14 sm:w-16 sm:h-16" />
          </button>
          <p className="mt-5 text-lg sm:text-xl font-semibold text-foreground">
            {lang === "hi" ? "अपनी स्थिति बोलने के लिए टैप करें" :
             lang === "od" ? "ଆପଣଙ୍କ ପରିସ୍ଥିତି କହିବାକୁ ଟ୍ୟାପ୍ କରନ୍ତୁ" :
             "Tap to Speak your situation"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "hi" ? "(अपनी स्थानीय भाषा में)" :
             lang === "od" ? "(ଆପଣଙ୍କ ସ୍ଥାନୀୟ ଭାଷାରେ)" :
             "(in your local language)"}
          </p>
          {isListening && (
            <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              {lang === "hi" ? "सुन रहा हूँ..." : lang === "od" ? "ଶୁଣୁଛି..." : "Listening..."}
            </div>
          )}
        </section>

        {/* Fallback Text Input */}
        <section className="mb-10">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={
                lang === "hi" ? "या अपनी स्थिति यहाँ लिखें..." :
                lang === "od" ? "କିମ୍ବା ଏଠାରେ ଲେଖନ୍ତୁ..." :
                "Or type your situation here..."
              }
              className="flex-1 border border-input rounded-xl px-5 py-3.5 text-base bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none"
            />
            <button
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-semibold text-base hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
            >
              <Send className="w-5 h-5" />
              {lang === "hi" ? "सलाह लें" : lang === "od" ? "ପରାମର୍ଶ" : "Get Advice"}
            </button>
          </div>
        </section>

        {/* Mock Results */}
        {showResults && (
          <section className="space-y-5 animate-in fade-in duration-500">
            {/* Loading State */}
            {isLoading && <SkeletonLoader />}

            {/* Error State */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Unable to fetch advisory data. Please try again later.
                </AlertDescription>
              </Alert>
            )}

            {/* Display Backend Data */}
            {advisoryData && !isLoading && (
              <>
                {/* Extract data from advisory response */}
                {advisoryData.data?.sentinelReport?.alerts && advisoryData.data.sentinelReport.alerts.length > 0 && (
                  <>
                    {advisoryData.data.sentinelReport.alerts.map((alert, idx) => (
                      <div key={idx} className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-5 flex items-start gap-4">
                        <AlertTriangle className="w-8 h-8 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-lg font-bold text-destructive">
                            {alert.type === "weather" ? "⚠️ " : ""}
                            {alert.description}
                          </h3>
                          <p className="text-sm text-foreground/70 mt-1">
                            {alert.severity === "critical" && "Immediate action required"}
                            {alert.severity === "high" && "Please take necessary precautions"}
                            {alert.severity === "medium" && "Monitor situation closely"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Action Plan from Backend */}
                {advisoryData.data?.advisorReport?.actionItems && advisoryData.data.advisorReport.actionItems.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                    <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      {lang === "hi" ? "कार्य योजना" : lang === "od" ? "କାର୍ଯ୍ୟ ଯୋଜନା" : "Action Plan"}
                    </h3>
                    <div className="space-y-4">
                      {advisoryData.data.advisorReport.actionItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-muted/50 rounded-xl p-4">
                          <div className="w-7 h-7 text-primary shrink-0">
                            {item.priority === "critical" && <OctagonAlert className="w-7 h-7 text-destructive" />}
                            {item.priority === "high" && <Tractor className="w-7 h-7 text-warning" />}
                            {item.priority !== "critical" && item.priority !== "high" && <ShieldCheck className="w-7 h-7 text-primary" />}
                          </div>
                          <span className="text-base font-medium text-foreground">{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scheme Recommendations from Backend */}
                {advisoryData.data?.advisorReport?.schemeRecommendations && advisoryData.data.advisorReport.schemeRecommendations.length > 0 && (
                  <>
                    {advisoryData.data.advisorReport.schemeRecommendations.map((scheme, idx) => (
                      <div key={idx} className="bg-info/10 border-2 border-info/30 rounded-2xl p-5 flex items-start gap-4">
                        <FileCheck className="w-8 h-8 text-info shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-info">
                            {scheme.name}
                          </h3>
                          <p className="text-sm text-foreground/70 mt-1 mb-3">
                            {scheme.description}
                          </p>
                          <div className="text-xs text-muted-foreground mb-3">
                            <span className="bg-info/20 text-info px-2 py-1 rounded">
                              Match: {Math.round((scheme.matchPercentage || 0) * 100)}%
                            </span>
                          </div>
                          <button className="bg-info text-info-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                            {lang === "hi" ? "🔊 विवरण सुनें / आवेदन करें" :
                             lang === "od" ? "🔊 ବିବରଣୀ ଶୁଣନ୍ତୁ / ଆବେଦନ କରନ୍ତୁ" :
                             "🔊 Learn More / Apply"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Fallback: Show mock data if no real data yet */}
                {(!advisoryData.data?.sentinelReport?.alerts || advisoryData.data.sentinelReport.alerts.length === 0) &&
                 (!advisoryData.data?.advisorReport?.actionItems || advisoryData.data.advisorReport.actionItems.length === 0) && (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      {lang === "hi" ? "कोई तत्काल सलाह उपलब्ध नहीं है" :
                       lang === "od" ? "କୌଣସି ତାତ୍ତ୍ଵିକ ପରାମର୍ଶ ନାହିଁ" :
                       "No urgent advisories at this time"}
                    </p>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
