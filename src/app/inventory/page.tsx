import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AnimatedCard from "../components/AnimatedCard";
import SectionTitle from "../components/SectionTitle";

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
        <SectionTitle
          title="Мой инвентарь"
          text="Здесь отображаются товары, которые ты купил в магазине."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {inventory && inventory.length > 0 ? (
            inventory.map((entry: any, index: number) => (
              <AnimatedCard
                key={entry.id}
                delay={index * 0.05}
              >
                <article className="overflow-hidden">
                  {entry.item?.image_url ? (
                    <img
                      src={entry.item.image_url}
                      alt={entry.item.name}
                      className="max-h-[300px] w-full bg-black object-contain p-3"
                    />
                  ) : null}

                  <div className="p-6">
                    <h2 className="text-2xl font-black">
                      {entry.item?.name || "Предмет"}
                    </h2>

                    <p className="mt-4 whitespace-pre-line text-zinc-300">
                      {entry.item?.description ||
                        "Описание отсутствует."}
                    </p>

                    <div className="mt-5 flex gap-3">
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
                        👣 {entry.item?.price_steps || 0}
                      </span>

                      <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-300">
                        ♟ {entry.item?.price_moves || 0}
                      </span>
                    </div>

                    <p className="mt-5 text-sm text-zinc-500">
                      Куплено:{" "}
                      {entry.created_at
                        ? new Date(
                            entry.created_at
                          ).toLocaleDateString("ru-RU")
                        : "—"}
                    </p>
                  </div>
                </article>
              </AnimatedCard>
            ))
          ) : (
            <AnimatedCard>
              <div className="p-8 text-zinc-400">
                Инвентарь пока пуст.
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </main>
  );
}