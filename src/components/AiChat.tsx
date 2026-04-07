import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Terminal } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const TIPS = [
  "Plan my sprint tasks for this week",
  "Help me break down a feature",
  "What habits should I track?",
  "Create a study schedule",
];

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "```\n> SYSTEM ONLINE\n> AI_ASSISTANT v2.0\n> Ready to assist.\n```\nHow can I help you optimize your workflow today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulated AI response (replace with real AI gateway when backend is connected)
    setTimeout(() => {
      const responses = [
        "I've analyzed your request. Here's my recommendation:\n\n1. **Break it into smaller tasks** — create subtasks in your kanban board\n2. **Set time blocks** — use the calendar to schedule focus sessions\n3. **Use pomodoro** — 25-min sprints for deep work\n\nShall I help you create specific tasks?",
        "Great question! Based on productivity research:\n\n- **Morning**: High-priority coding tasks\n- **Afternoon**: Meetings & reviews\n- **Evening**: Learning & reading\n\nI'd suggest tracking these habits daily for optimal results.",
        "Here's a structured approach:\n\n```\nPhase 1: Planning  [2 hrs]\nPhase 2: Execution [4 hrs]\nPhase 3: Review    [1 hr]\n```\n\nWant me to set up time blocks in your calendar?",
        "Analyzing your workflow patterns...\n\n> Recommendation: Focus on **one major task** per pomodoro session.\n> Track completion rates in your habit tracker.\n> Review weekly for continuous improvement.\n\nLet me know if you need more specific guidance!",
      ];
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="rounded-lg bg-card cyber-border flex flex-col h-full">
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <Terminal className="w-3.5 h-3.5 text-primary" />
        <h3 className="font-display text-xs font-bold tracking-wider text-primary text-glow-cyan">
          // AI_ASSISTANT
        </h3>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse-glow" />
          <span className="text-[9px] text-cyber-green">ONLINE</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3 h-3 text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] rounded px-3 py-2 text-xs leading-relaxed ${
              msg.role === "user"
                ? "bg-primary/10 border border-primary/20 text-foreground"
                : "bg-muted/50 text-foreground"
            }`}>
              <MessageContent content={msg.content} />
            </div>
            {msg.role === "user" && (
              <div className="w-5 h-5 rounded bg-cyber-purple/20 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3 h-3 text-cyber-purple" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center shrink-0">
              <Bot className="w-3 h-3 text-primary" />
            </div>
            <div className="bg-muted/50 rounded px-3 py-2">
              <Loader2 className="w-3 h-3 text-primary animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Quick tips */}
      {messages.length <= 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {TIPS.map(tip => (
            <button
              key={tip}
              onClick={() => { setInput(tip); }}
              className="text-[9px] px-2 py-1 rounded bg-muted/50 border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
            >
              {tip}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-border">
        <div className="flex gap-1">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="> enter_command..."
            className="flex-1 bg-muted/30 border border-border rounded px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="p-2 bg-primary/20 border border-primary/30 rounded hover:bg-primary/30 transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  // Simple markdown-ish rendering
  const parts = content.split(/(```[\s\S]*?```|\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const code = part.slice(3, -3).replace(/^\w+\n/, "");
          return <pre key={i} className="bg-background/50 rounded px-2 py-1 my-1 text-cyber-green text-[10px] overflow-x-auto font-mono">{code}</pre>;
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-primary">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
