import { useState, useEffect } from "react";
import { useXp } from "./XpContext";

interface Particle {
  id: string;
  x: number;
  y: number;
  emoji: string;
  delay: number;
}

const EMOJIS = ["🎉", "✨", "💥", "🔥", "⚡", "💎", "🌟", "🎊"];

export function ConfettiExplosion({ x, y }: { x: number; y: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const ps = Array.from({ length: 12 }, (_, i) => ({
      id: crypto.randomUUID(),
      x: x + (Math.random() - 0.5) * 120,
      y: y + (Math.random() - 0.5) * 80,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      delay: Math.random() * 0.3,
    }));
    setParticles(ps);
    const timer = setTimeout(() => setParticles([]), 1200);
    return () => clearTimeout(timer);
  }, [x, y]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute animate-confetti text-lg"
          style={{
            left: p.x,
            top: p.y,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

export function XpBar() {
  const { xp, level } = useXp();
  const progress = (xp % 100);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-cyber-purple font-display font-bold">LVL {level}</span>
      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyber-purple to-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[9px] text-muted-foreground">{progress}/100</span>
    </div>
  );
}
