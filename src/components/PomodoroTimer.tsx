import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, Zap } from "lucide-react";

type Mode = "work" | "break" | "longBreak";

const DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

const MODE_LABELS: Record<Mode, string> = {
  work: "FOCUS_MODE",
  break: "SHORT_BREAK",
  longBreak: "LONG_BREAK",
};

const MODE_COLORS: Record<Mode, string> = {
  work: "text-cyber-cyan",
  break: "text-cyber-green",
  longBreak: "text-cyber-purple",
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("work");
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === "work") {
        setSessions(s => s + 1);
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

  const reset = () => { setTimeLeft(DURATIONS[mode]); setIsRunning(false); };

  return (
    <div className="rounded-lg bg-card p-4 cyber-border-purple">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xs font-bold tracking-wider text-cyber-purple text-glow-purple">
          // POMODORO
        </h3>
        <div className="flex items-center gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i < sessions % 4 ? "bg-cyber-purple" : "bg-muted"}`} />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Circular timer */}
        <div className="relative w-36 h-36 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={mode === "work" ? "hsl(var(--cyber-cyan))" : mode === "break" ? "hsl(var(--cyber-green))" : "hsl(var(--cyber-purple))"}
              strokeWidth="2.5"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-display text-2xl font-bold ${MODE_COLORS[mode]} tracking-wider`}>
              {mins}:{secs}
            </span>
            <span className="text-[9px] text-muted-foreground mt-1">{MODE_LABELS[mode]}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button onClick={reset} className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
            <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-3 rounded-full transition-all ${
              isRunning
                ? "bg-cyber-purple/20 border border-cyber-purple/50 hover:bg-cyber-purple/30"
                : "bg-primary/20 border border-primary/50 hover:bg-primary/30"
            }`}
          >
            {isRunning
              ? <Pause className="w-4 h-4 text-cyber-purple" />
              : <Play className="w-4 h-4 text-primary" />
            }
          </button>
          <button
            onClick={() => setMode(mode === "work" ? "break" : "work")}
            className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            {mode === "work" ? <Coffee className="w-3.5 h-3.5 text-muted-foreground" /> : <Zap className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground mt-3">
          sessions_completed: <span className="text-cyber-purple">{sessions}</span>
        </p>
      </div>
    </div>
  );
}
