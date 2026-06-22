"use client";

import { useState } from "react";
import AnimatedCard from "../components/AnimatedCard";

type Chapter = {
  id: number;
  title: string;
  chapter_number: number;
  content: string;
  is_finished: boolean;
};

export default function LoreTabs({ chapters }: { chapters: Chapter[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id);

  const activeChapter = chapters.find(
    (chapter) => chapter.id === activeId
  );

  if (!chapters.length) {
    return (
      <AnimatedCard>
        <div className="p-8 text-zinc-400">
          Глав пока нет.
        </div>
      </AnimatedCard>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap gap-3">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => setActiveId(chapter.id)}
            className={`rounded-2xl px-5 py-3 font-semibold transition ${
              activeId === chapter.id
                ? "bg-white text-black"
                : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            Глава {chapter.chapter_number}
          </button>
        ))}
      </div>

      {activeChapter ? (
        <AnimatedCard>
          <article className="p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
                📖 Глава {activeChapter.chapter_number}
              </span>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  activeChapter.is_finished
                    ? "border border-green-500/20 bg-green-500/15 text-green-300"
                    : "border border-yellow-500/20 bg-yellow-500/15 text-yellow-300"
                }`}
              >
                {activeChapter.is_finished
                  ? "✅ Завершена"
                  : "🚧 В разработке"}
              </span>
            </div>

            <h2 className="text-4xl font-black">
              {activeChapter.title}
            </h2>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6">
              <p className="whitespace-pre-line text-lg leading-9 text-zinc-300">
                {activeChapter.is_finished
                  ? activeChapter.content
                  : "Эта глава ещё находится в разработке."}
              </p>
            </div>
          </article>
        </AnimatedCard>
      ) : null}
    </div>
  );
}