"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function EditProfileForm({ profile }: { profile: any }) {
  const [nickname, setNickname] = useState(profile.nickname || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadAvatar(file: File) {
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

      const res = await fetch("/api/profile/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Не удалось загрузить аватар.");
        return;
      }

      setAvatarUrl(data.url);
      toast.success("Аватар загружен!");
    } catch {
      toast.error("Ошибка при загрузке аватара.");
    } finally {
      setUploading(false);
    }
  }

  async function saveProfile() {
    if (saving || uploading) return;

    setSaving(true);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname,
          bio,
          avatar_url: avatarUrl,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        toast.success("Профиль успешно сохранён!");

        setTimeout(() => {
          window.location.href = "/profile";
        }, 800);
      } else {
        toast.error(data?.error || "Не удалось сохранить профиль.");
        setSaving(false);
      }
    } catch {
      toast.error("Ошибка при сохранении профиля.");
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-5xl font-black">
          Редактировать профиль
        </h1>

        <p className="mb-10 text-zinc-400">
          Здесь можно изменить ник, аватар и описание профиля.
        </p>

        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">Ник</span>

            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Введите ник"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            />
          </label>

          <div className="grid gap-4">
            <span className="text-sm text-zinc-400">Аватар</span>

            <div className="flex flex-wrap items-center gap-5">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={nickname || "Аватар"}
                  className="h-32 w-32 rounded-full border border-white/10 bg-black object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-black text-5xl">
                  ♟
                </div>
              )}

              <div className="grid gap-3">
                <label className="w-fit cursor-pointer rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:scale-105">
                  {uploading ? "Загружаем..." : "Выбрать изображение"}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    disabled={uploading || saving}
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        uploadAvatar(file);
                      }

                      event.target.value = "";
                    }}
                    className="hidden"
                  />
                </label>

                {avatarUrl ? (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl("")}
                    disabled={uploading || saving}
                    className="w-fit rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-3 font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                  >
                    Удалить аватар
                  </button>
                ) : null}

                <p className="max-w-sm text-sm text-zinc-500">
                  Поддерживаются PNG, JPG, WEBP и GIF. Максимальный размер —
                  5 МБ.
                </p>
              </div>
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">Описание</span>

            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={6}
              placeholder="Расскажи немного о себе"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            />
          </label>

          <button
            type="button"
            onClick={saveProfile}
            disabled={saving || uploading}
            className="rounded-2xl bg-white px-7 py-3 font-bold text-black transition hover:scale-105 disabled:opacity-50"
          >
            {uploading
              ? "Загружаем аватар..."
              : saving
                ? "Сохраняем..."
                : "Сохранить профиль"}
          </button>
        </div>
      </div>
    </main>
  );
}