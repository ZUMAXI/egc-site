import { supabase } from "@/lib/supabase";
import BuyButton from "./BuyButton";
import AnimatedCard from "../components/AnimatedCard";
import SectionTitle from "../components/SectionTitle";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const { data: items } = await supabase
    .from("shop_items")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title="Магазин EgC"
          text="Здесь можно купить предметы за шаги и ходы."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <AnimatedCard
                key={item.id}
                delay={index * 0.05}
              >
                <article className="overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="max-h-[320px] w-full bg-black object-contain p-3"
                    />
                  ) : null}

                  <div className="p-6">
                    <h2 className="text-2xl font-black">
                      {item.name}
                    </h2>

                    <p className="mt-4 whitespace-pre-line text-zinc-300">
                      {item.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 font-bold text-emerald-300">
                        👣 {item.price_steps || 0}
                      </span>

                      <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 font-bold text-violet-300">
                        ♟ {item.price_moves || 0}
                      </span>
                    </div>

                    <div className="mt-6">
                      <BuyButton itemId={item.id} />
                    </div>
                  </div>
                </article>
              </AnimatedCard>
            ))
          ) : (
            <AnimatedCard>
              <div className="p-8 text-zinc-400">
                Товаров пока нет.
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </main>
  );
}