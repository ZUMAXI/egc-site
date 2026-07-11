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
  const [category, setCategory] = useState("Правила");
  const [content, setContent] = useState("");
  const [orderNumber, setOrderNumber] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit(rule: any) {
    setEditing(rule);
    setTitle(rule.title || "");
    setCategory(rule.category || "Правила");
    setContent(rule.content || "");
    setOrderNumber(rule.order_number || 1);
    setImageUrl(rule.image_url || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function clearForm() {
    setEditing(null);
    setTitle("");
    setCategory("Правила");
    setContent("");
    setOrderNumber(1);
    setImageUrl("");
  }

  async function saveRule() {
    if (saving) return;

    if (!title.trim()) {
      toast.error("Укажи название раздела.");
      return;
    }

    if (!category.trim()) {
      toast.error("Укажи категорию правила.");
      return;
    }

    if (!content.trim() || content === "<p></p>") {
      toast.error("Добавь текст правила.");
      return;
    }

    if (!Number.isFinite(orderNumber) || orderNumber < 1) {
      toast.error("Порядок должен быть больше нуля.");
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
          category,
          content,
          order_number: orderNumber,
          image_url: imageUrl,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Не удалось сохранить правило.");
        setSaving(false);
        return;
      }

      toast.success(
        editing ? "Правило сохранено!" : "Правило создано!"
      );

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      toast.error("Ошибка при сохранении правила.");
      setSaving(false);
    }
  }

  async function deleteRule() {
    if (deleteId === null) return;

    try {
      const res = await fetch("/api/admin/rules/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deleteId,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Не удалось удалить правило.");
        setDeleteId(null);
        return;
      }

      setItems((prev) =>
        prev.filter((item) => item.id !== deleteId)
      );

      toast.success("Правило удалено.");
      setDeleteId(null);
    } catch {
      toast.error("Ошибка при удалении правила.");
      setDeleteId(null);
    }
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

          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">
              Название раздела
            </span>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Например: Правила проекта EgC"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">
              Категория
            </span>

            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Например: Проект, Беседы, Администрация"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">
              Порядок отображения
            </span>

            <input
              type="number"
              min={1}
              value={orderNumber}
              onChange={(event) =>
                setOrderNumber(Number(event.target.value))
              }
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">
              Ссылка на изображение
            </span>

            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Необязательно"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            />
          </label>

          {imageUrl ? (
            <div className="grid gap-3">
              <span className="text-sm text-zinc-400">
                Предпросмотр
              </span>

              <img
                src={imageUrl}
                alt={title || "Изображение правила"}
                className="max-h-[350px] w-full rounded-2xl border border-white/10 bg-black object-contain"
              />

              <button
                type="button"
                onClick={() => setImageUrl("")}
                disabled={saving}
                className="w-fit rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-2 font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                Убрать изображение
              </button>
            </div>
          ) : null}

          <div className="grid gap-2">
            <span className="text-sm text-zinc-400">
              Текст правила
            </span>

            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Напиши текст правила..."
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
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 font-bold text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                Отмена
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4">
          {items.length > 0 ? (
            items.map((rule) => (
              <div
                key={rule.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                {rule.image_url ? (
                  <img
                    src={rule.image_url}
                    alt={rule.title}
                    className="mb-5 max-h-[250px] w-full rounded-2xl bg-black object-contain"
                  />
                ) : null}

                <div className="flex flex-wrap gap-2 text-sm text-zinc-500">
                  <span>
                    Порядок: {rule.order_number || 1}
                  </span>

                  <span>•</span>

                  <span>
                    Категория: {rule.category || "Правила"}
                  </span>
                </div>

                <h3 className="mt-2 text-2xl font-bold">
                  {rule.title}
                </h3>

                <div
                  className={[
                    "mt-4 line-clamp-5 text-zinc-300",
                    "[&_p]:my-2",
                    "[&_h1]:text-3xl",
                    "[&_h1]:font-black",
                    "[&_h2]:text-2xl",
                    "[&_h2]:font-black",
                    "[&_h3]:text-xl",
                    "[&_h3]:font-bold",
                    "[&_strong]:font-bold",
                    "[&_em]:italic",
                    "[&_u]:underline",
                    "[&_s]:line-through",
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
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
              Правил пока нет.
            </div>
          )}
        </div>
      </div>
    </>
  );
}