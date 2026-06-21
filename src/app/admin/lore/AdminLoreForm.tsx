"use client";

import { useState } from "react";

export default function AdminLoreForm({ lore }: { lore: any[] }) {
  const [items, setItems] = useState(lore);
  const [editing, setEditing] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [saving, setSaving] = useState(false);

  function startEdit(item: any) {
    setEditing(item);
    setTitle(item.title || "");
    setCategory(item.category || "");
    setContent(item.content || "");
    setSortOrder(item.sort_order || 1);
  }

  function clearForm() {
    setEditing(null);
    setTitle("");
    setCategory("");
    setContent("");
    setSortOrder(1);
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
        category,
        content,
        sort_order: sortOrder,
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

        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Категория, например: Пролог"
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        <label className="grid gap-2">
          <span className="text-sm text-zinc-400">Порядок отображения</span>

          <input
            type="number"
            min={1}
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
            placeholder="Например: 1"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />
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
              Порядок: {item.sort_order || 1} • {item.category || "Лор"}
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