"use client";

import { useState } from "react";
import AnimatedCard from "../components/AnimatedCard";

type Rule = {
  id: number;
  title: string;
  category: string;
  content: string;
  order_number: number;
  image_url: string;
};

export default function RulesTabs({ rules }: { rules: Rule[] }) {
  const [activeId, setActiveId] = useState(rules[0]?.id);

  const activeRule = rules.find((rule) => rule.id === activeId);

  if (!rules.length) {
    return (
      <AnimatedCard>
        <div className="p-8 text-zinc-400">Правил пока нет.</div>
      </AnimatedCard>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap gap-3">
        {rules.map((rule) => (
          <button
            key={rule.id}
            onClick={() => setActiveId(rule.id)}
            className={`rounded-2xl px-5 py-3 font-semibold transition ${
              activeId === rule.id
                ? "bg-white text-black"
                : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            {rule.title}
          </button>
        ))}
      </div>

      {activeRule ? (
        <AnimatedCard>
          <article className="overflow-hidden">
            {activeRule.image_url ? (
              <img
                src={activeRule.image_url}
                alt={activeRule.title}
                className="max-h-[500px] w-full bg-black object-contain p-3"
              />
            ) : null}

            <div className="p-8">
              <div className="mb-4 flex flex-wrap gap-3">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300">
                  📖 {activeRule.category || "Правила"}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
                  № {activeRule.order_number || 1}
                </span>
              </div>

              <h2 className="text-4xl font-black">{activeRule.title}</h2>

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6">
                <p className="whitespace-pre-line text-lg leading-9 text-zinc-300">
                  {activeRule.content}
                </p>
              </div>
            </div>
          </article>
        </AnimatedCard>
      ) : null}
    </div>
  );
}