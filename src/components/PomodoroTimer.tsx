import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, Zap, SkipForward, Volume2 } from "lucide-react";
import { useXp } from "./XpContext";

type Mode = "work" | "break" | "longBreak";

const DURATIONS: Record<Mode, number> = { work: 25 * 60, break: 5 * 60, longBreak: 15 * 60 };
const MODE_INFO: Record<Mode, { label: string; vibe: string; color: string; border: string }> = {
  work: { label: "LOCK IN 🔒", vibe: "grind mode activated", color: "text-cyber-cyan", border: "cyber-border" },
  break: { label: "TOUCH GRASS 🌿", vibe: "u earned this bestie", color: "text-cyber-green", border: "cyber-border-green" },
  longBreak: { label: "RECHARGE 🔋", vibe: "big brain recovery arc", color: "text-cyber-purple", border: "cyber-border-purple" },
};

export default function PomodoroTimer() {
  const { addXp } = useXp();
  const [mode, setMode] = useState<Mode>("work");
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showModeSelect, setShowModeSelect] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === "work") {
        setSessions(s => s + 1);
        addXp(25, "pomodoro completed! no cap 🧠");
        setMode((sessions + 1) % 4 === 0 ? "longBreak" : "break");
      } else {
        setMode("work");
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    setTimeLeft(DURATIONS[mode]);
    setIsRunning(false);
  }, [mode]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const progress = ((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100;
  const circumference = 2 * Math.PI * 42;

  const reset = () => { setTimeLeft(DURATIONS[mode]); setIsRunning(false); };
  const skip = () => {
    if (mode === "work") { setSessions(s => s + 1); setMode("break"); }
    else setMode("work");
  };

  const info = MODE_INFO[mode];

  return (
    <div className={`rounded-lg bg-card p-4 ${info.border} transition-all duration-500 hover-glow-purple`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className={`font-display text-xs font-bold tracking-wider ${info.color} text-glow-purple`}>
          // POMODORO
        </h3>
        <div className="flex items-center gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < sessions % 4 ? "bg-cyber-purple shadow-[0_0_6px_hsl(270_80%_60%/0.5)] scale-110" : "bg-muted"
            }`} />
          ))}
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground mb-3 italic">{info.vibe}</p>

      {/* Mode selector */}
      <div className="flex gap-1 mb-4">
        {(Object.keys(DURATIONS) as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 text-[9px] py-1.5 rounded-md font-display tracking-wider transition-all duration-200 click-shrink ${
              mode === m
                ? `${MODE_INFO[m].color} bg-muted border border-current/30`
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {MODE_INFO[m].label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <div className={`relative w-40 h-40 mb-4 ${isRunning ? "animate-glow-pulse" : ""}`}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="1.5" />
            {/* Background track dots */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = 50 + 42 * Math.cos(rad);
              const y = 50 + 42 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="0.4" fill="hsl(var(--muted-foreground))" opacity="0.2" />;
            })}
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={mode === "work" ? "hsl(var(--cyber-cyan))" : mode === "break" ? "hsl(var(--cyber-green))" : "hsl(var(--cyber-purple))"}
              strokeWidth="2.5"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={`${circumference * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
              filter={isRunning ? `drop-shadow(0 0 4px ${mode === "work" ? "hsl(180 100% 50%)" : mode === "break" ? "hsl(140 100% 50%)" : "hsl(270 80% 60%)"})` : "none"}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-display text-3xl font-bold ${info.color} tracking-widest ${isRunning ? "" : "animate-pulse-glow"}`}>
              {mins}:{secs}
            </span>
            <span className="text-[9px] text-muted-foreground mt-1 tracking-wider">
              {isRunning ? "grinding... 💪" : "ready to lock in?"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={reset} className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-all hover-scale click-shrink" title="Reset">
            <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-4 rounded-full transition-all duration-300 hover-scale click-shrink ${
              isRunning
                ? "bg-cyber-purple/20 border-2 border-cyber-purple/50 hover:bg-cyber-purple/30 shadow-[0_0_20px_hsl(270_80%_60%/0.3)]"
                : "bg-primary/20 border-2 border-primary/50 hover:bg-primary/30 shadow-[0_0_20px_hsl(180_100%_50%/0.3)]"
            }`}
          >
            {isRunning
              ? <Pause className="w-5 h-5 text-cyber-purple" />
              : <Play className="w-5 h-5 text-primary ml-0.5" />
            }
          </button>
          <button onClick={skip} className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-all hover-scale click-shrink" title="Skip">
            <SkipForward className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <p className="text-[10px] text-muted-foreground">
            sessions: <span className="text-cyber-purple font-bold">{sessions}</span>
          </p>
          <span className="text-muted-foreground/30">|</span>
          <p className="text-[10px] text-muted-foreground">
            total focus: <span className="text-primary font-bold">{Math.floor(sessions * 25 / 60)}h {(sessions * 25) % 60}m</span>
          </p>
        </div>
      </div>
    </div>
  );
}
