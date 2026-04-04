import { useState, useEffect } from "react";
import { Bot, Mic, Send, X, AlertCircle, Loader } from "lucide-react";
import { useAdvisory } from "../hooks/useApi";
import { Farmer, Alert as AlertType } from "../services/api.client";

interface ChatWidgetProps {
  farmer?: Farmer;
  onClose?: () => void;
}

export default function ChatWidget({ farmer, onClose }: ChatWidgetProps) {
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);

  // Fetch advisory data from backend
  const { data: advisory, isLoading, error } = useAdvisory(farmer || null, open);

  // Initialize chat with advisory data
  useEffect(() => {
    if (advisory?.data) {
      const insights = advisory.data.advisorReport?.farmerAdvice || 
                      advisory.data.consolidatedInsight ||
                      "Your agricultural advisory is ready!";
      
      setChatMessages([
        {
          role: "bot",
          content: `🙏 Namaste! I am your AI Sahayak. Here's your personalized advisory:\n\n${insights}`,
        },
      ]);
    }
  }, [advisory]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);

    // Simulated bot response with data
    const botResponse = generateBotResponse(advisory, message);
    setChatMessages((prev) => [...prev, { role: "bot", content: botResponse }]);

    setMessage("");
  };

  const generateBotResponse = (advisory: any, userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    const sentinelReport = advisory?.data?.sentinelReport;
    const advisorReport = advisory?.data?.advisorReport;
    const analystReport = advisory?.data?.analystReport;

    if (msg.includes("weather")) {
      const weather = sentinelReport?.weatherData;
      return `Current Weather:\n🌡️ Temperature: ${weather?.temperature}°C\n💧 Humidity: ${weather?.humidity}%\n🌧️ Rainfall: ${weather?.rainfall}mm\n💨 Wind Speed: ${weather?.windSpeed} km/h`;
    }

    if (msg.includes("market") || msg.includes("price")) {
      const markets = sentinelReport?.marketData || [];
      return `Market Prices:\n${markets
        .slice(0, 3)
        .map((m: any) => `${m.cropName}: ₹${m.price} (${m.trend})`)
        .join("\n")}`;
    }

    if (msg.includes("alert")) {
      const alerts = sentinelReport?.alerts || [];
      return `⚠️ Active Alerts:\n${alerts
        .slice(0, 3)
        .map((a: AlertType) => `${a.severity.toUpperCase()}: ${a.title}`)
        .join("\n")}`;
    }

    if (msg.includes("scheme") || msg.includes("benefit")) {
      const schemes = advisorReport?.schemeRecommendations || [];
      return `📋 Recommended Schemes:\n${schemes
        .slice(0, 2)
        .map((s: any) => `${s.name}: ${s.reason || s.description}`)
        .join("\n")}`;
    }

    if (msg.includes("risk")) {
      const crops = analystReport?.cropLossModels || [];
      return `Risk Assessment:\n${crops
        .slice(0, 2)
        .map((c: any) => `${c.cropType}: ${c.overallRisk}% overall risk`)
        .join("\n")}`;
    }

    return "Tell me what you'd like to know! Ask about:\n• Weather\n• Market Prices\n• Alerts\n• Schemes\n• Risk Assessment";
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  if (!farmer) {
    return null; // Don't show widget if no farmer data
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <span className="font-semibold text-sm block">AI Sahayak</span>
                <span className="text-xs opacity-90">{farmer.name}</span>
              </div>
            </div>
            <button onClick={handleClose} className="hover:opacity-70 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="px-4 py-2 bg-destructive/10 border-b border-destructive text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Error loading data</span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !advisory && (
            <div className="px-4 py-8 flex flex-col items-center justify-center gap-2">
              <Loader className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Fetching your advisory...</span>
            </div>
          )}

          {/* Chat Messages */}
          {!isLoading && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
              {chatMessages.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-3 text-sm text-foreground shadow-sm">
                  <p className="font-medium">🙏 Namaste!</p>
                  <p className="mt-1 text-foreground/70">
                    I am your <strong>Kisanbodhi Sahayak</strong>. Loading your personalized advisory...
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground"
                      } whitespace-pre-wrap break-words`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border flex items-center gap-2">
            <button
              className="text-muted-foreground hover:text-primary transition-colors shrink-0"
              aria-label="Voice input"
              disabled={isLoading}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about weather, market, schemes..."
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="text-primary hover:opacity-70 transition-opacity shrink-0 disabled:opacity-50"
              aria-label="Send"
              disabled={isLoading || !message.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform relative"
          aria-label="Open chat"
        >
          <Bot className="w-7 h-7" />
          {isLoading && (
            <div className="absolute inset-0 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
          )}
        </button>
      )}
    </div>
  );
}
