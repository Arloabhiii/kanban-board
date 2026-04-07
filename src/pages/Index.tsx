import KanbanBoard from "@/components/KanbanBoard";
import HabitTracker from "@/components/HabitTracker";
import PomodoroTimer from "@/components/PomodoroTimer";
import CyberCalendar from "@/components/CyberCalendar";
import AiChat from "@/components/AiChat";
import SystemStatus from "@/components/SystemStatus";
import { Layout, Brain } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background scanline">
      <SystemStatus />

      <div className="p-4 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider text-foreground">
              NEXUS <span className="text-primary text-glow-cyan">DASHBOARD</span>
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-wider">PRODUCTIVITY_ENGINE // ALL_SYSTEMS_NOMINAL</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Kanban */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-3">
              <Layout className="w-3.5 h-3.5 text-primary" />
              <span className="font-display text-[10px] tracking-wider text-muted-foreground">TASK_PIPELINE</span>
            </div>
            <KanbanBoard />
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <PomodoroTimer />
            <CyberCalendar />
          </div>

          {/* Bottom row */}
          <div className="lg:col-span-7">
            <HabitTracker />
          </div>
          <div className="lg:col-span-5 h-[400px]">
            <AiChat />
          </div>
        </div>
      </div>
    </div>
  );
}
