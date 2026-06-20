"use client";

import { useState } from "react";

type Chapter = {
  id: number;
  title: string;
  chapter_number: number;
  content: string;
  is_finished: boolean;
};

export default function LoreTabs({ chapters }: { chapters: Chapter[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id);

  const activeChapter = chapters.find((chapter) => chapter.id === activeId);

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
            {chapter.title}
          </button>
        ))}
      </div>

      {activeChapter ? (
        <article className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="mb-3 text-sm text-zinc-500">
            Глава {activeChapter.chapter_number}
          </div>

          <h2 className="text-3xl font-bold">{activeChapter.title}</h2>

          <p className="mt-5 whitespace-pre-line text-lg leading-8 text-zinc-300">
            {activeChapter.is_finished
              ? activeChapter.content
              : "Эта глава ещё находится в разработке."}
          </p>

          <div className="mt-6 text-sm text-zinc-500">
            Статус: {activeChapter.is_finished ? "Готово" : "В разработке"}
          </div>
        </article>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
          Глав пока нет.
        </div>
      )}
    </div>
  );
}