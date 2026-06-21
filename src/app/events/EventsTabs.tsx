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
  image_url: string;
};

export default function EventsTabs({ events }: { events: Event[] }) {
  const [activeId, setActiveId] = useState(events[0]?.id);
  const activeEvent = events.find((event) => event.id === activeId);

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
        <article className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="mb-3 text-sm text-zinc-500">
            Тип: {activeEvent.type || "Событие"}
          </div>

          <h2 className="text-3xl font-bold">{activeEvent.title}</h2>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-400">
            <span>День: {activeEvent.weekday || "—"}</span>
            <span>Время: {activeEvent.start_time || "—"}</span>
            <span>Шаги: {activeEvent.reward_steps || 0}</span>
            <span>Ходы: {activeEvent.reward_moves || 0}</span>
          </div>

          <p className="mt-5 whitespace-pre-line text-lg leading-8 text-zinc-300">
            {activeEvent.description}
          </p>

          {activeEvent.image_url ? (
            <img
              src={activeEvent.image_url}
              alt={activeEvent.title}
              className="mt-6 w-full rounded-2xl bg-black p-2 object-contain"
            />
          ) : null}
        </article>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
          Событий пока нет.
        </div>
      )}
    </div>
  );
}