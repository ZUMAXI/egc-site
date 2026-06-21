"use client";

import { useState } from "react";

export default function EditProfileForm({ profile }: { profile: any }) {
  const [nickname, setNickname] = useState(profile.nickname || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    setSaving(true);

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

    if (res.ok) {
      window.location.href = "/profile";
    } else {
      alert("Не удалось сохранить профиль.");
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-5xl font-black">Редактировать профиль</h1>

        <p className="mb-10 text-zinc-400">
          Здесь можно изменить ник, аватар и описание профиля.
        </p>

        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">Ник</span>
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">Ссылка на аватар</span>
            <input
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-zinc-400">Описание</span>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={6}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            />
          </label>

          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={nickname}
              className="h-32 w-32 rounded-full object-cover"
            />
          ) : null}

          <button
            onClick={saveProfile}
            disabled={saving}
            className="rounded-2xl bg-white px-7 py-3 font-bold text-black transition hover:scale-105 disabled:opacity-50"
          >
            {saving ? "Сохраняем..." : "Сохранить профиль"}
          </button>
        </div>
      </div>
    </main>
  );
}