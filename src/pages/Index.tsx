import KanbanBoard from "@/components/KanbanBoard";
import HabitTracker from "@/components/HabitTracker";
import PomodoroTimer from "@/components/PomodoroTimer";
import CyberCalendar from "@/components/CyberCalendar";
import AiChat from "@/components/AiChat";
import TherapistChat from "@/components/TherapistChat";
import SystemStatus from "@/components/SystemStatus";
import { XpProvider } from "@/components/XpContext";
import { Layout, Brain, Sparkles } from "lucide-react";

export default function Index() {
  return (
    <XpProvider>
      <div className="min-h-screen bg-background scanline">
        <SystemStatus />

        <div className="p-4 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 animate-slide-up">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center animate-glow-pulse">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-wider text-foreground flex items-center gap-2">
                NEXUS <span className="text-primary text-glow-cyan">DASHBOARD</span>
                <Sparkles className="w-4 h-4 text-cyber-purple animate-float" />
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-wider">
                your personal productivity arc starts here 🚀 // <span className="text-cyber-green">ALL_SYSTEMS_NOMINAL</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Kanban */}
            <div className="lg:col-span-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-2 mb-3">
                <Layout className="w-3.5 h-3.5 text-primary" />
                <span className="font-display text-[10px] tracking-wider text-muted-foreground">TASK_PIPELINE // drag to slay 💅</span>
              </div>
              <KanbanBoard />
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <PomodoroTimer />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <CyberCalendar />
              </div>
            </div>

            {/* Bottom row */}
            <div className="lg:col-span-12 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <HabitTracker />
            </div>

            {/* Chat row */}
            <div className="lg:col-span-6 h-[450px] animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <AiChat />
            </div>
            <div className="lg:col-span-6 h-[450px] animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <TherapistChat />
            </div>
          </div>
        </div>
      </div>
    </XpProvider>
  );
}
