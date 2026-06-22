"use client";

import { useState } from "react";

function getProfileName(profile: any) {
  return profile.nickname || profile.telegram_name || profile.telegram_username || "Участник";
}

export default function GiveItemForm({
  profiles,
  items,
}: {
  profiles: any[];
  items: any[];
}) {
  const [profileId, setProfileId] = useState("");
  const [itemId, setItemId] = useState("");
  const [giving, setGiving] = useState(false);

  async function giveItem() {
    if (!profileId || !itemId) {
      alert("Выбери участника и предмет.");
      return;
    }

    setGiving(true);

    const res = await fetch("/api/admin/inventory/give", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile_id: profileId,
        shop_item_id: itemId,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Предмет выдан.");
      setProfileId("");
      setItemId("");
    } else {
      alert(data.error || "Не удалось выдать предмет.");
    }

    setGiving(false);
  }

  return (
    <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8">
      <label className="grid gap-2">
        <span className="text-sm text-zinc-400">Участник</span>
        <select
          value={profileId}
          onChange={(event) => setProfileId(event.target.value)}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        >
          <option value="">Выбери участника</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {getProfileName(profile)}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-sm text-zinc-400">Предмет</span>
        <select
          value={itemId}
          onChange={(event) => setItemId(event.target.value)}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white"
        >
          <option value="">Выбери предмет</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={giveItem}
        disabled={giving}
        className="rounded-2xl bg-white px-7 py-3 font-bold text-black transition hover:scale-105 disabled:opacity-50"
      >
        {giving ? "Выдаём..." : "Выдать предмет"}
      </button>
    </div>
  );
}