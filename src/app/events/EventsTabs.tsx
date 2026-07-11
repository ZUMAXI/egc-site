"use client";

import { useState } from "react";
import AnimatedCard from "../components/AnimatedCard";

type Event = {
  id: number;
  title: string;
  type: string;
  description: string;
  reward_steps: number;
  reward_moves: number;
  weekday: string;
  start_time: string;
  event_date: string;
  status: string;
  image_url: string;
};

function getStatusStyle(status?: string) {
  switch (status) {
    case "Идёт":
      return "bg-green-500/15 text-green-300 border border-green-500/20";

    case "Завершено":
      return "bg-red-500/15 text-red-300 border border-red-500/20";

    default:
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20";
  }
}

export default function EventsTabs({ events }: { events: Event[] }) {
  const [activeId, setActiveId] = useState(events[0]?.id);

  const activeEvent = events.find((event) => event.id === activeId);

  if (!events.length) {
    return (
      <AnimatedCard>
        <div className="p-8 text-zinc-400">
          Ближайших событий пока нет.
        </div>
      </AnimatedCard>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap gap-3">
        {events.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => setActiveId(event.id)}
            className={`rounded-2xl px-5 py-3 font-semibold transition ${
              activeId === event.id
                ? "bg-white text-black"
                : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            {event.title}
          </button>
        ))}
      </div>

      {activeEvent ? (
        <AnimatedCard>
          <article className="overflow-hidden">
            {activeEvent.image_url ? (
              <img
                src={activeEvent.image_url}
                alt={activeEvent.title}
                className="max-h-[500px] w-full bg-black object-contain"
              />
            ) : null}

            <div className="p-8">
              <div className="mb-4 flex flex-wrap gap-3">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${getStatusStyle(
                    activeEvent.status
                  )}`}
                >
                  {activeEvent.status || "Скоро"}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
                  {activeEvent.type || "Событие"}
                </span>
              </div>

              <h2 className="text-4xl font-black">
                {activeEvent.title}
              </h2>

              <div className="mt-6 grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-sm text-zinc-500">День</div>

                  <div className="font-bold">
                    {activeEvent.weekday || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-sm text-zinc-500">Время</div>

                  <div className="font-bold">
                    {activeEvent.start_time || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="text-sm text-emerald-300">
                    Награда
                  </div>

                  <div className="font-bold text-emerald-200">
                    👣 +{activeEvent.reward_steps || 0}
                  </div>
                </div>

                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                  <div className="text-sm text-violet-300">
                    Награда
                  </div>

                  <div className="font-bold text-violet-200">
                    ♟ +{activeEvent.reward_moves || 0}
                  </div>
                </div>
              </div>

              {activeEvent.event_date ? (
                <div className="mt-4 text-sm text-zinc-500">
                  📅{" "}
                  {new Date(
                    activeEvent.event_date
                  ).toLocaleDateString("ru-RU")}
                </div>
              ) : null}

              <div
                className={[
                  "mt-8 text-lg leading-8 text-zinc-300",

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
                  __html: activeEvent.description || "",
                }}
              />
            </div>
          </article>
        </AnimatedCard>
      ) : null}
    </div>
  );
}