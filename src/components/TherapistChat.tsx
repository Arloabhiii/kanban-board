import { useState, useRef, useEffect } from "react";
import { Send, Heart, User, Loader2, Sparkles, Shield, Brain } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "therapist";
  content: string;
  timestamp: Date;
}

const PROMPTS = [
  "i'm so burnt out rn 😩",
  "can't decide what to do with my life",
  "i keep procrastinating help 😭",
  "feeling imposter syndrome ngl",
];

const RESPONSES: Record<string, string[]> = {
  burnout: [
    "bestie, burnout is NOT a flex. your body is literally begging for a break 🫂\n\nhere's the real talk:\n\n1. **rest is productive** — your brain needs downtime to actually lock in later\n2. **set boundaries** — saying no is a superpower fr\n3. **micro-breaks** — 5 min every hour, touch grass, stretch\n\nyou're not lazy for being tired. you're human. and that's giving main character energy actually ✨",
    "ok pause. let me hold space for you rn 🫶\n\n> burnout doesn't mean you're weak. it means you gave too much without refilling your cup.\n\naction plan:\n- **tonight**: no screens after 9pm. just vibes.\n- **tomorrow**: do ONE thing you enjoy that has zero productivity value\n- **this week**: cancel one thing you don't want to do\n\nyou literally cannot pour from an empty cup bestie 💧",
  ],
  decision: [
    "ok let's break this down bc decision paralysis is SO real 🧠\n\nhere's a framework that hits different:\n\n1. **10/10/10 rule**: how will you feel about this choice in 10 minutes? 10 months? 10 years?\n2. **gut check**: close your eyes. flip a coin. the side you HOPE for? that's your answer.\n3. **both paths are valid** — there's no wrong choice, just different adventures\n\nwhat specifically are you torn between? let's talk it out 💭",
    "real talk: most decisions aren't as permanent as they feel rn 🎯\n\n> the anxiety of choosing is almost always worse than the outcome of either option\n\ntry this:\n- write both options down\n- for each, list: what's the BEST case? what's the WORST case? what's MOST LIKELY?\n- usually the most likely outcome of both is... totally fine\n\nyou're overthinking this and that's ok. your brain is just trying to protect you 🫂",
  ],
  procrastination: [
    "procrastination isn't laziness bestie, it's usually anxiety wearing a disguise 🎭\n\nthe tea:\n\n1. **you're not avoiding the task** — you're avoiding the FEELING (overwhelm, perfectionism, fear)\n2. **2-minute rule**: if it takes <2 min, do it NOW\n3. **ugly first draft** — give yourself permission to do it badly. done > perfect\n\n> \"I'll start after I feel motivated\" — motivation comes AFTER you start, not before\n\nwhat are you putting off rn? no judgment zone 🫶",
    "ok so procrastination is literally your brain choosing comfort over growth and that's valid but also... we can hack it 🧪\n\ntry:\n- **body doubling**: work next to someone (even virtually)\n- **temptation bundling**: boring task + fav playlist = bearable\n- **shrink the task**: \"write essay\" → \"open document and type one sentence\"\n\nyour future self will literally thank you. and if not today, tomorrow. baby steps are still steps 🐣",
  ],
  imposter: [
    "listen. EVERYONE feels like a fraud sometimes. literally everyone. even the people you look up to 💯\n\n> imposter syndrome is just proof that you're pushing yourself into new territory\n\nfacts:\n- **you earned your spot** — luck doesn't carry people as far as you think\n- **comparison is the thief of joy** — their chapter 20 vs your chapter 3\n- **keep a wins folder** — screenshot compliments, save good feedback, revisit when you doubt yourself\n\nyou're not faking it. you're LEARNING. and that's literally the most sigma thing you can do 🧠",
    "imposter syndrome? in THIS economy? bestie you're not alone 🫂\n\nlet me reframe:\n- feeling like you don't belong = you're surrounded by amazing people = you're in the RIGHT place\n- not knowing everything ≠ not deserving to be there\n- even the CEO googles stuff lol\n\n**homework**: write down 3 things you did well this week. doesn't matter how small. do it rn. i'll wait ✍️\n\nyou're literally more capable than your brain lets you believe 💪",
  ],
  general: [
    "i hear you. and i want you to know that whatever you're feeling right now is 100% valid 🫶\n\nthere's no \"right\" way to feel. emotions aren't math — they don't need to make sense.\n\nwhat would help you most rn?\n- **venting** without advice? i'm here for it\n- **action plan** to feel more in control?\n- **perspective shift** to see things differently?\n\nyou're not alone in this. and asking for help? that's actually the bravest thing 💜",
    "ok first of all — thank you for trusting me with this 🥺\n\nhere's what i know for sure:\n\n1. **feelings are temporary** — even the really intense ones pass\n2. **you've survived 100% of your worst days so far** — that's a perfect track record\n3. **small wins matter** — got out of bed? W. drank water? W. reached out? HUGE W.\n\ntell me more about what's going on. i'm not going anywhere 💜✨",
  ],
};

