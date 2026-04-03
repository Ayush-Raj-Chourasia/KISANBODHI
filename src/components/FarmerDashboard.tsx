import { useState } from "react";
import { Mic, Send, AlertTriangle, ShieldCheck, Sprout, Tractor, OctagonAlert, FileCheck } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "od", label: "ଓଡ଼ିଆ (Odia)" },
  { code: "hi", label: "हिन्दी (Hindi)" },
];

export default function FarmerDashboard() {
  const [lang, setLang] = useState("en");
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(true);
  const [isListening, setIsListening] = useState(false);

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
            {/* Alert Card */}
            <div className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-5 flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-destructive shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-destructive">
                  ⚠️ {lang === "hi" ? "चक्रवात चेतावनी: पारादीप तट" :
                       lang === "od" ? "ବାତ୍ୟା ସତର୍କତା: ପାରାଦୀପ ଉପକୂଳ" :
                       "Cyclone Alert: Paradip Coast"}
                </h3>
                <p className="text-sm text-foreground/70 mt-1">
                  {lang === "hi" ? "14 घंटे में भूमिगत होने की संभावना। हवा: 145km/h" :
                   lang === "od" ? "14 ଘଣ୍ଟା ମଧ୍ୟରେ ଭୂମିଗତ ହେବାର ସମ୍ଭାବନା। ବାୟୁ: 145km/h" :
                   "Expected landfall in 14 hours. Wind: 145km/h"}
                </p>
              </div>
            </div>

            {/* Action Plan */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                {lang === "hi" ? "कार्य योजना" : lang === "od" ? "କାର୍ଯ୍ୟ ଯୋଜନା" : "Action Plan"}
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: <OctagonAlert className="w-7 h-7 text-destructive" />,
                    text: lang === "hi" ? "फसल की कटाई न करें — तूफ़ान तक रुकें" :
                          lang === "od" ? "ଫସଲ କାଟନ୍ତୁ ନାହିଁ — ଝଡ଼ ପର୍ଯ୍ୟନ୍ତ ଅପେକ୍ଷା କରନ୍ତୁ" :
                          "Do NOT harvest — wait until the storm passes",
                  },
                  {
                    icon: <Tractor className="w-7 h-7 text-warning" />,
                    text: lang === "hi" ? "ट्रैक्टर को ऊंचे स्थान पर ले जाएं" :
                          lang === "od" ? "ଟ୍ରାକ୍ଟରକୁ ଉଚ୍ଚ ସ୍ଥାନକୁ ସ୍ଥାନାନ୍ତର କରନ୍ତୁ" :
                          "Move tractor & equipment to high ground",
                  },
                  {
                    icon: <ShieldCheck className="w-7 h-7 text-primary" />,
                    text: lang === "hi" ? "NDRF हेल्पलाइन पर कॉल करें: 1078" :
                          lang === "od" ? "NDRF ହେଲ୍ପଲାଇନକୁ କଲ କରନ୍ତୁ: 1078" :
                          "Call NDRF Helpline: 1078 if evacuation needed",
                  },
                ].map((action, i) => (
                  <div key={i} className="flex items-center gap-4 bg-muted/50 rounded-xl p-4">
                    {action.icon}
                    <span className="text-base font-medium text-foreground">{action.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scheme Card */}
            <div className="bg-info/10 border-2 border-info/30 rounded-2xl p-5 flex items-start gap-4">
              <FileCheck className="w-8 h-8 text-info shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-info">
                  {lang === "hi" ? "PMFBY बीमा के लिए पात्र" :
                   lang === "od" ? "PMFBY ବୀମା ପାଇଁ ଯୋଗ୍ୟ" :
                   "Eligible for PMFBY Insurance"}
                </h3>
                <p className="text-sm text-foreground/70 mt-1 mb-3">
                  {lang === "hi" ? "प्रधानमंत्री फसल बीमा योजना — चक्रवात से फसल हानि कवर" :
                   lang === "od" ? "ପ୍ରଧାନମନ୍ତ୍ରୀ ଫସଲ ବୀମା ଯୋଜନା — ବାତ୍ୟା ଦ୍ୱାରା ଫସଲ କ୍ଷତି କଭର" :
                   "Pradhan Mantri Fasal Bima Yojana — covers cyclone crop loss"}
                </p>
                <button className="bg-info text-info-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                  {lang === "hi" ? "🔊 विवरण सुनें / आवेदन करें" :
                   lang === "od" ? "🔊 ବିବରଣୀ ଶୁଣନ୍ତୁ / ଆବେଦନ କରନ୍ତୁ" :
                   "🔊 Listen to Details / Apply"}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
