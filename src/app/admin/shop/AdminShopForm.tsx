"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";
import RichTextEditor from "../../components/RichTextEditor";

export default function AdminShopForm({ items }: { items: any[] }) {
  const [list, setList] = useState(items);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

      const res = await fetch("/api/admin/shop/upload", {
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

  async function saveItem() {
    if (saving || uploading) return;

    if (!name.trim()) {
      toast.error("Укажи название товара.");
      return;
    }

    if (!description.trim() || description === "<p></p>") {
      toast.error("Добавь описание товара.");
      return;
    }

    if (!Number.isFinite(sortOrder) || sortOrder < 1) {
      toast.error("Порядок должен быть больше нуля.");
      return;
    }

    if (priceSteps < 0 || priceMoves < 0) {
      toast.error("Цена товара не может быть отрицательной.");
      return;
    }

    setSaving(true);

    try {
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

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Не удалось сохранить товар.");
        setSaving(false);
        return;
      }

      toast.success(editing ? "Товар сохранён!" : "Товар создан!");

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      toast.error("Ошибка при сохранении товара.");
      setSaving(false);
    }
  }

  async function deleteItem() {
    if (deleteId === null) return;

    try {
      const res = await fetch("/api/admin/shop/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Не удалось удалить товар.");
        setDeleteId(null);
        return;
      }

      setList((prev) => prev.filter((item) => item.id !== deleteId));
      toast.success("Товар удалён.");
      setDeleteId(null);
    } catch {
      toast.error("Ошибка при удалении товара.");
      setDeleteId(null);
    }
  }

  return (
    <>
      <ConfirmDialog
        open={deleteId !== null}
        title="Удалить товар?"
        description="Товар будет удалён из магазина. Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={deleteItem}
        onCancel={() => setDeleteId(null)}
      />

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

          <div className="grid gap-2">
            <span className="text-sm text-zinc-400">
              Описание товара
            </span>

            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Напиши описание товара..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              min={0}
              value={priceSteps}
              onChange={(event) =>
                setPriceSteps(Number(event.target.value))
              }
              placeholder="Цена в шагах"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
            />

            <input
              type="number"
              min={0}
              value={priceMoves}
              onChange={(event) =>
                setPriceMoves(Number(event.target.value))
              }
              placeholder="Цена в ходах"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
            />
          </div>

          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">
              Порядок отображения
            </span>

            <input
              type="number"
              min={1}
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(Number(event.target.value))
              }
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

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-black p-4">
            <span className="text-sm text-zinc-400">
              Изображение товара
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
              placeholder="Или вставь ссылку"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
            />
          </div>

          {imageUrl ? (
            <div className="grid gap-3">
              <span className="text-sm text-zinc-400">
                Предпросмотр
              </span>

              <img
                src={imageUrl}
                alt={name || "Изображение товара"}
                className="max-h-[350px] w-full rounded-2xl border border-white/10 bg-black object-contain"
              />
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveItem}
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

              <h3 className="mt-2 text-2xl font-bold">
                {item.name}
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
                  __html: item.description || "",
                }}
              />

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