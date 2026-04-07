import { useState } from "react";
import { Plus, Check, X, Zap } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  completedDays: number[];
  icon: string;
}

const defaultHabits: Habit[] = [
  { id: "1", name: "Code 2hrs", completedDays: [1, 2, 3, 5], icon: "⌨️" },
  { id: "2", name: "Exercise", completedDays: [1, 3, 5, 6], icon: "💪" },
  { id: "3", name: "Read 30min", completedDays: [1, 2, 4, 5, 6], icon: "📖" },
  { id: "4", name: "Meditate", completedDays: [2, 4, 6], icon: "🧘" },
];

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [newHabit, setNewHabit] = useState("");
  const today = new Date().getDay() || 7; // 1-7, Mon-Sun

  const toggleDay = (habitId: string, day: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const days = h.completedDays.includes(day)
        ? h.completedDays.filter(d => d !== day)
        : [...h.completedDays, day];
      return { ...h, completedDays: days };
    }));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits(prev => [...prev, { id: crypto.randomUUID(), name: newHabit, completedDays: [], icon: "⚡" }]);
    setNewHabit("");
  };

  const removeHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));

  return (
    <div className="rounded-lg bg-card p-4 cyber-border-green">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xs font-bold tracking-wider text-cyber-green text-glow-green">
          // HABIT_TRACKER
        </h3>
        <Zap className="w-3.5 h-3.5 text-cyber-green animate-pulse-glow" />
      </div>

      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2 px-1">
          <span className="w-24 text-[10px] text-muted-foreground">ROUTINE</span>
          <div className="flex gap-1 flex-1 justify-end">
            {dayLabels.map((d, i) => (
              <span key={i} className={`w-6 text-center text-[10px] ${i + 1 === today ? "text-cyber-green font-bold" : "text-muted-foreground"}`}>
                {d}
              </span>
            ))}
          </div>
          <span className="w-8 text-[10px] text-muted-foreground text-right">%</span>
        </div>

        {habits.map(habit => (
          <div key={habit.id} className="group flex items-center gap-2 bg-muted/30 rounded px-2 py-1.5 hover:bg-muted/50 transition-colors">
            <span className="text-xs">{habit.icon}</span>
            <span className="w-20 text-[11px] text-foreground truncate">{habit.name}</span>
            <div className="flex gap-1 flex-1 justify-end">
              {dayLabels.map((_, i) => {
                const day = i + 1;
                const done = habit.completedDays.includes(day);
                return (
                  <button
                    key={i}
                    onClick={() => toggleDay(habit.id, day)}
                    className={`w-6 h-6 rounded text-[10px] flex items-center justify-center transition-all ${
                      done
                        ? "bg-cyber-green/20 border border-cyber-green/50 text-cyber-green"
                        : day <= today
                        ? "bg-muted/50 border border-border text-muted-foreground hover:border-cyber-green/30"
                        : "bg-muted/20 border border-border/50 text-muted-foreground/30"
                    }`}
                  >
                    {done ? <Check className="w-3 h-3" /> : "·"}
                  </button>
                );
              })}
            </div>
            <span className="w-8 text-[10px] text-cyber-green text-right font-mono">
              {Math.round((habit.completedDays.length / 7) * 100)}%
            </span>
            <button onClick={() => removeHabit(habit.id)} className="opacity-0 group-hover:opacity-100">
              <X className="w-3 h-3 text-destructive" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-1 mt-3">
        <input
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addHabit()}
          placeholder="add_habit..."
          className="flex-1 bg-muted/30 border border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyber-green/50"
        />
        <button onClick={addHabit} className="p-1 hover:bg-cyber-green/10 rounded transition-colors">
          <Plus className="w-3.5 h-3.5 text-cyber-green" />
        </button>
      </div>
    </div>
  );
}
