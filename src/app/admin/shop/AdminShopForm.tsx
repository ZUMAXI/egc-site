"use client";

import { useState } from "react";

export default function AdminShopForm({ items }: { items: any[] }) {
  const [list, setList] = useState(items);
  const [editing, setEditing] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [priceSteps, setPriceSteps] = useState(0);
  const [priceMoves, setPriceMoves] = useState(0);
  const [sortOrder, setSortOrder] = useState(1);
  const [isAvailable, setIsAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function startEdit(item: any) {
    setEditing(item);
    setName(item.name || "");
    setDescription(item.description || "");
    setImageUrl(item.image_url || "");
    setPriceSteps(item.price_steps || 0);
    setPriceMoves(item.price_moves || 0);
    setSortOrder(item.sort_order || 1);
    setIsAvailable(item.is_available ?? true);
  }

  function clearForm() {
    setEditing(null);
    setName("");
    setDescription("");
    setImageUrl("");
    setPriceSteps(0);
    setPriceMoves(0);
    setSortOrder(1);
    setIsAvailable(true);
  }

  async function uploadImage(file: File) {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/shop/upload", {
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

  async function saveItem() {
    setSaving(true);

    const res = await fetch("/api/admin/shop/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editing?.id,
        name,
        description,
        image_url: imageUrl,
        price_steps: priceSteps,
        price_moves: priceMoves,
        sort_order: sortOrder,
        is_available: isAvailable,
      }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Не удалось сохранить товар.");
      setSaving(false);
    }
  }

  async function deleteItem(id: number) {
    if (!confirm("Точно удалить этот товар?")) return;

    const res = await fetch("/api/admin/shop/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setList((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("Не удалось удалить товар.");
    }
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-bold">
          {editing ? "Редактировать товар" : "Новый товар"}
        </h2>

        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Название товара"
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Описание товара"
          rows={6}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="number"
            min={0}
            value={priceSteps}
            onChange={(event) => setPriceSteps(Number(event.target.value))}
            placeholder="Цена в шагах"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          <input
            type="number"
            min={0}
            value={priceMoves}
            onChange={(event) => setPriceMoves(Number(event.target.value))}
            placeholder="Цена в ходах"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />
        </div>

        <label className="grid gap-2">
          <span className="text-sm text-zinc-400">Порядок отображения</span>
          <input
            type="number"
            min={1}
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black px-4 py-3">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(event) => setIsAvailable(event.target.checked)}
          />
          <span>Товар доступен</span>
        </label>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-black p-4">
          <span className="text-sm text-zinc-400">Изображение товара</span>

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
            placeholder="Или вставь ссылку"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          {uploading ? (
            <p className="text-sm text-zinc-400">Загружаем...</p>
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

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="max-h-[350px] w-full rounded-2xl bg-black object-contain"
          />
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={saveItem}
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
        {list.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="mb-5 max-h-[250px] w-full rounded-2xl bg-black object-contain"
              />
            ) : null}

            <div className="text-sm text-zinc-500">
              Порядок: {item.sort_order || 1} •{" "}
              {item.is_available ? "Доступен" : "Скрыт"}
            </div>

            <h3 className="mt-2 text-2xl font-bold">{item.name}</h3>

            <p className="mt-4 whitespace-pre-line text-zinc-300">
              {item.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/10 px-3 py-1">
                👣 {item.price_steps || 0}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1">
                ♟ {item.price_moves || 0}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => startEdit(item)}
                className="rounded-2xl bg-white px-5 py-2 font-bold text-black"
              >
                Редактировать
              </button>

              <button
                onClick={() => deleteItem(item.id)}
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