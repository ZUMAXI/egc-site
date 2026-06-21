"use client";

import { useState } from "react";

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

export default function EventsTabs({ events }: { events: Event[] }) {
  const [activeId, setActiveId] = useState(events[0]?.id);
  const activeEvent = events.find((event) => event.id === activeId);

  if (!events.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
        Ближайших событий пока нет.
      </div>
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
        <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          {activeEvent.image_url ? (
            <img
              src={activeEvent.image_url}
              alt={activeEvent.title}
              className="max-h-[500px] w-full bg-black object-contain"
            />
          ) : null}

          <div className="p-8">
            <div className="mb-3 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/10 px-3 py-1 text-zinc-300">
                {activeEvent.status || "Скоро"}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1 text-zinc-300">
                {activeEvent.type || "Событие"}
              </span>
            </div>

            <h2 className="text-4xl font-black">{activeEvent.title}</h2>

            <div className="mt-5 grid gap-3 text-sm text-zinc-400 md:grid-cols-4">
              <div>День: {activeEvent.weekday || "—"}</div>
              <div>Время: {activeEvent.start_time || "—"}</div>
              <div>Шаги: +{activeEvent.reward_steps || 0}</div>
              <div>Ходы: +{activeEvent.reward_moves || 0}</div>
            </div>

            {activeEvent.event_date ? (
              <div className="mt-3 text-sm text-zinc-500">
                Дата:{" "}
                {new Date(activeEvent.event_date).toLocaleDateString("ru-RU")}
              </div>
            ) : null}

            <p className="mt-6 whitespace-pre-line text-lg leading-8 text-zinc-300">
              {activeEvent.description}
            </p>
          </div>
        </article>
      ) : null}
    </div>
  );
}