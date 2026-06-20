import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function LorePage() {
  const { data: lore } = await supabase
    .from("lore")
    .select("*")
    .order("id");

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-10">
        Лор EgC
      </h1>

      <div className="grid gap-8">
        {lore?.map((chapter) => (
          <div
            key={chapter.id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
          >
            <h2 className="text-3xl font-bold mb-4">
              {chapter.title}
            </h2>

            <p className="text-zinc-300 text-lg leading-8 whitespace-pre-line">
              {chapter.content}
            </p>

            <div className="mt-6 text-sm text-zinc-500">
              Автор: {chapter.author || "EgC"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}