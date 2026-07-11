"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function AdminUserInventoryForm({
  inventory,
}: {
  inventory: any[];
}) {
  const [items, setItems] = useState(inventory);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function deleteEntry() {
    if (deleteId === null || deleting) return;

    setDeleting(true);

    try {
      const res = await fetch("/api/admin/inventory/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Не удалось удалить предмет.");
        setDeleting(false);
        return;
      }

      setItems((prev) =>
        prev.filter((entry) => entry.id !== deleteId)
      );

      toast.success("Предмет удалён из инвентаря.");
      setDeleteId(null);
    } catch {
      toast.error("Ошибка при удалении предмета.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <ConfirmDialog
        open={deleteId !== null}
        title="Удалить предмет?"
        description="Предмет будет удалён из инвентаря участника. Это действие нельзя отменить."
        confirmText={deleting ? "Удаляем..." : "Удалить"}
        cancelText="Отмена"
        onConfirm={deleteEntry}
        onCancel={() => {
          if (!deleting) {
            setDeleteId(null);
          }
        }}
      />

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
                    alt={entry.item.name || "Предмет"}
                    className="max-h-[280px] w-full bg-black object-contain p-3"
                  />
                ) : null}

                <div className="p-6">
                  <h2 className="text-2xl font-bold">
                    {entry.item?.name || "Предмет"}
                  </h2>

                  {entry.item?.description ? (
                    <div
                      className={[
                        "mt-4 text-zinc-300",

                        "[&_p]:my-3",

                        "[&_h1]:mb-4",
                        "[&_h1]:mt-6",
                        "[&_h1]:text-3xl",
                        "[&_h1]:font-black",
                        "[&_h1]:leading-tight",

                        "[&_h2]:mb-3",
                        "[&_h2]:mt-5",
                        "[&_h2]:text-2xl",
                        "[&_h2]:font-black",

                        "[&_h3]:mb-3",
                        "[&_h3]:mt-5",
                        "[&_h3]:text-xl",
                        "[&_h3]:font-bold",

                        "[&_strong]:font-black",
                        "[&_em]:italic",
                        "[&_u]:underline",
                        "[&_s]:line-through",

                        "[&_ul]:my-4",
                        "[&_ul]:list-disc",
                        "[&_ul]:pl-6",

                        "[&_ol]:my-4",
                        "[&_ol]:list-decimal",
                        "[&_ol]:pl-6",

                        "[&_li]:my-1",

                        "[&_blockquote]:my-5",
                        "[&_blockquote]:rounded-2xl",
                        "[&_blockquote]:border-l-4",
                        "[&_blockquote]:border-white/20",
                        "[&_blockquote]:bg-white/5",
                        "[&_blockquote]:px-5",
                        "[&_blockquote]:py-3",
                        "[&_blockquote]:italic",
                        "[&_blockquote]:text-zinc-300",

                        "[&_code]:rounded-md",
                        "[&_code]:bg-white/10",
                        "[&_code]:px-1.5",
                        "[&_code]:py-0.5",
                        "[&_code]:font-mono",
                        "[&_code]:text-sm",
                        "[&_code]:text-emerald-300",

                        "[&_pre]:my-5",
                        "[&_pre]:overflow-x-auto",
                        "[&_pre]:rounded-2xl",
                        "[&_pre]:border",
                        "[&_pre]:border-white/10",
                        "[&_pre]:bg-zinc-950",
                        "[&_pre]:p-5",

                        "[&_pre_code]:bg-transparent",
                        "[&_pre_code]:p-0",

                        "[&_hr]:my-6",
                        "[&_hr]:border-white/10",

                        "[&_a]:text-blue-400",
                        "[&_a]:underline",
                        "[&_a]:underline-offset-4",
                        "[&_a]:transition",
                        "[&_a:hover]:text-blue-300",
                      ].join(" ")}
                      dangerouslySetInnerHTML={{
                        __html: entry.item.description,
                      }}
                    />
                  ) : (
                    <p className="mt-4 text-zinc-400">
                      Описание отсутствует.
                    </p>
                  )}

                  <p className="mt-5 text-sm text-zinc-500">
                    Получено:{" "}
                    {entry.created_at
                      ? new Date(entry.created_at).toLocaleDateString("ru-RU")
                      : "—"}
                  </p>

                  <button
                    type="button"
                    onClick={() => setDeleteId(entry.id)}
                    disabled={deleting}
                    className="mt-5 w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
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
    </>
  );
}