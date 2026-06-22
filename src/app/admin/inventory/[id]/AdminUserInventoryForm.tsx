"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminUserInventoryForm({
  inventory,
}: {
  inventory: any[];
}) {
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
    <div className="grid gap-8">
      <Link
        href="/admin/users-inventory"
        className="w-fit rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white transition hover:bg-white/10"
      >
        ← Назад к участникам
      </Link>

      <div className="grid gap-8 md:grid-cols-3">
        {items.length > 0 ? (
          items.map((entry) => (
            <article
              key={entry.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
            >
              {entry.item?.image_url ? (
                <img
                  src={entry.item.image_url}
                  alt={entry.item.name}
                  className="max-h-[280px] w-full bg-black object-contain p-3"
                />
              ) : null}

              <div className="p-6">
                <h2 className="text-2xl font-bold">
                  {entry.item?.name || "Предмет"}
                </h2>

                <p className="mt-4 whitespace-pre-line text-zinc-300">
                  {entry.item?.description || "Описание отсутствует."}
                </p>

                <p className="mt-5 text-sm text-zinc-500">
                  Куплено:{" "}
                  {entry.created_at
                    ? new Date(entry.created_at).toLocaleDateString("ru-RU")
                    : "—"}
                </p>

                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="mt-5 w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-bold text-red-300 transition hover:bg-red-500/20"
                >
                  Удалить предмет
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400 md:col-span-3">
            У этого участника пока нет предметов.
          </div>
        )}
      </div>
    </div>
  );
}