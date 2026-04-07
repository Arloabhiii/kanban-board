import { useState } from "react";
import { Plus, X, GripVertical, Trash2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

interface Column {
  id: string;
  title: string;
  colorClass: string;
  glowClass: string;
  tasks: Task[];
}

const priorityColors: Record<string, string> = {
  low: "text-cyber-green",
  medium: "text-cyber-cyan",
  high: "text-cyber-pink",
};

const priorityBg: Record<string, string> = {
  low: "bg-cyber-green/10 border-cyber-green/30",
  medium: "bg-cyber-cyan/10 border-cyber-cyan/30",
  high: "bg-cyber-pink/10 border-cyber-pink/30",
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "// TO_DO", colorClass: "text-cyber-cyan", glowClass: "cyber-border", tasks: [] },
    { id: "progress", title: "// IN_PROGRESS", colorClass: "text-cyber-purple", glowClass: "cyber-border-purple", tasks: [] },
    { id: "done", title: "// DONE", colorClass: "text-cyber-green", glowClass: "cyber-border-green", tasks: [] },
  ]);
  const [newTask, setNewTask] = useState<Record<string, string>>({});
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromCol: string } | null>(null);

  const addTask = (colId: string) => {
    const title = newTask[colId]?.trim();
    if (!title) return;
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      priority: "medium",
      createdAt: new Date(),
    };
    setColumns(cols => cols.map(c => c.id === colId ? { ...c, tasks: [...c.tasks, task] } : c));
    setNewTask(prev => ({ ...prev, [colId]: "" }));
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

  const handleDragStart = (task: Task, fromCol: string) => {
    setDraggedTask({ task, fromCol });
  };

  const handleDrop = (toCol: string) => {
    if (!draggedTask || draggedTask.fromCol === toCol) { setDraggedTask(null); return; }
    setColumns(cols => cols.map(c => {
      if (c.id === draggedTask.fromCol) return { ...c, tasks: c.tasks.filter(t => t.id !== draggedTask.task.id) };
      if (c.id === toCol) return { ...c, tasks: [...c.tasks, draggedTask.task] };
      return c;
    }));
    setDraggedTask(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(col => (
        <div
          key={col.id}
          className={`rounded-lg bg-card p-4 ${col.glowClass} min-h-[300px]`}
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop(col.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-display text-xs font-bold tracking-wider ${col.colorClass} text-glow-cyan`}>
              {col.title}
            </h3>
            <span className={`text-xs ${col.colorClass} opacity-60`}>[{col.tasks.length}]</span>
          </div>

          <div className="space-y-2 mb-3">
            {col.tasks.map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task, col.id)}
                className="group bg-muted/50 border border-border rounded p-2.5 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="w-3 h-3 mt-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{task.title}</p>
                    <button onClick={() => cyclePriority(col.id, task.id)} className={`text-[10px] mt-1 ${priorityColors[task.priority]} uppercase tracking-wider`}>
                      [{task.priority}]
                    </button>
                  </div>
                  <button onClick={() => deleteTask(col.id, task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            <input
              value={newTask[col.id] || ""}
              onChange={e => setNewTask(prev => ({ ...prev, [col.id]: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && addTask(col.id)}
              placeholder="new_task..."
              className="flex-1 bg-muted/30 border border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <button onClick={() => addTask(col.id)} className="p-1 hover:bg-primary/10 rounded transition-colors">
              <Plus className="w-3.5 h-3.5 text-primary" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
