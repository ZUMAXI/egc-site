import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AnimatedCard from "../components/AnimatedCard";
import SectionTitle from "../components/SectionTitle";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, nickname, telegram_name")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (profileError) {
    console.error("Inventory profile error:", profileError);
  }

  if (!profile) {
    redirect("/login");
  }

  const { data: inventory, error: inventoryError } = await supabaseAdmin
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

  if (inventoryError) {
    console.error("Inventory load error:", inventoryError);
  }

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
                      alt={entry.item.name || "Предмет"}
                      className="max-h-[300px] w-full bg-black object-contain p-3"
                    />
                  ) : null}

                  <div className="p-6">
                    <h2 className="text-2xl font-black">
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

                    <div className="mt-5 flex flex-wrap gap-3">
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
                        👣 {entry.item?.price_steps || 0}
                      </span>

                      <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-300">
                        ♟ {entry.item?.price_moves || 0}
                      </span>
                    </div>

                    <p className="mt-5 text-sm text-zinc-500">
                      Получено:{" "}
                      {entry.created_at
                        ? new Date(entry.created_at).toLocaleDateString("ru-RU")
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