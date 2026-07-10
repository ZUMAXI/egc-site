"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";
import RichTextEditor from "../../components/RichTextEditor";

export default function AdminRulesForm({ rules }: { rules: any[] }) {
  const [items, setItems] = useState(rules);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [saving, setSaving] = useState(false);

  function startEdit(rule: any) {
    setEditing(rule);
    setTitle(rule.title || "");
    setContent(rule.content || "");
    setSortOrder(rule.sort_order || 1);
  }

  function clearForm() {
    setEditing(null);
    setTitle("");
    setContent("");
    setSortOrder(1);
  }

  async function saveRule() {
    if (saving) return;

    if (!title.trim()) {
      toast.error("Укажи название раздела.");
      return;
    }

    if (!content.trim() || content === "<p></p>") {
      toast.error("Добавь текст правила.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/rules/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editing?.id,
          title,
          content,
          sort_order: sortOrder,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        toast.success(editing ? "Правило сохранено!" : "Правило создано!");

        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        toast.error(data?.error || "Не удалось сохранить правило.");
        setSaving(false);
      }
    } catch {
      toast.error("Ошибка при сохранении правила.");
      setSaving(false);
    }
  }

  async function deleteRule() {
    if (deleteId === null) return;

    const res = await fetch("/api/admin/rules/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: deleteId }),
    });

    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== deleteId));
      toast.success("Правило удалено.");
    } else {
      toast.error("Не удалось удалить правило.");
    }

    setDeleteId(null);
  }

  return (
    <>
      <ConfirmDialog
        open={deleteId !== null}
        title="Удалить правило?"
        description="Правило будет удалено. Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={deleteRule}
        onCancel={() => setDeleteId(null)}
      />

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

          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">
              Порядок отображения
            </span>

            <input
              type="number"
              min={1}
              value={sortOrder}
              onChange={(event) => setSortOrder(Number(event.target.value))}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
            />
          </label>

          <div className="grid gap-2">
            <span className="text-sm text-zinc-400">
              Текст правила
            </span>

            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Напиши правила..."
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveRule}
              disabled={saving}
              className="rounded-2xl bg-white px-7 py-3 font-bold text-black transition hover:scale-105 disabled:opacity-50"
            >
              {saving ? "Сохраняем..." : "Сохранить"}
            </button>

            {editing ? (
              <button
                type="button"
                onClick={clearForm}
                disabled={saving}
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 font-bold text-white hover:bg-white/10 disabled:opacity-50"
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
                Порядок: {rule.sort_order || 1}
              </div>

              <h3 className="mt-2 text-2xl font-bold">
                {rule.title}
              </h3>

              <div
                className={[
                  "mt-4 line-clamp-5 text-zinc-300",
                  "[&_p]:my-2",
                  "[&_h1]:text-3xl",
                  "[&_h2]:text-2xl",
                  "[&_h3]:text-xl",
                  "[&_strong]:font-bold",
                  "[&_ul]:list-disc",
                  "[&_ul]:pl-6",
                  "[&_ol]:list-decimal",
                  "[&_ol]:pl-6",
                  "[&_blockquote]:border-l-4",
                  "[&_blockquote]:border-white/20",
                  "[&_blockquote]:pl-4",
                  "[&_blockquote]:italic",
                  "[&_a]:text-blue-400",
                  "[&_a]:underline",
                ].join(" ")}
                dangerouslySetInnerHTML={{
                  __html: rule.content || "",
                }}
              />

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(rule)}
                  className="rounded-2xl bg-white px-5 py-2 font-bold text-black"
                >
                  Редактировать
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteId(rule.id)}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-2 font-bold text-red-300"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}