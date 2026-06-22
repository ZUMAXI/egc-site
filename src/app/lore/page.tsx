import { supabase } from "@/lib/supabase";
import LoreTabs from "./LoreTabs";
import SectionTitle from "../components/SectionTitle";

export const dynamic = "force-dynamic";

export default async function LorePage() {
  const { data: lore } = await supabase
    .from("lore")
    .select("*")
    .order("chapter_number", { ascending: true });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          title="Лор EgC"
          text="История мира Eternal Game of Chess. Выбери главу, чтобы открыть её содержание."
        />

        <LoreTabs chapters={lore || []} />
      </div>
    </main>
  );
}