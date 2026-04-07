import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface XpState {
  xp: number;
  level: number;
  streak: number;
  totalTasksDone: number;
  achievements: string[];
  toasts: ToastMsg[];
}

interface ToastMsg {
  id: string;
  text: string;
  emoji: string;
  type: "xp" | "level" | "achievement" | "streak";
}

interface XpContextType extends XpState {
  addXp: (amount: number, reason: string) => void;
  incrementStreak: () => void;
  completeTask: () => void;
  dismissToast: (id: string) => void;
}

const XP_PER_LEVEL = 100;

const LEVEL_TITLES = [
  "NPC 💀", "Noob 🌱", "Grinder 💪", "Sweat 🔥", "Goated 🐐",
  "Based King 👑", "Sigma 🧠", "Final Boss 🎮", "Legendary 🏆", "Ascended ✨"
];

const XpContext = createContext<XpContextType | null>(null);

export function useXp() {
  const ctx = useContext(XpContext);
  if (!ctx) throw new Error("useXp must be inside XpProvider");
  return ctx;
}

export function getLevelTitle(level: number) {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)];
}

export function XpProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<XpState>({
    xp: 0,
    level: 0,
    streak: 0,
    totalTasksDone: 0,
    achievements: [],
    toasts: [],
  });

  const pushToast = useCallback((text: string, emoji: string, type: ToastMsg["type"]) => {
    const id = crypto.randomUUID();
    setState(s => ({ ...s, toasts: [...s.toasts, { id, text, emoji, type }] }));
    setTimeout(() => {
      setState(s => ({ ...s, toasts: s.toasts.filter(t => t.id !== id) }));
    }, 3000);
  }, []);

  const addXp = useCallback((amount: number, reason: string) => {
    setState(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL);
      const leveled = newLevel > prev.level;
      
      if (leveled) {
        setTimeout(() => pushToast(`LEVEL UP! ${getLevelTitle(newLevel)}`, "🚀", "level"), 500);
      }

      return { ...prev, xp: newXp, level: newLevel };
    });
    pushToast(`+${amount} XP — ${reason}`, "⚡", "xp");
  }, [pushToast]);

  const incrementStreak = useCallback(() => {
    setState(prev => {
      const newStreak = prev.streak + 1;
      const achievements = [...prev.achievements];
      
      if (newStreak === 3 && !achievements.includes("streak3")) {
        achievements.push("streak3");
        setTimeout(() => pushToast("3-day streak! no cap 🔥", "🏅", "achievement"), 300);
      }
      if (newStreak === 7 && !achievements.includes("streak7")) {
        achievements.push("streak7");
        setTimeout(() => pushToast("WEEKLY WARRIOR unlocked!", "🏆", "achievement"), 300);
      }
      
      return { ...prev, streak: newStreak, achievements };
    });
  }, [pushToast]);

  const completeTask = useCallback(() => {
    setState(prev => {
      const total = prev.totalTasksDone + 1;
      const achievements = [...prev.achievements];
      
      if (total === 1 && !achievements.includes("first")) {
        achievements.push("first");
        setTimeout(() => pushToast("First task done! slay 💅", "🎉", "achievement"), 300);
      }
      if (total === 10 && !achievements.includes("ten")) {
        achievements.push("ten");
        setTimeout(() => pushToast("10 tasks! you're lowkey goated", "🐐", "achievement"), 300);
      }
      
      return { ...prev, totalTasksDone: total, achievements };
    });
    addXp(15, "task completed fr fr");
  }, [addXp]);

  const dismissToast = useCallback((id: string) => {
    setState(s => ({ ...s, toasts: s.toasts.filter(t => t.id !== id) }));
  }, []);

  return (
    <XpContext.Provider value={{ ...state, addXp, incrementStreak, completeTask, dismissToast }}>
      {children}
      {/* Toast overlay */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {state.toasts.map((toast, i) => (
          <div
            key={toast.id}
            className={`animate-slide-up pointer-events-auto cursor-pointer px-4 py-2.5 rounded-lg border backdrop-blur-md flex items-center gap-2 text-xs font-bold tracking-wide transition-all hover-scale click-shrink ${
              toast.type === "xp" ? "bg-primary/20 border-primary/40 text-primary" :
              toast.type === "level" ? "bg-cyber-purple/20 border-cyber-purple/40 text-cyber-purple animate-rainbow-border" :
              toast.type === "achievement" ? "bg-cyber-yellow/20 border-cyber-yellow/40 text-cyber-yellow" :
              "bg-cyber-green/20 border-cyber-green/40 text-cyber-green"
            }`}
            onClick={() => dismissToast(toast.id)}
          >
            <span className="text-base">{toast.emoji}</span>
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </XpContext.Provider>
  );
}
