import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="mb-10 text-5xl font-bold">Новости EgC</h1>

      <div className="grid gap-8">
        {news && news.length > 0 ? (
          news.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="mb-6 max-h-[500px] w-full rounded-3xl bg-black object-contain"
                />
              ) : null}

              <h2 className="mb-4 text-3xl font-bold">
                {item.title}
              </h2>

              <p className="whitespace-pre-line text-lg leading-8 text-zinc-300">
                {item.content}
              </p>

              <div className="mt-6 flex justify-between text-sm text-zinc-500">
                <span>
                  Автор: {item.author || "EgC"}
                </span>

                <span>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString("ru-RU")
                    : ""}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-400">
            Новостей пока нет.
          </div>
        )}
      </div>
    </main>
  );
}