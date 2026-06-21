import { supabase } from "@/lib/supabase";
import LoreTabs from "./LoreTabs";

export const dynamic = "force-dynamic";

export default async function LorePage() {
  const { data: lore } = await supabase
    .from("lore")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-5xl font-black">Лор EgC</h1>

        <p className="mb-10 text-zinc-400">
          Выбери главу, чтобы открыть её текст.
        </p>

        <LoreTabs chapters={lore || []} />
      </div>
    </main>
  );
}