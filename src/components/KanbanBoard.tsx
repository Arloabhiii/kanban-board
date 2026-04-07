import { useState, useRef } from "react";
import { Plus, GripVertical, Trash2, Flame, PartyPopper, Sparkles } from "lucide-react";
import { useXp } from "./XpContext";
import { ConfettiExplosion } from "./Gamification";

interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  emoji: string;
}

interface Column {
  id: string;
  title: string;
  subtitle: string;
  colorClass: string;
  glowClass: string;
  hoverGlow: string;
  tasks: Task[];
}

const RANDOM_EMOJIS = ["🚀", "💻", "🧪", "📱", "🎯", "🧠", "⚙️", "🔧", "📊", "🎨"];
const priorityLabels: Record<string, { text: string; color: string; bg: string }> = {
  low: { text: "chill 😌", color: "text-cyber-green", bg: "bg-cyber-green/10 border-cyber-green/30" },
  medium: { text: "mid 🤷", color: "text-cyber-cyan", bg: "bg-cyber-cyan/10 border-cyber-cyan/30" },
  high: { text: "urgent fr 😤", color: "text-cyber-pink", bg: "bg-cyber-pink/10 border-cyber-pink/30" },
};

export default function KanbanBoard() {
  const { addXp, completeTask } = useXp();
  const [confetti, setConfetti] = useState<{ x: number; y: number } | null>(null);
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "// TO_DO", subtitle: "stuff to do bestie", colorClass: "text-cyber-cyan", glowClass: "cyber-border", hoverGlow: "hover-glow-cyan", tasks: [] },
    { id: "progress", title: "// GRINDING", subtitle: "locked in rn 🔒", colorClass: "text-cyber-purple", glowClass: "cyber-border-purple", hoverGlow: "hover-glow-purple", tasks: [] },
    { id: "done", title: "// SLAYED ✅", subtitle: "ate and left no crumbs", colorClass: "text-cyber-green", glowClass: "cyber-border-green", hoverGlow: "hover-glow-green", tasks: [] },
  ]);
  const [newTask, setNewTask] = useState<Record<string, string>>({});
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromCol: string } | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  const addTask = (colId: string) => {
    const title = newTask[colId]?.trim();
    if (!title) return;
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      priority: "medium",
      emoji: RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)],
    };
    setColumns(cols => cols.map(c => c.id === colId ? { ...c, tasks: [...c.tasks, task] } : c));
    setNewTask(prev => ({ ...prev, [colId]: "" }));
    setRecentlyAdded(task.id);
    addXp(5, "new task created 📝");
    setTimeout(() => setRecentlyAdded(null), 600);
  };

  const deleteTask = (colId: string, taskId: string) => {
    setColumns(cols => cols.map(c => c.id === colId ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) } : c));
  };

  const cyclePriority = (colId: string, taskId: string) => {
    const order: Task["priority"][] = ["low", "medium", "high"];
    setColumns(cols => cols.map(c => c.id === colId ? {
      ...c, tasks: c.tasks.map(t => t.id === taskId ? { ...t, priority: order[(order.indexOf(t.priority) + 1) % 3] } : t)
    } : c));
  };

  const handleDrop = (toCol: string, e: React.DragEvent) => {
    setDropTarget(null);
    if (!draggedTask || draggedTask.fromCol === toCol) { setDraggedTask(null); return; }
    
    // Moving to done = completion!
    if (toCol === "done") {
      completeTask();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setConfetti({ x: rect.left + rect.width / 2, y: rect.top });
      setTimeout(() => setConfetti(null), 1500);
    } else if (toCol === "progress") {
      addXp(3, "grinding mode activated 💪");
    }

    setColumns(cols => cols.map(c => {
      if (c.id === draggedTask.fromCol) return { ...c, tasks: c.tasks.filter(t => t.id !== draggedTask.task.id) };
      if (c.id === toCol) return { ...c, tasks: [...c.tasks, draggedTask.task] };
      return c;
    }));
    setDraggedTask(null);
  };

  return (
    <>
      {confetti && <ConfettiExplosion x={confetti.x} y={confetti.y} />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col, colIdx) => (
          <div
            key={col.id}
            className={`rounded-lg bg-card p-4 ${col.glowClass} ${col.hoverGlow} min-h-[300px] transition-all duration-300 ${
              dropTarget === col.id ? "scale-[1.02] ring-2 ring-primary/50" : ""
            }`}
            style={{ animationDelay: `${colIdx * 0.1}s` }}
            onDragOver={e => { e.preventDefault(); setDropTarget(col.id); }}
            onDragLeave={() => setDropTarget(null)}
            onDrop={e => handleDrop(col.id, e)}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-display text-xs font-bold tracking-wider ${col.colorClass} text-glow-cyan`}>
                {col.title}
              </h3>
              <span className={`text-xs ${col.colorClass} opacity-60`}>[{col.tasks.length}]</span>
            </div>
            <p className="text-[9px] text-muted-foreground mb-3 italic">{col.subtitle}</p>

            <div className="space-y-2 mb-3">
              {col.tasks.map((task, taskIdx) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => setDraggedTask({ task, fromCol: col.id })}
                  className={`group bg-muted/50 border border-border rounded-lg p-2.5 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all duration-200 hover-scale click-shrink ${
                    recentlyAdded === task.id ? "animate-bounce-in" : "animate-slide-up"
                  }`}
                  style={{ animationDelay: `${taskIdx * 0.05}s` }}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-3 h-3 mt-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm mt-0.5">{task.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground truncate">{task.title}</p>
                      <button
                        onClick={() => cyclePriority(col.id, task.id)}
                        className={`text-[10px] mt-1 ${priorityLabels[task.priority].color} uppercase tracking-wider hover:underline transition-colors click-shrink`}
                      >
                        [{priorityLabels[task.priority].text}]
                      </button>
                    </div>
                    <button onClick={() => deleteTask(col.id, task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity hover-scale">
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
              {col.tasks.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Sparkles className="w-5 h-5 mx-auto mb-2 animate-float opacity-40" />
                  <p className="text-[10px] italic">drag tasks here bestie ✨</p>
                </div>
              )}
            </div>

            <div className="flex gap-1">
              <input
                value={newTask[col.id] || ""}
                onChange={e => setNewTask(prev => ({ ...prev, [col.id]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && addTask(col.id)}
                placeholder="what's the move?..."
                className="flex-1 bg-muted/30 border border-border rounded-lg px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <button onClick={() => addTask(col.id)} className="p-1.5 hover:bg-primary/10 rounded-lg transition-all hover-scale click-shrink">
                <Plus className="w-3.5 h-3.5 text-primary" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
