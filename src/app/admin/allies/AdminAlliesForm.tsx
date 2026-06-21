"use client";

import { useState } from "react";

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
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/allies/upload", {
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

  async function saveAlly() {
    setSaving(true);

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

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Не удалось сохранить союз.");
      setSaving(false);
    }
  }

  async function deleteAlly(id: number) {
    if (!confirm("Точно удалить этот союз?")) return;

    const res = await fetch("/api/admin/allies/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("Не удалось удалить союз.");
    }
  }

  function getLeaderName(leaderProfileId: number | null) {
    const profile = profiles.find((item) => item.id === leaderProfileId);
    return profile ? getProfileName(profile) : "Не указан";
  }

  return (
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
          <span className="text-sm text-zinc-400">Статус союза</span>

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
          <span className="text-sm text-zinc-400">Лидер союза</span>

          <select
            value={leaderProfileId}
            onChange={(event) => setLeaderProfileId(event.target.value)}
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
          <span className="text-sm text-zinc-400">Порядок отображения</span>
          <input
            type="number"
            min={1}
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
          />
        </label>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-black p-4">
          <span className="text-sm text-zinc-400">Изображение союза</span>

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

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Описание союза"
          rows={8}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="max-h-[350px] w-full rounded-2xl bg-black object-contain"
          />
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={saveAlly}
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
                alt={item.name}
                className="mb-5 max-h-[250px] w-full rounded-2xl bg-black object-contain"
              />
            ) : null}

            <div className="text-sm text-zinc-500">
              Порядок: {item.sort_order || 1}
            </div>

            <h3 className="mt-2 text-2xl font-bold">{item.name}</h3>

            <p className="mt-2 text-sm text-zinc-500">
              Статус: {item.status || "🤝 Союз"}
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Лидер: {getLeaderName(item.leader_profile_id)}
            </p>

            <p className="mt-4 whitespace-pre-line text-zinc-300">
              {item.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => startEdit(item)}
                className="rounded-2xl bg-white px-5 py-2 font-bold text-black"
              >
                Редактировать
              </button>

              <button
                onClick={() => deleteAlly(item.id)}
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