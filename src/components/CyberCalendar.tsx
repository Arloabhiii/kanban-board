import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Clock } from "lucide-react";

interface ScheduleEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  color: "cyan" | "green" | "purple" | "pink";
}

const colorMap = {
  cyan: "bg-cyber-cyan/20 border-cyber-cyan/40 text-cyber-cyan",
  green: "bg-cyber-green/20 border-cyber-green/40 text-cyber-green",
  purple: "bg-cyber-purple/20 border-cyber-purple/40 text-cyber-purple",
  pink: "bg-cyber-pink/20 border-cyber-pink/40 text-cyber-pink",
};

export default function CyberCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>([
    { id: "1", title: "Sprint Review", date: formatDate(new Date()), time: "09:00", color: "cyan" },
    { id: "2", title: "Deep Work Block", date: formatDate(new Date()), time: "14:00", color: "purple" },
  ]);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "09:00", color: "cyan" as const });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
  const todayStr = formatDate(new Date());

  const days: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function formatDate(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function dateStr(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const addEvent = () => {
    if (!newEvent.title.trim()) return;
    setEvents(prev => [...prev, { ...newEvent, id: crypto.randomUUID(), date: selectedDate }]);
    setNewEvent({ title: "", time: "09:00", color: "cyan" });
    setShowAddForm(false);
  };

  const removeEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));
  const selectedEvents = events.filter(e => e.date === selectedDate);

  const monthName = currentDate.toLocaleString("en", { month: "long" }).toUpperCase();

  return (
    <div className="rounded-lg bg-card p-4 cyber-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-xs font-bold tracking-wider text-primary text-glow-cyan">
          // SCHEDULE
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-0.5 hover:bg-muted rounded"><ChevronLeft className="w-3.5 h-3.5 text-primary" /></button>
          <span className="text-[10px] text-foreground font-display tracking-wider">{monthName} {year}</span>
          <button onClick={nextMonth} className="p-0.5 hover:bg-muted rounded"><ChevronRight className="w-3.5 h-3.5 text-primary" /></button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map(d => (
          <div key={d} className="text-[8px] text-muted-foreground text-center py-1">{d}</div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const ds = dateStr(day);
          const isToday = ds === todayStr;
          const isSelected = ds === selectedDate;
          const hasEvents = events.some(e => e.date === ds);
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(ds)}
              className={`text-[10px] py-1.5 rounded relative transition-all ${
                isSelected ? "bg-primary/20 border border-primary/50 text-primary font-bold" :
                isToday ? "bg-muted text-foreground font-bold" :
                "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {day}
              {hasEvents && <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyber-cyan" />}
            </button>
          );
        })}
      </div>

      {/* Events for selected date */}
      <div className="border-t border-border pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground">
            EVENTS [{selectedDate}]
          </span>
          <button onClick={() => setShowAddForm(!showAddForm)} className="p-0.5 hover:bg-primary/10 rounded">
            {showAddForm ? <X className="w-3 h-3 text-primary" /> : <Plus className="w-3 h-3 text-primary" />}
          </button>
        </div>

        {showAddForm && (
          <div className="flex gap-1 mb-2">
            <input
              value={newEvent.title}
              onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && addEvent()}
              placeholder="event_name..."
              className="flex-1 bg-muted/30 border border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))}
              className="w-20 bg-muted/30 border border-border rounded px-1 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50"
            />
            <button onClick={addEvent} className="px-2 py-1 bg-primary/20 border border-primary/30 rounded text-xs text-primary hover:bg-primary/30">
              +
            </button>
          </div>
        )}

        <div className="space-y-1 max-h-24 overflow-y-auto">
          {selectedEvents.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic">no_events_scheduled</p>
          ) : (
            selectedEvents.sort((a, b) => a.time.localeCompare(b.time)).map(ev => (
              <div key={ev.id} className={`group flex items-center gap-2 rounded px-2 py-1 border text-[11px] ${colorMap[ev.color]}`}>
                <Clock className="w-3 h-3 shrink-0" />
                <span className="opacity-70">{ev.time}</span>
                <span className="flex-1 truncate">{ev.title}</span>
                <button onClick={() => removeEvent(ev.id)} className="opacity-0 group-hover:opacity-100">
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
