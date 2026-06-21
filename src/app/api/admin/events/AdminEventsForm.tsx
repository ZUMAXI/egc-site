"use client";

import { useState } from "react";

export default function AdminEventsForm({ events }: { events: any[] }) {
  const [items, setItems] = useState(events);
  const [editing, setEditing] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [weekday, setWeekday] = useState("");
  const [startTime, setStartTime] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [status, setStatus] = useState("Скоро");
  const [rewardSteps, setRewardSteps] = useState(0);
  const [rewardMoves, setRewardMoves] = useState(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function startEdit(item: any) {
    setEditing(item);
    setTitle(item.title || "");
    setType(item.type || "");
    setWeekday(item.weekday || "");
    setStartTime(item.start_time || "");
    setEventDate(item.event_date || "");
    setStatus(item.status || "Скоро");
    setRewardSteps(item.reward_steps || 0);
    setRewardMoves(item.reward_moves || 0);
    setDescription(item.description || "");
    setImageUrl(item.image_url || "");
  }

  function clearForm() {
    setEditing(null);
    setTitle("");
    setType("");
    setWeekday("");
    setStartTime("");
    setEventDate("");
    setStatus("Скоро");
    setRewardSteps(0);
    setRewardMoves(0);
    setDescription("");
    setImageUrl("");
  }

  async function uploadImage(file: File) {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/events/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setImageUrl(data.url);
    } else {
      alert("Не удалось загрузить изображение.");
    }

    setUploading(false);
  }

  async function saveEvent() {
    setSaving(true);

    const res = await fetch("/api/admin/events/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editing?.id,
        title,
        type,
        weekday,
        start_time: startTime,
        event_date: eventDate,
        status,
        reward_steps: rewardSteps,
        reward_moves: rewardMoves,
        description,
        image_url: imageUrl,
      }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Не удалось сохранить событие.");
      setSaving(false);
    }
  }

  async function deleteEvent(id: number) {
    const ok = confirm("Точно удалить событие?");
    if (!ok) return;

    const res = await fetch("/api/admin/events/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("Не удалось удалить событие.");
    }
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-bold">
          {editing ? "Редактировать событие" : "Новое событие"}
        </h2>

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white" />
        <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Тип события" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white" />
        <input value={weekday} onChange={(e) => setWeekday(e.target.value)} placeholder="День недели" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white" />
        <input value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Время, например 20:30" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white" />

        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white" />

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white">
          <option value="Скоро">Скоро</option>
          <option value="Идёт">Идёт</option>
          <option value="Завершено">Завершено</option>
        </select>

        <div className="grid gap-4 md:grid-cols-2">
          <input type="number" value={rewardSteps} onChange={(e) => setRewardSteps(Number(e.target.value))} placeholder="Награда шаги" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white" />
          <input type="number" value={rewardMoves} onChange={(e) => setRewardMoves(Number(e.target.value))} placeholder="Награда ходы" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white" />
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-black p-4">
          <span className="text-sm text-zinc-400">Изображение события</span>

          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadImage(file);
            }}
            className="text-sm text-zinc-300"
          />

          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Или вставь ссылку"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          {uploading ? <p className="text-sm text-zinc-400">Загружаем...</p> : null}

          {imageUrl ? (
            <button
              onClick={() => setImageUrl("")}
              className="w-fit rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-2 font-bold text-red-300"
            >
              Убрать изображение
            </button>
          ) : null}
        </div>

        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание события" rows={7} className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white" />

        {imageUrl ? (
          <img src={imageUrl} alt={title} className="max-h-[350px] w-full rounded-2xl bg-black object-contain" />
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button onClick={saveEvent} disabled={saving || uploading} className="rounded-2xl bg-white px-7 py-3 font-bold text-black transition hover:scale-105 disabled:opacity-50">
            {saving ? "Сохраняем..." : "Сохранить"}
          </button>

          {editing ? (
            <button onClick={clearForm} className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 font-bold text-white hover:bg-white/10">
              Отмена
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="mb-5 max-h-[250px] w-full rounded-2xl bg-black object-contain" />
            ) : null}

            <h3 className="text-2xl font-bold">{item.title}</h3>

            <p className="mt-2 text-sm text-zinc-500">
              {item.weekday || "День не указан"} • {item.start_time || "Время не указано"} • {item.status || "Скоро"}
            </p>

            <p className="mt-4 line-clamp-3 text-zinc-300">{item.description}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => startEdit(item)} className="rounded-2xl bg-white px-5 py-2 font-bold text-black">
                Редактировать
              </button>

              <button onClick={() => deleteEvent(item.id)} className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-2 font-bold text-red-300">
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}