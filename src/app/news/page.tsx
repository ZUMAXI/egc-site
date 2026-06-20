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

      <div className="grid gap-6">
        {news?.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-3">
              {item.title}
            </h2>

            <p className="text-zinc-300">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}