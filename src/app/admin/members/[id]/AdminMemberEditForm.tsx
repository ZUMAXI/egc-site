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

const rewards = [
  { label: "Набор", steps: 5, moves: 0 },
  { label: "Обход", steps: 10, moves: 0 },
  { label: "Тренировка", steps: 10, moves: 1 },
  { label: "РПБ", steps: 10, moves: 1 },
  { label: "Посиделки", steps: 5, moves: 0 },
  { label: "Союз", steps: 20, moves: 10 },
  { label: "1 человек", steps: 2, moves: 0 },
  { label: "Арт", steps: 0, moves: 5 },
  { label: "Видео", steps: 0, moves: 10 },
  { label: "Мем", steps: 0, moves: 3 },
];

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

      <div className="grid gap-4 md:grid-cols-2">
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
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
        <h3 className="mb-4 text-2xl font-bold">Начислить награду</h3>

        <div className="grid gap-3 md:grid-cols-2">
          {rewards.map((reward) => (
            <button
              key={reward.label}
              type="button"
              onClick={() => {
                setSteps((value: number) => value + reward.steps);
                setMoves((value: number) => value + reward.moves);
              }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
            >
              <div className="font-bold">{reward.label}</div>

              <div className="mt-1 text-sm text-zinc-400">
                +{reward.steps} шаг. / +{reward.moves} ход.
              </div>
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          После начисления не забудь нажать «Сохранить».
        </p>
      </div>

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