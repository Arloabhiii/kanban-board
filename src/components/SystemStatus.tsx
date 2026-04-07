import { Activity, Cpu, HardDrive, Wifi, Flame } from "lucide-react";
import { useXp, getLevelTitle } from "./XpContext";
import { XpBar } from "./Gamification";

export default function SystemStatus() {
  const { streak, totalTasksDone, level } = useXp();

  return (
    <div className="flex items-center gap-4 px-4 py-2.5 bg-card/50 border-b border-border backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-glow" />
        <span className="font-display text-[10px] tracking-widest text-primary text-glow-cyan">
          NEXUS_OS
        </span>
      </div>

      <div className="h-4 w-px bg-border" />
      
      <XpBar />

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-1">
        <span className="text-[9px]">{getLevelTitle(level).split(" ")[1]}</span>
        <span className="text-[9px] text-muted-foreground font-display">{getLevelTitle(level).split(" ")[0]}</span>
      </div>

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-1">
        <Flame className="w-3 h-3 text-cyber-pink" />
        <span className="text-[9px] text-cyber-pink font-bold">{streak}</span>
        <span className="text-[9px] text-muted-foreground">streak</span>
      </div>

      <div className="flex items-center gap-1">
        <Activity className="w-3 h-3 text-cyber-green" />
        <span className="text-[9px] text-cyber-green font-bold">{totalTasksDone}</span>
        <span className="text-[9px] text-muted-foreground">done</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1 bg-cyber-green/10 rounded-full px-2 py-0.5">
          <Wifi className="w-2.5 h-2.5 text-cyber-green" />
          <span className="text-[8px] text-cyber-green font-bold">CONNECTED</span>
        </div>
        <span className="text-[9px] text-muted-foreground font-mono">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </span>
        <span className="text-primary animate-blink">_</span>
      </div>
    </div>
  );
}
