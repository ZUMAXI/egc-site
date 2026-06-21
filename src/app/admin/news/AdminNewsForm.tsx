"use client";

import { useState } from "react";

export default function AdminNewsForm({ news }: { news: any[] }) {
  const [items, setItems] = useState(news);
  const [editing, setEditing] = useState<any | null>(null);

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
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/news/upload", {
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

  async function saveNews() {
    setSaving(true);

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

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Не удалось сохранить новость.");
      setSaving(false);
    }
  }

  async function deleteNews(id: number) {
    const ok = confirm("Точно удалить эту новость?");
    if (!ok) return;

    const res = await fetch("/api/admin/news/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("Не удалось удалить новость.");
    }
  }

  return (
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

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-black p-4">
          <span className="text-sm text-zinc-400">Изображение новости</span>

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
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="Или вставь ссылку на изображение"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          {uploading ? (
            <p className="text-sm text-zinc-400">Загружаем изображение...</p>
          ) : null}

          {imageUrl ? (
            <button
              onClick={() => setImageUrl("")}
              className="w-fit rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-2 font-bold text-red-300"
            >
              Убрать изображение
            </button>
          ) : null}
        </div>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Текст новости"
          rows={7}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[350px] w-full rounded-2xl bg-black object-contain"
          />
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={saveNews}
            disabled={saving || uploading}
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

            <p className="mt-4 line-clamp-3 text-zinc-300">{item.content}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => startEdit(item)}
                className="rounded-2xl bg-white px-5 py-2 font-bold text-black"
              >
                Редактировать
              </button>

              <button
                onClick={() => deleteNews(item.id)}
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