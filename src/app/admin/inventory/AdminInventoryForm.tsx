"use client";

import { useState } from "react";

function getName(profile: any) {
  return profile?.nickname || profile?.telegram_name || profile?.telegram_username || "Участник";
}

export default function AdminInventoryForm({ inventory }: { inventory: any[] }) {
  const [items, setItems] = useState(inventory);

  async function deleteEntry(id: number) {
    if (!confirm("Удалить этот предмет из инвентаря?")) return;

    const res = await fetch("/api/admin/inventory/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setItems((prev) => prev.filter((entry) => entry.id !== id));
    } else {
      alert("Не удалось удалить предмет.");
    }
  }

  return (
    <div className="grid gap-4">
      {items.length > 0 ? (
        items.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-4">
              {entry.item?.image_url ? (
                <img
                  src={entry.item.image_url}
                  alt={entry.item.name}
                  className="h-16 w-16 rounded-2xl bg-black object-contain"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                  🛒
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold">
                  {entry.item?.name || "Предмет"}
                </h2>

                <p className="text-sm text-zinc-400">
                  Владелец: {getName(entry.owner)}
                </p>

                <p className="text-sm text-zinc-500">
                  Куплено:{" "}
                  {entry.created_at
                    ? new Date(entry.created_at).toLocaleDateString("ru-RU")
                    : "—"}
                </p>
              </div>
            </div>

            <button
              onClick={() => deleteEntry(entry.id)}
              className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-bold text-red-300 transition hover:bg-red-500/20"
            >
              Удалить предмет
            </button>
          </div>
        ))
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
          Инвентари пока пустые.
        </div>
      )}
    </div>
  );
}