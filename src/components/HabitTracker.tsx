import { useState } from "react";
import { Plus, Check, X, Zap, Trophy, Pencil, Trash2 } from "lucide-react";
import { useXp } from "./XpContext";

interface Habit {
  id: string;
  name: string;
  completedDays: number[];
  icon: string;
  streak: number;
}

const defaultHabits: Habit[] = [
  { id: "1", name: "Code 2hrs", completedDays: [1, 2, 3, 5], icon: "⌨️", streak: 4 },
  { id: "2", name: "Touch grass", completedDays: [1, 3, 5, 6], icon: "🌿", streak: 2 },
  { id: "3", name: "Read 30min", completedDays: [1, 2, 4, 5, 6], icon: "📖", streak: 5 },
  { id: "4", name: "No doomscroll", completedDays: [2, 4, 6], icon: "📵", streak: 1 },
  { id: "5", name: "Gym arc", completedDays: [1, 3, 5], icon: "🏋️", streak: 3 },
];

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
const ICON_OPTIONS = ["⌨️", "🌿", "📖", "📵", "🏋️", "⚡", "🎯", "🧠", "💎", "🌟", "🎮", "🎵", "🍎", "💧", "🧘", "🎨"];

const streakEmoji = (streak: number) => {
  if (streak >= 7) return "🐐";
  if (streak >= 5) return "🔥";
  if (streak >= 3) return "⚡";
  return "✨";
};

