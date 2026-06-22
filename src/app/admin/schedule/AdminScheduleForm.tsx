"use client";

import { useState } from "react";

const accentOptions = [
  "bg-sky-500/15 text-sky-300",
  "bg-zinc-500/15 text-zinc-300",
  "bg-violet-500/15 text-violet-300",
  "bg-yellow-500/15 text-yellow-300",
  "bg-emerald-500/15 text-emerald-300",
  "bg-red-500/15 text-red-300",
];

export default function AdminScheduleForm({ schedule }: { schedule: any[] }) {
  const [items] = useState(schedule);
  const [editing, setEditing] = useState<any | null>(null);

  const [dayName, setDayName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [title, setTitle] = useState("");
  const [accent, setAccent] = useState(accentOptions[0]);
  const [sortOrder, setSortOrder] = useState(1);
  const [saving, setSaving] = useState(false);

  function startEdit(item: any) {
    setEditing(item);
    setDayName(item.day_name || "");
    setStartTime(item.start_time || "");
    setEndTime(item.end_time || "");
    setTitle(item.title || "");
    setAccent(item.accent || accentOptions[0]);
    setSortOrder(item.sort_order || 1);
  }

  async function saveSchedule() {
    setSaving(true);

    const res = await fetch("/api/admin/schedule/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editing?.id,
        day_name: dayName,
        start_time: startTime,
        end_time: endTime,
        title,
        accent,
        sort_order: sortOrder,
      }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Не удалось сохранить расписание.");
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-5 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-bold">
          {editing ? "Редактировать день" : "Новый день"}
        </h2>

        <input
          value={dayName}
          onChange={(event) => setDayName(event.target.value)}
          placeholder="День недели"
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            placeholder="Начало, например 21:00"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          <input
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            placeholder="Конец, например 21:40"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />
        </div>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Название активности"
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        <select
          value={accent}
          onChange={(event) => setAccent(event.target.value)}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        >
          {accentOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={sortOrder}
          onChange={(event) => setSortOrder(Number(event.target.value))}
          placeholder="Порядок"
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        <button
          onClick={saveSchedule}
          disabled={saving}
          className="w-fit rounded-2xl bg-white px-7 py-3 font-bold text-black transition hover:scale-105 disabled:opacity-50"
        >
          {saving ? "Сохраняем..." : "Сохранить"}
        </button>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => startEdit(item)}
            className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10 md:grid-cols-[160px_180px_1fr]"
          >
            <div className={`w-fit rounded-full px-4 py-2 font-bold ${item.accent}`}>
              {item.day_name}
            </div>

            <div className="text-zinc-300">
              {item.start_time || "—"}
              {item.end_time ? ` — ${item.end_time}` : ""}
            </div>

            <div className="font-bold">{item.title || "Отдых"}</div>
          </button>
        ))}
      </div>
    </div>
  );
}