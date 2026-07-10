"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminNewsForm({ news }: { news: any[] }) {
  const [items, setItems] = useState(news);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function startEdit(item: any) {
    setEditing(item);
    setTitle(item.title || "");
    setContent(item.content || "");
    setAuthor(item.author || "");
    setImageUrl(item.image_url || "");
  }

  function clearForm() {
    setEditing(null);
    setTitle("");
    setContent("");
    setAuthor("");
    setImageUrl("");
  }

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Выбери изображение.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Размер изображения не должен превышать 5 МБ.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/news/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Не удалось загрузить изображение.");
        return;
      }

      setImageUrl(data.url);
      toast.success("Изображение загружено!");
    } catch {
      toast.error("Ошибка при загрузке изображения.");
    } finally {
      setUploading(false);
    }
  }

  async function saveNews() {
    if (saving || uploading) return;

    setSaving(true);

    try {
      const res = await fetch("/api/admin/news/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editing?.id,
          title,
          content,
          author,
          image_url: imageUrl,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        toast.success(editing ? "Новость сохранена!" : "Новость создана!");

        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        toast.error(data?.error || "Не удалось сохранить новость.");
        setSaving(false);
      }
    } catch {
      toast.error("Ошибка при сохранении новости.");
      setSaving(false);
    }
  }

  async function deleteNews() {
    if (deleteId === null) return;

    const res = await fetch("/api/admin/news/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: deleteId }),
    });

    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== deleteId));
      toast.success("Новость удалена.");
    } else {
      toast.error("Не удалось удалить новость.");
    }

    setDeleteId(null);
  }

  return (
    <>
      <ConfirmDialog
        open={deleteId !== null}
        title="Удалить новость?"
        description="Новость будет удалена. Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={deleteNews}
        onCancel={() => setDeleteId(null)}
      />

      <div className="grid gap-8">
        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-bold">
            {editing ? "Редактировать новость" : "Новая новость"}
          </h2>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Заголовок"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Автор"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-black p-4">
            <span className="text-sm text-zinc-400">
              Изображение новости
            </span>

            <div className="flex flex-wrap items-center gap-4">
              <label className="w-fit cursor-pointer rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:scale-105">
                {uploading ? "Загружаем..." : "Выбрать изображение"}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  disabled={uploading || saving}
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      uploadImage(file);
                    }

                    event.target.value = "";
                  }}
                  className="hidden"
                />
              </label>

              {imageUrl ? (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  disabled={uploading || saving}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-3 font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  Убрать изображение
                </button>
              ) : null}
            </div>

            <p className="text-sm text-zinc-500">
              Поддерживаются PNG, JPG, WEBP и GIF. Максимальный размер — 5 МБ.
            </p>

            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Или вставь ссылку на изображение"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
            />
          </div>

          {imageUrl ? (
            <div className="grid gap-3">
              <span className="text-sm text-zinc-400">Предпросмотр</span>

              <img
                src={imageUrl}
                alt={title || "Изображение новости"}
                className="max-h-[350px] w-full rounded-2xl border border-white/10 bg-black object-contain"
              />
            </div>
          ) : null}

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Текст новости"
            rows={7}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveNews}
              disabled={saving || uploading}
              className="rounded-2xl bg-white px-7 py-3 font-bold text-black transition hover:scale-105 disabled:opacity-50"
            >
              {uploading
                ? "Загружаем изображение..."
                : saving
                  ? "Сохраняем..."
                  : "Сохранить"}
            </button>

            {editing ? (
              <button
                type="button"
                onClick={clearForm}
                disabled={saving || uploading}
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 font-bold text-white hover:bg-white/10 disabled:opacity-50"
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
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="mb-5 max-h-[250px] w-full rounded-2xl bg-black object-contain"
                />
              ) : null}

              <h3 className="text-2xl font-bold">{item.title}</h3>

              <p className="mt-2 text-sm text-zinc-500">
                Автор: {item.author || "EgC"}
              </p>

              <p className="mt-4 line-clamp-3 whitespace-pre-line text-zinc-300">
                {item.content}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-2xl bg-white px-5 py-2 font-bold text-black"
                >
                  Редактировать
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteId(item.id)}
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