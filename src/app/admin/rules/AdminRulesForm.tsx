"use client";

import { useState } from "react";

export default function AdminRulesForm({ rules }: { rules: any[] }) {
  const [items, setItems] = useState(rules);
  const [editing, setEditing] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  function startEdit(rule: any) {
    setEditing(rule);
    setTitle(rule.title || "");
    setContent(rule.content || "");
    setSortOrder(rule.sort_order || 0);
  }

  function clearForm() {
    setEditing(null);
    setTitle("");
    setContent("");
    setSortOrder(0);
  }

  async function saveRule() {
    setSaving(true);

    const res = await fetch("/api/admin/rules/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing?.id,
        title,
        content,
        sort_order: sortOrder,
      }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Не удалось сохранить правило.");
      setSaving(false);
    }
  }

  async function deleteRule(id: number) {
    if (!confirm("Точно удалить это правило?")) return;

    const res = await fetch("/api/admin/rules/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("Не удалось удалить правило.");
    }
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-bold">
          {editing ? "Редактировать правило" : "Новое правило"}
        </h2>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Название раздела"
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        <input
          type="number"
          value={sortOrder}
          onChange={(event) => setSortOrder(Number(event.target.value))}
          placeholder="Порядок"
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Текст правил"
          rows={10}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={saveRule}
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
        {items.map((rule) => (
          <div
            key={rule.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="text-sm text-zinc-500">
              Порядок: {rule.sort_order || 0}
            </div>

            <h3 className="mt-2 text-2xl font-bold">{rule.title}</h3>

            <p className="mt-4 line-clamp-4 whitespace-pre-line text-zinc-300">
              {rule.content}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => startEdit(rule)}
                className="rounded-2xl bg-white px-5 py-2 font-bold text-black"
              >
                Редактировать
              </button>

              <button
                onClick={() => deleteRule(rule.id)}
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