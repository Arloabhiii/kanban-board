import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Terminal, Sparkles, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const TIPS = [
  "plan my grind for this week 💪",
  "help me break down this feature",
  "what habits should I track? 🤔",
  "roast my productivity ngl",
];

const AI_RESPONSES = [
  "ok bestie here's the game plan:\n\n1. **Break it into micro-tasks** — small wins = dopamine = more grinding\n2. **Time block everything** — calendar is your best friend fr\n3. **25-min pomodoro sprints** — lock in, no cap\n\nshall I create tasks in the kanban? say less 🫡",
  "ngl you're asking the right questions! here's my hot take:\n\n- **Morning**: tackle the hardest code first (eat the frog energy 🐸)\n- **Afternoon**: meetings, reviews, collabs\n- **Evening**: learn something new, read docs\n\nconsistency > motivation always. you got this 💪",
  "let me cook real quick... 🧑‍🍳\n\n```\nPhase 1: Research    [2 hrs] 📖\nPhase 2: Build MVP   [4 hrs] 🔨\nPhase 3: Ship it     [1 hr]  🚀\n```\n\nthe key is shipping fast and iterating. perfectionism is the enemy fr fr",
  "analyzed your workflow and... you're actually lowkey goated 🐐\n\n> Pro tip: stack your habits with your tasks\n> Example: Code 2hrs → gym → read → ship feature\n\nthis compound effect thing hits different. trust the process bestie ✨",
  "ok hot take but...\n\nyou don't need more productivity apps. you need **less decisions**.\n\n1. Pick 3 tasks max per day\n2. Do the scariest one first\n3. Celebrate small wins (literally)\n\nthat's the whole sigma grindset tbh 🧠",
];

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1", role: "assistant",
      content: "```\n> SYSTEM ONLINE\n> AI_ASSISTANT v4.20\n> vibes: immaculate ✨\n```\n\nyo what's good! 🫡 i'm your AI productivity bestie. ask me anything about planning, grinding, or just venting about code. no judgment zone fr fr",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    // Simulated typing delay for realism
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    }, delay);
  };

  const formatTime = (d: Date) => d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="rounded-lg bg-card cyber-border flex flex-col h-full hover-glow-cyan transition-all duration-300">
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
          <Terminal className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-[10px] font-bold tracking-wider text-primary text-glow-cyan">
            AI_BESTIE
          </h3>
          <p className="text-[8px] text-muted-foreground">powered by vibes ✨</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-cyber-green/10 rounded-full px-2 py-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse-glow" />
          <span className="text-[9px] text-cyber-green font-bold">ONLINE</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""} animate-slide-up`} style={{ animationDelay: `${idx * 0.05}s` }}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 animate-bounce-in">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed transition-all ${
              msg.role === "user"
                ? "bg-cyber-purple/10 border border-cyber-purple/20 text-foreground"
                : "bg-muted/50 text-foreground"
            }`}>
              <MessageContent content={msg.content} />
              <span className="block text-[8px] text-muted-foreground mt-1 opacity-50">{formatTime(msg.timestamp)}</span>
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-md bg-cyber-purple/20 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-cyber-purple" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 animate-slide-up">
            <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-primary animate-pulse-glow" />
            </div>
            <div className="bg-muted/50 rounded-lg px-4 py-2.5 flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: "0s" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: "0.3s" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: "0.6s" }} />
              </div>
              <span className="text-[9px] text-muted-foreground ml-1">cooking...</span>
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {TIPS.map(tip => (
            <button
              key={tip}
              onClick={() => setInput(tip)}
              className="text-[9px] px-2.5 py-1.5 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all duration-200 hover-scale click-shrink"
            >
              {tip}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-border">
        <div className="flex gap-1.5">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="spill the tea... ☕"
            className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-primary/20 border border-primary/30 rounded-lg hover:bg-primary/30 transition-all duration-200 hover-scale click-shrink disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```|\*\*.*?\*\*|> .*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const code = part.slice(3, -3).replace(/^\w+\n/, "");
          return <pre key={i} className="bg-background/50 rounded-md px-2 py-1.5 my-1.5 text-cyber-green text-[10px] overflow-x-auto font-mono border border-cyber-green/10">{code}</pre>;
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-primary">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("> ")) {
          return <div key={i} className="border-l-2 border-primary/30 pl-2 my-1 text-muted-foreground italic">{part.slice(2)}</div>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
