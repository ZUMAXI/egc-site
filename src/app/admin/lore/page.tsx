import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminLoreForm from "./AdminLoreForm";
import AdminBackButton from "../components/AdminBackButton";

export const dynamic = "force-dynamic";

export default async function AdminLorePage() {
  const { data: lore } = await supabaseAdmin
    .from("lore")
    .select("*")
    .order("chapter_number", { ascending: true });

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <AdminBackButton />
        
        <h1 className="mb-3 text-5xl font-black">Управление лором</h1>

        <p className="mb-10 text-zinc-400">
          Создание, редактирование и удаление глав лора EgC.
        </p>

        <AdminLoreForm lore={lore || []} />
      </div>
    </main>
  );
}