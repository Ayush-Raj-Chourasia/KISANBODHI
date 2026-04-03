import { useState } from "react";
import { Bot, Mic, Send, X } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState("");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold text-sm">AI Sahayak</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:opacity-70 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 h-48 overflow-y-auto bg-muted/30">
            <div className="bg-card border border-border rounded-xl p-3 text-sm text-foreground shadow-sm">
              <p className="font-medium">🙏 Namaste!</p>
              <p className="mt-1 text-foreground/70">
                I am your <strong>Kisanbodhi Sahayak</strong>. Ask me any farming questions in your language.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                मैं आपकी भाषा में मदद कर सकता हूँ। · ମୁଁ ଆପଣଙ୍କ ଭାଷାରେ ସାହାଯ୍ୟ କରିପାରିବି।
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex items-center gap-2">
            <button className="text-muted-foreground hover:text-primary transition-colors shrink-0" aria-label="Voice input">
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
            />
            <button className="text-primary hover:opacity-70 transition-opacity shrink-0" aria-label="Send">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          aria-label="Open chat"
        >
          <Bot className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}
