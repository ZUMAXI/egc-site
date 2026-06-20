import { supabase } from "@/lib/supabase";

export default async function NewsPage() {
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("id");

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-10">
        Новости EgC
      </h1>

      <div className="grid gap-8">
        {news?.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
          >
            <h2 className="text-3xl font-bold mb-4">
              {item.title}
            </h2>

            <p className="text-zinc-300 text-lg leading-8">
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
        ))}
      </div>
    </main>
  );
}