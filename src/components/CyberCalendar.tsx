import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Clock, CalendarDays } from "lucide-react";
import { useXp } from "./XpContext";

interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  color: "cyan" | "green" | "purple" | "pink";
  emoji: string;
}

const colorMap = {
  cyan: "bg-cyber-cyan/15 border-cyber-cyan/40 text-cyber-cyan",
  green: "bg-cyber-green/15 border-cyber-green/40 text-cyber-green",
  purple: "bg-cyber-purple/15 border-cyber-purple/40 text-cyber-purple",
  pink: "bg-cyber-pink/15 border-cyber-pink/40 text-cyber-pink",
};
const colorOptions: { value: ScheduleEvent["color"]; emoji: string }[] = [
  { value: "cyan", emoji: "🔵" },
  { value: "green", emoji: "🟢" },
  { value: "purple", emoji: "🟣" },
  { value: "pink", emoji: "🔴" },
];
const eventEmojis = ["📌", "💼", "🎯", "📊", "🧪", "🎨", "🏃", "📚"];

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CyberCalendar() {
  const { addXp } = useXp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>([
    { id: "1", title: "Sprint Review", date: formatDate(new Date()), time: "09:00", color: "cyan", emoji: "💼" },
    { id: "2", title: "Deep Work sesh", date: formatDate(new Date()), time: "14:00", color: "purple", emoji: "🧠" },
    { id: "3", title: "Gym arc", date: formatDate(new Date()), time: "18:00", color: "green", emoji: "🏋️" },
  ]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "09:00", color: "cyan" as ScheduleEvent["color"] });
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const todayStr = formatDate(new Date());

  const days: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function dateStr(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const addEvent = () => {
    if (!newEvent.title.trim()) return;
    const emoji = eventEmojis[Math.floor(Math.random() * eventEmojis.length)];
    setEvents(prev => [...prev, { ...newEvent, id: crypto.randomUUID(), date: selectedDate, emoji }]);
    setNewEvent({ title: "", time: "09:00", color: "cyan" });
    setShowAddForm(false);
    addXp(5, "event scheduled 📅");
  };

  const removeEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));
  const selectedEvents = events.filter(e => e.date === selectedDate);
  const monthName = currentDate.toLocaleString("en", { month: "long" }).toUpperCase();

  return (
    <div className="rounded-lg bg-card p-4 cyber-border hover-glow-cyan transition-all duration-300">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-xs font-bold tracking-wider text-primary text-glow-cyan">
          // SCHEDULE
        </h3>
        <CalendarDays className="w-3.5 h-3.5 text-primary animate-float" />
      </div>
      <p className="text-[9px] text-muted-foreground mb-3 italic">plan the main character arc ✨</p>

      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1 hover:bg-muted rounded-md transition-all hover-scale click-shrink">
          <ChevronLeft className="w-3.5 h-3.5 text-primary" />
        </button>
        <span className="text-[11px] text-foreground font-display tracking-wider">{monthName} {year}</span>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1 hover:bg-muted rounded-md transition-all hover-scale click-shrink">
          <ChevronRight className="w-3.5 h-3.5 text-primary" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map(d => (
          <div key={d} className="text-[8px] text-muted-foreground text-center py-1 font-bold">{d}</div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const ds = dateStr(day);
          const isToday = ds === todayStr;
          const isSelected = ds === selectedDate;
          const dayEvents = events.filter(e => e.date === ds);
          const isHovered = hoveredDay === day;
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(ds)}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`text-[10px] py-1.5 rounded-md relative transition-all duration-200 click-shrink ${
                isSelected ? "bg-primary/20 border border-primary/50 text-primary font-bold shadow-[0_0_10px_hsl(180_100%_50%/0.2)]" :
                isToday ? "bg-muted text-foreground font-bold ring-1 ring-primary/30" :
                isHovered ? "bg-muted/70 text-foreground" :
                "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {day}
              {dayEvents.length > 0 && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-[2px]">
                  {dayEvents.slice(0, 3).map((ev, j) => (
                    <div key={j} className={`w-1 h-1 rounded-full ${
                      ev.color === "cyan" ? "bg-cyber-cyan" :
                      ev.color === "green" ? "bg-cyber-green" :
                      ev.color === "purple" ? "bg-cyber-purple" : "bg-cyber-pink"
                    }`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="border-t border-border pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground">
            {selectedDate === todayStr ? "TODAY'S AGENDA 📋" : `EVENTS [${selectedDate}]`}
          </span>
          <button onClick={() => setShowAddForm(!showAddForm)} className="p-1 hover:bg-primary/10 rounded-md transition-all hover-scale click-shrink">
            {showAddForm ? <X className="w-3 h-3 text-primary" /> : <Plus className="w-3 h-3 text-primary" />}
          </button>
        </div>

        {showAddForm && (
          <div className="space-y-1.5 mb-2 animate-slide-up">
            <div className="flex gap-1">
              <input
                value={newEvent.title}
                onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && addEvent()}
                placeholder="what's the plan?..."
                className="flex-1 bg-muted/30 border border-border rounded-md px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))}
                className="w-20 bg-muted/30 border border-border rounded-md px-1 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {colorOptions.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setNewEvent(p => ({ ...p, color: c.value }))}
                    className={`text-xs p-1 rounded transition-all click-shrink ${newEvent.color === c.value ? "bg-muted scale-110" : "opacity-50 hover:opacity-100"}`}
                  >
                    {c.emoji}
                  </button>
                ))}
              </div>
              <button onClick={addEvent} className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-md text-xs text-primary hover:bg-primary/30 transition-all click-shrink hover-scale">
                add ✨
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1 max-h-28 overflow-y-auto">
          {selectedEvents.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic text-center py-2">
              nothing planned... yet 👀
            </p>
          ) : (
            selectedEvents.sort((a, b) => a.time.localeCompare(b.time)).map((ev, idx) => (
              <div
                key={ev.id}
                className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 border text-[11px] transition-all duration-200 hover-scale click-shrink animate-slide-up ${colorMap[ev.color]}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span>{ev.emoji}</span>
                <Clock className="w-3 h-3 shrink-0 opacity-60" />
                <span className="opacity-70">{ev.time}</span>
                <span className="flex-1 truncate font-medium">{ev.title}</span>
                <button onClick={() => removeEvent(ev.id)} className="opacity-0 group-hover:opacity-100 transition-opacity click-shrink">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
