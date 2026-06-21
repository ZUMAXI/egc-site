"use client";

import { useState } from "react";

const positions = [
  "Guest",
  "Host",
  "Clerk",
  "White King",
  "Black King",
  "White Queen",
  "Black Queen",
  "White Bishop",
  "Black Bishop",
  "White Knight",
  "Black Knight",
  "White Rook",
  "Black Rook",
];

const accessRoles = ["guest", "member", "admin", "host"];

export default function AdminMemberEditForm({
  profile,
  currentAccessRole,
}: {
  profile: any;
  currentAccessRole: string;
}) {
  const [position, setPosition] = useState(profile.position || "Guest");
  const [accessRole, setAccessRole] = useState(profile.access_role || "guest");
  const [steps, setSteps] = useState(profile.steps || 0);
  const [moves, setMoves] = useState(profile.moves || 0);
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function save() {
    setSaving(true);

    const res = await fetch("/api/admin/members/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: profile.id,
        position,
        access_role: accessRole,
        steps,
        moves,
        bio,
        avatar_url: avatarUrl,
      }),
    });

    if (res.ok) {
      window.location.href = "/admin/members";
    } else {
      alert("Не удалось сохранить участника.");
      setSaving(false);
    }
  }

  async function deleteMember() {
    const ok = confirm("Точно удалить этот аккаунт? Это действие нельзя отменить.");

    if (!ok) return;

    setDeleting(true);

    const res = await fetch("/api/admin/members/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: profile.id }),
    });

    if (res.ok) {
      window.location.href = "/admin/members";
    } else {
      alert("Не удалось удалить аккаунт.");
      setDeleting(false);
    }
  }

  return (
    <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
      <label className="grid gap-2">
        <span className="text-sm text-zinc-400">Ссылка на аватар</span>
        <input
          value={avatarUrl}
          onChange={(event) => setAvatarUrl(event.target.value)}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />
      </label>

      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={profile.nickname}
          className="h-28 w-28 rounded-full object-cover"
        />
      ) : null}

      <label className="grid gap-2">
        <span className="text-sm text-zinc-400">Описание</span>
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={5}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm text-zinc-400">Должность</span>
        <select
          value={position}
          onChange={(event) => setPosition(event.target.value)}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        >
          {positions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-sm text-zinc-400">Доступ</span>
        <select
          value={accessRole}
          onChange={(event) => setAccessRole(event.target.value)}
          disabled={currentAccessRole !== "host"}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {accessRoles.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-sm text-zinc-400">Шаги</span>
        <input
          type="number"
          value={steps}
          onChange={(event) => setSteps(Number(event.target.value))}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm text-zinc-400">Ходы</span>
        <input
          type="number"
          value={moves}
          onChange={(event) => setMoves(Number(event.target.value))}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-2xl bg-white px-7 py-3 font-bold text-black transition hover:scale-105 disabled:opacity-50"
        >
          {saving ? "Сохраняем..." : "Сохранить"}
        </button>

        {currentAccessRole === "host" ? (
          <button
            onClick={deleteMember}
            disabled={deleting}
            className="rounded-2xl border border-red-500/30 bg-red-500/10 px-7 py-3 font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
          >
            {deleting ? "Удаляем..." : "Удалить аккаунт"}
          </button>
        ) : null}
      </div>
    </div>
  );
}