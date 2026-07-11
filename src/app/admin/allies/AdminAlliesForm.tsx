"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";
import RichTextEditor from "../../components/RichTextEditor";

function getProfileName(profile: any) {
  return (
    profile.nickname ||
    profile.telegram_name ||
    profile.telegram_username ||
    "Участник"
  );
}

export default function AdminAlliesForm({
  allies,
  profiles,
}: {
  allies: any[];
  profiles: any[];
}) {
  const [items, setItems] = useState(allies);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("🤝 Союз");
  const [leaderProfileId, setLeaderProfileId] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function startEdit(item: any) {
    setEditing(item);
    setName(item.name || "");
    setStatus(item.status || "🤝 Союз");
    setLeaderProfileId(
      item.leader_profile_id ? String(item.leader_profile_id) : ""
    );
    setDescription(item.description || "");
    setImageUrl(item.image_url || "");
    setSortOrder(item.sort_order || 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function clearForm() {
    setEditing(null);
    setName("");
    setStatus("🤝 Союз");
    setLeaderProfileId("");
    setDescription("");
    setImageUrl("");
    setSortOrder(1);
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

      const res = await fetch("/api/admin/allies/upload", {
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

  async function saveAlly() {
    if (saving || uploading) return;

    if (!name.trim()) {
      toast.error("Укажи название союза.");
      return;
    }

    if (!description.trim() || description === "<p></p>") {
      toast.error("Добавь описание союза.");
      return;
    }

    if (!Number.isFinite(sortOrder) || sortOrder < 1) {
      toast.error("Порядок должен быть больше нуля.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/allies/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editing?.id,
          name,
          status,
          leader_profile_id: leaderProfileId || null,
          description,
          image_url: imageUrl,
          sort_order: sortOrder,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Не удалось сохранить союз.");
        setSaving(false);
        return;
      }

      toast.success(editing ? "Союз сохранён!" : "Союз создан!");

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      toast.error("Ошибка при сохранении союза.");
      setSaving(false);
    }
  }

  async function deleteAlly() {
    if (deleteId === null) return;

    try {
      const res = await fetch("/api/admin/allies/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Не удалось удалить союз.");
        setDeleteId(null);
        return;
      }

      setItems((prev) =>
        prev.filter((item) => item.id !== deleteId)
      );

      toast.success("Союз удалён.");
      setDeleteId(null);
    } catch {
      toast.error("Ошибка при удалении союза.");
      setDeleteId(null);
    }
  }

  function getLeaderName(leaderId: number | string | null) {
    const profile = profiles.find(
      (item) => String(item.id) === String(leaderId)
    );

    return profile ? getProfileName(profile) : "Не указан";
  }

  return (
    <>
      <ConfirmDialog
        open={deleteId !== null}
        title="Удалить союз?"
        description="Союз будет удалён. Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={deleteAlly}
        onCancel={() => setDeleteId(null)}
      />

      <div className="grid gap-8">
        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-bold">
            {editing ? "Редактировать союз" : "Новый союз"}
          </h2>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Название союза"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">
              Статус союза
            </span>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
            >
              <option>🤝 Союз</option>
              <option>🧊 Заморозка</option>
              <option>❌ Закрыт</option>
              <option>⚔️ Война</option>
              <option>⭐ Особый союз</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">
              Лидер союза
            </span>

            <select
              value={leaderProfileId}
              onChange={(event) =>
                setLeaderProfileId(event.target.value)
              }
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
            >
              <option value="">Не указан</option>

              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {getProfileName(profile)}
                </option>
              ))}
            </select>
          </label>

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

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-black p-4">
            <span className="text-sm text-zinc-400">
              Изображение союза
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
                alt={name || "Изображение союза"}
                className="max-h-[350px] w-full rounded-2xl border border-white/10 bg-black object-contain"
              />
            </div>
          ) : null}

          <div className="grid gap-2">
            <span className="text-sm text-zinc-400">
              Описание союза
            </span>

            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Напиши описание союза..."
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveAlly}
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
                  alt={item.name}
                  className="mb-5 max-h-[250px] w-full rounded-2xl bg-black object-contain"
                />
              ) : null}

              <div className="text-sm text-zinc-500">
                Порядок: {item.sort_order || 1}
              </div>

              <h3 className="mt-2 text-2xl font-bold">
                {item.name}
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Статус: {item.status || "🤝 Союз"}
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Лидер: {getLeaderName(item.leader_profile_id)}
              </p>

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