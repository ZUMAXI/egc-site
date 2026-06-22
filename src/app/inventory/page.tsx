import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) redirect("/login");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, nickname, telegram_name")
    .eq("telegram_id", telegramId)
    .single();

  if (!profile) redirect("/login");

  const { data: inventory } = await supabaseAdmin
    .from("inventory")
    .select(`
      id,
      created_at,
      item:shop_items (
        id,
        name,
        description,
        image_url,
        price_steps,
        price_moves
      )
    `)
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3 text-5xl font-black">Мой инвентарь</h1>

        <p className="mb-10 text-zinc-400">
          Здесь отображаются товары, которые ты купил в магазине.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {inventory && inventory.length > 0 ? (
            inventory.map((entry: any) => (
              <article
                key={entry.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
              >
                {entry.item?.image_url ? (
                  <img
                    src={entry.item.image_url}
                    alt={entry.item.name}
                    className="max-h-[300px] w-full bg-black object-contain p-3"
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
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400 md:col-span-3">
              Инвентарь пока пуст.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}