function categorize(text: string): string {
  const lower = text.toLowerCase();
  if (lower.match(/burn|tired|exhaust|overwhelm|too much|drained|can't anymore/)) return "burnout";
  if (lower.match(/decide|decision|choice|torn|what should|can't choose|don't know what/)) return "decision";
  if (lower.match(/procrastinat|putting off|lazy|can't start|avoid|distract|doom/)) return "procrastination";
  if (lower.match(/imposter|fraud|fake|don't belong|not good enough|not smart/)) return "imposter";
  return "general";
}

export default function TherapistChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "therapist",
      content: "```\n> SAFE_SPACE.exe loaded\n> judgment: OFF\n> empathy: MAX ✨\n```\n\nhey bestie 🫶 i'm your lil digital therapist. no judgment, no toxic positivity — just real talk and actual support.\n\nwhat's weighing on you? spill the tea, i'm here for it 💜",
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

    const category = categorize(text);
    const pool = RESPONSES[category];
    const delay = 1200 + Math.random() * 1000;

    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: crypto.randomUUID(),
        role: "therapist",
        content: pool[Math.floor(Math.random() * pool.length)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, reply]);
      setIsLoading(false);
    }, delay);
  };

  const formatTime = (d: Date) => d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="rounded-lg bg-card cyber-border-purple flex flex-col h-full hover-glow-purple transition-all duration-300">
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <div className="w-6 h-6 rounded-md bg-cyber-purple/20 flex items-center justify-center">
          <Heart className="w-3.5 h-3.5 text-cyber-purple" />
        </div>
        <div>
          <h3 className="font-display text-[10px] font-bold tracking-wider text-cyber-purple" style={{ textShadow: "0 0 10px hsl(280 100% 65% / 0.5)" }}>
            THERAPIST_BESTIE
          </h3>
          <p className="text-[8px] text-muted-foreground">safe space loading... 🫶</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-cyber-purple/10 rounded-full px-2 py-0.5">
          <Shield className="w-3 h-3 text-cyber-purple" />
          <span className="text-[9px] text-cyber-purple font-bold">SAFE</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""} animate-slide-up`} style={{ animationDelay: `${idx * 0.05}s` }}>
            {msg.role === "therapist" && (
              <div className="w-6 h-6 rounded-md bg-cyber-purple/20 flex items-center justify-center shrink-0 mt-0.5 animate-bounce-in">
                <Heart className="w-3.5 h-3.5 text-cyber-purple" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed transition-all ${
              msg.role === "user"
                ? "bg-primary/10 border border-primary/20 text-foreground"
                : "bg-cyber-purple/5 border border-cyber-purple/10 text-foreground"
            }`}>
              <MessageContent content={msg.content} />
              <span className="block text-[8px] text-muted-foreground mt-1 opacity-50">{formatTime(msg.timestamp)}</span>
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 animate-slide-up">
            <div className="w-6 h-6 rounded-md bg-cyber-purple/20 flex items-center justify-center shrink-0">
              <Heart className="w-3.5 h-3.5 text-cyber-purple animate-pulse-glow" />
            </div>
            <div className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-lg px-4 py-2.5 flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-pulse-glow" style={{ animationDelay: "0s" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-pulse-glow" style={{ animationDelay: "0.3s" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-pulse-glow" style={{ animationDelay: "0.6s" }} />
              </div>
              <span className="text-[9px] text-muted-foreground ml-1">thinking with empathy...</span>
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {PROMPTS.map(tip => (
            <button
              key={tip}
              onClick={() => setInput(tip)}
              className="text-[9px] px-2.5 py-1.5 rounded-lg bg-cyber-purple/5 border border-cyber-purple/20 text-muted-foreground hover:border-cyber-purple/40 hover:text-foreground transition-all duration-200 hover-scale click-shrink"
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
            placeholder="what's on your mind? 💭"
            className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyber-purple/50 focus:ring-1 focus:ring-cyber-purple/20 transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-cyber-purple/20 border border-cyber-purple/30 rounded-lg hover:bg-cyber-purple/30 transition-all duration-200 hover-scale click-shrink disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5 text-cyber-purple" />
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
          return <pre key={i} className="bg-background/50 rounded-md px-2 py-1.5 my-1.5 text-cyber-purple text-[10px] overflow-x-auto font-mono border border-cyber-purple/10">{code}</pre>;
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-cyber-purple">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("> ")) {
          return <div key={i} className="border-l-2 border-cyber-purple/30 pl-2 my-1 text-muted-foreground italic">{part.slice(2)}</div>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
