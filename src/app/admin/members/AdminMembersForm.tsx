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

export default function AdminMembersForm({
  profiles,
  currentAccessRole,
}: {
  profiles: any[];
  currentAccessRole: string;
}) {
  const [items, setItems] = useState(profiles);
  const [savingId, setSavingId] = useState<number | null>(null);

  async function updateMember(profile: any) {
    setSavingId(profile.id);

    const res = await fetch("/api/admin/members/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });

    if (!res.ok) {
      alert("Не удалось сохранить участника.");
    }

    setSavingId(null);
  }

  function changeValue(id: number, field: string, value: string | number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  return (
    <div className="grid gap-6">
      {items.map((profile) => (
        <div
          key={profile.id}
          className="rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <div className="mb-6 flex items-center gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.nickname}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">
                ♟
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold">
                {profile.nickname || profile.telegram_name || "Участник"}
              </h2>
              <p className="text-zinc-400">
                @{profile.telegram_username || "telegram"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="grid gap-2">
              <span className="text-sm text-zinc-400">Должность</span>
              <select
                value={profile.position || "Guest"}
                onChange={(event) =>
                  changeValue(profile.id, "position", event.target.value)
                }
                className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
              >
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-zinc-400">Доступ</span>
              <select
                value={profile.access_role || "guest"}
                onChange={(event) =>
                  changeValue(profile.id, "access_role", event.target.value)
                }
                disabled={currentAccessRole !== "host"}
                className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white disabled:opacity-50"
              >
                {accessRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-zinc-400">Шаги</span>
              <input
                type="number"
                value={profile.steps || 0}
                onChange={(event) =>
                  changeValue(profile.id, "steps", Number(event.target.value))
                }
                className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-zinc-400">Ходы</span>
              <input
                type="number"
                value={profile.moves || 0}
                onChange={(event) =>
                  changeValue(profile.id, "moves", Number(event.target.value))
                }
                className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
              />
            </label>
          </div>

          <button
            onClick={() => updateMember(profile)}
            disabled={savingId === profile.id}
            className="mt-6 rounded-2xl bg-white px-6 py-3 font-bold text-black transition hover:scale-105 disabled:opacity-50"
          >
            {savingId === profile.id ? "Сохраняем..." : "Сохранить"}
          </button>
        </div>
      ))}
    </div>
  );
}