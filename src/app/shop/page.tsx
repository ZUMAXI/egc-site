import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const { data: items } = await supabase
    .from("shop_items")
    .select("*")
    .order("id");

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3 text-5xl font-black">Магазин EgC</h1>

        <p className="mb-10 text-zinc-400">
          Здесь можно посмотреть предметы, которые покупаются за валюту 『Ход』.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {items && items.length > 0 ? (
            items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="max-h-[320px] w-full object-contain bg-black p-3"
                  />
                ) : null}

                <div className="p-6">
                  <div className="mb-3 text-sm text-zinc-500">
                    {item.category || "Предмет"}
                  </div>

                  <h2 className="text-2xl font-bold">{item.name}</h2>

                  <p className="mt-4 whitespace-pre-line text-zinc-300">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="rounded-full bg-white px-4 py-2 font-bold text-black">
                      {item.price} ход.
                    </span>

                    <span className="text-sm text-zinc-500">
                      От: {item.author || "EgC"}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400 md:col-span-3">
              Товаров пока нет.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}