export default function HabitTracker() {
  const { addXp, incrementStreak } = useXp();
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [newHabit, setNewHabit] = useState("");
  const [animatingCell, setAnimatingCell] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showIconPicker, setShowIconPicker] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const today = new Date().getDay() || 7;

  const toggleDay = (habitId: string, day: number) => {
    const cellKey = `${habitId}-${day}`;
    setAnimatingCell(cellKey);
    setTimeout(() => setAnimatingCell(null), 400);

    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const wasCompleted = h.completedDays.includes(day);
      const days = wasCompleted
        ? h.completedDays.filter(d => d !== day)
        : [...h.completedDays, day];
      
      if (!wasCompleted) {
        addXp(10, `${h.name} done! slay 💅`);
        if (day === today) incrementStreak();
      }
      
      const streak = wasCompleted ? Math.max(0, h.streak - 1) : h.streak + 1;
      return { ...h, completedDays: days, streak };
    }));
  };

  const startEdit = (habit: Habit) => {
    setEditingId(habit.id);
    setEditValue(habit.name);
  };

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      setHabits(prev => prev.map(h => h.id === id ? { ...h, name: editValue.trim() } : h));
    }
    setEditingId(null);
  };

  const changeIcon = (id: string, icon: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, icon } : h));
    setShowIconPicker(null);
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const icons = ["⚡", "🎯", "🧠", "💎", "🌟", "🎮", "🎵", "🍎"];
    setHabits(prev => [...prev, {
      id: crypto.randomUUID(),
      name: newHabit,
      completedDays: [],
      icon: icons[Math.floor(Math.random() * icons.length)],
      streak: 0,
    }]);
    setNewHabit("");
    addXp(5, "new habit added 🌱");
  };

  const removeHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setConfirmDelete(null);
  };

  const totalCompletion = habits.length > 0
    ? Math.round(habits.reduce((sum, h) => sum + h.completedDays.filter(d => d <= today).length, 0) / (habits.length * today) * 100)
    : 0;

  return (
    <div className="rounded-lg bg-card p-4 cyber-border-green hover-glow-green transition-all duration-300">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-xs font-bold tracking-wider text-cyber-green text-glow-green">
          // HABIT_GRIND
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-cyber-green/10 rounded-full px-2 py-0.5">
            <Trophy className="w-3 h-3 text-cyber-green" />
            <span className="text-[10px] text-cyber-green font-bold">{totalCompletion}%</span>
          </div>
          <Zap className="w-3.5 h-3.5 text-cyber-green animate-pulse-glow" />
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground mb-3 italic">tap to check, click name to edit, long press icon to swap ✨</p>

      <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-cyber-green to-primary rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${totalCompletion}%` }}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 px-1">
          <span className="w-28 text-[9px] text-muted-foreground">ROUTINE</span>
          <div className="flex gap-1 flex-1 justify-end">
            {dayLabels.map((d, i) => (
              <span key={i} className={`w-6 text-center text-[9px] font-bold ${
                i + 1 === today ? "text-cyber-green" : "text-muted-foreground"
              }`}>
                {i + 1 === today ? `>${d}<` : d}
              </span>
            ))}
          </div>
          <span className="w-10 text-[9px] text-muted-foreground text-right">🔥</span>
          <span className="w-12" />
        </div>

        {habits.map((habit, idx) => (
          <div
            key={habit.id}
            className="group flex items-center gap-2 bg-muted/30 rounded-lg px-2 py-1.5 hover:bg-muted/50 transition-all duration-200 hover-scale animate-slide-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            {/* Icon - click to pick */}
            <div className="relative">
              <button
                onClick={() => setShowIconPicker(showIconPicker === habit.id ? null : habit.id)}
                className="text-sm hover:scale-125 transition-transform click-shrink"
                title="change icon"
              >
                {habit.icon}
              </button>
              {showIconPicker === habit.id && (
                <div className="absolute top-7 left-0 z-30 bg-card border border-border rounded-lg p-2 grid grid-cols-4 gap-1 shadow-xl animate-scale-in min-w-[120px]">
                  {ICON_OPTIONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => changeIcon(habit.id, icon)}
                      className="text-sm p-1 rounded hover:bg-muted transition-all click-shrink"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Name - click to edit */}
            {editingId === habit.id ? (
              <input
                autoFocus
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={() => saveEdit(habit.id)}
                onKeyDown={e => { if (e.key === "Enter") saveEdit(habit.id); if (e.key === "Escape") setEditingId(null); }}
                className="w-24 bg-muted/50 border border-primary/50 rounded px-1 py-0.5 text-[11px] text-foreground focus:outline-none"
              />
            ) : (
              <button
                onClick={() => startEdit(habit)}
                className="w-24 text-[11px] text-foreground truncate text-left hover:text-primary transition-colors group/name flex items-center gap-1"
                title="click to rename"
              >
                <span className="truncate">{habit.name}</span>
                <Pencil className="w-2.5 h-2.5 opacity-0 group-hover/name:opacity-60 transition-opacity shrink-0" />
              </button>
            )}

            {/* Day checkboxes */}
            <div className="flex gap-1 flex-1 justify-end">
              {dayLabels.map((_, i) => {
                const day = i + 1;
                const done = habit.completedDays.includes(day);
                const cellKey = `${habit.id}-${day}`;
                const isAnimating = animatingCell === cellKey;
                return (
                  <button
                    key={i}
                    onClick={() => toggleDay(habit.id, day)}
                    disabled={day > today}
                    className={`w-6 h-6 rounded-md text-[10px] flex items-center justify-center transition-all duration-200 click-shrink ${
                      isAnimating ? "animate-bounce-in" : ""
                    } ${
                      done
                        ? "bg-cyber-green/20 border border-cyber-green/50 text-cyber-green shadow-[0_0_8px_hsl(140_100%_50%/0.3)]"
                        : day <= today
                        ? "bg-muted/50 border border-border text-muted-foreground hover:border-cyber-green/30 hover:bg-cyber-green/5"
                        : "bg-muted/20 border border-border/30 text-muted-foreground/20 cursor-not-allowed"
                    }`}
                  >
                    {done ? <Check className="w-3 h-3" /> : day <= today ? "·" : ""}
                  </button>
                );
              })}
            </div>

            {/* Streak */}
            <span className="w-10 text-[10px] text-right font-mono flex items-center justify-end gap-0.5">
              <span>{streakEmoji(habit.streak)}</span>
              <span className="text-cyber-green">{habit.streak}</span>
            </span>

            {/* Actions */}
            <div className="w-12 flex items-center justify-end gap-1">
              {confirmDelete === habit.id ? (
                <div className="flex gap-0.5 animate-scale-in">
                  <button onClick={() => removeHabit(habit.id)} className="p-0.5 bg-destructive/20 rounded click-shrink" title="confirm delete">
                    <Check className="w-3 h-3 text-destructive" />
                  </button>
                  <button onClick={() => setConfirmDelete(null)} className="p-0.5 bg-muted rounded click-shrink">
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(habit.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity click-shrink p-0.5"
                  title="delete habit"
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 mt-3">
        <input
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addHabit()}
          placeholder="new glow up habit... 🌱"
          className="flex-1 bg-muted/30 border border-border rounded-lg px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyber-green/50 focus:ring-1 focus:ring-cyber-green/20 transition-all"
        />
        <button onClick={addHabit} className="p-1.5 hover:bg-cyber-green/10 rounded-lg transition-all hover-scale click-shrink">
          <Plus className="w-3.5 h-3.5 text-cyber-green" />
        </button>
      </div>
    </div>
  );
}
