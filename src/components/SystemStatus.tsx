import { Activity, Cpu, HardDrive, Wifi } from "lucide-react";

export default function SystemStatus() {
  const stats = [
    { icon: Cpu, label: "CPU", value: "42%", color: "text-cyber-cyan" },
    { icon: HardDrive, label: "MEM", value: "67%", color: "text-cyber-green" },
    { icon: Activity, label: "TASKS", value: "12", color: "text-cyber-purple" },
    { icon: Wifi, label: "STATUS", value: "ONLINE", color: "text-cyber-green" },
  ];

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-card/50 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-glow" />
        <span className="font-display text-[10px] tracking-widest text-primary text-glow-cyan">
          NEXUS_OS v3.7
        </span>
      </div>
      <div className="h-3 w-px bg-border" />
      {stats.map(s => (
        <div key={s.label} className="flex items-center gap-1.5">
          <s.icon className={`w-3 h-3 ${s.color}`} />
          <span className="text-[9px] text-muted-foreground">{s.label}:</span>
          <span className={`text-[9px] font-bold ${s.color}`}>{s.value}</span>
        </div>
      ))}
      <div className="ml-auto text-[9px] text-muted-foreground font-mono">
        {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        <span className="text-primary ml-2 animate-blink">_</span>
      </div>
    </div>
  );
}
