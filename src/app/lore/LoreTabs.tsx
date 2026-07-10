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
            type="button"
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
              {activeChapter.is_finished ? (
                <div
                  className={[
                    "text-lg leading-9 text-zinc-300",

                    "[&_p]:my-4",

                    "[&_h1]:mb-5",
                    "[&_h1]:mt-7",
                    "[&_h1]:text-4xl",
                    "[&_h1]:font-black",
                    "[&_h1]:leading-tight",

                    "[&_h2]:mb-4",
                    "[&_h2]:mt-6",
                    "[&_h2]:text-3xl",
                    "[&_h2]:font-black",
                    "[&_h2]:leading-tight",

                    "[&_h3]:mb-3",
                    "[&_h3]:mt-5",
                    "[&_h3]:text-2xl",
                    "[&_h3]:font-bold",

                    "[&_strong]:font-black",
                    "[&_em]:italic",
                    "[&_u]:underline",
                    "[&_s]:line-through",

                    "[&_ul]:my-5",
                    "[&_ul]:list-disc",
                    "[&_ul]:pl-8",

                    "[&_ol]:my-5",
                    "[&_ol]:list-decimal",
                    "[&_ol]:pl-8",

                    "[&_li]:my-2",

                    "[&_blockquote]:my-6",
                    "[&_blockquote]:rounded-2xl",
                    "[&_blockquote]:border-l-4",
                    "[&_blockquote]:border-white/20",
                    "[&_blockquote]:bg-white/5",
                    "[&_blockquote]:px-6",
                    "[&_blockquote]:py-4",
                    "[&_blockquote]:italic",
                    "[&_blockquote]:text-zinc-300",

                    "[&_code]:rounded-md",
                    "[&_code]:bg-white/10",
                    "[&_code]:px-1.5",
                    "[&_code]:py-0.5",
                    "[&_code]:font-mono",
                    "[&_code]:text-sm",
                    "[&_code]:text-emerald-300",

                    "[&_pre]:my-6",
                    "[&_pre]:overflow-x-auto",
                    "[&_pre]:rounded-2xl",
                    "[&_pre]:border",
                    "[&_pre]:border-white/10",
                    "[&_pre]:bg-zinc-950",
                    "[&_pre]:p-5",

                    "[&_pre_code]:bg-transparent",
                    "[&_pre_code]:p-0",

                    "[&_hr]:my-8",
                    "[&_hr]:border-white/10",

                    "[&_a]:text-blue-400",
                    "[&_a]:underline",
                    "[&_a]:underline-offset-4",
                    "[&_a]:transition",
                    "[&_a:hover]:text-blue-300",
                  ].join(" ")}
                  dangerouslySetInnerHTML={{
                    __html: activeChapter.content || "",
                  }}
                />
              ) : (
                <p className="text-lg leading-9 text-zinc-300">
                  Эта глава ещё находится в разработке.
                </p>
              )}
            </div>
          </article>
        </AnimatedCard>
      ) : null}
    </div>
  );
}