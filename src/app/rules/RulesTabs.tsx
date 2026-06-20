"use client";

import { useState } from "react";

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
        <article className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="mb-3 text-sm text-zinc-500">
            Раздел: {activeRule.category || "rules"}
          </div>

          <h2 className="text-3xl font-bold">
            {activeRule.title}
          </h2>

          <p className="mt-5 whitespace-pre-line text-lg leading-8 text-zinc-300">
            {activeRule.content}
          </p>

          {activeRule.image_url ? (
            <img
              src={activeRule.image_url}
              alt={activeRule.title}
              className="mt-6 w-full rounded-2xl bg-black p-2 object-contain"
            />
          ) : null}
        </article>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
          Правил пока нет.
        </div>
      )}
    </div>
  );
}