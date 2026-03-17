"use client";

import { Zap, TrendingUp, Award, Flame } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import SectionHeading from "@/components/ui/SectionHeading";

const FEATURES = [
  {
    icon: Zap,
    title: "Ganá XP",
    description: "Completá lecciones y desafíos para ganar puntos de experiencia.",
    color: "text-xp-gold bg-xp-gold/10",
  },
  {
    icon: TrendingUp,
    title: "Subí de Nivel",
    description: "Avanzá del nivel 1 al 50. Cada nivel desbloquea módulos nuevos.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Award,
    title: "Desbloqueá Badges",
    description: "Conseguí insignias por logros especiales y hitos del curso.",
    color: "text-accent bg-accent/10",
  },
  {
    icon: Flame,
    title: "Mantené la Racha",
    description: "Aprendé todos los días y mantené tu racha activa.",
    color: "text-orange-400 bg-orange-400/10",
  },
];

export default function GamificationSection() {
  return (
    <section id="gamificacion" className="border-t border-border bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <AnimateOnScroll>
          <SectionHeading
            badge="Gamificación"
            title="Aprender es más fácil cuando es divertido"
            highlight="divertido"
            subtitle="Sistema completo de XP, niveles, badges y rachas para mantenerte motivado."
          />
        </AnimateOnScroll>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <AnimateOnScroll key={feature.title} delay={i * 100}>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <div
                  className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Profile preview card */}
        <AnimateOnScroll delay={500}>
          <div className="mx-auto mt-12 max-w-sm rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-2xl">
                🧑‍💻
              </div>
              <div>
                <p className="font-semibold text-foreground">Tu perfil</p>
                <p className="text-sm text-muted-foreground">Nivel 12 — Explorador</p>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">XP del nivel</span>
                <span className="font-medium text-xp-gold">2,450 / 3,000 XP</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-xp-gold to-yellow-300" />
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-5 flex justify-between text-center">
              <div>
                <p className="text-xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Nivel</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">Badges</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">15🔥</p>
                <p className="text-xs text-muted-foreground">Racha</p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
