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

              <p className="mt-8 whitespace-pre-line text-lg leading-8 text-zinc-300">
                {activeEvent.description}
              </p>
            </div>
          </article>
        </AnimatedCard>
      ) : null}
    </div>
  );
}