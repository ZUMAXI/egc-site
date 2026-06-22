"use client";

import { useState } from "react";

export default function AdminLoreForm({ lore }: { lore: any[] }) {
  const [items, setItems] = useState(lore);
  const [editing, setEditing] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [chapterNumber, setChapterNumber] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  function startEdit(item: any) {
    setEditing(item);
    setTitle(item.title || "");
    setContent(item.content || "");
    setChapterNumber(item.chapter_number || 1);
    setIsFinished(item.is_finished || false);
  }

  function clearForm() {
    setEditing(null);
    setTitle("");
    setContent("");
    setChapterNumber(1);
    setIsFinished(false);
  }

  async function saveLore() {
    setSaving(true);

    const res = await fetch("/api/admin/lore/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editing?.id,
        title,
        content,
        chapter_number: chapterNumber,
        is_finished: isFinished,
      }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Не удалось сохранить лор.");
      setSaving(false);
    }
  }

  async function deleteLore(id: number) {
    if (!confirm("Точно удалить эту главу лора?")) return;

    const res = await fetch("/api/admin/lore/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("Не удалось удалить лор.");
    }
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-bold">
          {editing ? "Редактировать главу" : "Новая глава"}
        </h2>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Название главы"
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        <label className="grid gap-2">
          <span className="text-sm text-zinc-400">Номер главы</span>

          <input
            type="number"
            min={1}
            value={chapterNumber}
            onChange={(event) => setChapterNumber(Number(event.target.value))}
            placeholder="Например: 1"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black px-4 py-3">
          <input
            type="checkbox"
            checked={isFinished}
            onChange={(event) => setIsFinished(event.target.checked)}
          />
          <span>Глава завершена</span>
        </label>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Текст главы"
          rows={12}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={saveLore}
            disabled={saving}
            className="rounded-2xl bg-white px-7 py-3 font-bold text-black transition hover:scale-105 disabled:opacity-50"
          >
            {saving ? "Сохраняем..." : "Сохранить"}
          </button>

          {editing ? (
            <button
              onClick={clearForm}
              className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              Отмена
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="text-sm text-zinc-500">
              Глава: {item.chapter_number || 1} •{" "}
              {item.is_finished ? "Завершена" : "В процессе"}
            </div>

            <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>

            <p className="mt-4 line-clamp-4 whitespace-pre-line text-zinc-300">
              {item.content}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => startEdit(item)}
                className="rounded-2xl bg-white px-5 py-2 font-bold text-black"
              >
                Редактировать
              </button>

              <button
                onClick={() => deleteLore(item.id)}
                className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-2 font-bold text-red-300"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}