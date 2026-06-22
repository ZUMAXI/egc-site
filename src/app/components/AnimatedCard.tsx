"use client";

import FadeIn from "./FadeIn";

export default function AnimatedCard({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <FadeIn delay={delay}>
      <div
        className={`rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-white/5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10 ${className}`}
      >
        {children}
      </div>
    </FadeIn>
  );
}